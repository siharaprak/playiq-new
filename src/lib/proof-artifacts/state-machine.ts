export type ArtifactStatus = 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'revise';
export type ActorRole = 'student' | 'reviewer';

export interface TransitionContext {
  status: ArtifactStatus;
  actorRole: ActorRole;
}

export function getAllowedArtifactTransitions(status: ArtifactStatus, actorRole: ActorRole): ArtifactStatus[] {
  if (actorRole === 'student') {
    switch (status) {
      case 'draft': return ['submitted'];
      case 'revise': return ['submitted'];
      case 'rejected': return []; // Rejected is final in beta
      default: return []; // Cannot transition out of submitted, under_review, approved
    }
  }

  if (actorRole === 'reviewer') {
    switch (status) {
      case 'submitted': return ['under_review', 'approved', 'revise', 'rejected'];
      case 'under_review': return ['approved', 'rejected', 'revise'];
      case 'draft': return []; // Reviewer shouldn't touch drafts
      case 'approved': return []; // Final state (for beta)
      case 'rejected': return []; // Final state until student resubmits
      case 'revise': return []; // Waiting on student
      default: return [];
    }
  }

  return [];
}

export function canTransitionArtifact(currentStatus: ArtifactStatus, nextStatus: ArtifactStatus, actorRole: ActorRole): boolean {
  return getAllowedArtifactTransitions(currentStatus, actorRole).includes(nextStatus);
}

export function getArtifactStatusLabel(status: ArtifactStatus): string {
  switch (status) {
    case 'draft': return 'Draft';
    case 'submitted': return 'Submitted';
    case 'under_review': return 'Under Review';
    case 'approved': return 'Approved';
    case 'rejected': return 'Rejected';
    case 'revise': return 'Needs Revision';
    default: return status;
  }
}

export function getArtifactStatusDescription(status: ArtifactStatus): string {
  switch (status) {
    case 'draft': return 'Upload initiated but not finalized.';
    case 'submitted': return 'Awaiting review.';
    case 'under_review': return 'Currently being reviewed.';
    case 'approved': return 'Proof accepted. Great work!';
    case 'rejected': return 'Proof not accepted.';
    case 'revise': return 'Please review notes and resubmit.';
    default: return '';
  }
}
