import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/permissions';
import { createApiSuccess, handleApiError } from '@/lib/server/responses';
import { getStudentProofArtifacts } from '@/lib/data/proof-artifacts';

export async function GET(request: NextRequest) {
  try {
    const appUser = await requireAuth(request);
    const searchParams = request.nextUrl.searchParams;
    const moduleId = searchParams.get('moduleId') || undefined;

    const artifacts = await getStudentProofArtifacts(appUser.id, moduleId);

    return createApiSuccess(artifacts);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to fetch student artifacts');
  }
}
