'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { KnowledgeFile } from './types';

// ---------------------------------------------------------------------------
// Shared result type
// ---------------------------------------------------------------------------
type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

// ---------------------------------------------------------------------------
// Delete: Remove a knowledge file from storage + DB
// ---------------------------------------------------------------------------
/**
 * Safely deletes an assistant's knowledge file from object storage and the database.
 * Only allows deletions when the associated assistant profile is in 'draft' status.
 */
export async function deleteAssistantKnowledgeFile(
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
      .select('id, student_id, assistant_profile_id')
      .eq('id', fileId)
      .single();

    if (fetchError || !file) {
      return { ok: false, error: 'Knowledge file not found' };
    }
    if (file.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to delete this file' };
    }

    // 3. Verify assistant profile is in 'draft' status
    if (file.assistant_profile_id) {
      const { data: profile, error: profileError } = await supabase
        .from('assistant_profiles')
        .select('status')
        .eq('id', file.assistant_profile_id)
        .single();

      if (profileError) {
        return { ok: false, error: `Failed to verify profile status: ${profileError.message}` };
      }
      if (profile && profile.status !== 'draft') {
        return { ok: false, error: 'Cannot delete files from an active or published assistant profile' };
      }
    }

    // 4. Delete from Supabase storage
    const { error: storageError } = await supabaseAdmin
      .storage
      .from('knowledge-files')
      .remove([filePath]);

    if (storageError) {
      return { ok: false, error: `Failed to delete file from storage: ${storageError.message}` };
    }

    // 5. Delete the DB record
    const { error: dbError } = await supabase
      .from('knowledge_files')
      .delete()
      .eq('id', fileId);

    if (dbError) {
      console.error('[deleteAssistantKnowledgeFile] DB delete error:', dbError.message);
      return { ok: false, error: `File removed from storage but DB cleanup failed: ${dbError.message}` };
    }

    return { ok: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[deleteAssistantKnowledgeFile] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Request Upload Slot: Validate file parameters and return signed upload URL
// ---------------------------------------------------------------------------

/**
 * Validates assistant knowledge file parameters on the server and issues a signed upload URL.
 * Scopes file count check to the assistant profile (max 5 files).
 */
export async function requestAssistantUploadSlot(
  assistantProfileId: string,
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
    const { isFilenameSafe } = await import('./assistant-build-policy');
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
      .eq('assistant_profile_id', assistantProfileId);

    if (countError) {
      return { ok: false, error: 'Failed to verify file count' };
    }
    if (count !== null && count >= 5) {
      return { ok: false, error: 'Maximum 5 files allowed per assistant' };
    }

    // Verify assistant profile belongs to this user
    const { data: profile, error: profileError } = await supabase
      .from('assistant_profiles')
      .select('id, student_id')
      .eq('id', assistantProfileId)
      .single();

    if (profileError || !profile) {
      return { ok: false, error: 'Assistant profile not found' };
    }
    if (profile.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to add files to this profile' };
    }

    // Build unique upload path: {studentId}/{assistantProfileId}/{timestamp}_{filename}
    const safeNameClean = fileName.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_');
    const filePath = `${user.id}/${assistantProfileId}/${Date.now()}_${safeNameClean}`;

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
        feature: 'assistant_knowledge_file',
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
    console.error('[requestAssistantUploadSlot] error:', message);
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
export async function createAssistantKnowledgeFileRecord(
  assistantProfileId: string,
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
    const { isFilenameSafe } = await import('./assistant-build-policy');
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
      .eq('assistant_profile_id', assistantProfileId);

    if (countError) {
      return { ok: false, error: 'Failed to verify file count' };
    }
    if (count !== null && count >= 5) {
      return { ok: false, error: 'Maximum 5 files allowed per assistant' };
    }

    // 2. Verify assistant profile belongs to this user
    const { data: profile, error: profileError } = await supabase
      .from('assistant_profiles')
      .select('id, student_id')
      .eq('id', assistantProfileId)
      .single();

    if (profileError || !profile) {
      return { ok: false, error: 'Assistant profile not found' };
    }
    if (profile.student_id !== user.id) {
      return { ok: false, error: 'Not authorized to add files to this profile' };
    }

    // 3. Insert the knowledge file record
    const { data: record, error: insertError } = await supabase
      .from('knowledge_files')
      .insert({
        student_id: user.id,
        assistant_profile_id: assistantProfileId,
        file_name: fileName,
        file_url: filePath, // Storage path
        file_size: fileSize,
        mime_type: mimeType,
      })
      .select('*')
      .single();

    if (insertError || !record) {
      return { ok: false, error: `Failed to create file record: ${insertError?.message ?? 'Unknown'}` };
    }

    return { ok: true, data: record as unknown as KnowledgeFile };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[createAssistantKnowledgeFileRecord] error:', message);
    return { ok: false, error: message };
  }
}
