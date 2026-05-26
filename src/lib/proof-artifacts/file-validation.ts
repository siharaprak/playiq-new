/**
 * Sprint 5C — File Validation Hardening
 * 
 * Provides robust validation for filenames, extensions, limits, and sizes
 * before allowing upload slots to be generated or processed.
 */
import { ALLOWED_PHOTO_MIMES, ALLOWED_DOCUMENT_MIMES, ALLOWED_AUDIO_MIMES, ALLOWED_VIDEO_MIMES, MAX_PHOTO_SIZE_BYTES, MAX_DOCUMENT_SIZE_BYTES, MAX_AUDIO_SIZE_BYTES, MAX_VIDEO_SIZE_BYTES } from './types';

export const PROOF_ALLOWED_MIME_TYPES = {
  photo: ALLOWED_PHOTO_MIMES,
  document: ALLOWED_DOCUMENT_MIMES,
  audio: ALLOWED_AUDIO_MIMES,
  video: ALLOWED_VIDEO_MIMES,
};

export const PROOF_FILE_SIZE_LIMITS = {
  photo: MAX_PHOTO_SIZE_BYTES,
  document: MAX_DOCUMENT_SIZE_BYTES,
  audio: MAX_AUDIO_SIZE_BYTES,
  video: MAX_VIDEO_SIZE_BYTES,
};

export const FORBIDDEN_EXTENSIONS = new Set([
  'exe', 'bat', 'cmd', 'js', 'scr', 'vbs', 'jar', 'ps1', 'msi', 'sh', 'php', 'py', 'html', 'htm'
]);

// Map mediaKind to valid extensions to catch egregious mismatches
export const PROOF_ALLOWED_EXTENSIONS = {
  photo: new Set(['jpeg', 'jpg', 'png', 'webp']),
  document: new Set(['pdf', 'doc', 'docx']),
  audio: new Set(['mp3', 'mp4', 'wav', 'webm', 'm4a']),
  video: new Set(['mp4', 'webm', 'mov', 'quicktime'])
};

export function detectDangerousFileName(fileName: string): { dangerous: boolean; reason?: string } {
  if (!fileName || fileName.trim() === '') {
    return { dangerous: true, reason: 'Filename cannot be empty' };
  }

  // Path traversal check
  if (fileName.includes('/') || fileName.includes('\\')) {
    return { dangerous: true, reason: 'Path traversal characters detected' };
  }

  const parts = fileName.toLowerCase().split('.');
  if (parts.length < 2) {
    return { dangerous: true, reason: 'Missing file extension' };
  }

  const finalExt = parts[parts.length - 1];

  if (FORBIDDEN_EXTENSIONS.has(finalExt)) {
    return { dangerous: true, reason: `Executable/forbidden extension (.${finalExt})` };
  }

  // Check for disguised dangerous extensions like proof.pdf.exe
  if (parts.length > 2) {
    // If the file is a.b.c, 'c' is already checked. But what if it's recording.mp4.js?
    // We already checked 'js'. What if it's proof.exe.pdf? That's technically a pdf, but suspicious.
    // Let's block any part being in the forbidden list just to be safe.
    for (let i = 1; i < parts.length; i++) {
      if (FORBIDDEN_EXTENSIONS.has(parts[i])) {
        return { dangerous: true, reason: `Forbidden extension (.${parts[i]}) embedded in filename` };
      }
    }
  }

  return { dangerous: false };
}

export function sanitizeAndValidateFileName(fileName: string): { safeName: string; error?: string } {
  const { dangerous, reason } = detectDangerousFileName(fileName);
  if (dangerous) {
    return { safeName: '', error: reason };
  }

  let safeName = fileName;
  
  // Replace spaces with hyphens
  safeName = safeName.replace(/\s+/g, '-');

  // Strip anything that is not alphanumeric, dot, hyphen, underscore
  safeName = safeName.replace(/[^a-zA-Z0-9._-]/g, '');

  return { safeName };
}

export function validateProofMimeAndExtension(input: { fileName: string; mimeType: string; mediaKind: 'photo' | 'document' | 'audio' | 'video' }): { valid: boolean; error?: string } {
  const allowedMimes = PROOF_ALLOWED_MIME_TYPES[input.mediaKind];
  if (!allowedMimes.includes(input.mimeType)) {
    return { valid: false, error: `Unsupported MIME type for ${input.mediaKind}` };
  }

  const parts = input.fileName.toLowerCase().split('.');
  const ext = parts[parts.length - 1];

  const allowedExts = PROOF_ALLOWED_EXTENSIONS[input.mediaKind];
  if (!allowedExts.has(ext)) {
    // Note: Some MIME/extension combos are tricky (e.g. quicktime vs .mov), but our sets cover the common cases.
    return { valid: false, error: `Unsupported file extension (.${ext}) for ${input.mediaKind}` };
  }

  return { valid: true };
}

export function validateProofFileSize(input: { fileSizeBytes: number; mediaKind: 'photo' | 'document' | 'audio' | 'video' }): { valid: boolean; error?: string } {
  if (input.fileSizeBytes <= 0) {
    return { valid: false, error: 'File size must be greater than 0' };
  }

  const limit = PROOF_FILE_SIZE_LIMITS[input.mediaKind];
  if (input.fileSizeBytes > limit) {
    return { valid: false, error: `File size exceeds ${limit / (1024 * 1024)}MB limit for ${input.mediaKind}` };
  }

  return { valid: true };
}

export function validateProofUploadRequest(input: {
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  mediaKind: 'photo' | 'document' | 'audio' | 'video';
}): { valid: boolean; error?: string; safeFileName?: string } {
  
  const { safeName, error: nameError } = sanitizeAndValidateFileName(input.fileName);
  if (nameError || !safeName) {
    return { valid: false, error: nameError };
  }

  const sizeCheck = validateProofFileSize({ fileSizeBytes: input.fileSizeBytes, mediaKind: input.mediaKind });
  if (!sizeCheck.valid) {
    return { valid: false, error: sizeCheck.error };
  }

  const mimeCheck = validateProofMimeAndExtension({ fileName: safeName, mimeType: input.mimeType, mediaKind: input.mediaKind });
  if (!mimeCheck.valid) {
    return { valid: false, error: mimeCheck.error };
  }

  return { valid: true, safeFileName: safeName };
}
