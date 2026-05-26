import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/permissions';
import { createApiSuccess, handleApiError } from '@/lib/server/responses';
import { getReviewQueue } from '@/lib/data/proof-artifacts';

export async function GET(request: NextRequest) {
  try {
    const appUser = await requireAuth(request);
    
    if (!appUser.roles.includes('admin') && !appUser.roles.includes('teacher')) {
      throw new Error('Only admins and teachers can view the review queue');
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || undefined;
    const moduleId = searchParams.get('moduleId') || undefined;

    const artifacts = await getReviewQueue({ status, moduleId });

    return createApiSuccess(artifacts);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to fetch review queue');
  }
}
