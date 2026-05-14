/**
 * Sprint 3 Continued — Learning Event Capture Helpers
 *
 * Server-only event logging layer around the existing events_log table.
 * Uses supabaseAdmin (service role) for privileged inserts.
 *
 * All helpers:
 *   - Validate input with Zod
 *   - Catch errors silently (non-blocking) unless security-critical
 *   - Return { ok, eventId?, error? }
 *   - Never expose service role to client
 *
 * Integration status:
 *   - Tutor/assistant event helpers: CREATED but no CRUD flows exist yet.
 *     Pending Module 9/10 UI integration in a future sprint.
 *   - attempt_started: enum value added but NOT integrated yet.
 *     Pending explicit start-tracking flow in a future sprint.
 */

import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { EventResult } from './types';
import {
  LearningEventInputSchema,
  AttemptEventInputSchema,
  UnlockEventInputSchema,
  RevisionEventInputSchema,
  CompletionEventInputSchema,
  ProofEventInputSchema,
  TutorUpdateEventInputSchema,
  AssistantUpdateEventInputSchema,
} from './types';
import type {
  LearningEventInput,
  AttemptEventInput,
  UnlockEventInput,
  RevisionEventInput,
  CompletionEventInput,
  ProofEventInput,
  TutorUpdateEventInput,
  AssistantUpdateEventInput,
} from './types';

// ---------------------------------------------------------------------------
// Base event logger
// ---------------------------------------------------------------------------

/**
 * Logs a learning event to events_log.
 * Non-blocking: catches errors and returns safe result.
 */
export async function logLearningEvent(input: LearningEventInput): Promise<EventResult> {
  try {
    const parsed = LearningEventInputSchema.parse(input);

    const { data, error } = await supabaseAdmin
      .from('events_log')
      .insert({
        student_id: parsed.studentId,
        event_type: parsed.eventType,
        target_type: parsed.targetType,
        target_id: parsed.targetId ?? null,
        metadata: parsed.metadata ?? null,
      })
      .select('id')
      .single();

    if (error) {
      console.error('[logLearningEvent] DB error:', error.message);
      return { ok: false, error: error.message };
    }

    return { ok: true, eventId: data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logLearningEvent] Validation/runtime error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Attempt events
// ---------------------------------------------------------------------------

/**
 * Logs an attempt event (assessment_submitted or attempt_started).
 * Uses assessment_submission as canonical target_type.
 *
 * NOTE: attempt_started is an enum placeholder — not integrated yet.
 * The existing flow does not have an explicit "start" phase before submission.
 */
export async function logAttemptEvent(input: AttemptEventInput): Promise<EventResult> {
  try {
    const parsed = AttemptEventInputSchema.parse(input);

    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: parsed.eventType,
      targetType: 'assessment_submission',
      targetId: parsed.submissionId,
      metadata: {
        assessment_type: parsed.assessmentType,
        module_id: parsed.moduleId,
        node_id: parsed.nodeId,
        ...parsed.metadata,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logAttemptEvent] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Unlock events
// ---------------------------------------------------------------------------

/**
 * Logs an unlock/tier event.
 * Maps to existing tier_unlocked or new unlock_granted enum value.
 */
export async function logUnlockEvent(input: UnlockEventInput): Promise<EventResult> {
  try {
    const parsed = UnlockEventInputSchema.parse(input);

    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: 'unlock_granted',
      targetType: parsed.targetType,
      targetId: parsed.targetId,
      metadata: parsed.metadata,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logUnlockEvent] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Revision events
// ---------------------------------------------------------------------------

/**
 * Logs a revision submission event.
 * Captures when a student re-submits after a failed attempt.
 */
export async function logRevisionEvent(input: RevisionEventInput): Promise<EventResult> {
  try {
    const parsed = RevisionEventInputSchema.parse(input);

    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: 'revision_submitted',
      targetType: 'assessment_submission',
      targetId: parsed.submissionId,
      metadata: {
        assessment_type: parsed.assessmentType,
        node_id: parsed.nodeId,
        ...parsed.metadata,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logRevisionEvent] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Completion events
// ---------------------------------------------------------------------------

/**
 * Logs a node_mastered or module_completed event.
 */
export async function logCompletionEvent(input: CompletionEventInput): Promise<EventResult> {
  try {
    const parsed = CompletionEventInputSchema.parse(input);

    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: parsed.eventType,
      targetType: parsed.targetType,
      targetId: parsed.targetId,
      metadata: parsed.metadata,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logCompletionEvent] error:', message);
    return { ok: false, error: message };
  }
}

/**
 * Logs a module_completed event idempotently.
 * Checks if one already exists for this module before inserting.
 */
export async function logModuleCompletedIdempotent(studentId: string, moduleId: string): Promise<EventResult> {
  try {
    const { data: existing } = await supabaseAdmin
      .from('events_log')
      .select('id')
      .eq('student_id', studentId)
      .eq('event_type', 'module_completed')
      .eq('target_type', 'module')
      .eq('target_id', moduleId)
      .limit(1)
      .single();

    if (existing) {
      return { ok: true, eventId: existing.id }; // Already logged
    }

    return logLearningEvent({
      studentId,
      eventType: 'module_completed',
      targetType: 'module',
      targetId: moduleId,
      metadata: { source: 'logModuleCompletedIdempotent' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logModuleCompletedIdempotent] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Proof events
// ---------------------------------------------------------------------------

/**
 * Logs a proof_submitted or proof_reviewed event.
 */
export async function logProofEvent(input: ProofEventInput): Promise<EventResult> {
  try {
    const parsed = ProofEventInputSchema.parse(input);

    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: parsed.eventType,
      targetType: 'proof_artifact_submission',
      targetId: parsed.submissionId,
      metadata: {
        artifact_type: parsed.artifactType,
        ...parsed.metadata,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logProofEvent] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Tutor update events
// ---------------------------------------------------------------------------

/**
 * Logs a tutor profile/version event.
 *
 * INTEGRATION STATUS: PENDING
 * No tutor CRUD flow exists yet. This helper is ready for future Module 9 integration.
 * Call from tutor create/update handlers once they are built.
 */
export async function logTutorUpdateEvent(input: TutorUpdateEventInput): Promise<EventResult> {
  try {
    const parsed = TutorUpdateEventInputSchema.parse(input);

    const targetType = parsed.eventType.includes('version')
      ? 'tutor_version'
      : 'tutor_profile';

    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: parsed.eventType,
      targetType,
      targetId: parsed.targetId,
      metadata: parsed.metadata,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logTutorUpdateEvent] error:', message);
    return { ok: false, error: message };
  }
}

// ---------------------------------------------------------------------------
// Assistant update events
// ---------------------------------------------------------------------------

/**
 * Logs an assistant profile/version event.
 *
 * INTEGRATION STATUS: PENDING
 * No assistant CRUD flow exists yet. This helper is ready for future Module 10 integration.
 * Call from assistant create/update handlers once they are built.
 */
export async function logAssistantUpdateEvent(input: AssistantUpdateEventInput): Promise<EventResult> {
  try {
    const parsed = AssistantUpdateEventInputSchema.parse(input);

    const targetType = parsed.eventType.includes('version')
      ? 'assistant_version'
      : 'assistant_profile';

    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: parsed.eventType,
      targetType,
      targetId: parsed.targetId,
      metadata: parsed.metadata,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logAssistantUpdateEvent] error:', message);
    return { ok: false, error: message };
  }
}
