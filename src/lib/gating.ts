import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import type { MasteryRequirementConfig, PlaceholderRequirementKey, PlaceholderRequirementStatus } from '@/lib/mastery/types';
import { inferRequirementDefaultsForNode, getRequirementSummary } from '@/lib/mastery/placeholders';
import { MODULES } from '@/lib/constants';

const MODULE_ID_MAP: Record<number, string> = {
  1: MODULES.MODULE_1_ID,
  2: MODULES.MODULE_2_ID,
  3: MODULES.MODULE_3_ID,
  4: MODULES.MODULE_4_ID,
  5: MODULES.MODULE_5_ID,
  6: MODULES.MODULE_6_ID,
  7: MODULES.MODULE_7_ID,
  8: MODULES.MODULE_8_ID,
  9: MODULES.MODULE_9_ID,
  10: MODULES.MODULE_10_ID,
  11: MODULES.CAPSTONE_ID,
};

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

  const moduleId = MODULE_ID_MAP[moduleNumber];

  // Fetch progress for this specific node
  let query = supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('node_id', nodeId);

  if (moduleId) {
    query = query.eq('module_id', moduleId);
  }

  const { data: progress } = await query.single();

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
    const moduleId = MODULE_ID_MAP[moduleNumber];
    let query = supabase
      .from('student_node_progress')
      .select('node_id')
      .eq('student_id', user.id)
      .eq('node_mastered', true);

    if (moduleId) {
      query = query.eq('module_id', moduleId);
    }

    const { data: allNodes } = await query;

    if (!allNodes || allNodes.length < totalNodes) {
      redirect(`${basePath}/overview`);
    }
  }

  // Fetch the module ID for moduleNumber
  const { data: currentModule } = await supabase
    .from('modules')
    .select('id')
    .eq('order_num', moduleNumber)
    .single();

  const moduleId = currentModule?.id;

  // Fetch assessments and artifacts for this specific module, ordered by newest first
  let assessmentQuery = supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  if (moduleId) {
    assessmentQuery = assessmentQuery.eq('module_id', moduleId);
  }

  const { data: assessments } = await assessmentQuery;

  const quiz = assessments?.find(a => a.assessment_type === 'module_quiz');
  const bossBattle = assessments?.find(a => a.assessment_type === 'boss_battle');

  let artifactQuery = supabase
    .from('proof_artifact_submissions')
    .select('*')
    .eq('student_id', user.id)
    .order('created_at', { ascending: false });

  if (moduleId) {
    artifactQuery = artifactQuery.eq('module_id', moduleId);
  }

  const { data: artifacts } = await artifactQuery;

  const studyRules = artifacts?.find(
    a => a.artifact_type === 'study_rules' && a.status !== 'draft' && a.status !== 'revise'
  );
  const errorReview = artifacts?.find(
    a => a.artifact_type === 'error_review' && a.status !== 'draft' && a.status !== 'revise'
  );

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
      if (!studyRules || (moduleNumber <= 2 && !errorReview)) {
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
