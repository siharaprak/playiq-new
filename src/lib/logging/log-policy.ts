/**
 * Sprint 9A — Logging Review Policy
 *
 * Defines allowed and forbidden fields for application logs.
 */

export type LogSeverity = 'debug' | 'info' | 'warn' | 'error' | 'security';

export const LOG_POLICY = {
  allowedFields: [
    'event',
    'severity',
    'route',
    'action',
    'userRole',
    'requestId',
    'statusCode',
    'durationMs',
    'feature',
    'studentId',
    'moduleId',
    'nodeId',
    'targetId',
    'noPromptStored',
    'noResponseStored',
    'noFileContentStored'
  ],
  forbiddenFields: [
    'email',
    'fullName',
    'phone',
    'jwt',
    'cookies',
    'serviceRoleKey',
    'service_role',
    'apiKey',
    'rawPrompt',
    'rawResponse',
    'customInstructions',
    'proofNotes',
    'reviewNotes',
    'fileContent',
    'storagePath',
    'storage_path',
    'signedUrl',
    'signed_url',
    'cardNumber',
    'cvv'
  ]
} as const;

export function isSafeLogField(field: string): boolean {
  const lowerField = field.toLowerCase();
  
  // Explicitly check forbidden keywords
  const isForbidden = LOG_POLICY.forbiddenFields.some(f => {
    const lowerForbidden = f.toLowerCase();
    return lowerField.includes(lowerForbidden);
  });
  
  if (isForbidden) return false;

  return LOG_POLICY.allowedFields.includes(field as any) || 
         field.endsWith('Id') || 
         field.endsWith('_id');
}
