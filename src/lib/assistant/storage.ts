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
