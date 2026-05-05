import { NextRequest } from 'next/server';
import { requireAuth, logAuditEvent } from '@/lib/auth/permissions';
import { reportDiscussionItem } from '@/lib/data/discussions';
import { createApiSuccess, createApiError, handleApiError } from '@/lib/server/responses';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const appUser = await requireAuth(req);
    const { reason } = await req.json();

    if (!reason || reason.trim() === '') {
      return createApiError('Reason is required', 400);
    }

    const report = await reportDiscussionItem({
      reporterId: appUser.id,
      topicId: id,
      reason,
    });

    await logAuditEvent({
      actorUserId: appUser.id,
      eventType: 'topic_reported',
      entityType: 'discussion_reports',
      entityId: report.id,
      metadata: { topicId: id, reason }
    });

    return createApiSuccess(report);
  } catch (error: unknown) {
    return handleApiError(error, 'Failed to report topic');
  }
}

