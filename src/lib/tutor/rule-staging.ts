// src/lib/tutor/rule-staging.ts
'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import type { StagedRules } from './rule-staging-types';
import { DEFAULT_STAGED_RULES } from './rule-staging-types';

/**
 * Fetch all staged rules for the authenticated student.
 */
export async function getStudentStagedRules(studentId?: string): Promise<StagedRules> {
  const supabase = await createClient();
  let targetId = studentId;

  if (!targetId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return DEFAULT_STAGED_RULES;
    targetId = user.id;
  }

  const { data: profile } = await supabase
    .from('student_assessment_profiles')
    .select('rescue_target_subject, advance_target_subject, personal_goal, explanation_style, pacing_preference, learning_blueprint')
    .eq('student_id', targetId)
    .maybeSingle();

  const blueprint = profile?.learning_blueprint as Record<string, unknown> | null;
  const blueprintRules = (blueprint?.staged_rules as Partial<StagedRules>) || {};

  return {
    ...DEFAULT_STAGED_RULES,
    rescueTarget: profile?.rescue_target_subject || DEFAULT_STAGED_RULES.rescueTarget,
    advanceTarget: profile?.advance_target_subject || DEFAULT_STAGED_RULES.advanceTarget,
    personalGoal: profile?.personal_goal || DEFAULT_STAGED_RULES.personalGoal,
    explanationStyle: profile?.explanation_style || DEFAULT_STAGED_RULES.explanationStyle,
    pacingPreference: profile?.pacing_preference || DEFAULT_STAGED_RULES.pacingPreference,
    ...blueprintRules,
  };
}

/**
 * Save or update specific staged rules for a student.
 */
export async function saveStudentStagedRule(
  updates: Partial<StagedRules>
): Promise<{ success: boolean; rules: StagedRules }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch current blueprint
  const { data: profile } = await supabase
    .from('student_assessment_profiles')
    .select('learning_blueprint')
    .eq('student_id', user.id)
    .maybeSingle();

  const currentBlueprint = (profile?.learning_blueprint as Record<string, unknown>) || {};
  const currentStagedRules = (currentBlueprint.staged_rules as Record<string, unknown>) || {};

  const updatedStagedRules = {
    ...currentStagedRules,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const updatedBlueprint = {
    ...currentBlueprint,
    staged_rules: updatedStagedRules,
  };

  const { error } = await supabase
    .from('student_assessment_profiles')
    .update({ learning_blueprint: updatedBlueprint })
    .eq('student_id', user.id);

  if (error) {
    console.error('Error updating student staged rule:', error);
    throw new Error('Failed to save learning rule');
  }

  revalidatePath('/student/modules');
  revalidatePath('/student/assessment');

  const fullRules = await getStudentStagedRules(user.id);
  return { success: true, rules: fullRules };
}
