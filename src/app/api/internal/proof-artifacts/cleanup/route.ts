import { NextRequest } from 'next/server';
import { createApiSuccess, handleApiError, createApiError } from '@/lib/server/responses';
import { cleanupExpiredDraftArtifacts } from '@/lib/proof-artifacts/cleanup';

export async function POST(request: NextRequest) {
  try {
    const cronSecret = process.env.PROOF_CLEANUP_CRON_SECRET;
    
    if (!cronSecret) {
      return createApiError('Cron secret not configured', 503);
    }

    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${cronSecret}`) {
      return createApiError('Unauthorized', 401);
    }

    let dryRun = true;
    let olderThanHours = 24;

    try {
      const body = await request.json();
      if (typeof body.dryRun === 'boolean') {
        dryRun = body.dryRun;
      }
      if (typeof body.olderThanHours === 'number') {
        olderThanHours = body.olderThanHours;
      }
    } catch {
      // Body is optional, defaults remain
    }

    const result = await cleanupExpiredDraftArtifacts(dryRun, olderThanHours);
    
    return createApiSuccess(result);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to run cleanup cron');
  }
}
