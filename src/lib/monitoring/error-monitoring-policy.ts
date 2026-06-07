// src/lib/monitoring/error-monitoring-policy.ts
//
// Sprint 9B Error Monitoring and Logging Policy
// Declares rules for safe, structured error logging without external SaaS.
//

export const ERROR_CATEGORIES = {
  AUTH_ERROR: 'auth_error',
  RBAC_DENIED: 'rbac_denied',
  VALIDATION_ERROR: 'validation_error',
  RATE_LIMIT_BLOCKED: 'rate_limit_blocked',
  AI_PROVIDER_ERROR: 'ai_provider_error',
  STORAGE_UPLOAD_ERROR: 'storage_upload_error',
  STORAGE_FINALIZE_ERROR: 'storage_finalize_error',
  PROOF_REVIEW_ERROR: 'proof_review_error',
  SUPPORT_ISSUE_ERROR: 'support_issue_error',
  ENROLLMENT_ERROR: 'enrollment_error',
  DATABASE_ERROR: 'database_error',
  BUILD_RELEASE_ERROR: 'build_release_error',
  // Sprint 9C categories
  ROLE_ACCESS_DENIED: 'role_access_denied',
  PROGRESSION_EDGE_CASE: 'progression_edge_case',
  PROOF_UPLOAD_REJECTED: 'proof_upload_rejected',
  PROOF_FINALIZE_REJECTED: 'proof_finalize_rejected',
  TUTOR_PROFILE_REJECTED: 'tutor_profile_rejected',
  ASSISTANT_PROFILE_REJECTED: 'assistant_profile_rejected',
  PARENT_VISIBILITY_VIOLATION: 'parent_visibility_violation',
  STAGING_RESET_BLOCKED: 'staging_reset_blocked',
  STAGING_RESET_EXECUTED: 'staging_reset_executed',
} as const;

export type ErrorCategory = typeof ERROR_CATEGORIES[keyof typeof ERROR_CATEGORIES];

export const ERROR_MONITORING_POLICY = {
  stdoutOnly: true,
  forbiddenLogFields: [
    'email', 'fullName', 'rawPrompt', 'rawResponse',
    'systemInstructions', 'storagePath', 'signedUrl', 'cookie', 'jwt', 'apiKey'
  ]
} as const;
