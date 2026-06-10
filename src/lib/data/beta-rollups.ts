// src/lib/data/beta-rollups.ts
//
// Sprint 9B: Derived Beta Rollup Helpers
// Consolidated, bounded count and summary helpers utilizing explicit projections.
// No physical caching or cross-user session leaks.
//

import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

// ---------------------------------------------------------------------------
// Authorization Helpers
// ---------------------------------------------------------------------------

async function assertAdmin(userId: string): Promise<void> {
  const { data: roleRows, error } = await supabaseAdmin
    .from('user_roles')
    .select('role')
    .eq('user_id', userId);

  if (error || !roleRows) {
    throw new Error('Unauthorized role inspection');
  }

  const roles = roleRows.map((r: any) => r.role);
  if (!roles.includes('admin')) {
    throw new Error('Not authorized: Admin privilege required');
  }
}

// ---------------------------------------------------------------------------
// Parent Rollups
// ---------------------------------------------------------------------------

export interface ParentRollupData {
  studentId: string;
  displayName: string;
  modulesCompleted: number;
  currentModuleTitle: string | null;
  latestActivityAt: string | null;
  proofSubmissionsTotal: number;
  proofApprovedTotal: number;
  tutorBuildStatus: 'none' | 'started' | 'has_version';
  assistantBuildStatus: 'none' | 'started' | 'has_version';
}

/**
 * Retrieves a parent-facing rollup for a child student, verifying parent_child_links.
 * Never includes storage paths, signed URLs, emails, or custom prompts.
 */
export async function getBetaParentRollup(
  parentId: string,
  studentId: string
): Promise<ParentRollupData | null> {
  // 1. Verify link
  const { data: link, error: linkError } = await supabaseAdmin
    .from('parent_child_links')
    .select('id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .limit(1)
    .maybeSingle();

  if (linkError || !link) {
    return null;
  }

  // 2. Fetch whitelisted fields
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('full_name')
    .eq('id', studentId)
    .single();

  if (!profile) return null;

  // Consolidate progress query
  const { data: nodeProgress } = await supabaseAdmin
    .from('student_node_progress')
    .select('module_id, node_mastered')
    .eq('student_id', studentId);

  const mastered = (nodeProgress ?? []).filter((n: any) => n.node_mastered);
  
  // Total modules done
  const { data: modules } = await supabaseAdmin
    .from('modules')
    .select('id, title, order_num')
    .order('order_num', { ascending: true });

  const KNOWN_MODULE_NODE_COUNTS: Record<number, number> = {
    1: 4, 2: 6, 3: 4, 4: 5, 5: 4, 6: 4, 7: 4, 8: 4, 9: 6, 10: 7,
  };

  const masteredByModule: Record<string, number> = {};
  for (const n of mastered) {
    masteredByModule[n.module_id] = (masteredByModule[n.module_id] || 0) + 1;
  }

  let modulesCompleted = 0;
  let currentModuleTitle: string | null = null;
  if (modules) {
    for (const mod of modules) {
      if (mod.order_num >= 1 && mod.order_num <= 10) {
        const expected = KNOWN_MODULE_NODE_COUNTS[mod.order_num] ?? 4;
        const masteredCount = masteredByModule[mod.id] ?? 0;
        if (masteredCount >= expected) {
          modulesCompleted++;
        } else if (!currentModuleTitle) {
          currentModuleTitle = mod.title;
        }
      }
    }
  }

  // Fetch count-only proof details
  const { data: proofs } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('status')
    .eq('student_id', studentId);

  const proofSubmissionsTotal = proofs?.length ?? 0;
  const proofApprovedTotal = proofs?.filter((p: any) => p.status === 'approved').length ?? 0;

  // Tutor/Assistant status (counts only)
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

  const tutorStatus = (tutorVersions ?? 0) > 0 ? 'has_version' : (tutorCount ?? 0) > 0 ? 'started' : 'none';
  const assistantStatus = (assistantVersions ?? 0) > 0 ? 'has_version' : (assistantCount ?? 0) > 0 ? 'started' : 'none';

  // Latest activity event
  const { data: latestEvent } = await supabaseAdmin
    .from('events_log')
    .select('created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    studentId,
    displayName: profile.full_name || 'Student',
    modulesCompleted,
    currentModuleTitle: currentModuleTitle || 'All modules completed',
    latestActivityAt: latestEvent?.created_at ?? null,
    proofSubmissionsTotal,
    proofApprovedTotal,
    tutorBuildStatus: tutorStatus,
    assistantBuildStatus: assistantStatus,
  };
}

// ---------------------------------------------------------------------------
// Admin Ops Rollups
// ---------------------------------------------------------------------------

export interface AdminOpsSummary {
  openTickets: number;
  overdueProofReviews: number;
  criticalAlerts: number;
  warnings: number;
  timestamp: string;
}

/**
 * Returns count-only metrics for Admin Home widgets.
 */
export async function getBetaAdminOpsRollup(adminUserId: string): Promise<AdminOpsSummary> {
  await assertAdmin(adminUserId);
  const now = new Date();

  // 1. Open tickets count
  const { count: openTickets } = await supabaseAdmin
    .from('support_issues')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'open');

  // 2. Overdue proof reviews count (> 48 hours in pending_review / submitted status)
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();
  const { count: overdueProofReviews } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('id', { count: 'exact', head: true })
    .in('status', ['submitted', 'under_review', 'pending_review'])
    .lte('created_at', fortyEightHoursAgo);

  return {
    openTickets: openTickets || 0,
    overdueProofReviews: overdueProofReviews || 0,
    criticalAlerts: 0, // Injected by alert policy evaluations
    warnings: 0,
    timestamp: now.toISOString(),
  };
}

