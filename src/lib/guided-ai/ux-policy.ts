/**
 * Sprint 4E — Guided AI UX Policy
 *
 * Defines the user experience differences between hinting, coaching,
 * explaining, and other guided AI modes.
 * Pure static data + helper functions. No runtime behavioral changes.
 */

import type { GuidedAiModeId, HintLevel } from './types';

export interface GuidedAiUxPolicy {
  mode: GuidedAiModeId;
  primaryPurpose: string;
  uxBehavior: string[];
  studentFacingLanguage: string;
  parentFacingLanguage: string;
  allowedDepth: HintLevel | 'full' | 'none';
  primaryUserIntent: 'help' | 'practice' | 'plan' | 'diagnostic' | 'rescue';
}

export const GUIDED_AI_UX_MODES: Record<GuidedAiModeId, GuidedAiUxPolicy> = {
  hint: {
    mode: 'hint',
    primaryPurpose: 'Help student move one step forward without giving the answer.',
    uxBehavior: [
      'short response',
      'one nudge at a time',
      'hint ladder levels 1-3',
      'deeper hints require effort',
      'Level 3 requires teach-back',
      'no full worked solution to the exact problem'
    ],
    studentFacingLanguage: 'I\'ll give you a nudge, not the answer.',
    parentFacingLanguage: 'Guides your child step-by-step without giving the final answer.',
    allowedDepth: 3,
    primaryUserIntent: 'help'
  },
  coach: {
    mode: 'coach',
    primaryPurpose: 'Help student plan, focus, recover, choose next action, and stay disciplined.',
    uxBehavior: [
      'study strategy',
      'confidence support',
      'action planning',
      'prioritization',
      'does not explain full academic content unless routing to Explain Mode',
      'does not solve tasks'
    ],
    studentFacingLanguage: 'I\'ll help you decide what to do next.',
    parentFacingLanguage: 'Helps your child build study skills, focus, and a plan of action.',
    allowedDepth: 'none',
    primaryUserIntent: 'plan'
  },
  explain: {
    mode: 'explain',
    primaryPurpose: 'Explain a concept clearly using the module context.',
    uxBehavior: [
      'can give plain-language explanation',
      'can give analogy',
      'can give small example',
      'must end with a check question',
      'cannot reveal quiz/homework answers',
      'deeper explanation requires selectedText, confusion statement, or attempt'
    ],
    studentFacingLanguage: 'I\'ll explain the idea so you can use it yourself.',
    parentFacingLanguage: 'Explains concepts using analogies and examples to build understanding.',
    allowedDepth: 'full',
    primaryUserIntent: 'help'
  },
  quiz: {
    mode: 'quiz',
    primaryPurpose: 'Generate practice and check student thinking.',
    uxBehavior: [
      'answer withheld until student attempts',
      'weak attempt triggers retry',
      'no answer leak in payload before attempt'
    ],
    studentFacingLanguage: 'I\'ll give you practice questions to test your knowledge.',
    parentFacingLanguage: 'Tests your child\'s knowledge with practice questions.',
    allowedDepth: 'none',
    primaryUserIntent: 'practice'
  },
  lesson_rescue: {
    mode: 'lesson_rescue',
    primaryPurpose: 'Diagnose confusion and guide student back to understanding.',
    uxBehavior: [
      'requires confusing sentence, selectedText, or attempt',
      'returns confusion type, gap diagnosis, check question, teach-back prompt',
      'no direct answer release'
    ],
    studentFacingLanguage: 'I\'ll help you figure out exactly what\'s confusing.',
    parentFacingLanguage: 'Diagnoses exactly where your child is stuck and guides them back on track.',
    allowedDepth: 'full',
    primaryUserIntent: 'rescue'
  },
  lesson_rescue_stub: {
    mode: 'lesson_rescue_stub',
    primaryPurpose: 'Scaffold only. Asks student to paste a confusing excerpt.',
    uxBehavior: [
      'scaffold only',
      'asks for confusion input'
    ],
    studentFacingLanguage: 'I\'ll help you figure out what\'s confusing (Preview).',
    parentFacingLanguage: 'Preview of our upcoming lesson rescue feature.',
    allowedDepth: 'none',
    primaryUserIntent: 'rescue'
  },
  learn_your_way: {
    mode: 'learn_your_way',
    primaryPurpose: 'Lightweight diagnostic that asks preference questions and writes bounded signals.',
    uxBehavior: [
      'diagnostic only',
      'writes bounded signals',
      'no deep explanation'
    ],
    studentFacingLanguage: 'I\'ll help figure out how you learn best.',
    parentFacingLanguage: 'Helps us understand your child\'s learning preferences.',
    allowedDepth: 'none',
    primaryUserIntent: 'diagnostic'
  }
};

export function getGuidedAiUxPolicy(mode: GuidedAiModeId): GuidedAiUxPolicy {
  return GUIDED_AI_UX_MODES[mode];
}

export function describeModeForStudent(mode: GuidedAiModeId): string {
  return GUIDED_AI_UX_MODES[mode]?.studentFacingLanguage ?? '';
}

export function describeModeForParent(mode: GuidedAiModeId): string {
  return GUIDED_AI_UX_MODES[mode]?.parentFacingLanguage ?? '';
}

export function getModeAllowedDepth(mode: GuidedAiModeId): HintLevel | 'full' | 'none' {
  return GUIDED_AI_UX_MODES[mode]?.allowedDepth ?? 'none';
}

export function getModePrimaryUserIntent(mode: GuidedAiModeId): 'help' | 'practice' | 'plan' | 'diagnostic' | 'rescue' {
  return GUIDED_AI_UX_MODES[mode]?.primaryUserIntent ?? 'help';
}
