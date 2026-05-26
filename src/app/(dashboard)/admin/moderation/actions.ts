'use server';

import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { moderateTopic, moderateReply } from '@/lib/data/discussions';
import { revalidatePath } from 'next/cache';

/**
 * Helper to assert that the current user has the admin role.
 */
async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthenticated');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    throw new Error('Unauthorized: Admin access required');
  }

  return user;
}

/**
 * Dismisses a report from the moderation queue.
 */
export async function dismissReportAction(reportId: string) {
  try {
    await assertAdmin();

    const { error } = await supabaseAdmin
      .from('discussion_reports')
      .delete()
      .eq('id', reportId);

    if (error) {
      throw new Error(`Failed to dismiss report: ${error.message}`);
    }

    revalidatePath('/admin/moderation');
    revalidatePath('/admin/home');
    return { success: true };
  } catch (err: any) {
    console.error('dismissReportAction error:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Moderates and removes reported content from discussions, and clears related reports.
 */
export async function removeContentAction(
  itemId: string,
  itemType: 'topic' | 'reply',
  reason: string
) {
  try {
    const user = await assertAdmin();

    if (!reason || reason.trim() === '') {
      throw new Error('A removal reason is required.');
    }

    if (itemType === 'topic') {
      // Mark topic as removed
      await moderateTopic({
        topicId: itemId,
        moderatorId: user.id,
        action: 'remove',
        reason,
      });

      // Clear all reports for this topic
      await supabaseAdmin
        .from('discussion_reports')
        .delete()
        .eq('topic_id', itemId);
    } else {
      // Mark reply as removed
      await moderateReply({
        replyId: itemId,
        moderatorId: user.id,
        action: 'remove',
        reason,
      });

      // Clear all reports for this reply
      await supabaseAdmin
        .from('discussion_reports')
        .delete()
        .eq('reply_id', itemId);
    }

    revalidatePath('/admin/moderation');
    revalidatePath('/admin/home');
    return { success: true };
  } catch (err: any) {
    console.error('removeContentAction error:', err);
    return { success: false, error: err.message };
  }
}
