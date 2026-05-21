/**
 * Sprint 4A+4B+4C — Guided AI Integrity Controls
 *
 * Programmatic enforcement of academic integrity rules.
 * All checks are deterministic keyword-based — no ML.
 * Never exposes internal policy text or raw system prompts.
 *
 * Sprint 4B adds: Lesson Rescue minimum-input enforcement.
 * Sprint 4C adds: per-mode depth gating, hint ladder effort
 * enforcement, quiz answer withholding, retry-exhaustion handling.
 * Returns effortRequired immediately when effort is insufficient
 * (no silent downgrade to Gemini).
 */

import type { IntegrityResult, GuidedAiModeId, HintLevel } from './types';
import { canAdvanceHintLevel } from './hint-ladder';

// ---------------------------------------------------------------------------
// Pattern lists (never exposed to client)
// ---------------------------------------------------------------------------

const HOMEWORK_PATTERNS = [
  'do my homework',
  'write my essay',
  'write my paragraph',
  'solve my worksheet',
  'do this for me',
  'complete my assignment',
  'write this for me',
  'finish my work',
  'do my work',
  'answer my homework',
  'write my answer',
  'do the work for me',
  'just give me the answer',
  'copy paste answer',
];

const DIRECT_ANSWER_PATTERNS = [
  'give me the answer',
  'what is the answer',
  'tell me the answer',
  'what\'s the answer',
  'just tell me',
  'tell me what to put',
  'solve this',
  'solve it',
  'what should i put',
  'what do i write',
  'give me the correct answer',
  'what is the correct answer',
];

const ASSESSMENT_ANSWER_PATTERNS = [
  'quiz answer',
  'test answer',
  'mini check answer',
  'boss battle answer',
  'teach back answer',
  'assessment answer',
  'what is the right answer for the quiz',
  'answer to question',
];

const UNSAFE_PERSONAL_PATTERNS = [
  'my phone number',
  'my address',
  'my password',
  'my social security',
  'my credit card',
];

// ---------------------------------------------------------------------------
// Core detection functions
// ---------------------------------------------------------------------------

function normalizeInput(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s']/g, '');
}

function matchesAnyPattern(input: string, patterns: string[]): boolean {
  const normalized = normalizeInput(input);
  return patterns.some(pattern => normalized.includes(pattern));
}

/**
 * Classifies the overall risk of a guided AI request.
 */
export function classifyGuidedAiRequest(input: string): 'safe' | 'homework_outsource' | 'direct_answer' | 'assessment_answer' | 'unsafe_personal' {
  if (matchesAnyPattern(input, UNSAFE_PERSONAL_PATTERNS)) return 'unsafe_personal';
  if (matchesAnyPattern(input, ASSESSMENT_ANSWER_PATTERNS)) return 'assessment_answer';
  if (matchesAnyPattern(input, HOMEWORK_PATTERNS)) return 'homework_outsource';
  if (matchesAnyPattern(input, DIRECT_ANSWER_PATTERNS)) return 'direct_answer';
  return 'safe';
}

/**
 * Checks whether the student provided meaningful input.
 * Refuses empty, gibberish, or extremely short requests.
 */
export function enforceMinimumEffort(input: string): IntegrityResult {
  const trimmed = input.trim();

  if (trimmed.length < 3) {
    return {
      action: 'refused',
      reason: 'minimum_effort',
      refusalMessage: 'Try writing a bit more about what you need help with. Even one sentence helps me give you better support.',
    };
  }

  // Check for obvious gibberish
  const gibberishPattern = /^[a-z]{1,4}$/i;
  if (gibberishPattern.test(trimmed) && !['help', 'hint', 'quiz', 'plan', 'why', 'how', 'what'].includes(trimmed.toLowerCase())) {
    return {
      action: 'refused',
      reason: 'gibberish',
      refusalMessage: 'I want to help, but I need a real question or request. What concept are you working on?',
    };
  }

  return { action: 'allowed' };
}

/**
 * Detects homework outsourcing attempts.
 */
export function detectHomeworkOutsourcing(input: string): IntegrityResult {
  if (matchesAnyPattern(input, HOMEWORK_PATTERNS)) {
    return {
      action: 'refused',
      reason: 'homework_outsource',
      refusalMessage: 'I can\'t do your homework for you — that would cheat you out of learning. But I can help you understand the concept, give you hints, or help you plan your approach. What are you working on?',
    };
  }
  return { action: 'allowed' };
}

/**
 * Detects direct assessment answer requests.
 */
