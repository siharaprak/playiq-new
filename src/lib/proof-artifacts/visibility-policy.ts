/**
 * Sprint 5F — Parent Proof Visibility Policy
 *
 * Defines exactly what proof artifact information parents can see.
 * During beta, parents receive counts and supportive status labels only.
 * Parents cannot download files, receive signed URLs, or see raw metadata.
 *
 * This file is the single source of truth for parent visibility rules.
 */

import type { ArtifactStatus } from './state-machine';

// ---------------------------------------------------------------------------
// Policy Constants
// ---------------------------------------------------------------------------

export const PROOF_PARENT_VISIBILITY_POLICY = {
  /** Parents can see summary counts for linked children */
  parentCanSeeSummaryCounts: true,
  /** Parents can see approved artifact metadata (title only, no file access) */
  parentCanSeeApprovedMetadata: true,
  /** Parents cannot download files during beta */
  parentCanDownloadFiles: false,
  /** Parents cannot receive signed URLs during beta */
  parentCanReceiveSignedUrls: false,
  /** Parents cannot see draft artifacts */
  parentCanSeeDrafts: false,
  /** Parents cannot see raw storage_path */
  parentCanSeeStoragePath: false,
  /** Parents cannot see review notes by default during beta */
  parentCanSeeReviewNotes: false,
  /** Parents cannot see raw file names during beta */
  parentCanSeeFileName: false,
} as const;

// ---------------------------------------------------------------------------
// Visibility Per Status
// ---------------------------------------------------------------------------

interface ParentArtifactVisibility {
  /** Whether the parent can see this artifact exists */
  visible: boolean;
  /** Whether the parent can see safe metadata (e.g. title for approved) */
  showMetadata: boolean;
  /** Whether the parent sees the count for this status */
  showCount: boolean;
  /** Whether the parent can download files in this status */
  showDownload: boolean;
}

/**
 * Returns the visibility rules for a parent viewing an artifact in the given status.
 */
export function getParentArtifactVisibility(status: ArtifactStatus): ParentArtifactVisibility {
  switch (status) {
    case 'approved':
      return {
        visible: true,
        showMetadata: PROOF_PARENT_VISIBILITY_POLICY.parentCanSeeApprovedMetadata,
        showCount: true,
        showDownload: PROOF_PARENT_VISIBILITY_POLICY.parentCanDownloadFiles,
      };
    case 'submitted':
    case 'under_review':
      return { visible: true, showMetadata: false, showCount: true, showDownload: false };
    case 'revise':
      return { visible: true, showMetadata: false, showCount: true, showDownload: false };
    case 'rejected':
      return { visible: true, showMetadata: false, showCount: true, showDownload: false };
    case 'draft':
      return { visible: false, showMetadata: false, showCount: false, showDownload: false };
    default:
      return { visible: false, showMetadata: false, showCount: false, showDownload: false };
  }
}

/**
 * Whether a parent can see safe metadata for an artifact in this status.
 * Currently only `approved` artifacts expose metadata to parents.
 */
export function canParentSeeArtifactMetadata(status: ArtifactStatus): boolean {
  return getParentArtifactVisibility(status).showMetadata;
}

/**
 * Whether a parent can download an artifact file in this status.
 * Always false during beta.
 */
export function canParentDownloadArtifact(status: ArtifactStatus): boolean {
  return getParentArtifactVisibility(status).showDownload;
}

/**
 * Returns a supportive, non-punitive message for a parent viewing
 * their child's proof artifact in the given status.
 */
export function getParentProofVisibilityMessage(status: ArtifactStatus): string {
  switch (status) {
    case 'approved':
      return 'Proof accepted — great progress!';
    case 'submitted':
      return 'Proof submitted and waiting for review.';
    case 'under_review':
      return 'Proof is currently being reviewed.';
    case 'revise':
      return 'Needs student action — your child is working on improvements.';
    case 'rejected':
      return 'Not accepted — your child may submit a new proof if asked.';
    case 'draft':
      return ''; // Draft is hidden from parents
    default:
      return '';
  }
}

/**
 * Returns all artifact statuses that are visible to parents.
 */
export function getParentVisibleProofStates(): ArtifactStatus[] {
  return ['approved', 'submitted', 'under_review', 'revise', 'rejected'];
}

/**
 * Returns all artifact statuses that are hidden from parents.
 */
export function getParentHiddenProofStates(): ArtifactStatus[] {
  return ['draft'];
}
