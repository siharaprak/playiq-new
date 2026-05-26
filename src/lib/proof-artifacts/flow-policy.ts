import { ArtifactStatus, ActorRole } from './state-machine';

export const PROOF_ARTIFACT_FLOW_POLICY = {
  allowStudentResubmitRejected: false,
  allowStudentResubmitRevise: true,
  requireReviewNotesForRevise: true,
  requireReviewNotesForRejected: true,
};

export function getStudentStatusMessage(status: ArtifactStatus): string {
  switch (status) {
    case 'draft': return "Finish and submit your proof.";
    case 'submitted': return "Your proof was submitted and is waiting for review.";
    case 'under_review': return "A reviewer is checking your proof.";
    case 'approved': return "Your proof was approved.";
    case 'revise': return "Your proof needs changes. Read the reviewer note and resubmit.";
    case 'rejected': return "Your proof was not accepted. Submit a new proof artifact if your instructor asks.";
    default: return "";
  }
}

export function describeProofStatusForReviewer(status: ArtifactStatus): string {
  switch (status) {
    case 'draft': return "Hidden from review queue by default.";
    case 'submitted': return "Ready to claim/check.";
    case 'under_review': return "Actively being reviewed.";
    case 'approved': return "Accepted.";
    case 'revise': return "Sent back to student for changes.";
    case 'rejected': return "Final rejection for this artifact.";
    default: return "";
  }
}

export function getStudentAllowedActions(status: ArtifactStatus) {
  return {
    canResubmit: status === 'revise',
    canEdit: status === 'draft',
    isFinal: status === 'approved' || status === 'rejected'
  };
}

export function getReviewerAllowedActions(status: ArtifactStatus, role: ActorRole) {
  if (role !== 'reviewer') return {};
  return {
    canClaim: status === 'submitted',
    canReview: status === 'submitted' || status === 'under_review',
  };
}

export function getReviewNoteRequirement(nextStatus: ArtifactStatus): boolean {
  if (nextStatus === 'revise' && PROOF_ARTIFACT_FLOW_POLICY.requireReviewNotesForRevise) return true;
  if (nextStatus === 'rejected' && PROOF_ARTIFACT_FLOW_POLICY.requireReviewNotesForRejected) return true;
  return false;
}

export function getProofFlowTimeline(status: ArtifactStatus) {
  return {
    showSubmittedAt: true,
    showReviewedAt: status === 'approved' || status === 'rejected' || status === 'revise'
  };
}
