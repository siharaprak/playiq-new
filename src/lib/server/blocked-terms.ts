/**
 * Blocked Terms — Server-Only
 *
 * Deterministic list for pre-submit content moderation.
 * Categories: profanity, slurs, bullying, sexual_content, self_harm_risk.
 *
 * Rules:
 * - Server-only: never expose to client.
 * - Self-harm terms produce a safe/support message, not shaming.
 * - Raw offensive content must NOT be logged into audit metadata.
 * - Keep list maintainable. This is a starter set for beta.
 */

import 'server-only';

export type BlockedTermCategory =
  | 'profanity'
  | 'slurs'
  | 'bullying'
  | 'sexual_content'
  | 'self_harm_risk';

export interface BlockedTermEntry {
  term: string;
  category: BlockedTermCategory;
}

/**
 * Minimal starter blocked terms list.
 * All terms are lowercase. Matching is done against normalized text.
 */
export const BLOCKED_TERMS: BlockedTermEntry[] = [
  // --- Profanity ---
  { term: 'fuck', category: 'profanity' },
  { term: 'shit', category: 'profanity' },
  { term: 'damn', category: 'profanity' },
  { term: 'ass', category: 'profanity' },
  { term: 'bitch', category: 'profanity' },
  { term: 'bastard', category: 'profanity' },
  { term: 'crap', category: 'profanity' },
  { term: 'dick', category: 'profanity' },
  { term: 'piss', category: 'profanity' },
  { term: 'cock', category: 'profanity' },
  { term: 'cunt', category: 'profanity' },

  // --- Slurs (placeholder category — expand carefully) ---
  { term: 'nigger', category: 'slurs' },
  { term: 'nigga', category: 'slurs' },
  { term: 'faggot', category: 'slurs' },
  { term: 'fag', category: 'slurs' },
  { term: 'retard', category: 'slurs' },
  { term: 'tranny', category: 'slurs' },
  { term: 'spic', category: 'slurs' },
  { term: 'chink', category: 'slurs' },
  { term: 'kike', category: 'slurs' },

  // --- Bullying ---
  { term: 'kill yourself', category: 'bullying' },
  { term: 'kys', category: 'bullying' },
  { term: 'go die', category: 'bullying' },
  { term: 'nobody likes you', category: 'bullying' },
  { term: 'you should die', category: 'bullying' },
  { term: 'loser', category: 'bullying' },
  { term: 'worthless', category: 'bullying' },

  // --- Sexual Content ---
  { term: 'porn', category: 'sexual_content' },
  { term: 'sex', category: 'sexual_content' },
  { term: 'nude', category: 'sexual_content' },
  { term: 'naked', category: 'sexual_content' },
  { term: 'xxx', category: 'sexual_content' },
  { term: 'onlyfans', category: 'sexual_content' },

  // --- Self-Harm Risk ---
  // These should NOT produce a shaming message.
  // They trigger a safe, supportive response.
  { term: 'i want to die', category: 'self_harm_risk' },
  { term: 'i want to kill myself', category: 'self_harm_risk' },
  { term: 'suicide', category: 'self_harm_risk' },
  { term: 'self harm', category: 'self_harm_risk' },
  { term: 'cutting myself', category: 'self_harm_risk' },
];

/**
 * Categories that should NOT produce a shaming or punitive message.
 * Instead, show a safe, supportive message.
 */
export const SENSITIVE_CATEGORIES: BlockedTermCategory[] = ['self_harm_risk'];

/**
 * Safe message for self-harm/safety-risk content.
 * Generic and supportive — never shaming.
 */
export const SELF_HARM_SAFE_MESSAGE =
  'It looks like you may be going through a tough time. ' +
  'Please reach out to a trusted adult, school counselor, or contact the ' +
  'Crisis Text Line by texting HOME to 741741. You are not alone.';

/**
 * Default block message for general content violations.
 */
export const DEFAULT_BLOCK_MESSAGE =
  'Your post needs to be rewritten before it can be shared.';
