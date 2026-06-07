// src/lib/uploads/upload-abuse-policy.ts
//
// Sprint 9B: Upload Abuse and File Validation Policy
// Server-side rules to prevent path traversal, double extensions, and execution attacks.
//

export const FORBIDDEN_EXTENSIONS = [
  'exe', 'bat', 'cmd', 'com', 'msi', 'scr', 'pif',
  'js', 'vbs', 'wsf', 'ps1', 'sh', 'bash', 'dll', 'sys',
  'drv', 'html', 'htm', 'svg', 'php', 'asp', 'jsp', 'py', 'pl'
];

export const UPLOAD_ABUSE_POLICY = {
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
  maxFilesPerEntity: 5,
  forbiddenExtensions: FORBIDDEN_EXTENSIONS,
  allowedMimes: [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg'
  ],
} as const;

export function getUploadLimitForKind(kind: string): number {
  // Bounded size limit per upload category
  if (kind === 'video') return 50 * 1024 * 1024; // 50MB
  if (kind === 'audio') return 10 * 1024 * 1024; // 10MB
  return UPLOAD_ABUSE_POLICY.maxSizeBytes;
}

export function getMaxFilesForEntity(entityType: string): number {
  return UPLOAD_ABUSE_POLICY.maxFilesPerEntity;
}

/**
 * Validates file names against traversals, control characters, null bytes,
 * forbidden extensions, and double extension masking attacks.
 */
export function isDangerousUploadName(fileName: string): { dangerous: boolean; reason?: string } {
  if (!fileName || fileName.trim() === '') {
    return { dangerous: true, reason: 'Filename cannot be empty' };
  }

  // 1. Path traversal checks
  if (fileName.includes('/') || fileName.includes('\\') || fileName.includes('..') || fileName.includes('./')) {
    return { dangerous: true, reason: 'Path traversal sequence detected' };
  }

  // 2. Control characters & Null byte checks
  if (/[\x00-\x1f\x7f-\x9f]/.test(fileName) || fileName.includes('\0')) {
    return { dangerous: true, reason: 'Control characters or null bytes detected' };
  }

  const parts = fileName.toLowerCase().split('.');
  if (parts.length < 2) {
    return { dangerous: true, reason: 'Missing file extension' };
  }

  // 3. Double extension check & direct block checks
  for (let i = 1; i < parts.length; i++) {
    const ext = parts[i].trim();
    if (FORBIDDEN_EXTENSIONS.includes(ext)) {
      return { dangerous: true, reason: `Forbidden extension (.${ext}) found in file sequence` };
    }
  }

  return { dangerous: false };
}

export const EXTENSION_MIME_MAP: Record<string, string[]> = {
  pdf: ['application/pdf'],
  txt: ['text/plain'],
  md: ['text/markdown'],
  docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  png: ['image/png'],
  jpg: ['image/jpeg'],
  jpeg: ['image/jpeg'],
};

export function classifyUploadAbuseRisk(input: {
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
}): { safe: boolean; reason?: string } {
  const nameCheck = isDangerousUploadName(input.fileName);
  if (nameCheck.dangerous) {
    return { safe: false, reason: nameCheck.reason };
  }

  if (input.fileSizeBytes > UPLOAD_ABUSE_POLICY.maxSizeBytes) {
    return { safe: false, reason: 'File size exceeds allowed limit' };
  }

  if (!(UPLOAD_ABUSE_POLICY.allowedMimes as readonly string[]).includes(input.mimeType)) {
    return { safe: false, reason: 'Unsupported file MIME type' };
  }

  // Prevent MIME mismatch attacks
  const parts = input.fileName.toLowerCase().split('.');
  const ext = parts[parts.length - 1].trim();
  const expectedMimes = EXTENSION_MIME_MAP[ext];
  if (expectedMimes && !expectedMimes.includes(input.mimeType)) {
    return { safe: false, reason: `MIME type mismatch: extension .${ext} does not match MIME ${input.mimeType}` };
  }

  return { safe: true };
}

export function getUploadAbuseMessage(reason: string): string {
  return `Upload blocked: ${reason || 'security policy violation'}.`;
}

