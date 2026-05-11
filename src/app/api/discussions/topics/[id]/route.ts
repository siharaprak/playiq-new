import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { getTopicWithReplies, updateOwnTopic, softDeleteOwnTopic, TopicSchema } from '@/lib/data/discussions';
import { createApiSuccess, createApiValidationError, handleApiError } from '@/lib/server/responses';

export async function GET(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAuth(request);
    const { id } = await ctx.params;
    const data = await getTopicWithReplies(id);
    return createApiSuccess(data);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to fetch topic');
  }
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    const { id } = await ctx.params;
    
    const body = await request.json();
    const parsed = TopicSchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    const topic = await updateOwnTopic({
      topicId: id,
      authorId: appUser.id,
      title: parsed.data.title,
      body: parsed.data.body,
    });

    await logAuditEvent({
      userId: appUser.id,
      action: 'topic_edited',
      resourceType: 'discussion_topics',
      resourceId: id,
    });

    return createApiSuccess(topic);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to update topic');
  }
}

export async function DELETE(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    const { id } = await ctx.params;
    
    const topic = await softDeleteOwnTopic({
      topicId: id,
      authorId: appUser.id,
    });

    await logAuditEvent({
      userId: appUser.id,
      action: 'topic_deleted',
      resourceType: 'discussion_topics',
      resourceId: id,
    });

    return createApiSuccess(topic);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to delete topic');
  }
}

