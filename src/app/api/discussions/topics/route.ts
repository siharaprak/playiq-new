import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { listTopics, createTopic, TopicSchema } from '@/lib/data/discussions';
import { z } from 'zod';
import { createApiSuccess, createApiError, createApiValidationError, handleApiError } from '@/lib/server/responses';
import { parsePaginationParams } from '@/lib/server/pagination';
import { assertCanCreateContent } from '@/lib/server/discussion-rules';
import { moderateDiscussionContent } from '@/lib/server/content-moderation';

export async function GET(request: NextRequest) {
  try {
    await requireAuth(request);
    
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const { page, pageSize } = parsePaginationParams(searchParams);

    if (!categoryId) {
      return createApiError('categoryId is required', 400);
    }

    const data = await listTopics({ categoryId, page, pageSize });
    return createApiSuccess(data);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to list topics');
  }
}

const CreateTopicSchema = z.object({
  categoryId: z.string().uuid(),
}).merge(TopicSchema);

export async function POST(request: NextRequest) {
  try {
    const appUser = await requireAuth(request);
    assertCanCreateContent(appUser);

    const body = await request.json();
    const parsed = CreateTopicSchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    // Pre-submit content moderation — block before insert
    const moderation = moderateDiscussionContent({
      title: parsed.data.title,
      body: parsed.data.body,
      actorRole: appUser.primary_role,
    });

    if (moderation.decision !== 'allow') {
      // Log category/decision only — never raw offensive content
      await logAuditEvent({
        userId: appUser.id,
        action: 'content_moderation_blocked',
        resourceType: 'discussion_topics',
        resourceId: 'pre_insert',
        metadata: { decision: moderation.decision, category: moderation.category ?? 'unknown' },
      });
      return createApiError(moderation.message, 400);
    }

    const topic = await createTopic({
      categoryId: parsed.data.categoryId,
      authorId: appUser.id,
      title: parsed.data.title,
      body: parsed.data.body,
    });

    await logAuditEvent({
      userId: appUser.id,
      action: 'topic_created',
      resourceType: 'discussion_topics',
      resourceId: topic.id,
      metadata: { categoryId: parsed.data.categoryId }
    });

    return createApiSuccess(topic);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to create topic');
  }
}

