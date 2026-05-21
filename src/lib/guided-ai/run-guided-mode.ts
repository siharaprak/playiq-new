/**
 * Sprint 4A+4B+4C+4D — Guided AI Run Engine
 *
 * Server-only orchestrator that ties together:
 * 1. Integrity check (with Sprint 4C depth gating)
 * 2. Sprint 4D safety routing (self-harm, prohibited, academic integrity)
 * 3. Server-side hintLevel clamping and effort enforcement
 * 4. Context build
 * 5. Prompt build
 * 6. Gemini call
 * 7. Response validation (Zod)
 * 8. Sprint 4C post-processing:
 *    - Strip practiceItems[].answer before client response
 *    - Hint level metadata + teach-back enforcement for L3
 *    - Quiz effort gating
 * 9. Learn Your Way signal writes (bounded enums only)
 * 10. Lesson Rescue structured output parsing + bounded signal writes (Sprint 4B)
 * 11. Sprint 4D event logging at 9 safe points (non-blocking, safe metadata only)
 *
 * Does NOT store raw prompts, selected text, student attempts, or raw AI responses.
 * Does NOT use conversation history.
 * Logging failures never break the student experience (correction #5).
 */

import 'server-only';
import { GoogleGenAI } from '@google/genai';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { GuidedAiRequest, GuidedAiResponseData, LearnYourWayPreferences, HintLevel } from './types';
import { GuidedAiResponseDataSchema, LessonRescueDataSchema, ConfusionType } from './types';
import { applyModeIntegrityRules, buildSafeRefusal, enforceQuizAttemptEffort, buildEffortPrompt } from './integrity';
import { buildGuidedAiContext } from './context';
import { buildGuidedAiSystemPrompt, buildGuidedAiUserPrompt } from './prompts';
import { getNextHintLevel } from './hint-ladder';
import {
  classifyUnsafeAssistance,
  getUnsafeAssistanceRoute,
  buildUnsafeAssistanceResponse,
  shouldLogUnsafeAssistance,
} from './safety-routing';
import {
  logGuidedAiSupportEvent,
  logGuidedAiRefusalEvent,
  logGuidedAiEffortRequiredEvent,
  logGuidedAiHintLadderEvent,
  logLessonRescueUsedEvent,
  logLearnYourWayUpdatedEvent,
  logUnsafeAssistanceRoutedEvent,
} from '@/lib/events/learning-events';

// ---------------------------------------------------------------------------
// Gemini client (reuses same pattern as gemini.ts)
// ---------------------------------------------------------------------------

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing from environment variables.');
  }
  return new GoogleGenAI({ apiKey });
};

// ---------------------------------------------------------------------------
// Safe fallback response
// ---------------------------------------------------------------------------

function buildFallbackResponse(mode: string): GuidedAiResponseData {
  if (mode === 'lesson_rescue') {
    return {
      mode: mode as GuidedAiResponseData['mode'],
      response: 'I can help rescue this, but I need one confusing sentence or your best attempt first.',
      integrityAction: 'allowed',
      suggestedNextStep: 'Paste one confusing sentence from the lesson and tell me where you got lost.',
    };
  }
  return {
    mode: mode as GuidedAiResponseData['mode'],
    response: 'I had trouble processing that request. Try rephrasing your question, or try a different mode.',
    integrityAction: 'allowed',
    suggestedNextStep: 'Try asking your question in a different way.',
  };
}

// ---------------------------------------------------------------------------
// Learn Your Way signal writer (bounded enum values only)
// ---------------------------------------------------------------------------

async function writeLearnYourWaySignals(
  studentId: string,
  moduleId: string | undefined,
  preferences: LearnYourWayPreferences
): Promise<void> {
  const signals: { student_id: string; module_id: string | null; signal_type: string; signal_value: string }[] = [];

  if (preferences.explanation_style) {
    signals.push({
      student_id: studentId,
      module_id: moduleId ?? null,
      signal_type: 'explanation_style',
      signal_value: preferences.explanation_style,
    });
  }
  if (preferences.pace_preference) {
    signals.push({
      student_id: studentId,
      module_id: moduleId ?? null,
      signal_type: 'pace_preference',
      signal_value: preferences.pace_preference,
    });
  }
  if (preferences.practice_preference) {
    signals.push({
      student_id: studentId,
      module_id: moduleId ?? null,
      signal_type: 'practice_preference',
      signal_value: preferences.practice_preference,
    });
  }
  if (preferences.support_preference) {
    signals.push({
      student_id: studentId,
      module_id: moduleId ?? null,
      signal_type: 'support_preference',
      signal_value: preferences.support_preference,
    });
  }

  if (signals.length > 0) {
    const { error } = await supabaseAdmin.from('fingerprint_signals').insert(signals);
    if (error) {
      console.error('[runGuidedMode] Failed to write fingerprint signals:', error.message);
    }
  }
}

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

