import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth/permissions';
import { validateUsername, normalizeUsername, isUsernameAvailable } from '@/lib/data/profile-identity';
import { createApiSuccess, createApiError, handleApiError } from '@/lib/server/responses';

/**
 * GET /api/profile/username/check?username=xxx
 *
 * Checks if a username is available and valid.
 * Authenticated users only.
 */
export async function GET(request: NextRequest) {
  try {
    const appUser = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const raw = searchParams.get('username');

    if (!raw) {
      return createApiError('username parameter is required', 400);
    }

    const normalized = normalizeUsername(raw);

    // Validate format
    const validation = validateUsername(normalized);
    if (!validation.valid) {
      return createApiSuccess({ available: false, valid: false, error: validation.error });
    }

    // Check availability (exclude current user so they can keep their own)
    const available = await isUsernameAvailable(normalized, appUser.id);

    return createApiSuccess({ available, valid: true, username: normalized });
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to check username');
  }
}
