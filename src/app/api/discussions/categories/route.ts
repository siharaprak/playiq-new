import { requireAuth } from '@/lib/auth/permissions';
import { listDiscussionCategories } from '@/lib/data/discussions';
import { createApiSuccess, handleApiError } from '@/lib/server/responses';

export async function GET(request: Request) {
  try {
    await requireAuth(request);
    const categories = await listDiscussionCategories();
    return createApiSuccess(categories);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to fetch categories');
  }
}

