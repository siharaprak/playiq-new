import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { togglePinTopic } from '@/lib/data/discussions';
import { createApiSuccess, createApiError, handleApiError } from '@/lib/server/responses';
import { assertCanModerate } from '@/lib/server/discussion-rules';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appUser = await requireAuth(req);
    assertCanModerate(appUser);
    
    const { isPinned } = await req.json();

    if (typeof isPinned !== 'boolean') {
      return createApiError('isPinned must be a boolean', 400);
    }

    const topic = await togglePinTopic({
      topicId: id,
      moderatorId: appUser.id,
      isPinned,
    });

    await logAuditEvent({
      actorUserId: appUser.id,
      eventType: 'topic_pinned_toggled',
      entityType: 'discussion_topics',
      entityId: id,
      metadata: { isPinned }
    });

    return createApiSuccess(topic);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to pin topic');
  }
}

