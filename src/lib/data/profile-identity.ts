/**
 * Profile Identity — Server-Only
 *
 * Data helpers for student username management.
 *
 * Rules:
 * - Username is public display identity only. NOT used for login/auth.
 * - User can only update their own username.
 * - Parent cannot set final child username.
 * - Username cannot look like email, phone, or contain blocked terms.
 * - Soft limit: 3 changes during beta.
 * - Normalized to lowercase.
 */

import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { checkBlockedTerms } from '@/lib/server/content-moderation';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 24;
const USERNAME_PATTERN = /^[a-z0-9_]+$/;
const BETA_CHANGE_LIMIT = 3;

/** Patterns that indicate PII in a username */
const EMAIL_LIKE = /^[^@]+@[^@]+\.[a-z]{2,}$/i;
const PHONE_LIKE = /\d{7,}/;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface UsernameValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Normalizes a username candidate to lowercase, trimmed.
 */
export function normalizeUsername(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Validates a username candidate against all rules.
 * Does NOT check availability (that requires a DB call).
 */
export function validateUsername(raw: string): UsernameValidationResult {
  const username = normalizeUsername(raw);

  if (username.length < USERNAME_MIN_LENGTH) {
    return { valid: false, error: `Username must be at least ${USERNAME_MIN_LENGTH} characters.` };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return { valid: false, error: `Username must be ${USERNAME_MAX_LENGTH} characters or fewer.` };
  }

  if (!USERNAME_PATTERN.test(username)) {
    return { valid: false, error: 'Username can only contain lowercase letters, numbers, and underscores.' };
  }

  if (EMAIL_LIKE.test(username)) {
    return { valid: false, error: 'Username cannot look like an email address.' };
  }

  if (PHONE_LIKE.test(username)) {
    return { valid: false, error: 'Username cannot contain a phone number.' };
  }

  // Check blocked terms
  const blocked = checkBlockedTerms(username);
  if (blocked) {
    return { valid: false, error: 'This username is not available.' };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Availability check
// ---------------------------------------------------------------------------

/**
 * Checks if a username is available (case-insensitive).
 * Optionally excludes a specific user ID (for the current user editing their own).
 */
export async function isUsernameAvailable(
  username: string,
  excludeUserId?: string
): Promise<boolean> {
  const normalized = normalizeUsername(username);

  let query = supabaseAdmin
    .from('profiles')
    .select('id')
    .ilike('username', normalized)
    .limit(1);

  if (excludeUserId) {
    query = query.neq('id', excludeUserId);
  }

  const { data } = await query;
  return !data || data.length === 0;
}

// ---------------------------------------------------------------------------
// Public identity
// ---------------------------------------------------------------------------

export interface PublicStudentIdentity {
  userId: string;
  username: string | null;
  displayName: string;
  canEditUsername: boolean;
  usernameChangeCount: number;
}

/**
 * Returns the public identity for a student.
 */
export async function getPublicStudentIdentity(
  userId: string
): Promise<PublicStudentIdentity | null> {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('id, username, full_name, role, username_change_count')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  const changeCount = (data as any).username_change_count ?? 0;

  return {
    userId: data.id as string,
    username: (data as any).username ?? null,
    displayName: (data as any).username || data.full_name || 'Student',
    canEditUsername: changeCount < BETA_CHANGE_LIMIT,
    usernameChangeCount: changeCount,
  };
}

// ---------------------------------------------------------------------------
// Update username
// ---------------------------------------------------------------------------

export interface UpdateUsernameResult {
  success: boolean;
  error?: string;
  username?: string;
}

/**
 * Updates the authenticated user's own username.
 * Enforces validation, availability, and beta change limit.
 */
export async function updateOwnUsername(
  userId: string,
  rawUsername: string
): Promise<UpdateUsernameResult> {
  const normalized = normalizeUsername(rawUsername);

  // Validate format
  const validation = validateUsername(normalized);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  // Check beta change limit
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('username_change_count')
    .eq('id', userId)
    .single();

  if (!profile) {
    return { success: false, error: 'Profile not found.' };
  }

  const currentCount = (profile as any).username_change_count ?? 0;
  if (currentCount >= BETA_CHANGE_LIMIT) {
    return { success: false, error: `You have reached the maximum of ${BETA_CHANGE_LIMIT} username changes for beta. Contact support to reset.` };
  }

  // Check availability (exclude current user)
  const available = await isUsernameAvailable(normalized, userId);
  if (!available) {
    return { success: false, error: 'This username is already taken.' };
  }

  // Update
  const { error: updateError } = await supabaseAdmin
    .from('profiles')
    .update({
      username: normalized,
      username_updated_at: new Date().toISOString(),
      username_change_count: currentCount + 1,
    })
    .eq('id', userId);

  if (updateError) {
    return { success: false, error: 'Failed to update username. Please try again.' };
  }

  return { success: true, username: normalized };
}
