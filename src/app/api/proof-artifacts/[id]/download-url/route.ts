import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/permissions';
import { createApiSuccess, handleApiError, createApiError } from '@/lib/server/responses';
import { createProofArtifactSignedDownloadUrl, getProofArtifactForReviewer } from '@/lib/data/proof-artifacts';
import { checkProofArtifactRateLimit } from '@/lib/proof-artifacts/rate-limit';
import { canActorRequestProofSignedUrl, getSignedAccessDeniedReason } from '@/lib/proof-artifacts/signed-access-policy';

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    const { id } = await ctx.params;

    const rateLimit = checkProofArtifactRateLimit(appUser.id, 'download-url');
    if (!rateLimit.allowed) {
      return createApiError(rateLimit.reason || 'Too Many Requests', 429);
    }

    // Fetch basic info to check permissions
    const artifact = await getProofArtifactForReviewer(id);

    // Use signed-access-policy as the single source of truth
    if (!canActorRequestProofSignedUrl(appUser, artifact)) {
      const reason = getSignedAccessDeniedReason(appUser, artifact);
      return createApiError(reason, 403);
    }

    const url = await createProofArtifactSignedDownloadUrl(id);

    return createApiSuccess({ url });
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to get download URL');
  }
}
