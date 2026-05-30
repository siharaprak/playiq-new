/**
 * Sprint 5C — Proof Artifact Storage Paths
 * 
 * Provides centralized logic for generating, validating, and managing
 * storage paths for proof artifacts.
 */

import { sanitizeAndValidateFileName } from './file-validation';

export const PROOF_ARTIFACT_BUCKET = 'proof-artifacts';

export interface ProofStoragePathInput {
  studentId: string;
  moduleIdOrModuleNumber: string | number;
  artifactId: string;
  fileName: string;
}

/**
 * Validates uuid loosely.
 */
function isUUID(str: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Wrapper for file-validation sanitize to expose unified path API.
 */
export function sanitizeProofFileName(fileName: string) {
  return sanitizeAndValidateFileName(fileName);
}

/**
 * Builds canonical storage path.
 * Format: student/{studentId}/module/{moduleIdOrModuleNumber}/artifact/{artifactId}/{safeFileName}
 */
export function getProofArtifactStoragePath(input: ProofStoragePathInput): { path: string; error?: string } {
  if (!input.studentId || !isUUID(input.studentId)) {
    return { path: '', error: 'studentId must be a valid UUID' };
  }
  
  if (!input.artifactId || !isUUID(input.artifactId)) {
    return { path: '', error: 'artifactId must be a valid UUID' };
  }

  const { safeName, error } = sanitizeProofFileName(input.fileName);
  if (error || !safeName) {
    return { path: '', error };
  }

  // Use lower-case safeName for normalization
  const path = `student/${input.studentId}/module/${input.moduleIdOrModuleNumber}/artifact/${input.artifactId}/${safeName.toLowerCase()}`;
  return { path };
}

/**
 * Validates if an existing path strictly matches the canonical format.
 */
export function assertValidProofStoragePath(path: string): boolean {
  if (!path || path.trim() === '') return false;
  
  // Basic check: starts with student/, has module/, has artifact/
  const parts = path.split('/');
  if (parts.length < 7) return false;
  if (parts[0] !== 'student' || parts[2] !== 'module' || parts[4] !== 'artifact') return false;
  
  const studentId = parts[1];
  const artifactId = parts[5];
  
  if (!isUUID(studentId) || !isUUID(artifactId)) return false;
  
  return true;
}
