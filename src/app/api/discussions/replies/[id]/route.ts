import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { updateOwnReply, softDeleteOwnReply, ReplySchema } from '@/lib/data/discussions';
import { createApiSuccess, createApiValidationError, handleApiError } from '@/lib/server/responses';

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    const { id } = await ctx.params;
    
    const body = await request.json();
    const parsed = ReplySchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    const reply = await updateOwnReply({
      replyId: id,
      authorId: appUser.id,
      body: parsed.data.body,
    });

    await logAuditEvent({
      actorUserId: appUser.id,
      eventType: 'reply_edited',
      entityType: 'discussion_replies',
      entityId: id,
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
      actorUserId: appUser.id,
      eventType: 'reply_deleted',
      entityType: 'discussion_replies',
      entityId: id,
    });

    return createApiSuccess(reply);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to delete reply');
  }
}

