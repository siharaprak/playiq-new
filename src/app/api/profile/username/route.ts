import { NextRequest } from 'next/server';
import { z } from 'zod';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { updateOwnUsername } from '@/lib/data/profile-identity';
import { createApiSuccess, createApiError, createApiValidationError, handleApiError } from '@/lib/server/responses';

const UpdateUsernameSchema = z.object({
  username: z.string().min(3).max(24),
});

/**
 * PATCH /api/profile/username
 *
 * Allows the authenticated student to set or change their own username.
 * Parent cannot update child username through this route.
 */
export async function PATCH(request: NextRequest) {
  try {
    const appUser = await requireAuth(request);

    // Only students can set their own username through this route
    if (appUser.primary_role === 'parent') {
      return createApiError('Parents cannot set a child\'s public username.', 403);
    }

    const body = await request.json();
    const parsed = UpdateUsernameSchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    const result = await updateOwnUsername(appUser.id, parsed.data.username);

    if (!result.success) {
      return createApiError(result.error!, 400);
    }

    // Audit log — log decision only, NOT the raw username content
    await logAuditEvent({
      userId: appUser.id,
      action: 'username_updated',
      resourceType: 'profiles',
      resourceId: appUser.id,
      metadata: { changeNumber: 'incremented' },
    });

    return createApiSuccess({ username: result.username });
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to update username');
  }
}
