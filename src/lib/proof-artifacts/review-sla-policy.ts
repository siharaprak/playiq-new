/**
 * Sprint 5F — Beta Review SLA Policy
 *
 * Defines review SLA expectations for proof artifacts during beta.
 * Uses calendar-day approximation (not business-day calculation).
 *
 * Important: This is an expectation, NOT a contractual guarantee.
 * Student/parent-facing copy should say "usually reviewed within 2 business days during beta."
 */

// ---------------------------------------------------------------------------
// Policy Constants
// ---------------------------------------------------------------------------

export const PROOF_REVIEW_SLA_POLICY = {
  /** Target review time description */
  targetDescription: '2 business days',
  /** Warning threshold in calendar days */
  warningCalendarDays: 3,
  /** Overdue threshold in calendar days */
  overdueCalendarDays: 5,
  /** Urgent threshold in calendar days */
  urgentCalendarDays: 7,
  /** Whether SLA is a guarantee */
  isGuarantee: false,
  /** Student-facing review time message */
  studentMessage: 'Proofs are usually reviewed within 2 business days during beta.',
  /** Parent-facing review time message */
  parentMessage: 'Proofs are usually reviewed within 2 business days during beta.',
} as const;

// ---------------------------------------------------------------------------
// SLA Status Types
// ---------------------------------------------------------------------------

export type ProofReviewSlaStatus = 'on_track' | 'approaching_delay' | 'overdue' | 'urgent';

// ---------------------------------------------------------------------------
// SLA Helpers
// ---------------------------------------------------------------------------

/**
 * Calculates the SLA status for a proof artifact based on its submission time.
 * Uses calendar-day approximation for beta simplicity.
 */
export function getProofReviewSlaStatus(submittedAt: string | Date, now: Date = new Date()): ProofReviewSlaStatus {
  const submitted = new Date(submittedAt);
  const diffMs = now.getTime() - submitted.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays >= PROOF_REVIEW_SLA_POLICY.urgentCalendarDays) return 'urgent';
  if (diffDays >= PROOF_REVIEW_SLA_POLICY.overdueCalendarDays) return 'overdue';
  if (diffDays >= PROOF_REVIEW_SLA_POLICY.warningCalendarDays) return 'approaching_delay';
  return 'on_track';
}

/**
 * Returns a human-readable label for the SLA status.
 */
export function getProofReviewSlaLabel(status: ProofReviewSlaStatus): string {
  switch (status) {
    case 'on_track': return 'On Track';
    case 'approaching_delay': return 'Review Soon';
    case 'overdue': return 'Overdue';
    case 'urgent': return 'Urgent';
    default: return '';
  }
}

/**
 * Returns a descriptive message for the SLA status.
 */
export function getProofReviewSlaMessage(status: ProofReviewSlaStatus): string {
  switch (status) {
    case 'on_track':
      return 'This proof is within the expected review window.';
    case 'approaching_delay':
      return 'This proof is approaching the review window limit. Please review soon.';
    case 'overdue':
      return 'This proof is overdue for review. Please prioritize.';
    case 'urgent':
      return 'This proof has been waiting over 7 days. Immediate review recommended.';
    default:
      return '';
  }
}

/**
 * Returns a reviewer queue priority for an artifact.
 * Higher numbers = more urgent.
 */
export function getReviewerQueuePriority(artifact: { submitted_at: string }): number {
  if (!artifact.submitted_at) return 0;
  const status = getProofReviewSlaStatus(artifact.submitted_at);
  switch (status) {
    case 'urgent': return 4;
    case 'overdue': return 3;
    case 'approaching_delay': return 2;
    case 'on_track': return 1;
    default: return 0;
  }
}

/**
 * Returns the CSS color class for an SLA badge.
 */
export function getSlaBadgeColor(status: ProofReviewSlaStatus): string {
  switch (status) {
    case 'on_track': return 'text-slate-400 border-slate-600 bg-slate-800/50';
    case 'approaching_delay': return 'text-amber-400 border-amber-400/30 bg-amber-400/10';
    case 'overdue': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
    case 'urgent': return 'text-red-400 border-red-400/30 bg-red-400/10';
    default: return 'text-slate-400 border-slate-600 bg-slate-800/50';
  }
}
