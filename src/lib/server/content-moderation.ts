/**
 * Content Moderation — Server-Only
 *
 * Deterministic pre-submit moderation for discussion content.
 * Checks blocked terms, personal info patterns (email, phone).
 *
 * Rules:
 * - Block unsafe content before DB insert.
 * - Do NOT log raw offensive content in audit metadata — log category/decision only.
 * - Self-harm content gets a safe, supportive message.
 * - No pending_review status — block and ask for rewrite.
 */

import 'server-only';

import {
  BLOCKED_TERMS,
  SENSITIVE_CATEGORIES,
  SELF_HARM_SAFE_MESSAGE,
  DEFAULT_BLOCK_MESSAGE,
  type BlockedTermCategory,
} from './blocked-terms';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ModerationDecision = 'allow' | 'block' | 'needs_review';

export interface ModerationResult {
  decision: ModerationDecision;
  /** Safe, user-facing message. Never contains raw offensive content. */
  message: string;
  /** Category of violation (for server-side logging). Never exposed to client in detail. */
  category?: BlockedTermCategory;
}

export interface ModerationInput {
  title?: string;
  body: string;
  actorRole?: string;
}

// ---------------------------------------------------------------------------
// Text normalization
// ---------------------------------------------------------------------------

/**
 * Normalize text for moderation matching.
 * Strips accents, collapses whitespace, lowercases.
 */
export function normalizeContentForModeration(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toLowerCase()
    .replace(/[_\-\.]/g, ' ')        // replace common separators with spaces
    .replace(/0/g, 'o')              // leet speak basics
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/\$/g, 's')
    .replace(/@/g, 'a')
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Blocked term check
// ---------------------------------------------------------------------------

/**
 * Checks normalized text against the blocked terms list.
 * Returns the first matching term entry or null.
 */
export function checkBlockedTerms(
  rawText: string
): { category: BlockedTermCategory } | null {
  const normalized = normalizeContentForModeration(rawText);

  for (const entry of BLOCKED_TERMS) {
    // Word boundary match: the term must appear as a standalone word or substring
    // Use a simple includes check with word-boundary-like padding
    const padded = ` ${normalized} `;
    if (padded.includes(` ${entry.term} `) || padded.includes(`${entry.term} `) || padded.includes(` ${entry.term}`)) {
      return { category: entry.category };
    }
    // Also check without spaces for multi-word terms and concatenated text
    if (entry.term.includes(' ') && normalized.includes(entry.term)) {
      return { category: entry.category };
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Personal info check
// ---------------------------------------------------------------------------

/** Email-like pattern */
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

/** Phone-like pattern (7+ digits, possibly with separators) */
const PHONE_PATTERN = /(?:\+?\d{1,3}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/;

/**
 * Checks if text contains personal info patterns.
 * Only blocks for student role to avoid false positives for staff.
 */
export function checkUnsafePersonalInfo(
  text: string,
  actorRole?: string
): { category: 'personal_info' } | null {
  // Only enforce for students to avoid blocking teacher/admin legitimate content
  if (actorRole && actorRole !== 'student') return null;

  if (EMAIL_PATTERN.test(text)) {
    return { category: 'personal_info' };
  }

  if (PHONE_PATTERN.test(text)) {
    return { category: 'personal_info' };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main moderation function
// ---------------------------------------------------------------------------

/**
 * Moderates discussion content before DB insert.
 * Returns a decision with a safe user-facing message.
 *
 * Decision model:
 * - block: obvious offensive terms, personal info (for students)
 * - needs_review: treated as block for beta (no pending_review in DB)
 * - allow: clean content
 */
export function moderateDiscussionContent(input: ModerationInput): ModerationResult {
  const combinedText = [input.title, input.body].filter(Boolean).join(' ');

  // Check blocked terms first
  const blockedMatch = checkBlockedTerms(combinedText);
  if (blockedMatch) {
    const isSensitive = SENSITIVE_CATEGORIES.includes(blockedMatch.category);

    return {
      decision: 'block',
      message: isSensitive ? SELF_HARM_SAFE_MESSAGE : DEFAULT_BLOCK_MESSAGE,
      category: blockedMatch.category,
    };
  }

  // Check personal info (students only)
  const personalInfoMatch = checkUnsafePersonalInfo(combinedText, input.actorRole);
  if (personalInfoMatch) {
    return {
      decision: 'block',
      message: 'Your post appears to contain personal information like an email or phone number. Please remove it before posting.',
      category: undefined, // Do not log as blocked term category
    };
  }

  return { decision: 'allow', message: '' };
}

/**
 * Convenience wrapper that returns the moderation decision.
 */
export function getModerationDecision(input: ModerationInput): ModerationResult {
  return moderateDiscussionContent(input);
}
