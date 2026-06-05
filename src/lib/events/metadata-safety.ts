export const ALLOWED_AI_METADATA_KEYS = new Set([
  'mode',
  'moduleNumber',
  'nodeId',
  'pageType',
  'hintLevel',
  'retryCount',
  'refusalReason',
  'routingTarget',
  'effortRequired',
  'teachBackRequired',
  'confusionType',
  'noPromptStored',
  'noResponseStored',
  'source',
  'noFileContentStoredInEvent',
  'integrityAction'
]);

export function hasForbiddenAiMetadataKeys(metadata: Record<string, unknown> | null | undefined): boolean {
  if (!metadata) return false;
  return Object.keys(metadata).some(key => !ALLOWED_AI_METADATA_KEYS.has(key));
}

export function sanitizeAiEventMetadata(metadata: Record<string, unknown> | null | undefined): Record<string, unknown> {
  if (!metadata) return {};
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(metadata)) {
    if (ALLOWED_AI_METADATA_KEYS.has(key)) {
      sanitized[key] = value;
    }
  }

  // Inject audit markers if we stripped something
  if (Object.keys(metadata).length > Object.keys(sanitized).length) {
    sanitized['noPromptStored'] = true;
    sanitized['noResponseStored'] = true;
  }

  return sanitized;
}

export function assertSafeAiEventMetadata(metadata: Record<string, unknown> | null | undefined): void {
  if (hasForbiddenAiMetadataKeys(metadata)) {
    throw new Error('Unsafe AI metadata detected. Forbidden keys must be stripped before logging.');
  }
}
