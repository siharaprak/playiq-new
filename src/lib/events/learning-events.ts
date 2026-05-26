/**
 * Sprint 3 Continued + Sprint 4D — Learning Event Capture Helpers
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
 * Sprint 4D adds: Guided AI support event helpers.
 *   - Safe metadata only — no raw prompts, responses, selectedText, or studentAttempt.
 *   - Logging failures must never break the student experience.
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
  GuidedAiSupportEventInputSchema,
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
  GuidedAiSupportEventInput,
} from './types';
import { sanitizeAiEventMetadata } from './metadata-safety';

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
        target_id: parsed.targetId || undefined,
        metadata: parsed.targetType === 'guided_ai' ? sanitizeAiEventMetadata(parsed.metadata) : (parsed.metadata || {}),
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

    // Strip forbidden keys explicitly
    const rawMetadata = parsed.metadata || {};
    const safeMetadata: Record<string, any> = {
      artifact_type: parsed.artifactType,
    };
    
    const forbiddenKeys = ['signedUrl', 'publicUrl', 'storagePath', 'fileUrl', 'fileContent', 'email', 'fullName', 'reviewNotes'];
    
    for (const key of Object.keys(rawMetadata)) {
      if (!forbiddenKeys.includes(key)) {
        safeMetadata[key] = rawMetadata[key];
      }
    }

    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: parsed.eventType,
      targetType: 'proof_artifact_submission',
      targetId: parsed.submissionId,
      metadata: safeMetadata,
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

// ---------------------------------------------------------------------------
// Sprint 4D — Guided AI Support Event Helpers
// ---------------------------------------------------------------------------

/**
 * Builds safe-only metadata for Guided AI events.
 * NEVER includes raw message, selectedText, studentAttempt, AI response, or personal info.
 */
function buildGuidedAiSafeMetadata(input: GuidedAiSupportEventInput): Record<string, unknown> {
  const meta: Record<string, unknown> = {
    mode: input.mode,
    noPromptStored: true,
    noResponseStored: true,
    source: 'guided_ai',
  };

  if (input.moduleNumber !== undefined) meta.moduleNumber = input.moduleNumber;
  if (input.nodeId) meta.nodeId = input.nodeId;
  if (input.pageType) meta.pageType = input.pageType;
  if (input.integrityAction) meta.integrityAction = input.integrityAction;
  if (input.refusalReason) meta.refusalReason = input.refusalReason;
  if (input.routingTarget) meta.routingTarget = input.routingTarget;
  if (input.hintLevel !== undefined) meta.hintLevel = input.hintLevel;
  if (input.retryCount !== undefined) meta.retryCount = input.retryCount;
  if (input.effortRequired !== undefined) meta.effortRequired = input.effortRequired;
  if (input.teachBackRequired !== undefined) meta.teachBackRequired = input.teachBackRequired;
  if (input.confusionType) meta.confusionType = input.confusionType;

  return meta;
}

/**
 * Logs a successful Guided AI usage event.
 * Non-blocking: catches errors and returns safe result.
 */
export async function logGuidedAiSupportEvent(input: GuidedAiSupportEventInput): Promise<EventResult> {
  try {
    const parsed = GuidedAiSupportEventInputSchema.parse(input);
    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: parsed.eventType,
      targetType: 'guided_ai',
      targetId: parsed.moduleId ?? undefined,
      metadata: buildGuidedAiSafeMetadata(parsed),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logGuidedAiSupportEvent] error:', message);
    return { ok: false, error: message };
  }
}

/**
 * Logs a Guided AI refusal event.
 * Used when integrity rules refuse a request.
 */
export async function logGuidedAiRefusalEvent(input: GuidedAiSupportEventInput): Promise<EventResult> {
  try {
    const parsed = GuidedAiSupportEventInputSchema.parse({
      ...input,
      eventType: 'guided_ai_refused',
    });
    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: 'guided_ai_refused',
      targetType: 'guided_ai',
      targetId: parsed.moduleId ?? undefined,
      metadata: buildGuidedAiSafeMetadata(parsed),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logGuidedAiRefusalEvent] error:', message);
    return { ok: false, error: message };
  }
}

/**
 * Logs a Guided AI effort-required event.
 * Used when deeper help is blocked due to insufficient student effort.
 */
export async function logGuidedAiEffortRequiredEvent(input: GuidedAiSupportEventInput): Promise<EventResult> {
  try {
    const parsed = GuidedAiSupportEventInputSchema.parse({
      ...input,
      eventType: 'guided_ai_effort_required',
    });
    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: 'guided_ai_effort_required',
      targetType: 'guided_ai',
      targetId: parsed.moduleId ?? undefined,
      metadata: buildGuidedAiSafeMetadata(parsed),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logGuidedAiEffortRequiredEvent] error:', message);
    return { ok: false, error: message };
  }
}

/**
 * Logs a hint ladder step event.
 * Captures hintLevel only — no raw content.
 */
export async function logGuidedAiHintLadderEvent(input: GuidedAiSupportEventInput): Promise<EventResult> {
  try {
    const parsed = GuidedAiSupportEventInputSchema.parse({
      ...input,
      eventType: 'guided_ai_hint_ladder_step',
    });
    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: 'guided_ai_hint_ladder_step',
      targetType: 'guided_ai',
      targetId: parsed.moduleId ?? undefined,
      metadata: buildGuidedAiSafeMetadata(parsed),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logGuidedAiHintLadderEvent] error:', message);
    return { ok: false, error: message };
  }
}

/**
 * Logs a Lesson Rescue usage event.
 * Captures bounded confusionType only.
 */
export async function logLessonRescueUsedEvent(input: GuidedAiSupportEventInput): Promise<EventResult> {
  try {
    const parsed = GuidedAiSupportEventInputSchema.parse({
      ...input,
      eventType: 'lesson_rescue_used',
    });
    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: 'lesson_rescue_used',
      targetType: 'guided_ai',
      targetId: parsed.moduleId ?? undefined,
      metadata: buildGuidedAiSafeMetadata(parsed),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logLessonRescueUsedEvent] error:', message);
    return { ok: false, error: message };
  }
}

/**
 * Logs a Learn Your Way preference update event.
 * Captures bounded preference signals only.
 */
export async function logLearnYourWayUpdatedEvent(input: GuidedAiSupportEventInput): Promise<EventResult> {
  try {
    const parsed = GuidedAiSupportEventInputSchema.parse({
      ...input,
      eventType: 'learn_your_way_updated',
    });
    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: 'learn_your_way_updated',
      targetType: 'guided_ai',
      targetId: parsed.moduleId ?? undefined,
      metadata: buildGuidedAiSafeMetadata(parsed),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logLearnYourWayUpdatedEvent] error:', message);
    return { ok: false, error: message };
  }
}

/**
 * Logs an unsafe assistance routing event.
 * Used only when routing actually occurs (not for normal safe requests).
 * Captures classification category and routing target only — never raw content.
 */
export async function logUnsafeAssistanceRoutedEvent(input: GuidedAiSupportEventInput): Promise<EventResult> {
  try {
    const parsed = GuidedAiSupportEventInputSchema.parse({
      ...input,
      eventType: 'unsafe_assistance_routed',
    });
    return logLearningEvent({
      studentId: parsed.studentId,
      eventType: 'unsafe_assistance_routed',
      targetType: 'guided_ai',
      targetId: parsed.moduleId ?? undefined,
      metadata: buildGuidedAiSafeMetadata(parsed),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[logUnsafeAssistanceRoutedEvent] error:', message);
    return { ok: false, error: message };
  }
}