export interface AiUsageSummary {
  guidedAiTotal: number;
  refusalsTotal: number;
  tutorTestsTotal: number;
  assistantTestsTotal: number;
}

/**
 * Returns total cost and refusal rates in a bounded window.
 */
export async function getBetaAiUsageRollup(
  adminUserId: string,
  windowHours: number = 24
): Promise<AiUsageSummary> {
  await assertAdmin(adminUserId);
  const startTime = new Date(Date.now() - windowHours * 60 * 60 * 1000).toISOString();

  // Scans events log using explicit projections
  const { data: events } = await supabaseAdmin
    .from('events_log')
    .select('event_type, metadata')
    .gte('created_at', startTime);

  let guidedAiTotal = 0;
  let refusalsTotal = 0;
  let tutorTestsTotal = 0;
  let assistantTestsTotal = 0;

  events?.forEach((e: any) => {
    const type = e.event_type;
    const action = e.metadata?.action;

    if (type.startsWith('guided_ai_')) {
      guidedAiTotal++;
      if (type === 'guided_ai_refused' || type === 'unsafe_assistance_routed') {
        refusalsTotal++;
      }
    } else if (type === 'tutor_profile_updated') {
      if (action === 'tutor_test_attempt') tutorTestsTotal++;
      if (action === 'tutor_test_refused') {
        tutorTestsTotal++;
        refusalsTotal++;
      }
    } else if (type === 'assistant_profile_updated') {
      if (action === 'assistant_test_attempt') assistantTestsTotal++;
      if (action === 'assistant_test_refused') {
        assistantTestsTotal++;
        refusalsTotal++;
      }
    }
  });

  return {
    guidedAiTotal,
    refusalsTotal,
    tutorTestsTotal,
    assistantTestsTotal,
  };
}

export interface ProofReviewCounts {
  submitted: number;
  approved: number;
  revise: number;
}

/**
 * Count-only proof summary for reviewer stats.
 */
export async function getBetaProofReviewRollup(adminUserId: string): Promise<ProofReviewCounts> {
  await assertAdmin(adminUserId);

  const { data: statusCounts } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('status');

  let submitted = 0;
  let approved = 0;
  let revise = 0;

  statusCounts?.forEach((p: any) => {
    if (p.status === 'submitted' || p.status === 'under_review') submitted++;
    else if (p.status === 'approved') approved++;
    else if (p.status === 'revise' || p.status === 'rejected') revise++;
  });

  return { submitted, approved, revise };
}

export interface SupportCounts {
  open: number;
  resolved: number;
}

/**
 * Count-only support summary.
 */
export async function getBetaSupportRollup(adminUserId: string): Promise<SupportCounts> {
  await assertAdmin(adminUserId);

  const { data: tickets } = await supabaseAdmin
    .from('support_issues')
    .select('status');

  let open = 0;
  let resolved = 0;

  tickets?.forEach((t: any) => {
    if (t.status === 'open') open++;
    else if (t.status === 'resolved') resolved++;
  });

  return { open, resolved };
}

export interface EnrollmentCounts {
  active: number;
  total: number;
}

/**
 * Count-only enrollment summary.
 */
export async function getBetaEnrollmentRollup(adminUserId: string): Promise<EnrollmentCounts> {
  await assertAdmin(adminUserId);

  const { data: list } = await supabaseAdmin
    .from('enrollments')
    .select('status');

  let active = 0;
  list?.forEach((e: any) => {
    if (e.status === 'active') active++;
  });

  return {
    active,
    total: list?.length || 0,
  };
}
