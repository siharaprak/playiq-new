import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/permissions';
import { createApiSuccess, handleApiError, createApiError } from '@/lib/server/responses';
import { finalizeProofArtifactUpload } from '@/lib/data/proof-artifacts';
import { logProofEvent } from '@/lib/events/learning-events';
import { checkProofArtifactRateLimit } from '@/lib/proof-artifacts/rate-limit';

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    const { id } = await ctx.params;

    const rateLimit = checkProofArtifactRateLimit(appUser.id, 'finalize');
    if (!rateLimit.allowed) {
      return createApiError(rateLimit.reason || 'Too Many Requests', 429);
    }

    const artifact = await finalizeProofArtifactUpload(appUser.id, id);

    // Log the event
    await logProofEvent({
      studentId: appUser.id,
      eventType: 'proof_submitted',
      submissionId: id,
      artifactType: 'supplemental_proof',
      metadata: {
        moduleId: artifact.module_id,
        mediaKind: artifact.media_kind,
        noFileContentStoredInEvent: true,
      }
    });

    return createApiSuccess({ status: artifact.status });
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to finalize upload');
  }
}
