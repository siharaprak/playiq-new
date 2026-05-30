'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Resolves an active support issue in the DB.
 */
export async function resolveSupportIssueAction(issueId: string): Promise<ActionResult<void>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { ok: false, error: 'Not authenticated' };

    // Verify admin
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'admin') {
      return { ok: false, error: 'Not authorized. Admin privileges required.' };
    }

    const { error } = await supabase
      .from('support_issues')
      .update({ status: 'resolved' })
      .eq('id', issueId);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/admin/support');
    revalidatePath('/student/home');

    return { ok: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[resolveSupportIssueAction] error:', message);
    return { ok: false, error: message };
  }
}

/**
 * Form action wrapper to resolve support issue.
 */
export async function resolveSupportIssueFormAction(formData: FormData): Promise<void> {
  const issueId = formData.get('issueId') as string;
  if (!issueId) return;
  await resolveSupportIssueAction(issueId);
}

