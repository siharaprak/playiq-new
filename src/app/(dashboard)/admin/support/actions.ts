'use server';

import { revalidatePath } from 'next/cache';
import { resolveSupportIssue } from '@/lib/data/admin-support';
import { supabaseAdmin } from '@/lib/supabase/admin';

type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Resolves an active support issue in the DB.
 */
export async function resolveSupportIssueAction(
  issueId: string,
  notes?: string
): Promise<ActionResult<void>> {
  const result = await resolveSupportIssue(issueId, notes || 'Resolved via Admin Console', supabaseAdmin);
  if (!result.ok) {
    return { ok: false, error: result.error || 'Failed to resolve ticket' };
  }

  revalidatePath('/admin/support');
  revalidatePath('/student/home');

  return { ok: true, data: undefined };
}

/**
 * Form action wrapper to resolve support issue.
 */
export async function resolveSupportIssueFormAction(formData: FormData): Promise<void> {
  const issueId = formData.get('issueId') as string;
  if (!issueId) return;
  await resolveSupportIssueAction(issueId);
}
