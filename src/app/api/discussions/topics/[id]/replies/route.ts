import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { createReply, ReplySchema } from '@/lib/data/discussions';
import { createApiSuccess, createApiValidationError, handleApiError } from '@/lib/server/responses';
import { assertCanCreateContent } from '@/lib/server/discussion-rules';

export async function POST(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    const { id } = await ctx.params;
    
    assertCanCreateContent(appUser);

    const body = await request.json();
    const parsed = ReplySchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    const reply = await createReply({
      topicId: id,
      authorId: appUser.id,
      body: parsed.data.body,
    });

    await logAuditEvent({
      userId: appUser.id,
      action: 'reply_created',
      resourceType: 'discussion_replies',
      resourceId: reply.id,
      metadata: { topicId: id }
    });

    return createApiSuccess(reply);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to create reply');
  }
}

