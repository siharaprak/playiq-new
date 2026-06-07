'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { KnowledgeFile } from './types';

// ---------------------------------------------------------------------------
// Shared result type
// ---------------------------------------------------------------------------

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Signed URL: Generate a private download link for a knowledge file
// ---------------------------------------------------------------------------

/**
 * Generates a 1-hour signed download URL for a knowledge file.
 * File path format: `{studentId}/{tutorProfileId}/{filename}`
 *
 * Authorization:
 *   - Student owner of the file
 *   - Admin users
 */
export async function getKnowledgeFileSignedUrl(filePath: string): Promise<string> {
  const supabase = await createClient();

  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 2. Extract student ID from path: "studentId/tutorProfileId/filename"
  const parts = filePath.split('/');
  if (parts.length < 3) throw new Error('Invalid file path format');
  const studentId = parts[0];

  // 3. Authorization check
  let isAuthorized = false;

  // Case A: User is the student owner
  if (user.id === studentId) {
    isAuthorized = true;
  } else {
    // Case B: Check if user is an admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    throw new Error('Not authorized to access this knowledge file');
  }

  // 4. Generate the 1-hour signed URL using the admin client
  const { data, error } = await supabaseAdmin
    .storage
    .from('knowledge-files')
    .createSignedUrl(filePath, 3600); // 1 hour expiration

  if (error || !data?.signedUrl) {
    const { ErrorReporter } = await import('@/lib/monitoring/error-reporter');
    ErrorReporter.report({
      error: error || new Error('Signed URL creation returned null data'),
      category: 'storage_upload_error',
      feature: 'tutor_knowledge_file',
      action: 'get_signed_url'
    });
    throw new Error(`Failed to generate signed download URL: ${error?.message || 'Unknown error'}`);
  }

  return data.signedUrl;
}

// ---------------------------------------------------------------------------
// Delete: Remove a knowledge file from storage + DB
// ---------------------------------------------------------------------------

/**
 * Safely deletes a knowledge file from object storage and the database.
 * Only allows deletions when the associated tutor profile is in 'draft' status.
 */
