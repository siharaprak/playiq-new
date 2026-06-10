'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { logProofEvent } from '@/lib/events/learning-events';

export interface ArtifactFileMetadata {
  filePath: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
}

/**
 * Saves a single artifact submission as a DRAFT.
 * If a submission already exists for this student + module + type, it updates it.
 */
export async function saveArtifactDraft(
  moduleId: string,
  artifactType: 'study_rules' | 'error_review',
  contentPayload: any,
  fileInfo?: ArtifactFileMetadata
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Check if a record already exists
  const { data: existing } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('id, status')
    .eq('student_id', user.id)
    .eq('module_id', moduleId)
    .eq('artifact_type', artifactType)
    .single();

  if (existing) {
    if (existing.status === 'approved') {
      throw new Error('Cannot modify an already approved artifact');
    }

    // Update existing record and reset state to 'draft'
    const { error } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .update({
        content_payload: contentPayload,
        status: 'draft', // Reset status if edited
        file_path: fileInfo?.filePath || null,
        file_size: fileInfo?.fileSize || null,
        mime_type: fileInfo?.mimeType || null,
        original_name: fileInfo?.originalName || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id);

    if (error) throw new Error(`Failed to update draft: ${error.message}`);
  } else {
    // Insert new draft record
    const { error } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .insert({
        student_id: user.id,
        module_id: moduleId,
        artifact_type: artifactType,
        content_payload: contentPayload,
        status: 'draft',
        file_path: fileInfo?.filePath || null,
        file_size: fileInfo?.fileSize || null,
        mime_type: fileInfo?.mimeType || null,
        original_name: fileInfo?.originalName || null,
      });

    if (error) throw new Error(`Failed to create draft: ${error.message}`);
  }

  revalidatePath(`/student/modules`);
}

/**
 * Transitions all non-approved draft artifacts for a module to 'submitted' state.
 * Fires telemetry events for the submissions.
 */
export async function submitArtifactsForReview(moduleId: string, moduleNum: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch current submissions
  const { data: submissions } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('id, status, artifact_type')
    .eq('student_id', user.id)
    .eq('module_id', moduleId);

  const studyRules = submissions?.find((s: any) => s.artifact_type === 'study_rules');
  const errorReview = submissions?.find((s: any) => s.artifact_type === 'error_review');

  if (!studyRules || !errorReview) {
    throw new Error('Both Artifact 1 (Warrior Code) and Artifact 2 (Boundaries Plan) must be created as drafts before submitting.');
  }

  const toSubmit = [studyRules, errorReview].filter((s: any) => s.status === 'draft' || s.status === 'revise');

  if (toSubmit.length > 0) {
    const { error } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .update({
        status: 'submitted',
        updated_at: new Date().toISOString()
      })
      .in('id', toSubmit.map(s => s.id));

    if (error) throw new Error(`Failed to submit artifacts: ${error.message}`);

    // Fire log events for newly submitted artifacts
    for (const sub of toSubmit) {
      try {
        await logProofEvent({
          studentId: user.id,
          eventType: 'proof_submitted',
          submissionId: sub.id,
          artifactType: sub.artifact_type as 'study_rules' | 'error_review',
        });
      } catch (e) {
        console.error('Failed to log telemetry event for', sub.artifact_type, ':', e);
      }
    }
  }

  revalidatePath(`/student/modules/${moduleNum}/proof-artifacts`);
  revalidatePath(`/student/modules/${moduleNum}/completion`);
  return { success: true };
}
