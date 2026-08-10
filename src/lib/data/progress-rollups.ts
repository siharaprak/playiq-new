/**
 * Sprint 3 Continued — Progress Rollup Helpers
 *
 * Server-only rollup functions for student and parent dashboard data.
 * Uses supabaseAdmin (service role) following the pattern in discussions.ts.
 *
 * RULES:
 *   - Never return student email in any rollup.
 *   - Parent rollups only return linked children via parent_child_links.
 *   - All rollups are read-only — no mutations.
 *   - These helpers do NOT replace existing dashboard queries yet.
 *   - They provide a clean data layer for future dashboard refactoring.
 */

import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StudentProgressRollup {
  student_id: string;
  display_name: string;
  modules_total: number;
  modules_started: number;
  modules_completed: number;
  nodes_total_or_known: number;
  nodes_mastered: number;
  assessments_submitted: number;
  latest_activity_at: string | null;
  proof_submissions_total: number;
  proof_approved_total: number;
  tutor_profile_status: 'none' | 'exists';
  tutor_versions_count: number;
  assistant_profiles_count: number;
  assistant_versions_count: number;
  discussion_replies_count: number;
  pdi_score: number;
}

export interface StudentModuleRollup {
  module_id: string;
  module_title: string;
  module_order: number;
  total_nodes: number;
  nodes_mastered: number;
  assessments_submitted: number;
  quiz_passed: boolean;
  boss_battle_passed: boolean;
  proof_submitted: boolean;
  is_complete: boolean;
}

export interface StudentProofRollup {
  total_submitted: number;
  total_approved: number;
  by_type: { artifact_type: string; count: number; approved: number }[];
}

export interface StudentDiscussionRollup {
  topics_count: number;
  replies_count: number;
  latest_topic_at: string | null;
  latest_reply_at: string | null;
}

export interface StudentTutorAssistantRollup {
  tutor_profile_exists: boolean;
  tutor_versions_count: number;
  assistant_profiles_count: number;
  assistant_versions_count: number;
}

export interface ParentChildSummary {
  student_id: string;
  display_name: string;
  modules_completed: number;
  current_module_title: string | null;
  latest_activity_at: string | null;
  proof_submissions_total: number;
  proof_approved_total: number;
  discussion_activity_count: number;
  tutor_build_status: 'none' | 'started' | 'has_version';
  assistant_build_status: 'none' | 'started' | 'has_version';
  flags: string[];
  pdi_score: number;
}

export interface ModuleTelemetry {
  time_logged_minutes: number;
  hints_utilized: number;
  resilience_score: number; // attempts on boss battle/mini check
}

// ---------------------------------------------------------------------------
// Known module config (from constants.ts MODULE_LIST pattern)
// ---------------------------------------------------------------------------

const KNOWN_MODULE_NODE_COUNTS: Record<number, number> = {
  1: 4, 2: 6, 3: 4, 4: 5, 5: 4, 6: 4, 7: 4, 8: 4, 9: 6, 10: 7,
};
const TOTAL_KNOWN_NODES = Object.values(KNOWN_MODULE_NODE_COUNTS).reduce((a, b) => a + b, 0);
const TOTAL_MODULES = 10;

// ---------------------------------------------------------------------------
// Telemetry & PDI Helpers
// ---------------------------------------------------------------------------

/**
 * Calculates the PDI (Performance & Dedication Index).
 * Formula: 40% Effort (Nodes), 30% Accuracy (Assessments), 30% Mastery (Proofs).
 */
