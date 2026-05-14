/**
 * Sprint 3 Continued — Event Capture Framework
 *
 * Zod schemas and TypeScript types for learning event payloads.
 * Used by the event capture helpers in learning-events.ts.
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
// Safe result type
// ---------------------------------------------------------------------------

export interface EventResult {
  ok: boolean;
  eventId?: string;
  error?: string;
}
