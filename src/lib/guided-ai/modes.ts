/**
 * Sprint 4A — Guided AI Mode Registry
 *
 * Defines all 6 guided AI modes with their config, integrity rules,
 * and output contracts.
 */

import type { GuidedAiModeConfig, GuidedAiModeId } from './types';

// ---------------------------------------------------------------------------
// Mode definitions
// ---------------------------------------------------------------------------

export const GUIDED_AI_MODES: Record<GuidedAiModeId, GuidedAiModeConfig> = {
  explain: {
    id: 'explain',
    label: 'Explain',
    description: 'Explains the concept in simpler language with analogy and example. Ends with a quick check question.',
    allowedInputs: ['message', 'selectedText'],
    integrityRules: [
      'Must not complete homework or quiz answers directly',
      'Must not fabricate module facts',
      'Must end with a quick check question',
      'Must use current module/node context',
    ],
    outputContract: 'Concept explanation + follow-up question',
    betaStatus: 'active',
  },

  hint: {
    id: 'hint',
    label: 'Hint',
    description: 'Gives one small hint at a time using a hint ladder. Does not reveal the final answer.',
    allowedInputs: ['message', 'selectedText', 'studentAttempt'],
    integrityRules: [
      'Must not reveal final answer',
      'Must require student attempt or context before giving hints',
      'Hint ladder: 1) nudge, 2) direction, 3) worked micro-example (not the exact answer)',
      'Must not give more than one hint level per request',
    ],
    outputContract: 'Single hint at appropriate ladder level',
    betaStatus: 'active',
  },

  quiz: {
    id: 'quiz',
    label: 'Quiz Me',
    description: 'Generates practice questions from the current concept. Gives answer only after student responds.',
    allowedInputs: ['message', 'studentAttempt'],
    integrityRules: [
      'Must not reveal answer before student responds',
      'Must generate questions from current concept context',
      'Supports multiple choice and short answer',
      'No grading persistence',
    ],
    outputContract: 'Practice question(s) with answer withheld until student attempt',
    betaStatus: 'active',
  },

  coach: {
    id: 'coach',
    label: 'Coach',
    description: 'Helps plan study approach, focus, confidence, and next action. Practical and student-safe.',
    allowedInputs: ['message'],
    integrityRules: [
      'No therapy-style language',
      'Must be practical, short, student-safe',
      'May suggest next action based on module context',
      'Must not provide direct assessment answers',
    ],
    outputContract: 'Study plan / next-step advice',
    betaStatus: 'active',
  },

  learn_your_way: {
    id: 'learn_your_way',
    label: 'Learn Your Way',
    description: 'Lightweight diagnostic that asks preference questions and writes bounded signals.',
    allowedInputs: ['message', 'preferences'],
    integrityRules: [
      'Must ask specific preference questions',
      'Must only write bounded enum values to fingerprint_signals',
      'No full personalization engine',
      'Return preference summary to student',
    ],
    outputContract: 'Preference diagnostic + bounded signal write',
    betaStatus: 'beta',
  },

  lesson_rescue_stub: {
    id: 'lesson_rescue_stub',
    label: 'Lesson Rescue Preview',
    description: 'Scaffold only. Asks student to paste a confusing excerpt and identify what feels unclear.',
    allowedInputs: ['message', 'selectedText'],
    integrityRules: [
      'Must not build full rescue workflow',
      'Must ask student what feels unclear',
      'Must not save rescue reports',
      'Must display as beta preview / scaffold only',
    ],
    outputContract: 'Guided clarification scaffold — no full rescue',
    betaStatus: 'scaffold',
  },

  lesson_rescue: {
    id: 'lesson_rescue',
    label: 'Lesson Rescue',
    description: 'Diagnose confusion in a pasted or selected lesson excerpt and guide the student back to understanding without giving direct answers.',
    allowedInputs: ['message', 'selectedText', 'studentAttempt'],
    integrityRules: [
      'Must not give direct homework answers',
      'Must not reveal quiz or assessment answers',
      'Must identify likely confusion type from bounded enum',
      'Must explain the missing idea in plain language',
      'Must ask one check question',
      'Must ask student to teach it back in their own words',
      'Must not produce long lectures',
      'Must not shame the student',
      'microExample must not solve the student exact assignment',
      'If input is too vague, ask for the confusing sentence',
    ],
    outputContract: 'Structured rescue diagnosis: confusionType, gapDiagnosis, rescueExplanation, checkQuestion, teachBackPrompt, nextStep',
    betaStatus: 'beta',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getMode(id: GuidedAiModeId): GuidedAiModeConfig {
  return GUIDED_AI_MODES[id];
}

export function getActiveModes(): GuidedAiModeConfig[] {
  return Object.values(GUIDED_AI_MODES).filter(m => m.betaStatus !== 'scaffold');
}

export function getAllModes(): GuidedAiModeConfig[] {
  return Object.values(GUIDED_AI_MODES);
}

export function isModeAvailable(id: GuidedAiModeId): boolean {
  const mode = GUIDED_AI_MODES[id];
  return mode.betaStatus === 'active' || mode.betaStatus === 'beta';
}