export async function getPDIForStudent(studentId: string): Promise<number> {
  const { data: nodeProgress } = await supabaseAdmin
    .from('student_node_progress')
    .select('node_mastered')
    .eq('student_id', studentId);
    
  const mastered = (nodeProgress ?? []).filter((n: any) => n.node_mastered).length;
  const effortScore = TOTAL_KNOWN_NODES > 0 ? (mastered / TOTAL_KNOWN_NODES) * 100 : 0;

  const { data: assessments } = await supabaseAdmin
    .from('assessment_submissions')
    .select('score_numeric, assessment_type')
    .eq('student_id', studentId)
    .in('assessment_type', ['mini_check', 'boss_battle']);
    
  let accuracyScore = 0;
  if (assessments && assessments.length > 0) {
    const sum = assessments.reduce((acc, curr) => acc + (Number(curr.score_numeric) || 0), 0);
    // boss_battle is out of 5, mini_check is out of 100, we'll normalize everything roughly
    // For simplicity of MVP, just average their raw percentages or out-of-5 to 100
    let normalizedSum = 0;
    assessments.forEach((a: any) => {
      if (a.assessment_type === 'boss_battle') normalizedSum += ((Number(a.score_numeric) || 0) / 5) * 100;
      else normalizedSum += Number(a.score_numeric) || 0;
    });
    accuracyScore = normalizedSum / assessments.length;
  }

  const { data: proofs } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('status')
    .eq('student_id', studentId);
    
  const proofTotal = proofs?.length || 0;
  const proofApproved = proofs?.filter((p: any) => p.status === 'approved').length || 0;
  const masteryScore = proofTotal > 0 ? (proofApproved / proofTotal) * 100 : 0;

  return Math.round((effortScore * 0.4) + (accuracyScore * 0.3) + (masteryScore * 0.3));
}

/**
 * Fetches real-time telemetry for a specific module
 */
