'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';
import { logProofEvent } from '@/lib/events/learning-events';
import { resolveCourseModuleFromAnyId } from '@/lib/constants';

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

  const { dbModuleId, courseModuleNumber } = resolveCourseModuleFromAnyId(
    moduleId,
    typeof contentPayload?.courseModuleNumber === 'number' ? contentPayload.courseModuleNumber : undefined
  );

  const enrichedPayload = {
    ...(contentPayload && typeof contentPayload === 'object' ? contentPayload : {}),
    courseModuleNumber,
  };

  // Check if a record already exists for this student + module + type (+ courseModuleNumber for M10-M14)
  const { data: existingRows } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('id, status, content_payload')
    .eq('student_id', user.id)
    .eq('module_id', dbModuleId)
    .eq('artifact_type', artifactType)
    .order('created_at', { ascending: false });

  const existing = (existingRows || []).find((row: any) => {
    if (courseModuleNumber >= 10) {
      return Number(row.content_payload?.courseModuleNumber) === courseModuleNumber;
    }
    return row.content_payload?.courseModuleNumber === undefined || Number(row.content_payload?.courseModuleNumber) === courseModuleNumber;
  });

  if (existing) {
    if (existing.status === 'approved') {
      throw new Error('Cannot modify an already approved artifact');
    }

    // Update existing record and reset state to 'draft'
    const { error } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .update({
        content_payload: enrichedPayload,
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
        module_id: dbModuleId,
        artifact_type: artifactType,
        content_payload: enrichedPayload,
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

  const { dbModuleId, courseModuleNumber } = resolveCourseModuleFromAnyId(moduleId, moduleNum);

  // Fetch current submissions
  const { data: rawSubmissions } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('id, status, artifact_type, content_payload')
    .eq('student_id', user.id)
    .eq('module_id', dbModuleId)
    .order('created_at', { ascending: false });

  const submissions = (rawSubmissions || []).filter((s: any) => {
    if (courseModuleNumber >= 10) {
      return Number(s.content_payload?.courseModuleNumber) === courseModuleNumber;
    }
    return s.content_payload?.courseModuleNumber === undefined || Number(s.content_payload?.courseModuleNumber) === courseModuleNumber;
  });

  const studyRules = submissions.find((s: any) => s.artifact_type === 'study_rules');
  const errorReview = submissions.find((s: any) => s.artifact_type === 'error_review');

  if (!studyRules || (moduleNum <= 2 && !errorReview)) {
    throw new Error(
      moduleNum <= 2
        ? 'Both Artifact 1 and Artifact 2 must be saved as drafts before submitting.'
        : 'Your Module Proof Artifact must be saved as a draft before submitting.'
    );
  }

  const toSubmit = [studyRules, errorReview]
    .filter(Boolean)
    .filter((s: any) => s.status === 'draft' || s.status === 'revise');

  if (toSubmit.length > 0) {
    const { error } = await supabaseAdmin
      .from('proof_artifact_submissions')
      .update({
        status: 'submitted',
        updated_at: new Date().toISOString()
      })
      .in('id', toSubmit.map((s: any) => s.id));

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
