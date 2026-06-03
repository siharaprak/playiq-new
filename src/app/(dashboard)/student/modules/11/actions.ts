'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { MODULES } from '@/lib/constants';
import { logProofEvent } from '@/lib/events/learning-events';

const CAPSTONE_MODULE_ID = MODULES.CAPSTONE_ID;
const CAPSTONE_NODE_ID = 'e1f94091-62d9-4ac9-8f0a-86c2e3650238';

export interface CapstonePayload {
  subject: string;
  unit: string;
  rationale: string;
  confidence: number;
  studyGuideFile?: {
    filePath: string;
    fileSize: number;
    mimeType: string;
    originalName: string;
  };
  teachBackText: string;
  teachBackFile?: {
    filePath: string;
    fileSize: number;
    mimeType: string;
    originalName: string;
  };
  assessmentType: string;
  score: string;
  delta: string;
}

export async function getCapstoneBuilderStatus() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Query Tutor profile
  const { data: tutor } = await supabase
    .from('tutor_profiles')
    .select('id, status')
    .eq('student_id', user.id)
    .in('status', ['active', 'published'])
    .maybeSingle();

  // Query Assistant profile
  const { data: assistant } = await supabase
    .from('assistant_profiles')
    .select('id, status')
    .eq('student_id', user.id)
    .in('status', ['active', 'published'])
    .maybeSingle();

  return {
    tutorComplete: !!tutor,
    assistantComplete: !!assistant,
  };
}

export async function submitCapstoneProof(payload: CapstonePayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // 1. Double check pre-requisite builders
  const builderStatus = await getCapstoneBuilderStatus();
  if (!builderStatus.tutorComplete || !builderStatus.assistantComplete) {
    throw new Error('You must activate/publish both your AI Tutor (M9) and AI Assistant (M10) before submitting the Capstone Master Trial.');
  }

  // 2. Submit Study Guide Artifact (Study Rules type)
  const studyGuidePayload = {
    subject: payload.subject,
    unit: payload.unit,
    rationale: payload.rationale,
    confidence: payload.confidence,
    type: 'capstone_study_guide',
  };

  const { data: existingRules } = await supabase
    .from('proof_artifact_submissions')
    .select('id')
    .eq('student_id', user.id)
    .eq('module_id', CAPSTONE_MODULE_ID)
    .eq('artifact_type', 'study_rules')
    .maybeSingle();

  let rulesSubId = '';
  if (existingRules) {
    const { error: err } = await supabase
      .from('proof_artifact_submissions')
      .update({
        content_payload: studyGuidePayload,
        status: 'submitted',
        file_path: payload.studyGuideFile?.filePath || null,
        file_size: payload.studyGuideFile?.fileSize || null,
        mime_type: payload.studyGuideFile?.mimeType || null,
        original_name: payload.studyGuideFile?.originalName || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingRules.id);
    if (err) throw err;
    rulesSubId = existingRules.id;
  } else {
    const { data: newRules, error: err } = await supabase
      .from('proof_artifact_submissions')
      .insert({
        student_id: user.id,
        module_id: CAPSTONE_MODULE_ID,
        artifact_type: 'study_rules',
        content_payload: studyGuidePayload,
        status: 'submitted',
        file_path: payload.studyGuideFile?.filePath || null,
        file_size: payload.studyGuideFile?.fileSize || null,
        mime_type: payload.studyGuideFile?.mimeType || null,
        original_name: payload.studyGuideFile?.originalName || null,
      })
      .select('id')
      .single();
    if (err) throw err;
    rulesSubId = newRules.id;
  }

  // 3. Submit Teach-Back Artifact (Error Review type)
  const teachBackPayload = {
    teachBackText: payload.teachBackText,
    assessmentType: payload.assessmentType,
    score: payload.score,
    delta: payload.delta,
    type: 'capstone_teach_back',
  };

  const { data: existingReview } = await supabase
    .from('proof_artifact_submissions')
    .select('id')
    .eq('student_id', user.id)
    .eq('module_id', CAPSTONE_MODULE_ID)
    .eq('artifact_type', 'error_review')
    .maybeSingle();

  let reviewSubId = '';
  if (existingReview) {
    const { error: err } = await supabase
      .from('proof_artifact_submissions')
      .update({
        content_payload: teachBackPayload,
        status: 'submitted',
        file_path: payload.teachBackFile?.filePath || null,
        file_size: payload.teachBackFile?.fileSize || null,
        mime_type: payload.teachBackFile?.mimeType || null,
        original_name: payload.teachBackFile?.originalName || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingReview.id);
    if (err) throw err;
    reviewSubId = existingReview.id;
  } else {
    const { data: newReview, error: err } = await supabase
      .from('proof_artifact_submissions')
      .insert({
        student_id: user.id,
        module_id: CAPSTONE_MODULE_ID,
        artifact_type: 'error_review',
        content_payload: teachBackPayload,
        status: 'submitted',
        file_path: payload.teachBackFile?.filePath || null,
        file_size: payload.teachBackFile?.fileSize || null,
        mime_type: payload.teachBackFile?.mimeType || null,
        original_name: payload.teachBackFile?.originalName || null,
      })
      .select('id')
      .single();
    if (err) throw err;
    reviewSubId = newReview.id;
  }

  // 4. Log proof events
  try {
    await logProofEvent({
      studentId: user.id,
      eventType: 'proof_submitted',
      submissionId: rulesSubId,
      artifactType: 'study_rules',
    });
    await logProofEvent({
      studentId: user.id,
      eventType: 'proof_submitted',
      submissionId: reviewSubId,
      artifactType: 'error_review',
    });
  } catch (e) {
    console.error('Failed to log capstone events:', e);
  }

  // 5. Update student_node_progress for Capstone (marks the Capstone complete)
  const { error: progressError } = await supabase
    .from('student_node_progress')
    .upsert({
      student_id: user.id,
      module_id: CAPSTONE_MODULE_ID,
      node_id: CAPSTONE_NODE_ID,
      lesson_completed: true,
      activity_completed: true,
      mini_check_passed: true,
      teach_back_status: 'pass',
      node_mastered: true,
      completed_at: new Date().toISOString(),
    }, {
      onConflict: 'student_id,node_id'
    });

  if (progressError) {
    throw new Error(`Failed to update capstone progress: ${progressError.message}`);
  }

  // 6. Revalidate cache
  revalidatePath('/student/home');
  revalidatePath('/student/modules/11/overview');

  return { ok: true };
}
