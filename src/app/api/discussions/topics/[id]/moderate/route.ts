import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { moderateTopic } from '@/lib/data/discussions';
import { z } from 'zod';
import { createApiSuccess, createApiValidationError, handleApiError } from '@/lib/server/responses';
import { assertCanModerate } from '@/lib/server/discussion-rules';

const ModerateTopicSchema = z.object({
  action: z.enum(['remove', 'lock']),
  reason: z.string().max(500).optional(),
});

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const appUser = await requireAuth(request);
    assertCanModerate(appUser);
    
    const { id } = await ctx.params;
    
    const body = await request.json();
    const parsed = ModerateTopicSchema.safeParse(body);

    if (!parsed.success) {
      return createApiValidationError(parsed.error);
    }

    const topic = await moderateTopic({
      topicId: id,
      moderatorId: appUser.id,
      action: parsed.data.action,
      reason: parsed.data.reason,
    });

    await logAuditEvent({
      actorUserId: appUser.id,
      eventType: 'topic_moderated',
      entityType: 'discussion_topics',
      entityId: id,
      metadata: { action: parsed.data.action, reason: parsed.data.reason }
    });

    return createApiSuccess(topic);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to moderate topic');
  }
}