export function detectAssessmentAnswerRequest(input: string): IntegrityResult {
  if (matchesAnyPattern(input, ASSESSMENT_ANSWER_PATTERNS)) {
    return {
      action: 'refused',
      reason: 'assessment_answer',
      refusalMessage: 'I can\'t reveal assessment answers — that would skip the learning. Try the quiz yourself first, then I can help you understand what you got wrong.',
    };
  }
  return { action: 'allowed' };
}

/**
 * Builds a safe, student-friendly refusal message.
 */
export function buildSafeRefusal(reason: string): string {
  switch (reason) {
    case 'homework_outsource':
      return 'I can\'t do your homework for you — that would cheat you out of learning. But I can help you understand the concept, give you hints, or help you plan your approach. What are you working on?';
    case 'direct_answer':
      return 'I\'m here to help you think, not to give you the answer directly. Try explaining what you understand so far, and I\'ll give you a hint in the right direction.';
    case 'assessment_answer':
      return 'I can\'t reveal assessment answers — the goal is for you to earn the understanding. Try it yourself first, and I\'ll help you learn from any mistakes.';
    case 'unsafe_personal':
      return 'I noticed some personal information in your message. For your safety, I can\'t process that. Please remove any personal details and try again.';
    case 'minimum_effort':
      return 'Try writing a bit more about what you need help with. Even one sentence helps me give you better support.';
    case 'gibberish':
      return 'I want to help, but I need a real question or request. What concept are you working on?';
    case 'scaffold_mode':
      return 'Lesson Rescue Preview is available as a guided beta preview. Full rescue mode is coming soon. For now, paste the confusing part and tell me what feels unclear.';
    case 'lesson_rescue_minimum_input':
      return 'I want to help rescue this concept for you, but I need more to work with. Paste one confusing sentence from the lesson, or describe what feels confusing in a bit more detail.';
    case 'hint_l2_effort':
      return 'I can give you a deeper hint, but first I need to see some effort. Share what you\'ve tried so far (at least a short sentence), select the confusing part, or describe your thinking in more detail.';
    case 'hint_l3_effort':
      return 'For a worked micro-example, I need to see a real attempt from you first. Write at least one sentence about what you\'ve tried or what you think the answer might be.';
    case 'quiz_answer_effort':
      return 'I can\'t show you the answer before you try. Give it your best shot first, then I\'ll help you understand what you got right and wrong.';
    case 'quiz_weak_attempt':
      return 'Your answer is a bit short — try one more sentence using your own words. Even a guess helps me give you better feedback.';
    case 'retry_exhaustion':
      return 'I can see you\'re stuck, but I can\'t give you the answer directly. Try switching to Hint Mode or Coach Mode for a different kind of help.';
    default:
      return 'I\'m here to help you learn. Can you rephrase your question so I can support you better?';
  }
}

/**
 * Applies all integrity rules for a given mode and input.
 * Returns the first failing check, or 'allowed' if all pass.
 *
 * Sprint 4C: accepts hintLevel and retryCount for depth gating.
 */
export function applyModeIntegrityRules(
  mode: GuidedAiModeId,
  input: string,
  selectedText?: string,
  studentAttempt?: string,
  hintLevel?: HintLevel,
  retryCount?: number
): IntegrityResult {
  // 1. Minimum effort check (all modes)
  const effortCheck = enforceMinimumEffort(input);
  if (effortCheck.action !== 'allowed') return effortCheck;

  // 2. Unsafe personal info check (all modes)
  if (matchesAnyPattern(input, UNSAFE_PERSONAL_PATTERNS)) {
    return {
      action: 'refused',
      reason: 'unsafe_personal',
      refusalMessage: buildSafeRefusal('unsafe_personal'),
    };
  }

  // 3. Assessment answer check (all modes)
  const assessmentCheck = detectAssessmentAnswerRequest(input);
  if (assessmentCheck.action !== 'allowed') return assessmentCheck;

  // 4. Homework outsourcing check (all modes except coach)
  if (mode !== 'coach') {
    const homeworkCheck = detectHomeworkOutsourcing(input);
    if (homeworkCheck.action !== 'allowed') return homeworkCheck;
  }

  // 5. Direct answer check (explain, hint, and lesson_rescue modes)
  if (mode === 'explain' || mode === 'hint' || mode === 'lesson_rescue') {
    if (matchesAnyPattern(input, DIRECT_ANSWER_PATTERNS)) {
      return {
        action: 'refused',
        reason: 'direct_answer',
        refusalMessage: buildSafeRefusal('direct_answer'),
      };
    }
  }

  // 6. Quiz mode — extra guard against answer seeking
  if (mode === 'quiz') {
    if (matchesAnyPattern(input, DIRECT_ANSWER_PATTERNS)) {
      return {
        action: 'refused',
        reason: 'assessment_answer',
        refusalMessage: 'In Quiz Mode, I generate questions for you to practice. Try answering the question first, then I\'ll let you know how you did.',
      };
    }
  }

  // 7. Lesson Rescue minimum input check (Sprint 4B)
  if (mode === 'lesson_rescue') {
    const rescueInputCheck = enforceLessonRescueMinimumInput(input, selectedText, studentAttempt);
    if (rescueInputCheck.action !== 'allowed') return rescueInputCheck;
  }

  // 8. Sprint 4C: Hint depth effort gating
  if (mode === 'hint' && hintLevel && hintLevel > 1) {
    const depthCheck = enforceHintDepthEffort(hintLevel, studentAttempt, selectedText, input);
    if (depthCheck.action !== 'allowed') return depthCheck;
  }

  // 9. Sprint 4C: Retry exhaustion check (retryCount >= 2 + direct answer pattern)
  if ((retryCount ?? 0) >= 2) {
    if (matchesAnyPattern(input, DIRECT_ANSWER_PATTERNS)) {
      return {
        action: 'refused',
        reason: 'retry_exhaustion',
        refusalMessage: buildSafeRefusal('retry_exhaustion'),
      };
    }
  }

  return { action: 'allowed' };
}