export async function deleteKnowledgeFile(
  fileId: string,
  filePath: string
): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 2. Verify ownership via knowledge_files table
    const { data: file, error: fetchError } = await supabase
      .from('knowledge_files')
      .select('id, student_id, tutor_profile_id')
      .eq('id', fileId)
      .single();

    if (fetchError || !file) {
      return { ok: false, error: 'Knowledge file not found' };
    }
    if (file.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to delete this file' };
    }

    // 3. Verify tutor profile is in 'draft' status
    if (file.tutor_profile_id) {
      const { data: profile, error: profileError } = await supabase
        .from('tutor_profiles')
        .select('status')
        .eq('id', file.tutor_profile_id)
        .single();

      if (profileError) {
        return { ok: false, error: `Failed to verify profile status: ${profileError.message}` };
      }
      if (profile && profile.status !== 'draft') {
        return { ok: false, error: 'Cannot delete files from an active or published tutor profile' };
      }
    }

    // 4. Verify version dependencies — if a version depends on the file, detach instead of delete
    let shouldDetachOnly = false;
    if (file.tutor_profile_id) {
      const { data: versions, error: versionsError } = await supabase
        .from('tutor_versions')
        .select('id, knowledge_file_ids')
        .eq('tutor_profile_id', file.tutor_profile_id);

      if (versionsError) {
        return { ok: false, error: `Failed to verify version dependencies: ${versionsError.message}` };
      }

      const isDependedOn = versions?.some((v: any) =>
        Array.isArray(v.knowledge_file_ids) && v.knowledge_file_ids.includes(fileId)
      );

      if (isDependedOn) {
        shouldDetachOnly = true;
      }
    }

    if (shouldDetachOnly) {
      // Detach: set tutor_profile_id to null so it is removed from current view
      const { error: detachError } = await supabase
        .from('knowledge_files')
        .update({ tutor_profile_id: null })
        .eq('id', fileId);

      if (detachError) {
        return { ok: false, error: `Failed to detach knowledge file: ${detachError.message}` };
      }

      return { ok: true, data: undefined };
    }

    // 5. Physical Delete (not referenced by any versions): delete from storage then DB
    const { error: storageError } = await supabaseAdmin
      .storage
      .from('knowledge-files')
      .remove([filePath]);

    if (storageError) {
      return { ok: false, error: `Failed to delete file from storage: ${storageError.message}` };
    }

    const { error: dbError } = await supabase
      .from('knowledge_files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      console.error('[deleteKnowledgeFile] DB delete error:', dbError.message);
      return { ok: false, error: `File removed from storage but DB cleanup failed: ${dbError.message}` };
    }

    return { ok: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[deleteKnowledgeFile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Request Upload Slot: Validate file parameters and return signed upload URL
// ---------------------------------------------------------------------------

/**
 * Validates knowledge file parameters on the server and issues a signed upload URL.
 * Scopes file count check to the tutor profile (max 5 files).
 */
export async function requestTutorUploadSlot(
  tutorProfileId: string,
  fileName: string,
  fileSize: number,
  mimeType: string
): Promise<ActionResult<{ uploadUrl: string; token: string; filePath: string }>> {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // 2. Server-side validations
    const { isFilenameSafe } = await import('./tutor-build-policy');
    if (!isFilenameSafe(fileName)) {
      return { ok: false, error: 'Unsafe filename: dangerous patterns or extensions blocked' };
    }

    if (fileSize <= 0 || fileSize > 10 * 1024 * 1024) {
      return { ok: false, error: 'File size exceeds maximum allowed limit (10MB)' };
    }

    const allowedMimes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg'
    ];
    if (!allowedMimes.includes(mimeType)) {
      return { ok: false, error: 'Unsupported file MIME type' };
    }

    // Additional upload abuse checks (MIME mismatch, null bytes, double extensions, path traversal)
    const { classifyUploadAbuseRisk } = await import('@/lib/uploads/upload-abuse-policy');
    const riskCheck = classifyUploadAbuseRisk({ fileName, fileSizeBytes: fileSize, mimeType });
    if (!riskCheck.safe) {
      return { ok: false, error: riskCheck.reason || 'Unsafe file' };
    }

    // Scoped file count check (max 5)
    const { count, error: countError } = await supabase
      .from('knowledge_files')
      .select('id', { count: 'exact', head: true })
      .eq('tutor_profile_id', tutorProfileId);

    if (countError) {
      return { ok: false, error: 'Failed to verify file count' };
    }
    if (count !== null && count >= 5) {
      return { ok: false, error: 'Maximum 5 files allowed per tutor' };
    }

    // Verify tutor profile belongs to this user
    const { data: profile, error: profileError } = await supabase
      .from('tutor_profiles')
      .select('id, student_id')
      .eq('id', tutorProfileId)
      .single();

    if (profileError || !profile) {
      return { ok: false, error: 'Tutor profile not found' };
    }
    if (profile.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to add files to this profile' };
    }

    // Build unique upload path: {studentId}/{tutorProfileId}/{timestamp}_{filename}
    // Clean filename characters to avoid issues in path segment
    const safeNameClean = fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    const filePath = `${user.id}/${tutorProfileId}/${Date.now()}_${safeNameClean}`;

    // Generate signed upload URL (Valid for 10 minutes)
    const { data, error: uploadError } = await supabaseAdmin
      .storage
      .from('knowledge-files')
      .createSignedUploadUrl(filePath);

    if (uploadError || !data?.signedUrl) {
      const { ErrorReporter } = await import('@/lib/monitoring/error-reporter');
      ErrorReporter.report({
        error: uploadError || new Error('Signed upload URL returned null data'),
        category: 'storage_upload_error',
        feature: 'tutor_knowledge_file',
        action: 'request_upload_slot'
      });
      return { ok: false, error: `Failed to create signed upload URL: ${uploadError?.message || 'Unknown'}` };
    }

    return {
      ok: true,
      data: {
        uploadUrl: data.signedUrl,
        token: data.token,
        filePath
      }
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[requestTutorUploadSlot] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Create: Insert a knowledge file record after client-side upload
// ---------------------------------------------------------------------------

/**
 * Creates a knowledge_files DB record after the client has uploaded the file
 * to Supabase Storage. The client uploads directly; this action tracks the metadata.
 */
export async function createKnowledgeFileRecord(
  tutorProfileId: string,
  fileName: string,
  filePath: string,
  fileSize: number,
  mimeType: string
): Promise<ActionResult<KnowledgeFile>> {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // Server-side validations
    const { isFilenameSafe } = await import('./tutor-build-policy');
    if (!isFilenameSafe(fileName)) {
      return { ok: false, error: 'Unsafe filename: dangerous patterns or extensions blocked' };
    }

    if (filePath.includes('..') || filePath.includes('./') || filePath.includes('\\')) {
      return { ok: false, error: 'Unsafe file path detected' };
    }

    if (fileSize <= 0 || fileSize > 10 * 1024 * 1024) {
      return { ok: false, error: 'File size exceeds maximum allowed limit (10MB)' };
    }

    const allowedMimes = [
      'application/pdf',
      'text/plain',
      'text/markdown',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/png',
      'image/jpeg'
    ];
    if (!allowedMimes.includes(mimeType)) {
      return { ok: false, error: 'Unsupported file MIME type' };
    }

    // Additional upload abuse checks (MIME mismatch, null bytes, double extensions, path traversal)
    const { classifyUploadAbuseRisk } = await import('@/lib/uploads/upload-abuse-policy');
    const riskCheck = classifyUploadAbuseRisk({ fileName, fileSizeBytes: fileSize, mimeType });
    if (!riskCheck.safe) {
      return { ok: false, error: riskCheck.reason || 'Unsafe file' };
    }

    // Scoped file count check
    const { count, error: countError } = await supabase
      .from('knowledge_files')
      .select('id', { count: 'exact', head: true })
      .eq('tutor_profile_id', tutorProfileId);

    if (countError) {
      return { ok: false, error: 'Failed to verify file count' };
    }
    if (count !== null && count >= 5) {
      return { ok: false, error: 'Maximum 5 files allowed per tutor' };
    }

    // 2. Verify tutor profile belongs to this user
    const { data: profile, error: profileError } = await supabase
      .from('tutor_profiles')
      .select('id, student_id')
      .eq('id', tutorProfileId)
      .single();

    if (profileError || !profile) {
      return { ok: false, error: 'Tutor profile not found' };
    }
    if (profile.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to add files to this profile' };
    }

    // 3. Insert the knowledge file record
    const { data: record, error: insertError } = await supabase
      .from('knowledge_files')
      .insert({
        student_id: user.id,
        tutor_profile_id: tutorProfileId,
        file_name: fileName,
        file_url: filePath, // Storage path, not a public URL
        file_size: fileSize,
        mime_type: mimeType,
      })
      .select('*')
      .single();

    if (insertError || !record) {
      return { ok: false, error: `Failed to create file record: ${insertError?.message ?? 'Unknown'}` };
    }

    return { ok: true, data: record as KnowledgeFile };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[createKnowledgeFileRecord] error:', message);
    return { ok: false, error: message };
  }
}
