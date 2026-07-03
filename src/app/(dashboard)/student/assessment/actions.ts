'use server';

/**
 * Module 0 — Assessment Server Actions
 *
 * Handles saving each phase's responses, scoring baseline tasks,
 * generating the reveal, and marking assessment complete.
 */

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import {
  scoreBaselineTask1,
  scoreBaselineTask2,
  scoreBaselineTask3,
  computeBaselinePDI,
} from '@/lib/assessment/assessment-scoring';
import {
  generateRevealSummary,
  buildLearningBlueprint,
  getVisionOutcomes,
  type AssessmentProfile,
} from '@/lib/assessment/assessment-reveal';

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return { supabase, user };
}

// ── Phase 1: Save Basic Context ─────────────────────────────────────────────

export async function savePhase1(data: {
  displayName: string;
  gradeLevel: string;
  learnerType: string;
}) {
  const { supabase, user } = await getAuthenticatedUser();

  // Upsert: create if not exists, update if exists
  const { error } = await supabase
    .from('student_assessment_profiles')
    .upsert(
      {
        student_id: user.id,
        display_name: data.displayName,
        grade_level: data.gradeLevel,
        learner_type: data.learnerType,
        current_phase: 2,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'student_id' },
    );

  if (error) {
    console.error('Phase 1 save error:', error);
    throw new Error('Failed to save Phase 1 data');
  }

  return { success: true, nextPhase: 2 };
}

// ── Phase 2: Save Diagnostic Responses ──────────────────────────────────────

export async function savePhase2(data: {
  explanationStyle: string;
  pacingPreference: string;
  challengeResponse: string;
  aiLiteracyLevel: string;
  motivationDriver: string;
}) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from('student_assessment_profiles')
    .update({
      explanation_style: data.explanationStyle,
      pacing_preference: data.pacingPreference,
      challenge_response: data.challengeResponse,
      ai_literacy_level: data.aiLiteracyLevel,
      motivation_driver: data.motivationDriver,
      current_phase: 3,
      updated_at: new Date().toISOString(),
    })
    .eq('student_id', user.id);

  if (error) {
    console.error('Phase 2 save error:', error);
    throw new Error('Failed to save Phase 2 data');
  }

  return { success: true, nextPhase: 3 };
}

// ── Phase 3: Score & Save Baseline Tasks ────────────────────────────────────

export async function savePhase3(data: {
  task1Answer: string;
  task2Response: string;
  task3Response: string;
}) {
  const { supabase, user } = await getAuthenticatedUser();

  // Score all tasks
  const task1Result = scoreBaselineTask1(data.task1Answer);
  const [task2Result, task3Result] = await Promise.all([
    scoreBaselineTask2(data.task2Response),
    scoreBaselineTask3(data.task3Response),
  ]);

  const pdiSnapshot = computeBaselinePDI(
    task1Result.correct,
    task2Result.score,
    task3Result.score,
  );

  const { error } = await supabase
    .from('student_assessment_profiles')
    .update({
      baseline_task1_answer: data.task1Answer,
      baseline_task1_correct: task1Result.correct,
      baseline_task2_response: data.task2Response,
      baseline_task2_score: task2Result.score,
      baseline_task3_response: data.task3Response,
      baseline_task3_score: task3Result.score,
      baseline_pdi_snapshot: pdiSnapshot,
      current_phase: 4,
      updated_at: new Date().toISOString(),
    })
    .eq('student_id', user.id);

  if (error) {
    console.error('Phase 3 save error:', error);
    throw new Error('Failed to save Phase 3 data');
  }

  return { success: true, nextPhase: 4 };
}

// ── Phase 4: Save School Reality Check ──────────────────────────────────────

