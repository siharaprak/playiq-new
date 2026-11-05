import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import type { MasteryRequirementConfig, PlaceholderRequirementKey, PlaceholderRequirementStatus } from '@/lib/mastery/types';
import { inferRequirementDefaultsForNode, getRequirementSummary } from '@/lib/mastery/placeholders';
import {
  COURSE_15_MODULES,
  getCourseModuleNodeKey,
  getDbModuleIdForCourseModule,
  isNodeKeyForCourseModule,
} from '@/lib/constants';

export async function checkIsStudentAdmin(supabase: any, userId: string): Promise<boolean> {
  const [{ data: profile }, { data: roleRows }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', userId).maybeSingle(),
    supabase.from('user_roles').select('role').eq('user_id', userId),
  ]);
  return (
    profile?.role === 'admin' ||
    Boolean(roleRows?.some((r: any) => r.role === 'admin'))
  );
}

/**
 * Enforces that a student cannot jump ahead to Module N (N >= 2) unless
 * Modules 1..(N-1) have all been completed in sequence (or the user is an admin).
 */
export async function enforceSequentialModuleUnlock(moduleNumber: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const isAdmin = await checkIsStudentAdmin(supabase, user.id);
  if (isAdmin || moduleNumber <= 1) {
    return { user, isAdmin };
  }

  const { data: allProgress } = await supabase
    .from('student_node_progress')
    .select('module_id, node_id')
    .eq('student_id', user.id)
    .eq('node_mastered', true);

  let m13RecordCompleted = false;
  if (moduleNumber > 13) {
    try {
      const { data: lr13 } = await supabase
        .from('course_release_learning_records')
        .select('completed')
        .eq('student_id', user.id)
        .eq('module_number', 13)
        .maybeSingle();
      m13RecordCompleted = Boolean(lr13?.completed);
    } catch {
      // ignore if table unavailable
    }
  }

  const priorModules = COURSE_15_MODULES.filter(
    (m) => m.num >= 1 && m.num < moduleNumber,
  );

  for (const mod of priorModules) {
    const masteredCount = (allProgress || []).filter((row: any) =>
      isNodeKeyForCourseModule(mod.num, row.module_id, row.node_id),
    ).length;
    const completed =
      masteredCount >= mod.totalNodes || (mod.num === 13 && m13RecordCompleted);
    if (!completed) {
      redirect('/student/home');
    }
  }

  return { user, isAdmin: false };
}

// Module-agnostic node gating across the 15-module course
export async function enforceNodeGating(
  nodeId: string,
  phase: 'lesson' | 'activity' | 'mini-check' | 'teach-back' | 'completion',
  moduleNumber: number = 1
) {
  const { user, isAdmin } = await enforceSequentialModuleUnlock(moduleNumber);
  if (isAdmin) {
    return { user, progress: null, isAdmin: true };
  }

  const supabase = await createClient();
  const basePath = `/student/modules/${moduleNumber}`;
  const moduleId = getDbModuleIdForCourseModule(moduleNumber);
  const dbNodeKey = getCourseModuleNodeKey(moduleNumber, nodeId);

  // Enforce sequential node order within the module (Node K requires Nodes 1..K-1 mastered)
  const numericNodeId = Number(nodeId);
  if (Number.isInteger(numericNodeId) && numericNodeId > 1) {
    const { data: moduleProgress } = await supabase
      .from('student_node_progress')
      .select('node_id, node_mastered')
      .eq('student_id', user.id)
      .eq('module_id', moduleId)
      .eq('node_mastered', true);

    const masteredKeys = new Set((moduleProgress || []).map((r: any) => r.node_id));
    for (let prev = 1; prev < numericNodeId; prev++) {
      const prevKey = getCourseModuleNodeKey(moduleNumber, String(prev));
      if (!masteredKeys.has(prevKey)) {
        redirect(`${basePath}/overview`);
      }
    }
  }

  // Fetch progress for this specific node
  const { data: progress } = await supabase
    .from('student_node_progress')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', moduleId)
    .eq('node_id', dbNodeKey)
    .maybeSingle();

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
  const { user, isAdmin } = await enforceSequentialModuleUnlock(moduleNumber);
  if (isAdmin) {
    return { user, isAdmin: true };
  }

  // Module 13 is an optional possibility preview with no required quiz, boss battle, or artifact
  if (moduleNumber === 13) {
    return { user };
  }

  const supabase = await createClient();
  const basePath = `/student/modules/${moduleNumber}`;
  const moduleId = getDbModuleIdForCourseModule(moduleNumber);

  // Check node mastery count
  if (phase === 'quiz' || phase === 'boss-battle' || phase === 'artifacts' || phase === 'completion') {
    const { data: allNodes } = await supabase
      .from('student_node_progress')
      .select('node_id')
      .eq('student_id', user.id)
      .eq('module_id', moduleId)
      .eq('node_mastered', true);

    const matchedNodes = (allNodes || []).filter((n: any) =>
      isNodeKeyForCourseModule(moduleNumber, moduleId, n.node_id)
    );

    if (matchedNodes.length < totalNodes) {
      redirect(`${basePath}/overview`);
    }
  }

  // Fetch assessments and artifacts for this specific module, ordered by newest first
  const { data: rawAssessments } = await supabase
    .from('assessment_submissions')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', moduleId)
    .order('created_at', { ascending: false });

  const assessments = (rawAssessments || []).filter((a: any) => {
    if (moduleNumber >= 10) {
      return Number(a.submission_payload?.courseModuleNumber) === moduleNumber;
    }
    return a.submission_payload?.courseModuleNumber === undefined || Number(a.submission_payload?.courseModuleNumber) === moduleNumber;
  });

  const quiz = assessments.find((a: any) => a.assessment_type === 'module_quiz');
  const bossBattle = assessments.find((a: any) => a.assessment_type === 'boss_battle');

  const { data: rawArtifacts } = await supabase
    .from('proof_artifact_submissions')
    .select('*')
    .eq('student_id', user.id)
    .eq('module_id', moduleId)
    .order('created_at', { ascending: false });

  const artifacts = (rawArtifacts || []).filter((a: any) => {
    if (moduleNumber >= 10) {
      return Number(a.content_payload?.courseModuleNumber) === moduleNumber;
    }
    return a.content_payload?.courseModuleNumber === undefined || Number(a.content_payload?.courseModuleNumber) === moduleNumber;
  });

  const studyRules = artifacts.find(
    (a: any) => a.artifact_type === 'study_rules' && a.status !== 'draft' && a.status !== 'revise'
  );
  const errorReview = artifacts.find(
    (a: any) => a.artifact_type === 'error_review' && a.status !== 'draft' && a.status !== 'revise'
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
export function getPlaceholderRequirementsForNode(
  nodeId: string,
  moduleNumber: number,
  nodeType?: string
): MasteryRequirementConfig {
  return inferRequirementDefaultsForNode(nodeId, moduleNumber, nodeType);
}

export function hasPlaceholderRequirement(
  nodeId: string,
  moduleNumber: number,
  requirement: PlaceholderRequirementKey,
  nodeType?: string
): boolean {
  const config = inferRequirementDefaultsForNode(nodeId, moduleNumber, nodeType);
  return config.requirements[requirement]?.required ?? false;
}

export function describeMissingPlaceholderRequirements(
  nodeId: string,
  moduleNumber: number,
  nodeType?: string
): PlaceholderRequirementStatus[] {
  const config = inferRequirementDefaultsForNode(nodeId, moduleNumber, nodeType);
  return getRequirementSummary(config).filter((r) => r.required);
}