export async function getModuleTelemetry(studentId: string, moduleId: string): Promise<ModuleTelemetry> {
  // Approximate time from events_log (just counting events * 2 mins for MVP if no true duration exists)
  // Or if we have actual timestamps, we could diff them. For MVP:
  const { count: eventCount } = await supabaseAdmin
    .from('events_log')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('module_id', moduleId); // Assuming events_log has module_id or target_id is node
    
  // hints utilized (checking fingerprint or events)
  const { count: hintsCount } = await supabaseAdmin
    .from('events_log')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('event_type', 'hint_requested' as any); // Might not exist, fallback to 0
    
  // attempts on assessments
  const { count: attemptsCount } = await supabaseAdmin
    .from('assessment_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId)
    .eq('module_id', moduleId);

  return {
    time_logged_minutes: (eventCount || 0) * 2, // Mock 2 min per event logged
    hints_utilized: hintsCount || 0,
    resilience_score: attemptsCount || 0, // Number of attempts indicates resilience
  };
}

// ---------------------------------------------------------------------------
// Student rollups
// ---------------------------------------------------------------------------

/**
 * Returns a comprehensive progress rollup for a student.
 * Never includes email.
 */
export async function getStudentProgressRollup(
  studentId: string
): Promise<StudentProgressRollup | null> {
  // Profile (display name only)
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', studentId)
    .single();

  if (!profile) return null;

  // Node progress
  const { data: nodeProgress } = await supabaseAdmin
    .from('student_node_progress')
    .select('module_id, node_mastered, unlocked_at, completed_at')
    .eq('student_id', studentId);

  const mastered = (nodeProgress ?? []).filter((n: any) => n.node_mastered);
  const moduleIds = new Set((nodeProgress ?? []).map((n: any) => n.module_id));

  // Assessment submissions
  const { count: assessmentCount } = await supabaseAdmin
    .from('assessment_submissions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  // Latest event
  const { data: latestEvent } = await supabaseAdmin
    .from('events_log')
    .select('created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Proof artifacts
  const { data: proofData } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('status')
    .eq('student_id', studentId);

  const proofTotal = proofData?.length ?? 0;
  const proofApproved = proofData?.filter((p: any) => p.status === 'approved').length ?? 0;

  // Tutor profiles
  const { count: tutorCount } = await supabaseAdmin
    .from('tutor_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  const { count: tutorVersions } = await supabaseAdmin
    .from('tutor_versions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  // Assistant profiles
  const { count: assistantCount } = await supabaseAdmin
    .from('assistant_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  const { count: assistantVersions } = await supabaseAdmin
    .from('assistant_versions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  // Discussion engagement
  const { count: topicsCount } = await supabaseAdmin
    .from('discussion_topics')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', studentId);

  const { count: repliesCount } = await supabaseAdmin
    .from('discussion_replies')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', studentId);

  // Determine modules completed (simplified: all nodes mastered in module)
  const masteredByModule: Record<string, number> = {};
  for (const n of mastered) {
    masteredByModule[n.module_id] = (masteredByModule[n.module_id] || 0) + 1;
  }

  // Count modules where mastered nodes >= expected node count (Modules 1-10)
  const { data: allModules } = await supabaseAdmin
    .from('modules')
    .select('id, order_num')
    .gte('order_num', 1)
    .lte('order_num', 10);

  let modulesCompleted = 0;
  if (allModules) {
    for (const mod of allModules) {
      const expected = KNOWN_MODULE_NODE_COUNTS[mod.order_num];
      if (expected && (masteredByModule[mod.id] ?? 0) >= expected) {
        modulesCompleted++;
      }
    }
  }

  return {
    student_id: studentId,
    display_name: profile.full_name || 'Student',
    modules_total: TOTAL_MODULES,
    modules_started: moduleIds.size,
    modules_completed: modulesCompleted,
    nodes_total_or_known: TOTAL_KNOWN_NODES,
    nodes_mastered: mastered.length,
    assessments_submitted: assessmentCount ?? 0,
    latest_activity_at: latestEvent?.created_at ?? null,
    proof_submissions_total: proofTotal,
    proof_approved_total: proofApproved,
    tutor_profile_status: (tutorCount ?? 0) > 0 ? 'exists' : 'none',
    tutor_versions_count: tutorVersions ?? 0,
    assistant_profiles_count: assistantCount ?? 0,
    assistant_versions_count: assistantVersions ?? 0,
    discussion_topics_count: topicsCount ?? 0,
    discussion_replies_count: repliesCount ?? 0,
    pdi_score: await getPDIForStudent(studentId),
  };
}

/**
 * Returns per-module rollups for a student.
 */
export async function getStudentModuleRollups(
  studentId: string
): Promise<StudentModuleRollup[]> {
  // Fetch all modules
  const { data: modules } = await supabaseAdmin
    .from('modules')
    .select('id, title, order_num')
    .order('order_num', { ascending: true });

  if (!modules) return [];

  // Node progress
  const { data: nodeProgress } = await supabaseAdmin
    .from('student_node_progress')
    .select('module_id, node_mastered')
    .eq('student_id', studentId);

  // Assessments
  const { data: assessments } = await supabaseAdmin
    .from('assessment_submissions')
    .select('module_id, assessment_type, pass_status, score_numeric')
    .eq('student_id', studentId);

  // Proof artifacts (only count if they are actually submitted or approved - i.e., not draft or revise)
  const { data: proofs } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('module_id')
    .eq('student_id', studentId)
    .not('status', 'in', '("draft","revise")');

  return modules
    .filter((m: any) => m.order_num >= 1 && m.order_num <= 10)
    .map((mod: any) => {
      const modNodes = (nodeProgress ?? []).filter((n: any) => n.module_id === mod.id);
      const modMastered = modNodes.filter((n: any) => n.node_mastered).length;
      const modAssessments = (assessments ?? []).filter((a: any) => a.module_id === mod.id);
      const modProofs = (proofs ?? []).filter((p: any) => p.module_id === mod.id);
      const quiz = modAssessments.find((a: any) => a.assessment_type === 'module_quiz' && a.pass_status === 'pass');
      const boss = modAssessments.find((a: any) => a.assessment_type === 'boss_battle' && a.pass_status === 'pass');
      const expectedNodes = KNOWN_MODULE_NODE_COUNTS[mod.order_num] ?? 4;

      return {
        module_id: mod.id,
        module_title: mod.title,
        module_order: mod.order_num,
        total_nodes: expectedNodes,
        nodes_mastered: modMastered,
        assessments_submitted: modAssessments.length,
        quiz_passed: !!quiz,
        boss_battle_passed: !!boss,
        proof_submitted: modProofs.length >= 2,
        is_complete: modMastered >= expectedNodes && !!quiz && !!boss && modProofs.length >= 2,
      };
    });
}

/**
 * Returns proof artifact rollup for a student.
 */
export async function getStudentProofRollup(
  studentId: string
): Promise<StudentProofRollup> {
  const { data: proofs } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('artifact_type, status')
    .eq('student_id', studentId);

  const items = proofs ?? [];
  const byType: Record<string, { count: number; approved: number }> = {};

  for (const p of items) {
    if (!byType[p.artifact_type]) byType[p.artifact_type] = { count: 0, approved: 0 };
    byType[p.artifact_type].count++;
    if (p.status === 'approved') byType[p.artifact_type].approved++;
  }

  return {
    total_submitted: items.length,
    total_approved: items.filter((p: any) => p.status === 'approved').length,
    by_type: Object.entries(byType).map(([type, data]) => ({
      artifact_type: type,
      count: data.count,
      approved: data.approved,
    })),
  };
}

/**
 * Returns discussion engagement rollup for a student.
 */
export async function getStudentDiscussionEngagementRollup(
  studentId: string
): Promise<StudentDiscussionRollup> {
  const { count: topicsCount } = await supabaseAdmin
    .from('discussion_topics')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', studentId);

  const { data: latestTopic } = await supabaseAdmin
    .from('discussion_topics')
    .select('created_at')
    .eq('author_id', studentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { count: repliesCount } = await supabaseAdmin
    .from('discussion_replies')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', studentId);

  const { data: latestReply } = await supabaseAdmin
    .from('discussion_replies')
    .select('created_at')
    .eq('author_id', studentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    topics_count: topicsCount ?? 0,
    replies_count: repliesCount ?? 0,
    latest_topic_at: latestTopic?.created_at ?? null,
    latest_reply_at: latestReply?.created_at ?? null,
  };
}

/**
 * Returns tutor/assistant build rollup for a student.
 */
export async function getStudentTutorAssistantRollup(
  studentId: string
): Promise<StudentTutorAssistantRollup> {
  const { count: tutorCount } = await supabaseAdmin
    .from('tutor_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  const { count: tutorVersions } = await supabaseAdmin
    .from('tutor_versions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  const { count: assistantCount } = await supabaseAdmin
    .from('assistant_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  const { count: assistantVersions } = await supabaseAdmin
    .from('assistant_versions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  return {
    tutor_profile_exists: (tutorCount ?? 0) > 0,
    tutor_versions_count: tutorVersions ?? 0,
    assistant_profiles_count: assistantCount ?? 0,
    assistant_versions_count: assistantVersions ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Parent rollups
// ---------------------------------------------------------------------------

/**
 * Returns rollups for ALL linked children of a parent.
 * Only includes children via parent_child_links.
 * Never exposes email.
 */
export async function getParentChildrenRollups(
  parentId: string
): Promise<ParentChildSummary[]> {
  // Fetch linked student IDs
  const { data: links } = await supabaseAdmin
    .from('parent_child_links')
    .select('student_id')
    .eq('parent_id', parentId);

  if (!links || links.length === 0) return [];

  const studentIds = links.map((l: any) => l.student_id);
  const results: ParentChildSummary[] = [];

  for (const studentId of studentIds) {
    const summary = await getParentChildSummary(parentId, studentId);
    if (summary) results.push(summary);
  }

  return results;
}

/**
 * Returns a summary for a single linked child.
 * Verifies parent-child link before returning data.
 * Never exposes email.
 */
export async function getParentChildSummary(
  parentId: string,
  studentId: string
): Promise<ParentChildSummary | null> {
  // Verify the link exists
  const { data: link } = await supabaseAdmin
    .from('parent_child_links')
    .select('id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .single();

  if (!link) return null;

  // Profile (display name only — NO email)
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', studentId)
    .single();

  // Node progress
  const { data: nodeProgress } = await supabaseAdmin
    .from('student_node_progress')
    .select('module_id, node_mastered')
    .eq('student_id', studentId);

  const mastered = (nodeProgress ?? []).filter((n: any) => n.node_mastered);
  const masteredByModule: Record<string, number> = {};
  for (const n of mastered) {
    masteredByModule[n.module_id] = (masteredByModule[n.module_id] || 0) + 1;
  }

  // Latest event
  const { data: latestEvent } = await supabaseAdmin
    .from('events_log')
    .select('created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // Proof artifacts
  const { data: proofs } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('status')
    .eq('student_id', studentId);

  // Discussion activity
  const { count: topicsCount } = await supabaseAdmin
    .from('discussion_topics')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', studentId);

  const { count: repliesCount } = await supabaseAdmin
    .from('discussion_replies')
    .select('id', { count: 'exact', head: true })
    .eq('author_id', studentId);

  // Tutor/assistant status
  const { count: tutorCount } = await supabaseAdmin
    .from('tutor_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  const { count: tutorVersions } = await supabaseAdmin
    .from('tutor_versions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  const { count: assistantCount } = await supabaseAdmin
    .from('assistant_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  const { count: assistantVersions } = await supabaseAdmin
    .from('assistant_versions')
    .select('id', { count: 'exact', head: true })
    .eq('student_id', studentId);

  // Determine current module
  const { data: currentModules } = await supabaseAdmin
    .from('modules')
    .select('id, title, order_num')
    .order('order_num', { ascending: true });

  let currentModuleTitle: string | null = null;
  if (currentModules) {
    for (const mod of currentModules) {
      if (mod.order_num >= 1 && mod.order_num <= 10) {
        const expectedNodes = KNOWN_MODULE_NODE_COUNTS[mod.order_num] ?? 4;
        const modMastered = masteredByModule[mod.id] ?? 0;
        if (modMastered < expectedNodes) {
          currentModuleTitle = mod.title;
          break;
        }
      }
    }
  }

  // Flags
  const flags: string[] = [];
  if (mastered.length === 0) flags.push('Not started');
  if (!latestEvent) flags.push('No recent activity');

  // Tutor/assistant build status
  const tutorStatus = (tutorVersions ?? 0) > 0
    ? 'has_version'
    : (tutorCount ?? 0) > 0
    ? 'started'
    : 'none';

  const assistantStatus = (assistantVersions ?? 0) > 0
    ? 'has_version'
    : (assistantCount ?? 0) > 0
    ? 'started'
    : 'none';

  // Count modules where mastered nodes >= expected node count (Modules 1-10)
  // Reuses currentModules already fetched above for current_module_title
  let modulesCompleted = 0;
  if (currentModules) {
    for (const mod of currentModules) {
      if (mod.order_num >= 1 && mod.order_num <= 10) {
        const expected = KNOWN_MODULE_NODE_COUNTS[mod.order_num];
        if (expected && (masteredByModule[mod.id] ?? 0) >= expected) {
          modulesCompleted++;
        }
      }
    }
  }

  return {
    student_id: studentId,
    display_name: profile?.full_name || 'Student',
    modules_completed: modulesCompleted,
    current_module_title: currentModuleTitle,
    latest_activity_at: latestEvent?.created_at ?? null,
    proof_submissions_total: proofs?.length ?? 0,
    proof_approved_total: proofs?.filter((p: any) => p.status === 'approved').length ?? 0,
    discussion_activity_count: (topicsCount ?? 0) + (repliesCount ?? 0),
    tutor_build_status: tutorStatus,
    assistant_build_status: assistantStatus,
    flags,
    pdi_score: await getPDIForStudent(studentId),
  };
}
