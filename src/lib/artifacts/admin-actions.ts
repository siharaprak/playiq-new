'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { logProofEvent } from '@/lib/events/learning-events';

/**
 * Approves a student's proof artifact submission.
 * Validates admin role privileges, changes status to 'approved', and logs reviews.
 */
export async function approveSubmission(submissionId: string) {
  const supabase = await createClient();
  
  // 1. Authenticate & Authorize Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized. Admin privilege required.');
  }

  // 2. Fetch the submission details
  const { data: submission } = await supabase
    .from('proof_artifact_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (!submission) throw new Error('Submission record not found');

  // 3. Perform approval update
  const { error } = await supabase
    .from('proof_artifact_submissions')
    .update({
      status: 'approved',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', submissionId);

  if (error) throw new Error(`Failed to approve submission: ${error.message}`);

  // 4. Log proof_reviewed telemetry event
  try {
    await logProofEvent({
      studentId: submission.student_id,
      eventType: 'proof_reviewed',
      submissionId: submission.id,
      artifactType: submission.artifact_type as 'study_rules' | 'error_review',
      metadata: { approved: true, reviewer_id: user.id }
    });
  } catch (e) {
    console.error('Failed to log proof_reviewed telemetry event:', e);
  }

  revalidatePath('/admin/artifacts');
  revalidatePath(`/student/modules`);
}

/**
 * Requests a revision on a student's proof artifact submission.
 * Reverts status to 'revise', appends constructive reviewer notes, and logs actions.
 */
export async function requestRevision(submissionId: string, notes: string) {
  if (!notes || notes.trim().length === 0) {
    throw new Error('Review notes are required to request a revision.');
  }

  const supabase = await createClient();
  
  // 1. Authenticate & Authorize Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized. Admin privilege required.');
  }

  // 2. Fetch the submission details
  const { data: submission } = await supabase
    .from('proof_artifact_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();

  if (!submission) throw new Error('Submission record not found');

  // 3. Perform revision update
  const { error } = await supabase
    .from('proof_artifact_submissions')
    .update({
      status: 'revise',
      review_notes: notes,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', submissionId);

  if (error) throw new Error(`Failed to request revision: ${error.message}`);

  // 4. Log proof_reviewed (failed) telemetry event
  try {
    await logProofEvent({
      studentId: submission.student_id,
      eventType: 'proof_reviewed',
      submissionId: submission.id,
      artifactType: submission.artifact_type as 'study_rules' | 'error_review',
      metadata: { approved: false, reviewer_id: user.id, comments: notes }
    });
  } catch (e) {
    console.error('Failed to log proof_reviewed (failed) telemetry event:', e);
  }

  revalidatePath('/admin/artifacts');
  revalidatePath(`/student/modules`);
}
