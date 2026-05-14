import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import type { MasteryRequirementConfig, PlaceholderRequirementKey, PlaceholderRequirementStatus } from '@/lib/mastery/types';
import { inferRequirementDefaultsForNode, getRequirementSummary } from '@/lib/mastery/placeholders';

// Module-agnostic node gating
export async function enforceNodeGating(
  nodeId: string,
  phase: 'lesson' | 'activity' | 'mini-check' | 'teach-back' | 'completion',
  moduleNumber: number = 1
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const basePath = `/student/modules/${moduleNumber}`;

  // Fetch progress for this specific node
  const { data: progress } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('node_id', nodeId)
    .single();

  switch (phase) {
    case 'activity':
      if (!progress?.lesson_completed) {
        redirect(`${basePath}/nodes/${nodeId}/lesson`);
      }
      break;
    case 'mini-check':
      if (!progress?.activity_completed) {
        redirect(`${basePath}/nodes/${nodeId}/activity`);
      }
      break;
    case 'teach-back':
      if (!progress?.mini_check_passed) {
        redirect(`${basePath}/nodes/${nodeId}/mini-check`);
      }
      break;
    case 'completion':
      if (progress?.teach_back_status !== 'pass') {
        redirect(`${basePath}/nodes/${nodeId}/teach-back`);
      }
      break;
  }

  return { user, progress };
}

export async function enforceModuleGating(
  phase: 'quiz' | 'boss-battle' | 'artifacts' | 'completion',
  moduleNumber: number = 1,
  totalNodes: number = 4
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const basePath = `/student/modules/${moduleNumber}`;

  // Check node mastery count
  if (phase === 'quiz' || phase === 'boss-battle' || phase === 'artifacts' || phase === 'completion') {
    const { data: allNodes } = await supabase
      .from('student_node_progress')
      .select('node_id')
      .eq('student_id', user.id)
      .eq('node_mastered', true);

    if (!allNodes || allNodes.length < totalNodes) {
      redirect(`${basePath}/overview`);
    }
  }

  // Fetch assessments and artifacts
  const { data: assessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user.id);

  const quiz = assessments?.find(a => a.assessment_type === 'module_quiz');
  const bossBattle = assessments?.find(a => a.assessment_type === 'boss_battle');

  const { data: artifacts } = await supabase
    .from('proof_artifact_submissions')
    .select('*')
    .eq('student_id', user.id);

  const studyRules = artifacts?.find(a => a.artifact_type === 'study_rules');
  const errorReview = artifacts?.find(a => a.artifact_type === 'error_review');

  switch (phase) {
    case 'boss-battle':
      if (!quiz || quiz.score_numeric < 80) {
        redirect(`${basePath}/quiz`);
      }
      break;
    case 'artifacts':
      if (!bossBattle || bossBattle.score_numeric < 4) {
        redirect(`${basePath}/boss-battle`);
      }
      break;
    case 'completion':
      if (!quiz || quiz.score_numeric < 80) {
        redirect(`${basePath}/quiz`);
      }
      if (!bossBattle || bossBattle.score_numeric < 4) {
        redirect(`${basePath}/boss-battle`);
      }
      if (!studyRules || !errorReview) {
        redirect(`${basePath}/proof-artifacts`);
      }
      break;
  }

  return { user };
}

// ---------------------------------------------------------------------------
// Sprint 3: Placeholder requirement helpers (non-breaking, no enforcement)
// ---------------------------------------------------------------------------
// These helpers query the mastery placeholder config for a node.
// They do NOT enforce any gates or alter existing gating behavior.



/**
 * Returns the full placeholder mastery config for a node.
 * Does not enforce anything.
 */
export function getPlaceholderRequirementsForNode(
  nodeId: string,
  moduleNumber: number,
  nodeType?: string
): MasteryRequirementConfig {
  return inferRequirementDefaultsForNode(nodeId, moduleNumber, nodeType);
}

/**
 * Checks if a specific placeholder requirement is required for a node.
 * Does not enforce anything.
 */
export function hasPlaceholderRequirement(
  nodeId: string,
  moduleNumber: number,
  requirement: PlaceholderRequirementKey,
  nodeType?: string
): boolean {
  const config = inferRequirementDefaultsForNode(nodeId, moduleNumber, nodeType);
  return config.requirements[requirement]?.required ?? false;
}

/**
 * Returns a list of placeholder requirements that are marked as required
 * but not yet fulfilled. Since enforcement is not active, this returns
 * all required placeholders as "missing" for informational purposes.
 * Does not enforce anything.
 */
export function describeMissingPlaceholderRequirements(
  nodeId: string,
  moduleNumber: number,
  nodeType?: string
): PlaceholderRequirementStatus[] {
  const config = inferRequirementDefaultsForNode(nodeId, moduleNumber, nodeType);
  return getRequirementSummary(config).filter((r) => r.required);
}
