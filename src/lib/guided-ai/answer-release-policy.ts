/**
 * Sprint 4E — Answer Release Policy
 *
 * Defines the strict policy for when Guided AI is allowed to release
 * answers, explanations, and worked examples to students.
 * 
 * Important:
 * - "Allowed" does not mean dumping final answers.
 * - Direct answer release should remain rare.
 * - This file centralizes policy documentation and provides lightweight helpers.
 */

import { classifyGuidedAiRequest } from './integrity';
import type { GuidedAiModeId } from './types';

// ---------------------------------------------------------------------------
// Answer Release Decision Type
// ---------------------------------------------------------------------------

export interface AnswerReleaseDecision {
  allowed: boolean;
  reason:
    | 'allowed_after_attempt'
    | 'allowed_conceptual_explanation'
    | 'allowed_micro_example'
    | 'allowed_verification'
    | 'blocked_direct_answer'
    | 'blocked_homework_outsourcing'
    | 'blocked_assessment_answer'
    | 'blocked_low_effort'
    | 'blocked_exact_solution'
    | 'blocked_unsafe';
  allowedSupport:
    | 'hint'
    | 'explain'
    | 'coach'
    | 'lesson_rescue'
    | 'quiz_practice'
    | 'none';
  message: string;
}

// ---------------------------------------------------------------------------
// Static Policy Rules
// ---------------------------------------------------------------------------

export const ANSWER_RELEASE_POLICY = {
  blockedRules: [
    { condition: 'student asks for direct homework answer', reason: 'blocked_direct_answer' },
    { condition: 'student asks to write/solve/complete work for them', reason: 'blocked_homework_outsourcing' },
    { condition: 'student asks for quiz/test/boss battle answer', reason: 'blocked_assessment_answer' },
    { condition: 'student asks for exact final solution without attempt', reason: 'blocked_exact_solution' },
    { condition: 'student requests Level 2/3 help without effort', reason: 'blocked_low_effort' },
    { condition: 'student includes unsafe personal info', reason: 'blocked_unsafe' },
    { condition: 'student requests prohibited or unsafe assistance', reason: 'blocked_unsafe' }
  ],
  allowedRules: [
    { condition: 'student has made a meaningful attempt and asks for feedback', reason: 'allowed_after_attempt' },
    { condition: 'generated practice question has been attempted', reason: 'allowed_after_attempt' },
    { condition: 'explanation is conceptual, not the exact answer', reason: 'allowed_conceptual_explanation' },
    { condition: 'micro-example uses a different scenario', reason: 'allowed_micro_example' },
    { condition: 'student asks for verification after showing work', reason: 'allowed_verification' }
  ]
};

// ---------------------------------------------------------------------------
// Core Policy Engine
// ---------------------------------------------------------------------------

/**
 * Returns a formal decision on whether an answer/explanation can be released
 * based on the student's input and current mode context.
 */
export function getAnswerReleaseDecision(
  message: string,
  mode: GuidedAiModeId,
  studentAttempt?: string
): AnswerReleaseDecision {
  // 1. Classify the safety and intent of the input
  const classification = classifyGuidedAiRequest(message);

  // 2. Handle unsafe or cheating requests
  if (classification === 'unsafe_personal') {
    return {
      allowed: false,
      reason: 'blocked_unsafe',
      allowedSupport: 'none',
      message: getBlockedAnswerMessage('blocked_unsafe')
    };
  }
  
  if (classification === 'assessment_answer') {
    return {
      allowed: false,
      reason: 'blocked_assessment_answer',
      allowedSupport: 'hint',
      message: getBlockedAnswerMessage('blocked_assessment_answer')
    };
  }

  if (classification === 'homework_outsource') {
    return {
      allowed: false,
      reason: 'blocked_homework_outsourcing',
      allowedSupport: 'coach',
      message: getBlockedAnswerMessage('blocked_homework_outsourcing')
    };
  }

  if (classification === 'direct_answer') {
    return {
      allowed: false,
      reason: 'blocked_direct_answer',
      allowedSupport: 'hint',
      message: getBlockedAnswerMessage('blocked_direct_answer')
    };
  }

  // 3. Handle specific mode policies
  if (mode === 'quiz') {
    const hasAttempt = (studentAttempt?.trim().length ?? 0) >= 5;
    if (!hasAttempt) {
      return {
        allowed: false,
        reason: 'blocked_low_effort',
        allowedSupport: 'quiz_practice',
        message: 'You need to try answering the question first before I can give feedback.'
      };
    }
    return {
      allowed: true,
      reason: 'allowed_after_attempt',
      allowedSupport: 'quiz_practice',
      message: 'Feedback allowed since you provided an attempt.'
    };
  }

  if (mode === 'explain') {
    return {
      allowed: true,
      reason: 'allowed_conceptual_explanation',
      allowedSupport: 'explain',
      message: 'Conceptual explanation allowed, provided no direct answers are revealed.'
    };
  }

  // Fallback safe state
  return {
    allowed: true,
    reason: 'allowed_conceptual_explanation',
    allowedSupport: 'hint',
    message: 'Help is allowed. Guide the student step-by-step.'
  };
}

/**
 * Convenience boolean helper for answer release.
 */
export function canReleaseAnswer(message: string, mode: GuidedAiModeId, studentAttempt?: string): boolean {
  return getAnswerReleaseDecision(message, mode, studentAttempt).allowed;
}

// ---------------------------------------------------------------------------
// Messaging Helpers
// ---------------------------------------------------------------------------

/**
 * Explains the formal release decision (internal/logging use).
 */
export function explainAnswerReleaseDecision(decision: AnswerReleaseDecision): string {
  return `[${decision.allowed ? 'ALLOWED' : 'BLOCKED'}] ${decision.reason}: ${decision.message}`;
}

/**
 * Returns a student-friendly refusal message for blocked answer requests.
 */
export function getBlockedAnswerMessage(reason: AnswerReleaseDecision['reason']): string {
  switch (reason) {
    case 'blocked_direct_answer':
    case 'blocked_exact_solution':
      return 'I\'m here to help you learn, not to give you the exact answer. Let\'s work through it together.';
    case 'blocked_homework_outsourcing':
      return 'I can\'t do your homework for you. But I can help you plan your approach or understand the concept.';
    case 'blocked_assessment_answer':
      return 'I can\'t reveal assessment answers. Try it yourself first, and then we can review your thinking.';
    case 'blocked_low_effort':
      return 'I need to see you try first before I can give you more detailed help.';
    case 'blocked_unsafe':
      return 'I cannot process this request due to safety rules. Please rephrase your question to focus on the lesson.';
    default:
      return 'I can\'t give you the answer directly, but I can guide you to it.';
  }
}
