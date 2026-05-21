/**
 * Sprint 4D — Guided AI Safety Routing
 *
 * Formal unsafe assistance classification and routing layer.
 * Wraps existing integrity detection (classifyGuidedAiRequest) and
 * extends it with self-harm/crisis detection by reusing patterns from
 * src/lib/server/blocked-terms.ts (correction #1: no duplication).
 *
 * Rules:
 * - Never expose classification codes to students (correction #6).
 * - Self-harm routing must sound supportive, not disciplinary (correction #7).
 * - Log only classification category + routing target — never raw content (correction #4).
 * - Do not create new safety tables (hard rule).
 */

import 'server-only';
import { classifyGuidedAiRequest } from './integrity';
import { BLOCKED_TERMS, SELF_HARM_SAFE_MESSAGE, SENSITIVE_CATEGORIES } from '@/lib/server/blocked-terms';
import type { GuidedAiModeId } from './types';

// ---------------------------------------------------------------------------
// Classification enum
// ---------------------------------------------------------------------------

export type UnsafeClassification =
  | 'direct_answer_request'
  | 'homework_outsourcing'
  | 'assessment_answer_request'
  | 'unsafe_personal_info'
  | 'self_harm_or_crisis'
  | 'prohibited_content'
  | 'low_effort_deeper_help'
  | 'allowed';

// ---------------------------------------------------------------------------
// Routing targets
// ---------------------------------------------------------------------------

export type SafeRoutingTarget = 'hint' | 'explain' | 'coach' | 'lesson_rescue' | 'blocked';

// ---------------------------------------------------------------------------
// Classification result
// ---------------------------------------------------------------------------

export interface ClassificationResult {
  classification: UnsafeClassification;
  isSensitive: boolean;
}

// ---------------------------------------------------------------------------
// Self-harm and prohibited content detection
// Uses patterns from blocked-terms.ts (reuse, not duplication — correction #1)
// ---------------------------------------------------------------------------

function detectSelfHarmOrCrisis(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  return BLOCKED_TERMS
    .filter(entry => SENSITIVE_CATEGORIES.includes(entry.category))
    .some(entry => normalized.includes(entry.term));
}

function detectProhibitedContent(input: string): boolean {
  const normalized = input.toLowerCase().trim();
  return BLOCKED_TERMS
    .filter(entry =>
      entry.category === 'profanity' ||
      entry.category === 'slurs' ||
      entry.category === 'sexual_content' ||
      entry.category === 'bullying'
    )
    .some(entry => normalized.includes(entry.term));
}

// ---------------------------------------------------------------------------
// Main classification function
// ---------------------------------------------------------------------------

/**
 * Classifies the safety risk of a Guided AI request.
 * Priority order: self-harm > prohibited > personal info > assessment > homework > direct answer > allowed.
 */
export function classifyUnsafeAssistance(
  message: string,
  studentAttempt?: string,
  selectedText?: string,
): ClassificationResult {
  const combinedText = [message, studentAttempt, selectedText].filter(Boolean).join(' ');

  // 1. Self-harm/crisis — highest priority, must be handled supportively
  if (detectSelfHarmOrCrisis(combinedText)) {
    return { classification: 'self_harm_or_crisis', isSensitive: true };
  }

  // 2. Prohibited content (profanity, slurs, sexual, bullying)
  if (detectProhibitedContent(combinedText)) {
    return { classification: 'prohibited_content', isSensitive: false };
  }

  // 3. Delegate to existing integrity classifier for academic safety
  const integrityClass = classifyGuidedAiRequest(message);
  switch (integrityClass) {
    case 'unsafe_personal':
      return { classification: 'unsafe_personal_info', isSensitive: false };
    case 'assessment_answer':
      return { classification: 'assessment_answer_request', isSensitive: false };
    case 'homework_outsource':
      return { classification: 'homework_outsourcing', isSensitive: false };
    case 'direct_answer':
      return { classification: 'direct_answer_request', isSensitive: false };
    default:
      return { classification: 'allowed', isSensitive: false };
  }
}

// ---------------------------------------------------------------------------
// Routing rules
// ---------------------------------------------------------------------------

/**
 * Maps a classification to a routing target based on the current mode.
 */
