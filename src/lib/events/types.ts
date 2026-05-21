/**
 * Sprint 3 Continued + Sprint 4D — Event Capture Framework
 *
 * Zod schemas and TypeScript types for learning event payloads.
 * Used by the event capture helpers in learning-events.ts.
 *
 * Sprint 4D adds: Guided AI support event types and schemas.
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// All event types supported by events_log.event_type enum
// ---------------------------------------------------------------------------

export const LearningEventType = z.enum([
  // Existing enum values
  'lesson_started',
  'activity_completed',
  'assessment_submitted',
  'node_mastered',
  'tier_unlocked',
  'module_completed',
  // New enum values (Sprint 3 continued)
  'attempt_started',
  'revision_submitted',
  'unlock_granted',
  'proof_submitted',
  'proof_reviewed',
  'tutor_profile_created',
  'tutor_profile_updated',
  'tutor_version_created',
  'assistant_profile_created',
  'assistant_profile_updated',
  'assistant_version_created',
  // Sprint 4D — Guided AI support events
  'guided_ai_used',
  'guided_ai_refused',
  'guided_ai_effort_required',
  'guided_ai_hint_ladder_step',
  'guided_ai_quiz_practice_generated',
  'guided_ai_teachback_required',
  'lesson_rescue_used',
  'learn_your_way_updated',
  'unsafe_assistance_routed',
]);

export type LearningEventType = z.infer<typeof LearningEventType>;

// ---------------------------------------------------------------------------
// Target types for events_log.target_type
// ---------------------------------------------------------------------------

export const EventTargetType = z.enum([
  'assessment_submission',
  'student_node_progress',
  'module',
  'proof_artifact_submission',
  'tutor_profile',
  'tutor_version',
  'assistant_profile',
  'assistant_version',
  'lesson',
  'activity',
  'mini_check',
  'teach_back',
  'quiz',
  'boss_battle',
  // Sprint 4D
  'guided_ai',
]);

export type EventTargetType = z.infer<typeof EventTargetType>;

// ---------------------------------------------------------------------------
// Base event input schema
// ---------------------------------------------------------------------------

export const LearningEventInputSchema = z.object({
  studentId: z.string().uuid(),
  eventType: LearningEventType,
  targetType: z.string().min(1),
  targetId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type LearningEventInput = z.infer<typeof LearningEventInputSchema>;

// ---------------------------------------------------------------------------
// Specialized input schemas
// ---------------------------------------------------------------------------

export const AttemptEventInputSchema = z.object({
  studentId: z.string().uuid(),
  moduleId: z.string().optional(),
  nodeId: z.string().optional(),
  assessmentType: z.string().min(1),
  eventType: z.enum(['attempt_started', 'assessment_submitted']),
  submissionId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AttemptEventInput = z.infer<typeof AttemptEventInputSchema>;

export const UnlockEventInputSchema = z.object({
  studentId: z.string().uuid(),
  targetType: z.enum(['student_node_progress', 'module']),
  targetId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type UnlockEventInput = z.infer<typeof UnlockEventInputSchema>;

export const RevisionEventInputSchema = z.object({
  studentId: z.string().uuid(),
  nodeId: z.string(),
  assessmentType: z.string().min(1),
  submissionId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type RevisionEventInput = z.infer<typeof RevisionEventInputSchema>;

export const CompletionEventInputSchema = z.object({
  studentId: z.string().uuid(),
  eventType: z.enum(['node_mastered', 'module_completed']),
  targetType: z.enum(['student_node_progress', 'module']),
  targetId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CompletionEventInput = z.infer<typeof CompletionEventInputSchema>;

export const ProofEventInputSchema = z.object({
  studentId: z.string().uuid(),
  eventType: z.enum(['proof_submitted', 'proof_reviewed']),
  submissionId: z.string().optional(),
  artifactType: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type ProofEventInput = z.infer<typeof ProofEventInputSchema>;

export const TutorUpdateEventInputSchema = z.object({
  studentId: z.string().uuid(),
  eventType: z.enum(['tutor_profile_created', 'tutor_profile_updated', 'tutor_version_created']),
  targetId: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type TutorUpdateEventInput = z.infer<typeof TutorUpdateEventInputSchema>;

export const AssistantUpdateEventInputSchema = z.object({
  studentId: z.string().uuid(),
  eventType: z.enum(['assistant_profile_created', 'assistant_profile_updated', 'assistant_version_created']),
  targetId: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type AssistantUpdateEventInput = z.infer<typeof AssistantUpdateEventInputSchema>;

// ---------------------------------------------------------------------------
// Sprint 4D — Guided AI Support Event schema
// ---------------------------------------------------------------------------

export const GuidedAiEventType = z.enum([
  'guided_ai_used',
  'guided_ai_refused',
  'guided_ai_effort_required',
  'guided_ai_hint_ladder_step',
  'guided_ai_quiz_practice_generated',
  'guided_ai_teachback_required',
  'lesson_rescue_used',
  'learn_your_way_updated',
  'unsafe_assistance_routed',
]);

export type GuidedAiEventType = z.infer<typeof GuidedAiEventType>;

/**
 * Input schema for Guided AI support events.
 * Safe metadata only — no raw prompts, responses, selectedText, or studentAttempt.
 */
export const GuidedAiSupportEventInputSchema = z.object({
  studentId: z.string().uuid(),
  eventType: GuidedAiEventType,
  moduleNumber: z.number().int().min(1).max(11).optional(),
  moduleId: z.string().optional(),
  nodeId: z.string().max(20).optional(),
  pageType: z.string().max(30).optional(),
  mode: z.string().max(30),
  integrityAction: z.enum(['allowed', 'refused', 'modified', 'flagged']).optional(),
  refusalReason: z.string().max(100).optional(),
  routingTarget: z.enum(['hint', 'explain', 'coach', 'lesson_rescue', 'blocked']).optional(),
  hintLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  retryCount: z.number().int().min(0).max(10).optional(),
  effortRequired: z.boolean().optional(),
  teachBackRequired: z.boolean().optional(),
  confusionType: z.string().max(50).optional(),
});

export type GuidedAiSupportEventInput = z.infer<typeof GuidedAiSupportEventInputSchema>;

// ---------------------------------------------------------------------------
// Safe result type
// ---------------------------------------------------------------------------

export interface EventResult {
  ok: boolean;
  eventId?: string;
  error?: string;
}
