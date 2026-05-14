import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { createReply, ReplySchema } from '@/lib/data/discussions';
import { createApiSuccess, createApiError, createApiValidationError, handleApiError } from '@/lib/server/responses';
import { assertCanCreateContent } from '@/lib/server/discussion-rules';
import { moderateDiscussionContent } from '@/lib/server/content-moderation';

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

    // Pre-submit content moderation — block before insert
    const moderation = moderateDiscussionContent({
      body: parsed.data.body,
      actorRole: appUser.primary_role,
    });

    if (moderation.decision !== 'allow') {
      await logAuditEvent({
        userId: appUser.id,
        action: 'content_moderation_blocked',
        resourceType: 'discussion_replies',
        resourceId: 'pre_insert',
        metadata: { decision: moderation.decision, category: moderation.category ?? 'unknown', topicId: id },
      });
      return createApiError(moderation.message, 400);
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

