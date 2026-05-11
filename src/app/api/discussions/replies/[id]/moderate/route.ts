import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { moderateReply } from '@/lib/data/discussions';
import { z } from 'zod';
import { createApiSuccess, createApiValidationError, handleApiError } from '@/lib/server/responses';
import { assertCanModerate } from '@/lib/server/discussion-rules';

const ModerateReplySchema = z.object({
  action: z.literal('remove'),
  reason: z.string().max(500).optional(),
});

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    assertCanModerate(appUser);
    
    const { id } = await ctx.params;
    
    const body = await request.json();
    const parsed = ModerateReplySchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    const reply = await moderateReply({
      replyId: id,
      moderatorId: appUser.id,
      action: parsed.data.action,
      reason: parsed.data.reason,
    });

    await logAuditEvent({
      userId: appUser.id,
      action: 'reply_moderated',
      resourceType: 'discussion_replies',
      resourceId: id,
      metadata: { action: parsed.data.action, reason: parsed.data.reason }
    });

    return createApiSuccess(reply);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to moderate reply');
  }
}