export async function savePhase4(data: {
  rescueTargetSubject: string;
  advanceTargetSubject: string;
  personalGoal: string;
}) {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from('student_assessment_profiles')
    .update({
      rescue_target_subject: data.rescueTargetSubject,
      advance_target_subject: data.advanceTargetSubject,
      personal_goal: data.personalGoal,
      current_phase: 5,
      updated_at: new Date().toISOString(),
    })
    .eq('student_id', user.id);

  if (error) {
    console.error('Phase 4 save error:', error);
    throw new Error('Failed to save Phase 4 data');
  }

  return { success: true, nextPhase: 5 };
}

// ── Phase 5: Generate Reveal & Complete Assessment ──────────────────────────

export async function completeAssessment() {
  const { supabase, user } = await getAuthenticatedUser();

  // Fetch the current assessment profile
  const { data: profile, error: fetchError } = await supabase
    .from('student_assessment_profiles')
    .select('*')
    .eq('student_id', user.id)
    .single();

  if (fetchError || !profile) {
    throw new Error('Assessment profile not found');
  }

  // Build the AssessmentProfile for reveal generation
  const assessmentProfile: AssessmentProfile = {
    display_name: profile.display_name || 'Apprentice',
    explanation_style: profile.explanation_style || 'visual',
    pacing_preference: profile.pacing_preference || 'top_down',
    challenge_response: profile.challenge_response || 'push_through',
    ai_literacy_level: profile.ai_literacy_level || 'answer_seeking',
    motivation_driver: profile.motivation_driver || 'mastery',
    rescue_target_subject: profile.rescue_target_subject || '',
    advance_target_subject: profile.advance_target_subject || '',
    personal_goal: profile.personal_goal || '',
    baseline_task1_correct: profile.baseline_task1_correct ?? false,
  };

  // Generate AI reveal summary
  const revealSummary = await generateRevealSummary(assessmentProfile);

  // Build learning blueprint
  const blueprint = buildLearningBlueprint(assessmentProfile);

  // Get vision outcomes
  const visionOutcomes = getVisionOutcomes(assessmentProfile.motivation_driver);

  // Update profile with reveal data (but do not mark completed yet so user can read it)
  const { error: updateError } = await supabase
    .from('student_assessment_profiles')
    .update({
      reveal_summary: revealSummary,
      learning_blueprint: { ...blueprint, visionOutcomes },
      updated_at: new Date().toISOString(),
    })
    .eq('student_id', user.id);

  if (updateError) {
    console.error('Assessment completion error:', updateError);
    throw new Error('Failed to complete assessment');
  }

  // Fire assessment_completed event
  await supabase.from('events_log').insert({
    student_id: user.id,
    event_type: 'assessment_completed',
    target_type: 'module_0',
    target_id: 'assessment',
    metadata: {
      explanation_style: assessmentProfile.explanation_style,
      motivation_driver: assessmentProfile.motivation_driver,
      rescue_target: assessmentProfile.rescue_target_subject,
      advance_target: assessmentProfile.advance_target_subject,
    },
  });

  return {
    success: true,
    revealSummary,
    blueprint,
    visionOutcomes,
  };
}

export async function finishAssessmentAction() {
  const { supabase, user } = await getAuthenticatedUser();

  const { error } = await supabase
    .from('student_assessment_profiles')
    .update({
      assessment_completed: true,
      assessment_completed_at: new Date().toISOString(),
      current_phase: 6, // completed
      updated_at: new Date().toISOString(),
    })
    .eq('student_id', user.id);

  if (error) {
    console.error('Finish assessment error:', error);
    throw new Error('Failed to finish assessment');
  }

  revalidatePath('/student/home');
  revalidatePath('/parent/home');

  return { success: true };
}

// ── Fetch Assessment Profile (for resume / display) ─────────────────────────

export async function getAssessmentProfile() {
  const { supabase, user } = await getAuthenticatedUser();

  const { data, error } = await supabase
    .from('student_assessment_profiles')
    .select('*')
    .eq('student_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Fetch assessment profile error:', error);
    return null;
  }

  return data;
}
