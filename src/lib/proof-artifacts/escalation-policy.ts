/**
 * Sprint 5F — Upload Escalation Policy
 *
 * Defines structured escalation paths for broken or invalid proof uploads.
 * Does NOT create new artifact statuses — uses existing revise/rejected flow.
 *
 * Escalation paths:
 * - student_self_fix: student can resolve the issue themselves
 * - retry: transient error, student should try again
 * - teacher_admin_review: reviewer should handle via revise/rejected flow
 * - technical_support: requires developer/infrastructure investigation
 * - future_security_review: deferred until malware scanning is implemented
 */

// ---------------------------------------------------------------------------
// Issue Types
// ---------------------------------------------------------------------------

export type ProofUploadIssueType =
  | 'unsupported_file_type'
  | 'file_too_large'
  | 'upload_failed'
  | 'finalize_failed'
  | 'preview_failed'
  | 'corrupt_or_unreadable_file'
  | 'unsafe_file_name'
  | 'suspected_malware_future'
  | 'repeated_student_failure'
  | 'storage_error'
  | 'permission_error';

export type EscalationPath =
  | 'student_self_fix'
  | 'retry'
  | 'teacher_admin_review'
  | 'technical_support'
  | 'future_security_review';

// ---------------------------------------------------------------------------
// Policy Constants
// ---------------------------------------------------------------------------

export const PROOF_UPLOAD_ESCALATION_POLICY = {
  /** Maximum retries before escalating to teacher/admin */
  maxStudentRetries: 3,
  /** Whether a support ticket system exists */
  supportTicketSystemExists: false,
  /** Contact method for technical support */
  technicalSupportContact: 'Contact your instructor or administrator.',
} as const;

// ---------------------------------------------------------------------------
// Classification & Escalation
// ---------------------------------------------------------------------------

/**
 * Classifies a proof upload issue and returns the appropriate escalation path.
 */
export function classifyProofUploadIssue(issue: ProofUploadIssueType): {
  path: EscalationPath;
  severity: 'low' | 'medium' | 'high';
} {
  switch (issue) {
    case 'unsupported_file_type':
      return { path: 'student_self_fix', severity: 'low' };
    case 'file_too_large':
      return { path: 'student_self_fix', severity: 'low' };
    case 'unsafe_file_name':
      return { path: 'student_self_fix', severity: 'low' };
    case 'upload_failed':
      return { path: 'retry', severity: 'low' };
    case 'preview_failed':
      return { path: 'retry', severity: 'low' };
    case 'corrupt_or_unreadable_file':
      return { path: 'teacher_admin_review', severity: 'medium' };
    case 'repeated_student_failure':
      return { path: 'teacher_admin_review', severity: 'medium' };
    case 'finalize_failed':
      return { path: 'technical_support', severity: 'high' };
    case 'storage_error':
      return { path: 'technical_support', severity: 'high' };
    case 'permission_error':
      return { path: 'technical_support', severity: 'high' };
    case 'suspected_malware_future':
      return { path: 'future_security_review', severity: 'high' };
    default:
      return { path: 'technical_support', severity: 'medium' };
  }
}

/**
 * Returns the escalation path description for a given issue.
 */
export function getUploadEscalationPath(issue: ProofUploadIssueType): string {
  const { path } = classifyProofUploadIssue(issue);
  switch (path) {
    case 'student_self_fix':
      return 'The student can resolve this by adjusting the file and trying again.';
    case 'retry':
      return 'This may be a temporary error. The student should try uploading again.';
    case 'teacher_admin_review':
      return 'A teacher or admin should review this issue. Use the revise or reject flow with a clear note.';
    case 'technical_support':
      return 'This requires technical investigation. Contact the administrator.';
    case 'future_security_review':
      return 'This will be handled once malware scanning is implemented.';
    default:
      return 'Contact your instructor or administrator for help.';
  }
}

/**
 * Returns a student-safe troubleshooting message for a given issue reason.
 */
export function getStudentUploadTroubleshootingMessage(reason: string): string {
  const lower = reason.toLowerCase();

  if (lower.includes('mime') || lower.includes('extension') || lower.includes('unsupported')) {
    return 'This file type is not supported. Please upload a photo (JPEG, PNG, WebP), document (PDF, DOC, DOCX), audio (MP3, MP4, WAV, WebM), or video (MP4, WebM, MOV) file.';
  }

  if (lower.includes('size') || lower.includes('exceeds')) {
    return 'This file is too large. Photos must be under 10MB, documents under 20MB, audio under 50MB, and video under 100MB. Try compressing the file or choosing a smaller version.';
  }

  if (lower.includes('dangerous') || lower.includes('forbidden') || lower.includes('traversal')) {
    return 'This file name contains characters that are not allowed. Please rename the file using only letters, numbers, hyphens, and underscores, then try again.';
  }

  if (lower.includes('not found in storage') || lower.includes('upload may not have completed')) {
    return 'The upload did not complete successfully. Please try uploading the file again. If the problem persists, try a different browser or check your internet connection.';
  }

  if (lower.includes('failed to create') || lower.includes('failed to finalize')) {
    return 'Something went wrong on our end. Please try again in a few minutes. If this keeps happening, let your instructor know.';
  }

  // Generic fallback
  return 'Something went wrong with the upload. Please check your file and try again. If the problem continues, ask your instructor for help.';
}

/**
 * Returns a reviewer-facing escalation message for a given issue type.
 */
export function getAdminUploadEscalationMessage(issue: ProofUploadIssueType): string {
  switch (issue) {
    case 'corrupt_or_unreadable_file':
      return 'This file cannot be opened or is corrupted. Use "Revise" with a note asking the student to re-export or re-save the file in a supported format.';
    case 'repeated_student_failure':
      return 'This student has had multiple upload failures. Check if they need help with file formatting or if there is a technical issue with their account.';
    case 'finalize_failed':
      return 'The upload finalization step failed. This is likely a server-side issue. Check storage bucket access and Supabase service status.';
    case 'storage_error':
      return 'A storage system error occurred. Check Supabase Storage bucket configuration and service status.';
    case 'permission_error':
      return 'A permission error occurred. Verify RLS policies and bucket access rules.';
    case 'suspected_malware_future':
      return 'This file has been flagged for security review. Malware scanning is not yet active — do not open suspicious files.';
    default:
      return 'Review the student submission and use the appropriate action (Revise with note, or Reject if the issue is final).';
  }
}
