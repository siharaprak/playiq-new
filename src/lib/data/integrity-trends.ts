import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { summarizeGuidedAiUsagePatterns } from '@/lib/events/guided-ai-event-policy';
import type { GuidedAiEventType } from '@/lib/events/types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IntegrityTrendStatus = 'strong' | 'stable' | 'needs_support' | 'watch';

export interface IntegrityTrendSummary {
  studentId: string;
  periodStart: string;
  periodEnd: string;
  totalGuidedAiEvents: number;
  healthyLearningUseCount: number;
  hintSeekingCount: number;
  lessonRescueUseCount: number;
  quizPracticeCount: number;
  effortRequiredCount: number;
  refusalCount: number;
  unsafeRouteCount: number;
  teachBackRequiredCount: number;
  learnYourWayUpdates: number;
  integrityTrend: IntegrityTrendStatus;
  parentSafeSummary: string;
  suggestedParentAction: string;
}

export interface TrendOptions {
  daysBack?: number;
}

// ---------------------------------------------------------------------------
// Core Trend Generation
// ---------------------------------------------------------------------------

/**
 * Pure function: Summarizes raw events into a classified integrity trend.
 * Never exposes raw prompts, responses, or PII.
 */
export function summarizeIntegrityTrend(
  studentId: string,
  events: { event_type: GuidedAiEventType; metadata: Record<string, unknown>; created_at: string }[],
  daysBack: number
): IntegrityTrendSummary {
  const periodEnd = new Date().toISOString();
  const periodStart = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

  // Aggregate patterns
  const mappedEvents = events.map(e => ({ eventType: e.event_type, metadata: e.metadata }));
  const patterns = summarizeGuidedAiUsagePatterns(mappedEvents);

  const totalGuidedAiEvents = events.length;
  const refusalCount = patterns.direct_answer_seeking + patterns.homework_outsourcing + patterns.assessment_answer_seeking + patterns.unsafe_request;
  const unsafeRouteCount = patterns.unsafe_request;
  const effortRequiredCount = patterns.low_effort_loop;

  // 1. Threshold Classification
  let integrityTrend: IntegrityTrendStatus = 'stable';
  
  if (unsafeRouteCount >= 3 || patterns.assessment_answer_seeking >= 3 || patterns.homework_outsourcing >= 5) {
    integrityTrend = 'watch';
  } else if (effortRequiredCount >= 5 || patterns.direct_answer_seeking >= 5 || patterns.repeated_deeper_help >= 5) {
    integrityTrend = 'needs_support';
  } else if (patterns.healthy_learning_use >= 5 && refusalCount <= 2 && unsafeRouteCount === 0 && (patterns.quiz_practice_use > 0 || patterns.lesson_rescue_use > 0 || patterns.teachback_followthrough > 0)) {
    integrityTrend = 'strong';
  } else if (totalGuidedAiEvents === 0) {
    integrityTrend = 'stable'; // No data yet
  }

  // 2. Parent-Safe Messaging
  let parentSafeSummary = 'Using Guided AI for standard help and hints.';
  let suggestedParentAction = 'Encourage them to keep practicing and asking questions.';

  switch (integrityTrend) {
    case 'watch':
      parentSafeSummary = 'Frequently asks for direct answers, assessment answers, or attempts to skip work.';
      suggestedParentAction = 'Remind them that the AI is a coach, not an answer key. Discuss the value of trying problems independently.';
      break;
    case 'needs_support':
      parentSafeSummary = 'Needs more effort before deeper help is given. Sometimes gets stuck asking for answers.';
      suggestedParentAction = 'Encourage them to show their work and attempt the problem before asking the AI for a hint.';
      break;
    case 'strong':
      parentSafeSummary = 'Productively using hints, rescue tools, and practice questions to learn independently.';
      suggestedParentAction = 'Praise their independence and effective use of learning tools!';
      break;
    case 'stable':
      if (totalGuidedAiEvents === 0) {
        parentSafeSummary = 'No recent Guided AI usage.';
        suggestedParentAction = 'Encourage them to try Explain or Hint mode if they get stuck.';
      }
      break;
  }

  return {
    studentId,
    periodStart,
    periodEnd,
    totalGuidedAiEvents,
    healthyLearningUseCount: patterns.healthy_learning_use,
    hintSeekingCount: patterns.hint_seeking + patterns.repeated_deeper_help,
    lessonRescueUseCount: patterns.lesson_rescue_use,
    quizPracticeCount: patterns.quiz_practice_use,
    effortRequiredCount,
    refusalCount,
    unsafeRouteCount,
    teachBackRequiredCount: patterns.teachback_followthrough,
    learnYourWayUpdates: patterns.learn_your_way_personalization,
    integrityTrend,
    parentSafeSummary,
    suggestedParentAction
  };
}

// ---------------------------------------------------------------------------
// Database Fetchers
// ---------------------------------------------------------------------------

/**
 * Fetches the integrity trend for a specific student.
 * Bounded by a safe time window (default 14 days).
 */
export async function getStudentIntegrityTrend(
  studentId: string,
  options?: TrendOptions
): Promise<IntegrityTrendSummary> {
  const daysBack = options?.daysBack ?? 14;
  const cutoffDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString();

  const { data: events, error } = await supabaseAdmin
    .from('events_log')
    .select('event_type, metadata, created_at')
    .eq('student_id', studentId)
    .eq('target_type', 'guided_ai')
    .gte('created_at', cutoffDate)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[getStudentIntegrityTrend] DB error:', error.message);
    return summarizeIntegrityTrend(studentId, [], daysBack);
  }

  // Cast safely since we only query target_type = guided_ai
  const validEvents = (events || []).map((e: any) => ({
    event_type: e.event_type as GuidedAiEventType,
    metadata: e.metadata as Record<string, unknown> || {},
    created_at: e.created_at
  }));

  return summarizeIntegrityTrend(studentId, validEvents, daysBack);
}

/**
 * Fetches the integrity trend for a child, enforcing parent_child_links access.
 */
export async function getParentChildIntegrityTrend(
  parentId: string,
  studentId: string,
  options?: TrendOptions
): Promise<IntegrityTrendSummary | null> {
  // Enforce access control via parent_child_links
  const { data: link, error: linkError } = await supabaseAdmin
    .from('parent_child_links')
    .select('id')
    .eq('parent_id', parentId)
    .eq('student_id', studentId)
    .single();

  if (linkError || !link) {
    console.error('[getParentChildIntegrityTrend] Unauthorized or missing link.');
    return null; // Deny access
  }

  return getStudentIntegrityTrend(studentId, options);
}

/**
 * Fetches integrity trends for all linked children of a parent.
 */
export async function getParentChildrenIntegrityTrends(
  parentId: string,
  options?: TrendOptions
): Promise<IntegrityTrendSummary[]> {
  const { data: links, error: linkError } = await supabaseAdmin
    .from('parent_child_links')
    .select('student_id')
    .eq('parent_id', parentId);

  if (linkError || !links || links.length === 0) {
    return [];
  }

  const studentIds = links.map((l: any) => l.student_id);
  const results: IntegrityTrendSummary[] = [];

  for (const studentId of studentIds) {
    const trend = await getStudentIntegrityTrend(studentId, options);
    results.push(trend);
  }

  return results;
}
