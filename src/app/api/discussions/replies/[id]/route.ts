import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { updateOwnReply, softDeleteOwnReply, ReplySchema } from '@/lib/data/discussions';
import { createApiSuccess, createApiError, createApiValidationError, handleApiError } from '@/lib/server/responses';
import { moderateDiscussionContent } from '@/lib/server/content-moderation';

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    const { id } = await ctx.params;
    
    const body = await request.json();
    const parsed = ReplySchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    // Pre-submit content moderation — block before update
    const moderation = moderateDiscussionContent({
      body: parsed.data.body,
      actorRole: appUser.primary_role,
    });

    if (moderation.decision !== 'allow') {
      await logAuditEvent({
        userId: appUser.id,
        action: 'content_moderation_blocked',
        resourceType: 'discussion_replies',
        resourceId: id,
        metadata: { decision: moderation.decision, category: moderation.category ?? 'unknown' },
      });
      return createApiError(moderation.message, 400);
    }

    const reply = await updateOwnReply({
      replyId: id,
      authorId: appUser.id,
      body: parsed.data.body,
    });

    await logAuditEvent({
      userId: appUser.id,
      action: 'reply_edited',
      resourceType: 'discussion_replies',
      resourceId: id,
    });

    return createApiSuccess(reply);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to update reply');
  }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    const { id } = await ctx.params;
    
    const reply = await softDeleteOwnReply({
      replyId: id,
      authorId: appUser.id,
    });

    await logAuditEvent({
      userId: appUser.id,
      action: 'reply_deleted',
      resourceType: 'discussion_replies',
      resourceId: id,
    });

    return createApiSuccess(reply);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to delete reply');
  }
}

