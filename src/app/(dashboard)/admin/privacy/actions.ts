'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  openDeletionRequest,
  markIdentityVerified,
  disableAccess,
  runPurge,
  markReviewedForRetry,
  DeletionWorkflowError,
} from '@/lib/privacy/deletion';

const PAGE = '/admin/privacy';

/** Server-side admin check, same rule as the rest of /admin. Runs inside every action. */
async function enforceAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: profile } = await supabase.from('profiles').select('role, email').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Not authorized');
  return { id: user.id, email: profile.email || user.email || '' };
}

function done(params: Record<string, string>): never {
  revalidatePath(PAGE);
  redirect(`${PAGE}?${new URLSearchParams(params).toString()}`);
}

function failMessage(err: unknown): string {
  if (err instanceof DeletionWorkflowError) return err.message;
  console.error('[privacy] unexpected deletion workflow error:', err);
  return 'Unexpected error. Check the server logs.';
}

function requestIdFrom(formData: FormData): string {
  const id = String(formData.get('requestId') || '');
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new DeletionWorkflowError('Invalid request id');
  return id;
}

export async function openRequestAction(formData: FormData) {
  const admin = await enforceAdmin();
  let id: string;
  try {
    const relationship = String(formData.get('requesterRelationship') || 'other');
    id = await openDeletionRequest({
      subject: String(formData.get('subject') || ''),
      requesterEmail: String(formData.get('requesterEmail') || ''),
      requesterRelationship: (['parent', 'account_holder', 'admin_initiated', 'other'].includes(relationship)
        ? relationship
        : 'other') as 'parent' | 'account_holder' | 'admin_initiated' | 'other',
      notes: String(formData.get('notes') || ''),
      createdBy: admin.id,
    });
  } catch (err) {
    done({ error: failMessage(err) });
  }
  done({ msg: 'Deletion request opened', focus: id });
}

export async function verifyIdentityAction(formData: FormData) {
  const admin = await enforceAdmin();
  let id = '';
  try {
    id = requestIdFrom(formData);
    await markIdentityVerified(id, String(formData.get('method') || ''), admin.id);
  } catch (err) {
    done({ error: failMessage(err), focus: id });
  }
  done({ msg: 'Identity marked as verified', focus: id });
}

export async function disableAccessAction(formData: FormData) {
  await enforceAdmin();
  let id = '';
  try {
    id = requestIdFrom(formData);
    await disableAccess(id);
  } catch (err) {
    done({ error: failMessage(err), focus: id });
  }
  done({ msg: 'Access disabled: login blocked and profile suspended', focus: id });
}

export async function runPurgeAction(formData: FormData) {
  await enforceAdmin();
  let id = '';
  let result: Awaited<ReturnType<typeof runPurge>>;
  try {
    id = requestIdFrom(formData);
    if (String(formData.get('confirm') || '') !== 'DELETE') {
      throw new DeletionWorkflowError('Type DELETE to confirm the permanent purge');
    }
    result = await runPurge(id);
  } catch (err) {
    done({ error: failMessage(err), focus: id });
  }
  // redirect() throws, so it must stay outside the try block above
  if (result.status !== 'completed') {
    done({ error: `Purge stopped at the ${result.failed_stage} stage: ${result.failure_detail}`, focus: id });
  }
  done({ msg: 'Deletion completed', focus: id });
}

export async function markReviewedAction(formData: FormData) {
  const admin = await enforceAdmin();
  let id = '';
  try {
    id = requestIdFrom(formData);
    await markReviewedForRetry(id, String(formData.get('reviewNote') || ''), admin.email);
  } catch (err) {
    done({ error: failMessage(err), focus: id });
  }
  done({ msg: 'Marked as reviewed. Retry is now allowed and will re-run all safety checks.', focus: id });
}
