/**
 * Sprint 4C — Structured Hint Ladder
 *
 * Defines the 3-level hint ladder policy for Guided AI Hint Mode.
 * Each level provides progressively more help while NEVER revealing the answer.
 *
 * Level 1: Nudge — guiding question, points to concept
 * Level 2: Direction — step/idea needed, partial structure (requires effort)
 * Level 3: Micro-example — worked example using DIFFERENT scenario + teach-back (requires stronger effort)
 */

import type { HintLevel } from './types';

// ---------------------------------------------------------------------------
// Hint level policies
// ---------------------------------------------------------------------------

interface HintLevelPolicy {
  level: HintLevel;
  name: string;
  description: string;
  whatToGive: string;
  whatToWithhold: string;
  requiresTeachBack: boolean;
}

const HINT_POLICIES: Record<HintLevel, HintLevelPolicy> = {
  1: {
    level: 1,
    name: 'Nudge',
    description: 'A gentle nudge in the right direction.',
    whatToGive: 'Ask a guiding question. Point to the relevant concept area. Keep under 2 sentences.',
    whatToWithhold: 'No examples using the exact problem. No structural hints. No answer.',
    requiresTeachBack: false,
  },
  2: {
    level: 2,
    name: 'Direction',
    description: 'A more specific direction with partial structure.',
    whatToGive: 'Explain the step or idea the student needs. Give a partial structure or framework. Keep under 3 sentences.',
    whatToWithhold: 'No final answer. No worked example yet. No complete solution structure.',
    requiresTeachBack: false,
  },
  3: {
    level: 3,
    name: 'Micro-example',
    description: 'A small worked example using a different scenario, followed by teach-back.',
    whatToGive: 'Give a small worked example using a DIFFERENT scenario (never the student exact problem). Ask the student to apply the pattern back to their problem.',
    whatToWithhold: 'No final answer to the student exact question. No direct solution.',
    requiresTeachBack: true,
  },
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

/**
 * Returns the policy for a given hint level.
 */
export function getHintLevelPolicy(level: HintLevel): HintLevelPolicy {
  return HINT_POLICIES[level];
}

/**
 * Returns the next hint level, or null if at max.
 */
export function getNextHintLevel(current: HintLevel): HintLevel | null {
  if (current >= 3) return null;
  return (current + 1) as HintLevel;
}

/**
 * Returns human-readable label for a hint level.
 */
export function describeHintLevel(level: HintLevel): string {
  return `Hint ${level}: ${HINT_POLICIES[level].name}`;
}

/**
 * Checks whether the student has provided enough effort to advance to a given hint level.
 *
 * Level 1: Always allowed.
 * Level 2: studentAttempt >= 10 OR selectedText >= 20 OR message >= 20.
 * Level 3: studentAttempt >= 15.
 */
export function canAdvanceHintLevel(
  level: HintLevel,
  studentAttempt?: string,
  selectedText?: string,
  message?: string
): { allowed: boolean; reason?: string } {
  if (level <= 1) {
    return { allowed: true };
  }

  const attemptLen = studentAttempt?.trim().length ?? 0;
  const selectedLen = selectedText?.trim().length ?? 0;
  const messageLen = message?.trim().length ?? 0;

  if (level === 2) {
    if (attemptLen >= 10 || selectedLen >= 20 || messageLen >= 20) {
      return { allowed: true };
    }
    return {
      allowed: false,
      reason: 'hint_l2_effort',
    };
  }

  // Level 3
  if (attemptLen >= 15) {
    return { allowed: true };
  }
  return {
    allowed: false,
    reason: 'hint_l3_effort',
  };
}

/**
 * Builds the hint ladder instruction to inject into the Gemini prompt.
 * Forces the AI output to match the specified level.
 */
export function buildHintLadderInstruction(level: HintLevel): string {
  const policy = HINT_POLICIES[level];

  const parts = [
    `=== HINT LEVEL: ${level} (${policy.name}) ===`,
    `You are giving a Level ${level} hint.`,
    `WHAT TO GIVE: ${policy.whatToGive}`,
    `WHAT TO WITHHOLD: ${policy.whatToWithhold}`,
    'NEVER reveal the final answer, no matter what the student asks.',
  ];

  if (policy.requiresTeachBack) {
    parts.push('');
    parts.push('REQUIRED: You MUST include a "teachBackPrompt" field in your JSON output.');
    parts.push('Ask the student to explain the concept back to you in their own words.');
    parts.push('Example: "Can you apply this pattern to your problem and tell me what you get?"');
  }

  return parts.join('\n');
}