// ---------------------------------------------------------------------------
// Lesson Rescue — minimum input enforcement (Sprint 4B)
// ---------------------------------------------------------------------------

/**
 * Requires at least one substantial input for Lesson Rescue:
 * - selectedText with 20+ characters, OR
 * - message with 15+ characters, OR
 * - studentAttempt with 10+ characters
 */
export function enforceLessonRescueMinimumInput(
  message: string,
  selectedText?: string,
  studentAttempt?: string
): IntegrityResult {
  const hasSelectedText = (selectedText?.trim().length ?? 0) >= 20;
  const hasMessage = message.trim().length >= 15;
  const hasAttempt = (studentAttempt?.trim().length ?? 0) >= 10;

  if (hasSelectedText || hasMessage || hasAttempt) {
    return { action: 'allowed' };
  }

  return {
    action: 'refused',
    reason: 'lesson_rescue_minimum_input',
    refusalMessage: buildSafeRefusal('lesson_rescue_minimum_input'),
  };
}

// ---------------------------------------------------------------------------
// Sprint 4C: Hint depth effort enforcement
// ---------------------------------------------------------------------------

/**
 * Checks whether the student has provided enough effort for the requested hint level.
 * Returns effortRequired immediately if not (per correction #3: no silent downgrade).
 */
export function enforceHintDepthEffort(
  hintLevel: HintLevel,
  studentAttempt?: string,
  selectedText?: string,
  message?: string
): IntegrityResult {
  const check = canAdvanceHintLevel(hintLevel, studentAttempt, selectedText, message);
  if (check.allowed) {
    return { action: 'allowed' };
  }

  return {
    action: 'refused',
    reason: check.reason ?? 'hint_effort',
    refusalMessage: buildSafeRefusal(check.reason ?? 'hint_l2_effort'),
  };
}

// ---------------------------------------------------------------------------
// Sprint 4C: Quiz effort enforcement
// ---------------------------------------------------------------------------

/**
 * For quiz mode: checks whether the student has attempted the practice question.
 * Returns effortRequired if no attempt, retryRequired if attempt is too weak.
 */
export function enforceQuizAttemptEffort(
  studentAttempt?: string
): { status: 'has_attempt' | 'no_attempt' | 'weak_attempt' } {
  const attemptLen = studentAttempt?.trim().length ?? 0;
  if (attemptLen === 0) return { status: 'no_attempt' };
  if (attemptLen < 5) return { status: 'weak_attempt' };
  return { status: 'has_attempt' };
}

// ---------------------------------------------------------------------------
// Sprint 4C: Effort prompt builder
// ---------------------------------------------------------------------------

/**
 * Builds a mode-aware effort prompt for the student.
 */
export function buildEffortPrompt(mode: GuidedAiModeId, reason: string): string {
  switch (reason) {
    case 'hint_l2_effort':
      return 'To get a more detailed hint, share what you\'ve tried so far. Even one sentence helps.';
    case 'hint_l3_effort':
      return 'For a worked example, I need to see your attempt first. Write what you think the answer might be.';
    case 'quiz_answer_effort':
      return 'Try answering the practice question first. Even a guess helps me give you useful feedback.';
    case 'quiz_weak_attempt':
      return 'Your answer is quite short. Try adding one more sentence in your own words.';
    default:
      return 'Show me what you\'ve tried so far, and I\'ll help you from there.';
  }
}
