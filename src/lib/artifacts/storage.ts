'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Generates a private signed download URL for an artifact.
 * Performs rigorous authorization checks to ensure the caller has access.
 */
export async function getSignedDownloadUrl(filePath: string): Promise<string> {
  const supabase = await createClient();
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 2. Extract student ID from file path: "student_id/module_id/filename"
  const parts = filePath.split('/');
  if (parts.length < 3) throw new Error('Invalid file path format');
  const studentId = parts[0];

  // 3. Authorization check
  let isAuthorized = false;

  // Case A: User is the student owner
  if (user.id === studentId) {
    isAuthorized = true;
  } else {
    // Check role and link via user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role === 'admin') {
      // Case B: User is an admin
      isAuthorized = true;
    } else if (profile?.role === 'parent') {
      // Case C: User is a parent linked to this child
      const { data: link } = await supabase
        .from('parent_child_links')
        .select('id')
        .eq('parent_id', user.id)
        .eq('student_id', studentId)
        .single();
      
      if (link) isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    throw new Error('Not authorized to access this proof artifact');
  }

  // 4. Generate the 1-hour signed URL using the admin client
  const { data, error } = await supabaseAdmin
    .storage
    .from('proof-artifacts')
    .createSignedUrl(filePath, 3600); // 1 hour expiration

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to generate signed download URL: ${error?.message || 'Unknown error'}`);
  }

  return data.signedUrl;
}

/**
 * Safely deletes a file from object storage.
 * Only allows deletions if the user is the student owner and the submission is in 'draft' status (or hasn't been created yet).
 */
export async function deleteArtifactFile(filePath: string): Promise<void> {
  const supabase = await createClient();
  
  // 1. Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 2. Extract student ID and verify ownership
  const parts = filePath.split('/');
  if (parts.length < 3) throw new Error('Invalid file path format');
  const studentId = parts[0];

  if (user.id !== studentId) {
    throw new Error('Not authorized to delete this file');
  }

  // 3. Verify artifact status is 'draft' in database (if record exists)
  const { data: submission } = await supabase
    .from('proof_artifact_submissions')
    .select('status')
    .eq('file_path', filePath)
    .single();

  if (submission && submission.status !== 'draft') {
    throw new Error('Cannot delete files of submitted or approved artifacts');
  }

  // 4. Delete the file from Supabase storage
  const { error } = await supabaseAdmin
    .storage
    .from('proof-artifacts')
    .remove([filePath]);

  if (error) {
    throw new Error(`Failed to delete file from storage: ${error.message}`);
  }
}
