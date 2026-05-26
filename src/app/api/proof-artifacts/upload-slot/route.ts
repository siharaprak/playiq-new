import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/permissions';
import { createApiSuccess, createApiValidationError, handleApiError, createApiError } from '@/lib/server/responses';
import { ProofArtifactUploadSlotInputSchema } from '@/lib/proof-artifacts/types';
import { createProofArtifactDraft } from '@/lib/data/proof-artifacts';
import { checkProofArtifactRateLimit } from '@/lib/proof-artifacts/rate-limit';
import { validateProofUploadRequest } from '@/lib/proof-artifacts/file-validation';

export async function POST(request: NextRequest) {
  try {
    const appUser = await requireAuth(request);
    
    // Only students should upload proof artifacts
    if (!appUser.roles.includes('student')) {
      throw new Error('Only students can upload proof artifacts');
    }

    const body = await request.json();
    const parsed = ProofArtifactUploadSlotInputSchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    const rateLimit = checkProofArtifactRateLimit(appUser.id, 'upload-slot');
    if (!rateLimit.allowed) {
      return createApiError(rateLimit.reason || 'Too Many Requests', 429);
    }

    const valResult = validateProofUploadRequest({
      fileName: parsed.data.fileName,
      fileSizeBytes: parsed.data.fileSizeBytes,
      mimeType: parsed.data.mimeType,
      mediaKind: parsed.data.mediaKind
    });

    if (!valResult.valid) {
      return createApiError(valResult.error || 'Invalid upload parameters', 400);
    }

    const result = await createProofArtifactDraft(appUser.id, parsed.data);
    
    return createApiSuccess(result);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to create upload slot');
  }
}
