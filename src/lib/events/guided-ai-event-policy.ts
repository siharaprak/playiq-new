/**
 * Sprint 4E — AI Usage Pattern Taxonomy & Event Policy
 *
 * Defines the classification of raw Guided AI events into behavioral usage patterns.
 * Provides safe metadata filtering to ensure no raw PII or inputs/outputs are logged.
 * Pure read-only policy. No database writes.
 */

import type { GuidedAiEventType, GuidedAiSupportEventInput } from './types';

// ---------------------------------------------------------------------------
// Usage Pattern Taxonomy
// ---------------------------------------------------------------------------

export type GuidedAiUsagePattern =
  | 'healthy_learning_use'
  | 'hint_seeking'
  | 'repeated_deeper_help'
  | 'direct_answer_seeking'
  | 'homework_outsourcing'
  | 'assessment_answer_seeking'
  | 'lesson_rescue_use'
  | 'quiz_practice_use'
  | 'learn_your_way_personalization'
  | 'low_effort_loop'
  | 'teachback_followthrough'
  | 'unsafe_request';

export const GUIDED_AI_EVENT_POLICY: Record<GuidedAiEventType, GuidedAiUsagePattern | ((metadata: Record<string, unknown>) => GuidedAiUsagePattern)> = {
  guided_ai_used: 'healthy_learning_use',
  guided_ai_refused: (metadata) => {
    switch (metadata['refusalReason']) {
      case 'direct_answer': return 'direct_answer_seeking';
      case 'homework_outsource': return 'homework_outsourcing';
      case 'assessment_answer': return 'assessment_answer_seeking';
      case 'unsafe_personal': return 'unsafe_request';
      default: return 'direct_answer_seeking';
    }
  },
  guided_ai_effort_required: 'low_effort_loop',
  guided_ai_hint_ladder_step: (metadata) => {
    const level = metadata['hintLevel'] as number;
    return (level && level > 1) ? 'repeated_deeper_help' : 'hint_seeking';
  },
  guided_ai_quiz_practice_generated: 'quiz_practice_use',
  guided_ai_teachback_required: 'teachback_followthrough',
  lesson_rescue_used: 'lesson_rescue_use',
  learn_your_way_updated: 'learn_your_way_personalization',
  unsafe_assistance_routed: 'unsafe_request'
};

// ---------------------------------------------------------------------------
// Core Helpers
// ---------------------------------------------------------------------------

/**
 * Classifies a single Guided AI event into a broader usage pattern.
 */
export function classifyGuidedAiUsagePattern(
  eventType: GuidedAiEventType,
  metadata?: Record<string, unknown>
): GuidedAiUsagePattern {
  const policy = GUIDED_AI_EVENT_POLICY[eventType];
  if (typeof policy === 'function') {
    return policy(metadata || {});
  }
  return policy;
}

/**
 * Aggregates an array of events into a summary of behavioral patterns.
 */
export function summarizeGuidedAiUsagePatterns(
  events: { eventType: GuidedAiEventType; metadata?: Record<string, unknown> }[]
): Record<GuidedAiUsagePattern, number> {
  const summary: Record<GuidedAiUsagePattern, number> = {
    healthy_learning_use: 0,
    hint_seeking: 0,
    repeated_deeper_help: 0,
    direct_answer_seeking: 0,
    homework_outsourcing: 0,
    assessment_answer_seeking: 0,
    lesson_rescue_use: 0,
    quiz_practice_use: 0,
    learn_your_way_personalization: 0,
    low_effort_loop: 0,
    teachback_followthrough: 0,
    unsafe_request: 0
  };

  for (const event of events) {
    const pattern = classifyGuidedAiUsagePattern(event.eventType, event.metadata);
    summary[pattern]++;
  }

  return summary;
}

/**
 * Maps a conceptual outcome back to the core event type (for logging).
 */
export function getEventForGuidedAiOutcome(
  outcome: 'refused' | 'effort_required' | 'hint' | 'quiz' | 'rescue' | 'teachback' | 'learn_your_way' | 'unsafe' | 'used'
): GuidedAiEventType {
  switch (outcome) {
    case 'refused': return 'guided_ai_refused';
    case 'effort_required': return 'guided_ai_effort_required';
    case 'hint': return 'guided_ai_hint_ladder_step';
    case 'quiz': return 'guided_ai_quiz_practice_generated';
    case 'rescue': return 'lesson_rescue_used';
    case 'teachback': return 'guided_ai_teachback_required';
    case 'learn_your_way': return 'learn_your_way_updated';
    case 'unsafe': return 'unsafe_assistance_routed';
    case 'used': return 'guided_ai_used';
    default: return 'guided_ai_used';
  }
}

// ---------------------------------------------------------------------------
// Metadata Safety Whitelist
// ---------------------------------------------------------------------------

const ALLOWED_METADATA_KEYS = new Set([
  'mode',
  'moduleNumber',
  'nodeId',
  'pageType',
  'hintLevel',
  'retryCount',
  'refusalReason',
  'routingTarget',
  'effortRequired',
  'teachBackRequired',
  'confusionType',
  'noPromptStored',
  'noResponseStored',
  'integrityAction'
]);

/**
 * Enforces a strict whitelist on event metadata to prevent PII or raw inputs/outputs
 * from ever being logged to the database.
 */
export function getSafeGuidedAiEventMetadata(
  input: GuidedAiSupportEventInput
): Record<string, unknown> {
  const rawMetadata: Record<string, unknown> = {
    mode: input.mode,
    moduleNumber: input.moduleNumber,
    nodeId: input.nodeId,
    pageType: input.pageType,
    hintLevel: input.hintLevel,
    retryCount: input.retryCount,
    refusalReason: input.refusalReason,
    routingTarget: input.routingTarget,
    effortRequired: input.effortRequired,
    teachBackRequired: input.teachBackRequired,
    confusionType: input.confusionType,
    integrityAction: input.integrityAction,
    noPromptStored: true,
    noResponseStored: true,
  };

  const safeMetadata: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(rawMetadata)) {
    if (value !== undefined && ALLOWED_METADATA_KEYS.has(key)) {
      safeMetadata[key] = value;
    }
  }

  return safeMetadata;
}