export async function runGuidedMode(
  input: GuidedAiRequest,
  studentId: string,
  moduleDbId?: string
): Promise<GuidedAiResponseData> {
  // 0. Sprint 4C: Server-side clamp of hintLevel and retryCount (do not trust client)
  const clampedHintLevel: HintLevel | undefined = input.hintLevel
    ? (Math.max(1, Math.min(3, input.hintLevel)) as HintLevel)
    : (input.mode === 'hint' ? 1 : undefined);
  const clampedRetryCount = Math.max(0, Math.min(10, input.retryCount ?? 0));

  // Mutate a copy of input with clamped values for prompt building
  const clampedInput: GuidedAiRequest = {
    ...input,
    hintLevel: clampedHintLevel,
    retryCount: clampedRetryCount,
  };

  // 1. Integrity check (pass selectedText, studentAttempt, hintLevel, retryCount)
  const integrityResult = applyModeIntegrityRules(
    input.mode,
    input.message,
    input.selectedText,
    input.studentAttempt,
    clampedHintLevel,
    clampedRetryCount
  );
  if (integrityResult.action !== 'allowed') {
    // Sprint 4C: include effort metadata in refusal response
    const isEffortRefusal = [
      'hint_l2_effort', 'hint_l3_effort', 'quiz_answer_effort', 'quiz_weak_attempt',
    ].includes(integrityResult.reason ?? '');

    // Sprint 4D: fire-and-forget event logging for refusals
    const eventBase = {
      studentId,
      mode: input.mode,
      moduleNumber: input.moduleNumber,
      moduleId: moduleDbId,
      nodeId: input.nodeId,
      pageType: input.pageType,
      integrityAction: integrityResult.action as 'refused' | 'modified' | 'flagged',
      refusalReason: integrityResult.reason,
      hintLevel: clampedHintLevel,
    };

    if (isEffortRefusal) {
      // Log effort-required event
      logGuidedAiEffortRequiredEvent({ ...eventBase, eventType: 'guided_ai_effort_required', effortRequired: true }).catch(() => {});
    } else {
      // Log refusal event
      logGuidedAiRefusalEvent({ ...eventBase, eventType: 'guided_ai_refused' }).catch(() => {});

      // Sprint 4D patch: also log unsafe_assistance_routed when refusal reason
      // maps to an actual unsafe classification (not effort gating).
      const UNSAFE_REFUSAL_REASONS: Record<string, 'hint' | 'explain' | 'coach' | 'lesson_rescue' | 'blocked'> = {
        homework_outsource: 'coach',
        direct_answer: 'hint',
        assessment_answer: 'hint',
        unsafe_personal: 'blocked',
      };
      const routingTarget = UNSAFE_REFUSAL_REASONS[integrityResult.reason ?? ''];
      if (routingTarget) {
        logUnsafeAssistanceRoutedEvent({
          ...eventBase,
          eventType: 'unsafe_assistance_routed',
          routingTarget,
        }).catch(() => {});
      }
    }

    return {
      mode: input.mode,
      response: integrityResult.refusalMessage ?? buildSafeRefusal(integrityResult.reason ?? 'unknown'),
      integrityAction: integrityResult.action,
      suggestedNextStep: 'Try rephrasing your question or using a different mode.',
      // Sprint 4C effort metadata
      effortRequired: isEffortRefusal ? true : undefined,
      effortPrompt: isEffortRefusal ? buildEffortPrompt(input.mode, integrityResult.reason ?? '') : undefined,
      hintLevel: clampedHintLevel,
    };
  }

  // 1b. Sprint 4D: Safety routing pre-check (self-harm, prohibited, academic)
  const safetyClassification = classifyUnsafeAssistance(
    input.message,
    input.studentAttempt,
    input.selectedText,
  );

  if (safetyClassification.classification !== 'allowed') {
    const safetyTarget = getUnsafeAssistanceRoute(safetyClassification.classification, input.mode);
    const safetyResponse = buildUnsafeAssistanceResponse(safetyClassification.classification, safetyTarget);

    // Sprint 4D: Log refusal + routing events (only when routing occurs — correction #8)
    const routeEventBase = {
      studentId,
      mode: input.mode,
      moduleNumber: input.moduleNumber,
      moduleId: moduleDbId,
      nodeId: input.nodeId,
      pageType: input.pageType,
      integrityAction: 'refused' as const,
      refusalReason: safetyClassification.classification,
      routingTarget: safetyTarget,
    };

    logGuidedAiRefusalEvent({ ...routeEventBase, eventType: 'guided_ai_refused' }).catch(() => {});
    if (shouldLogUnsafeAssistance(safetyClassification.classification)) {
      logUnsafeAssistanceRoutedEvent({ ...routeEventBase, eventType: 'unsafe_assistance_routed' }).catch(() => {});
    }

    return {
      mode: input.mode,
      response: safetyResponse.message,
      integrityAction: 'refused',
      suggestedNextStep: safetyResponse.suggestedNextStep,
      safetyRoute: {
        classification: safetyClassification.classification,
        target: safetyTarget,
        message: safetyResponse.friendlyLabel,
      },
    };
  }

  // 2. Build context from static curriculum
  const context = await buildGuidedAiContext({
    moduleNumber: input.moduleNumber,
    nodeId: input.nodeId,
    pageType: input.pageType,
  });

  // 3. Build prompts (uses clampedInput so hint level is injected)
  const systemPrompt = buildGuidedAiSystemPrompt(input.mode);
  const userPrompt = buildGuidedAiUserPrompt(clampedInput, context);

  // 4. Call Gemini (non-streaming, JSON output)
  try {
    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        temperature: 0.4,
      },
    });

    if (!response.text) {
      console.error('[runGuidedMode] Empty response from Gemini');
      return buildFallbackResponse(input.mode);
    }

    // 5. Parse and validate with Zod
    let cleanJson = response.text;
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '').trim();
    }
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/```/g, '').trim();
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(cleanJson);
    } catch {
      console.error('[runGuidedMode] Failed to parse Gemini JSON output');
      return buildFallbackResponse(input.mode);
    }

    // Validate with Zod — add mode and integrityAction
    const toValidate = {
      ...(parsed as Record<string, unknown>),
      mode: input.mode,
      integrityAction: 'allowed',
    };

    const validated = GuidedAiResponseDataSchema.safeParse(toValidate);
    if (!validated.success) {
      console.error('[runGuidedMode] Zod validation failed:', validated.error.flatten());
      // Try to extract at least the response text
      const rawParsed = parsed as Record<string, unknown>;
      if (typeof rawParsed?.response === 'string') {
        return {
          mode: input.mode,
          response: rawParsed.response,
          integrityAction: 'allowed',
          suggestedNextStep: typeof rawParsed?.suggestedNextStep === 'string' ? rawParsed.suggestedNextStep : undefined,
          followUpQuestion: typeof rawParsed?.followUpQuestion === 'string' ? rawParsed.followUpQuestion : undefined,
        };
      }
      return buildFallbackResponse(input.mode);
    }

    const result = validated.data;

    // -----------------------------------------------------------------------
    // Sprint 4C: Post-Gemini enforcement
    // -----------------------------------------------------------------------

    // 6a. Hint mode: attach level metadata + teach-back enforcement
    if (input.mode === 'hint' && clampedHintLevel) {
      result.hintLevel = clampedHintLevel;
      result.nextHintAvailable = getNextHintLevel(clampedHintLevel) !== null;

      // Level 2: suggest retry
      if (clampedHintLevel === 2) {
        result.retryRequired = true;
        result.retryPrompt = result.retryPrompt || 'Now try applying this. What do you think the answer might be?';
      }

      // Level 3: always require teach-back (correction #5)
      if (clampedHintLevel === 3) {
        result.teachBackRequired = true;
        // Use Gemini's teachBackPrompt if present, otherwise safe fallback
        if (!result.teachBackPrompt) {
          const rawParsed = parsed as Record<string, unknown>;
          result.teachBackPrompt = typeof rawParsed?.teachBackPrompt === 'string'
            ? rawParsed.teachBackPrompt
            : 'Can you explain this concept in your own words? Try applying the example to your problem.';
        }
        result.nextHintAvailable = false; // L3 is max
      }
    }

    // 6b. Quiz mode: strip answers + effort gating (correction #1)
    if (input.mode === 'quiz' && result.practiceItems) {
      const quizEffort = enforceQuizAttemptEffort(input.studentAttempt);

      // Always strip answer from client payload (correction #1: server-side strip)
      result.practiceItems = result.practiceItems.map(item => ({
        ...item,
        answer: undefined,
      }));

      if (quizEffort.status === 'no_attempt') {
        result.effortRequired = true;
        result.effortPrompt = buildEffortPrompt(input.mode, 'quiz_answer_effort');
        result.retryPrompt = 'Try answering the questions first, then I\'ll check your work.';
      } else if (quizEffort.status === 'weak_attempt') {
        result.retryRequired = true;
        result.retryPrompt = buildEffortPrompt(input.mode, 'quiz_weak_attempt');
      }
    }

    // 6c. Lesson Rescue: parse structured rescue data from Gemini output (Sprint 4B)
    if (input.mode === 'lesson_rescue') {
      const rawParsed = parsed as Record<string, unknown>;
      const rescueValidation = LessonRescueDataSchema.safeParse(rawParsed);
      if (rescueValidation.success) {
        result.lessonRescue = rescueValidation.data;
        // Populate followUpQuestion from checkQuestion if not set
        if (!result.followUpQuestion && rescueValidation.data.checkQuestion) {
          result.followUpQuestion = rescueValidation.data.checkQuestion;
        }
        if (!result.suggestedNextStep && rescueValidation.data.nextStep) {
          result.suggestedNextStep = rescueValidation.data.nextStep;
        }
      }

      // Lesson Rescue always has teach-back
      result.teachBackRequired = true;
      if (!result.teachBackPrompt) {
        result.teachBackPrompt = result.lessonRescue?.teachBackPrompt
          || 'Can you explain this concept back to me in your own words?';
      }

      // Write bounded rescue signals to fingerprint_signals
      await writeLessonRescueSignals(
        studentId,
        moduleDbId,
        result.lessonRescue?.confusionType,
        input.moduleNumber
      );
    }

    // 7. Write Learn Your Way signals if preferences provided
    if (input.mode === 'learn_your_way' && input.preferences) {
      await writeLearnYourWaySignals(studentId, moduleDbId, input.preferences);
      result.preferenceSummary = input.preferences;

      // Sprint 4D: Log learn_your_way_updated event
      logLearnYourWayUpdatedEvent({
        studentId,
        eventType: 'learn_your_way_updated',
        mode: input.mode,
        moduleNumber: input.moduleNumber,
        moduleId: moduleDbId,
        nodeId: input.nodeId,
        pageType: input.pageType,
        integrityAction: 'allowed',
      }).catch(() => {});
    }

    // -----------------------------------------------------------------------
    // Sprint 4D: Event logging at safe points (fire-and-forget)
    // -----------------------------------------------------------------------

    const eventBase = {
      studentId,
      mode: input.mode,
      moduleNumber: input.moduleNumber,
      moduleId: moduleDbId,
      nodeId: input.nodeId,
      pageType: input.pageType,
      integrityAction: 'allowed' as const,
    };

    // E1. Any successful Guided AI use
    logGuidedAiSupportEvent({
      ...eventBase,
      eventType: 'guided_ai_used',
    }).catch(() => {});

    // E4. Hint ladder step
    if (input.mode === 'hint' && clampedHintLevel) {
      logGuidedAiHintLadderEvent({
        ...eventBase,
        eventType: 'guided_ai_hint_ladder_step',
        hintLevel: clampedHintLevel,
      }).catch(() => {});
    }

    // E5. Quiz practice generated
    if (input.mode === 'quiz' && result.practiceItems && result.practiceItems.length > 0) {
      logGuidedAiSupportEvent({
        ...eventBase,
        eventType: 'guided_ai_quiz_practice_generated',
      }).catch(() => {});
    }

    // E6. Teach-back required
    if (result.teachBackRequired) {
      logGuidedAiSupportEvent({
        ...eventBase,
        eventType: 'guided_ai_teachback_required',
        teachBackRequired: true,
        hintLevel: clampedHintLevel,
      }).catch(() => {});
    }

    // E7. Lesson Rescue used
    if (input.mode === 'lesson_rescue') {
      logLessonRescueUsedEvent({
        ...eventBase,
        eventType: 'lesson_rescue_used',
        confusionType: result.lessonRescue?.confusionType,
      }).catch(() => {});
    }

    return result;
  } catch (err) {
    console.error('[runGuidedMode] Gemini call failed:', err instanceof Error ? err.message : err);
    return buildFallbackResponse(input.mode);
  }
}

// ---------------------------------------------------------------------------
// Lesson Rescue signal writer (bounded enum values only — Sprint 4B)
// ---------------------------------------------------------------------------

async function writeLessonRescueSignals(
  studentId: string,
  moduleId: string | undefined,
  confusionType: string | undefined,
  moduleNumber: number | undefined
): Promise<void> {
  const signals: { student_id: string; module_id: string | null; signal_type: string; signal_value: string }[] = [];

  // Write rescue_used signal (bounded: "true")
  signals.push({
    student_id: studentId,
    module_id: moduleId ?? null,
    signal_type: 'rescue_used',
    signal_value: moduleNumber ? `module_${moduleNumber}` : 'true',
  });

  // Write confusion type signal if valid bounded enum
  if (confusionType) {
    const isValidConfusion = ConfusionType.safeParse(confusionType);
    if (isValidConfusion.success) {
      signals.push({
        student_id: studentId,
        module_id: moduleId ?? null,
        signal_type: 'rescue_confusion_type',
        signal_value: isValidConfusion.data,
      });
    }
  }

  if (signals.length > 0) {
    const { error } = await supabaseAdmin.from('fingerprint_signals').insert(signals);
    if (error) {
      console.error('[runGuidedMode] Failed to write rescue fingerprint signals:', error.message);
    }
  }
}
