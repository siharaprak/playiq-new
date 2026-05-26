import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/permissions';
import { createApiSuccess, createApiValidationError, handleApiError, createApiError } from '@/lib/server/responses';
import { reviewProofArtifact } from '@/lib/data/proof-artifacts';
import { ProofArtifactReviewInputSchema } from '@/lib/proof-artifacts/types';
import { logProofEvent } from '@/lib/events/learning-events';
import { checkProofArtifactRateLimit } from '@/lib/proof-artifacts/rate-limit';

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    
    if (!appUser.roles.includes('admin') && !appUser.roles.includes('teacher')) {
      throw new Error('Only admins and teachers can review proof artifacts');
    }

    const { id } = await ctx.params;
    
    const body = await request.json();
    const parsed = ProofArtifactReviewInputSchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    const rateLimit = checkProofArtifactRateLimit(appUser.id, 'review');
    if (!rateLimit.allowed) {
      return createApiError(rateLimit.reason || 'Too Many Requests', 429);
    }

    const artifact = await reviewProofArtifact(appUser.id, id, parsed.data);

    // Log the event
    await logProofEvent({
      studentId: artifact.student_id,
      eventType: 'proof_reviewed',
      submissionId: id,
      artifactType: 'supplemental_proof',
      metadata: {
        moduleId: artifact.module_id,
        mediaKind: artifact.media_kind,
        status: parsed.data.status,
        reviewerId: appUser.id,
        noFileContentStoredInEvent: true,
      }
    });

    return createApiSuccess(artifact);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to review artifact');
  }
}
