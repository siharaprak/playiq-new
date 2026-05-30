'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Inserts a support ticket record into support_issues.
 */
export async function submitSupportIssue(
  issueText: string
): Promise<ActionResult<{ id: string }>> {
  try {
    if (!issueText || issueText.trim().length < 5) {
      return { ok: false, error: 'Please describe the issue in at least 5 characters.' };
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('support_issues')
      .insert({
        reporter_id: user.id,
        issue_text: issueText.trim(),
        status: 'open',
      })
      .select('id')
      .single();

    if (error || !data) {
      return { ok: false, error: error?.message || 'Failed to submit support ticket.' };
    }

    revalidatePath('/student/home');
    revalidatePath('/admin/support');

    return { ok: true, data: { id: data.id } };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[submitSupportIssue] error:', message);
    return { ok: false, error: message };
  }
}
