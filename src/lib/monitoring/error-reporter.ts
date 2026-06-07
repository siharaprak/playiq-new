// src/lib/monitoring/error-reporter.ts
//
// Sprint 9B Error Reporter
// Standardizes safe error logging via SafeLogger and provides client-safe responses.
//

import { SafeLogger } from '@/lib/logging/safe-logger';
import { ERROR_CATEGORIES, type ErrorCategory } from './error-monitoring-policy';

export interface ErrorReportInput {
  error: unknown;
  category: ErrorCategory;
  feature?: string;
  action?: string;
  statusCode?: number;
  requestId?: string;
}

export class ErrorReporter {
  public static report(input: ErrorReportInput): void {
    const rawError = input.error;
    let message = rawError instanceof Error ? rawError.message : String(rawError);

    // Strip stack trace, causes, and any text that looks like a stack trace
    message = message.replace(/(?:\r?\n)+.*?(?:at\s+|    at\s+|@)[\s\S]*$/, '');

    // Perform string-level scrub for any forbidden sensitive fields or keys
    const forbiddenKeys = [
      'storage_path', 'signedUrl', 'signed_url', 'publicUrl',
      'instructions', 'custom_instructions', 'rawPrompt', 'rawResponse',
      'systemInstructions', 'storagePath', 'cookie', 'jwt', 'apiKey',
      'file content', 'file_content'
    ];

    for (const key of forbiddenKeys) {
      const regex = new RegExp(`("${key}"|'${key}'|${key})\\s*[:=]\\s*(?:"[^"]*"|'[^']*'|\\S+)`, 'gi');
      message = message.replace(regex, '$1: "[REMOVED]"');
    }

    // Remove any URLs containing storage paths or signs
    message = message.replace(/https?:\/\/[^\s]+/gi, (url) => {
      if (url.includes('storage') || url.includes('sign') || url.includes('token') || url.includes('object')) {
        return '[SIGNED_URL_REMOVED]';
      }
      return url;
    });

    // Strip stack traces or causes inside the message
    if (rawError instanceof Error && rawError.cause) {
      message += ` (cause: ${String(rawError.cause).replace(/(?:\r?\n)+.*?(?:at\s+|    at\s+|@)[\s\S]*$/, '')})`;
    }

    const payload: Record<string, unknown> = {
      feature: input.feature || 'unknown',
      action: input.action || 'unknown',
      statusCode: input.statusCode || 500,
      requestId: input.requestId || 'unknown',
    };

    const event = `[ERROR:${input.category}] ${message}`;
    SafeLogger.error(event, payload);
  }

  /**
   * Returns a generic client-safe error message.
   */
  public static getClientMessage(category: ErrorCategory): string {
    switch (category) {
      case ERROR_CATEGORIES.AUTH_ERROR:
      case ERROR_CATEGORIES.RBAC_DENIED:
      case ERROR_CATEGORIES.ROLE_ACCESS_DENIED:
        return 'Access denied. You do not have permission to access this resource.';
      case ERROR_CATEGORIES.RATE_LIMIT_BLOCKED:
        return 'Request blocked: Too many requests. Please try again later.';
      case ERROR_CATEGORIES.VALIDATION_ERROR:
        return 'Invalid request data. Please check your inputs and try again.';
      case ERROR_CATEGORIES.STORAGE_UPLOAD_ERROR:
      case ERROR_CATEGORIES.STORAGE_FINALIZE_ERROR:
      case ERROR_CATEGORIES.PROOF_UPLOAD_REJECTED:
      case ERROR_CATEGORIES.PROOF_FINALIZE_REJECTED:
        return 'File service error. Failed to process upload. Please try again.';
      case ERROR_CATEGORIES.PROGRESSION_EDGE_CASE:
        return 'Course content error: Module or progress path not found.';
      case ERROR_CATEGORIES.TUTOR_PROFILE_REJECTED:
      case ERROR_CATEGORIES.ASSISTANT_PROFILE_REJECTED:
        return 'Builder verification failed. Please check prompt instructions and content rules.';
      case ERROR_CATEGORIES.PARENT_VISIBILITY_VIOLATION:
        return 'Dashboard request blocked. Cannot access student internal details.';
      case ERROR_CATEGORIES.STAGING_RESET_BLOCKED:
        return 'Staging reset aborted: Production environment or credentials detected.';
      case ERROR_CATEGORIES.STAGING_RESET_EXECUTED:
        return 'Staging reset complete: Test data purged.';
      default:
        return 'An unexpected database or system error occurred. Please try again later.';
    }
  }
}
