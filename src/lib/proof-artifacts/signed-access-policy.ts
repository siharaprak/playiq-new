/**
 * Sprint 5F — Signed Access Policy
 *
 * Single source of truth for who can request signed download URLs
 * for proof artifacts. During beta, parents are explicitly blocked.
 *
 * Rules:
 * - Signed URLs are generated only server-side.
 * - Signed URLs are never stored in the DB.
 * - Signed URLs are never logged in events_log.
 * - Signed URLs are never displayed as raw text in UI.
 * - Signed URLs may be used internally as img/audio/video/object src.
 */

import type { UserRole } from '@/lib/auth/permissions';

// ---------------------------------------------------------------------------
// Policy Constants
// ---------------------------------------------------------------------------

export const PROOF_SIGNED_ACCESS_POLICY = {
  /** Signed URL expiry in seconds (10 minutes) */
  expirySeconds: 600,
  /** Whether parent signed URL access is enabled */
  parentSignedUrlEnabled: false,
  /** Whether signed URLs should be cached beyond component memory */
  allowClientCaching: false,
  /** Whether there is a public URL fallback */
  publicUrlFallback: false,
} as const;

// ---------------------------------------------------------------------------
// Access Helpers
// ---------------------------------------------------------------------------

/**
 * Returns the signed URL expiry in seconds.
 */
export function getSignedUrlExpirySeconds(): number {
  return PROOF_SIGNED_ACCESS_POLICY.expirySeconds;
}

interface SignedUrlActor {
  id: string;
  roles: UserRole[];
}

interface SignedUrlArtifact {
  student_id: string;
  status: string;
}

/**
 * Determines whether an actor can request a signed download URL for a given artifact.
 *
 * Allowed:
 * - Owner student (artifact belongs to them)
 * - Admin (for review)
 * - Teacher (for review, scoped to proof review flows only during beta)
 *
 * Blocked:
 * - Parents (during beta)
 * - Unrelated students
 * - Unrelated parents
 * - Unauthenticated users (should never reach this function)
 */
export function canActorRequestProofSignedUrl(actor: SignedUrlActor, artifact: SignedUrlArtifact): boolean {
  // Admin always allowed
  if (actor.roles.includes('admin')) return true;

  // Teacher allowed (scoped to review flows during beta)
  if (actor.roles.includes('teacher')) return true;

  // Owner student allowed
  if (actor.id === artifact.student_id) return true;

  // Parent explicitly blocked during beta
  if (actor.roles.includes('parent')) return false;

  // All others blocked
  return false;
}

/**
 * Returns a human-readable reason why a signed URL request was denied.
 */
export function getSignedAccessDeniedReason(actor: SignedUrlActor, artifact: SignedUrlArtifact): string {
  if (actor.roles.includes('parent')) {
    return 'File downloads are not available for parents during the beta period. You can view proof progress counts on your dashboard.';
  }

  if (actor.roles.includes('student') && actor.id !== artifact.student_id) {
    return 'You can only access your own proof artifacts.';
  }

  return 'You do not have permission to access this file.';
}

/**
 * Asserts that a metadata object or payload does not contain any signed URL strings.
 * Used as a safety check before logging to events_log.
 *
 * @returns true if the payload is safe (no signed URLs detected).
 */
export function assertNoSignedUrlLeak(payload: Record<string, unknown>): boolean {
  const json = JSON.stringify(payload);
  // Supabase signed URLs contain a recognizable token parameter
  if (json.includes('token=') && json.includes('/storage/')) return false;
  if (json.includes('signedUrl') || json.includes('signed_url')) return false;
  return true;
}