export function getUnsafeAssistanceRoute(
  classification: UnsafeClassification,
  _currentMode: GuidedAiModeId,
): SafeRoutingTarget {
  switch (classification) {
    case 'self_harm_or_crisis':
      return 'blocked'; // Do not process — return support message
    case 'prohibited_content':
      return 'blocked';
    case 'unsafe_personal_info':
      return 'blocked';
    case 'direct_answer_request':
      return 'hint';
    case 'homework_outsourcing':
      return 'coach';
    case 'assessment_answer_request':
      return 'hint';
    case 'low_effort_deeper_help':
      return 'hint';
    case 'allowed':
      return 'hint'; // Fallback — shouldn't be reached
  }
}

// ---------------------------------------------------------------------------
// Response builders — student-friendly labels only (correction #6)
// ---------------------------------------------------------------------------

/**
 * Builds a safe, student-friendly response for an unsafe classification.
 * Never exposes internal classification codes (correction #6).
 * Self-harm uses supportive wording (correction #7).
 */
export function buildUnsafeAssistanceResponse(
  classification: UnsafeClassification,
  target: SafeRoutingTarget,
): {
  message: string;
  friendlyLabel: string;
  suggestedNextStep: string;
} {
  switch (classification) {
    case 'self_harm_or_crisis':
      // Correction #7: supportive, not disciplinary
      return {
        message: SELF_HARM_SAFE_MESSAGE,
        friendlyLabel: 'We care about you',
        suggestedNextStep: 'Please talk to a trusted adult, school counselor, or text HOME to 741741.',
      };

    case 'prohibited_content':
      return {
        message: 'That message contains content I can\'t process. Let\'s focus on the lesson instead.',
        friendlyLabel: 'Let\'s refocus on learning',
        suggestedNextStep: 'Try asking about the lesson content or a concept you want to understand.',
      };

    case 'unsafe_personal_info':
      return {
        message: 'I noticed some personal information in your message. For your safety, I can\'t process that. Please remove any personal details and try again.',
        friendlyLabel: 'Keeping you safe',
        suggestedNextStep: 'Remove any personal info and rephrase your question.',
      };

    case 'direct_answer_request':
      return {
        message: 'I\'m here to help you think, not give you the answer directly. Let me guide you toward understanding instead.',
        friendlyLabel: 'Try a hint instead',
        suggestedNextStep: target === 'hint'
          ? 'Switch to Hint Mode to get a nudge in the right direction.'
          : 'Try explaining what you understand so far.',
      };

    case 'homework_outsourcing':
      return {
        message: 'I can\'t do the work for you — that would skip the learning. But I can help you plan your approach or understand the concepts.',
        friendlyLabel: 'I can help you understand it, not do it for you',
        suggestedNextStep: target === 'coach'
          ? 'Try Coach Mode for a study plan or approach.'
          : 'Break the problem into smaller pieces and tell me where you\'re stuck.',
      };

    case 'assessment_answer_request':
      return {
        message: 'I can\'t reveal assessment answers — the learning happens when you work through it. Try the question yourself first.',
        friendlyLabel: 'Let\'s turn this into a learning step',
        suggestedNextStep: 'Try your best guess first, then I\'ll help you understand what you got right.',
      };

    case 'low_effort_deeper_help':
      return {
        message: 'I need to see some effort before giving you more detailed help. Show me what you\'ve tried so far.',
        friendlyLabel: 'Show me what you\'ve tried',
        suggestedNextStep: 'Write what you think the answer might be, even if it\'s just a guess.',
      };

    default:
      return {
        message: 'I\'m here to help you learn. Can you rephrase your question?',
        friendlyLabel: 'Try again',
        suggestedNextStep: 'Rephrase your question focusing on what you want to understand.',
      };
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Whether this classification should trigger an unsafe_assistance_routed event.
 * Only logs when actual routing happens — not for normal safe requests (correction #8).
 */
export function shouldLogUnsafeAssistance(classification: UnsafeClassification): boolean {
  return classification !== 'allowed' && classification !== 'low_effort_deeper_help';
}

/**
 * Returns a student-safe routing target label.
 * Never shows internal codes to students.
 */
export function getSafeRoutingTarget(
  classification: UnsafeClassification,
  currentMode: GuidedAiModeId,
): string {
  const target = getUnsafeAssistanceRoute(classification, currentMode);
  switch (target) {
    case 'hint': return 'Hint Mode';
    case 'explain': return 'Explain Mode';
    case 'coach': return 'Coach Mode';
    case 'lesson_rescue': return 'Lesson Rescue';
    case 'blocked': return '';
  }
}
