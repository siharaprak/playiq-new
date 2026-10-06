import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, AlertTriangle, CheckCircle2, Clock, FileSearch } from 'lucide-react';
import {
  listDeletionRequests,
  inventoryUserStorage,
  ACCESS_DISABLE_TARGET_HOURS,
  COMPLETION_TARGET_DAYS,
  type DeletionRequest,
} from '@/lib/privacy/deletion';
import { openRequestAction, verifyIdentityAction, disableAccessAction, runPurgeAction, markReviewedAction } from './actions';

export const dynamic = 'force-dynamic';

const STAGES: { key: string; label: string; at: keyof DeletionRequest }[] = [
  { key: 'requested', label: 'Requested', at: 'requested_at' },
  { key: 'identity_verified', label: 'Identity verified', at: 'identity_verified_at' },
  { key: 'access_disabled', label: 'Access disabled', at: 'access_disabled_at' },
  { key: 'storage_purged', label: 'Files deleted', at: 'storage_purged_at' },
  { key: 'database_purged', label: 'Records deleted', at: 'database_purged_at' },
  { key: 'auth_deleted', label: 'Login deleted', at: 'auth_deleted_at' },
  { key: 'completed', label: 'Completed', at: 'completed_at' },
];

function fmt(ts: string | null) {
  return ts ? new Date(ts).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) : '';
}

function overdueWarnings(r: DeletionRequest): string[] {
  if (r.status === 'completed') return [];
  const ageMs = Date.now() - new Date(r.requested_at).getTime();
  const warnings: string[] = [];
  if (!r.access_disabled_at && ageMs > ACCESS_DISABLE_TARGET_HOURS * 3_600_000) {
    warnings.push(`Access not disabled within ${ACCESS_DISABLE_TARGET_HOURS} hours`);
  }
  if (ageMs > COMPLETION_TARGET_DAYS * 86_400_000) {
    warnings.push(`Not completed within ${COMPLETION_TARGET_DAYS} days`);
  }
  return warnings;
}

const inputClass = 'neon-input w-full !text-xs';
const labelClass = 'block font-mono text-[10px] text-[#00c8ff] uppercase tracking-widest mb-1.5';

export default async function PrivacyDeletionsPage({
  searchParams,
}: {
  searchParams: Promise<{ msg?: string; error?: string; focus?: string; preview?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/admin/login');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') redirect('/login');

  const params = await searchParams;
  const requests = await listDeletionRequests();

  // Read-only dry run: list the files the storage stage would delete
  let preview: { request: DeletionRequest; files: string[]; missingBuckets: string[]; outside: string[] } | null = null;
  let previewError: string | null = null;
  const previewRequest = requests.find((r) => r.id === params.preview);
  if (previewRequest && previewRequest.status !== 'completed') {
    try {
      const inv = await inventoryUserStorage(previewRequest.subject_user_id);
      preview = {
        request: previewRequest,
        files: inv.objects.map((o) => `${o.bucket}/${o.path}`),
        missingBuckets: inv.missingBuckets,
        outside: inv.outsideUserFolders.map((o) => `${o.bucket}/${o.path}`),
      };
    } catch (err) {
      previewError = err instanceof Error ? err.message : 'Preview failed';
    }
  }

  const open = requests.filter((r) => r.status !== 'completed');
  const closed = requests.filter((r) => r.status === 'completed');

  return (
    <div className="min-h-screen bg-[#020617] text-[var(--text-primary)] px-4 sm:px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <Link href="/admin/home" className="flex items-center gap-2 text-slate-500 hover:text-[#00c8ff] font-mono text-xs uppercase tracking-widest transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Admin Home
        </Link>

        <div className="mb-8">
          <p className="font-mono text-[#7b4fce] text-[0.6rem] uppercase tracking-[0.3em] mb-2">&gt; PRIVACY</p>
          <h1 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-widest">Account Deletion Requests</h1>
          <p className="text-slate-400 font-mono text-xs mt-3 leading-relaxed max-w-3xl">
            Every account deletion goes through these steps in order. Files are deleted from storage first; if that
            fails, nothing else is deleted. Internal targets: disable access within {ACCESS_DISABLE_TARGET_HOURS} hours,
            complete within {COMPLETION_TARGET_DAYS} days.
          </p>
        </div>

        {params.msg && (
          <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> {params.msg}
          </div>
        )}
        {params.error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/40 text-red-300 font-mono text-xs flex gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {params.error}
          </div>
        )}

        {/* Open a new request */}
        <section className="glass-card p-5 sm:p-6 !rounded-none border border-slate-800 mb-10">
          <h2 className="font-display font-bold uppercase tracking-wider text-sm mb-4">Open a request</h2>
          <form action={openRequestAction} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass} htmlFor="subject">Account to delete (email or user ID)</label>
              <input id="subject" name="subject" required className={inputClass} placeholder="child@student.playiq.dev" />
            </div>
            <div>
              <label className={labelClass} htmlFor="requesterEmail">Requester email</label>
              <input id="requesterEmail" name="requesterEmail" type="email" required className={inputClass} placeholder="parent@example.com" />
            </div>
            <div>
              <label className={labelClass} htmlFor="requesterRelationship">Requester is</label>
              <select id="requesterRelationship" name="requesterRelationship" className={inputClass} defaultValue="parent">
                <option value="parent">Parent / guardian</option>
                <option value="account_holder">The account holder</option>
                <option value="admin_initiated">PlayIQ admin</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass} htmlFor="notes">Notes (optional)</label>
              <input id="notes" name="notes" className={inputClass} placeholder="e.g. Email received Oct 6" />
            </div>
            <div className="sm:col-span-2">
              <button id="open-deletion-request" type="submit" className="btn-neon-filled px-6 py-2.5 !rounded-none font-display font-bold uppercase tracking-widest text-xs">
                Open request
              </button>
            </div>
          </form>
        </section>

        {/* Dry-run preview */}
        {(preview || previewError) && (
          <section className="glass-card p-5 sm:p-6 !rounded-none border border-[#00c8ff]/40 mb-10">
            <h2 className="font-display font-bold uppercase tracking-wider text-sm mb-3 flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-[#00c8ff]" /> File preview (nothing deleted)
            </h2>
            {previewError && <p className="text-red-300 font-mono text-xs">{previewError}</p>}
            {preview && (
              <div className="font-mono text-xs space-y-2">
                <p>{preview.request.subject_label || preview.request.subject_user_id}: <strong>{preview.files.length}</strong> file(s) would be deleted.</p>
                {preview.missingBuckets.length > 0 && (
                  <p className="text-slate-500">Buckets not present in this project (nothing to delete there): {preview.missingBuckets.join(', ')}</p>
                )}
                {preview.outside.length > 0 && (
                  <p className="text-amber-300">
                    {preview.outside.length} recorded path(s) are outside this user&apos;s folders. The purge will stop before deleting anything until this is reviewed.
                  </p>
                )}
                {preview.files.length > 0 && (
                  <ul className="max-h-48 overflow-auto bg-black/40 p-3 space-y-1 text-slate-400">
                    {preview.files.map((f) => <li key={f} className="break-all">{f}</li>)}
                  </ul>
                )}
              </div>
            )}
          </section>
        )}

        {/* Open requests */}
        <h2 className="font-display font-bold uppercase tracking-wider text-sm mb-4">Open ({open.length})</h2>
        {open.length === 0 && <p className="text-slate-500 font-mono text-xs mb-10">No open deletion requests.</p>}
        <div className="space-y-6 mb-12">
          {open.map((r) => {
            const warnings = overdueWarnings(r);
            const highlight = params.focus === r.id;
            return (
              <article key={r.id} id={`req-${r.id}`} className={`glass-card p-5 sm:p-6 !rounded-none border ${highlight ? 'border-[#00c8ff]/60' : 'border-slate-800'}`}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="font-display font-bold text-sm">{r.subject_label || r.subject_user_id}</p>
                    <p className="font-mono text-[10px] text-slate-500 mt-1">
                      {r.subject_role || 'unknown role'} · requested by {r.requester_email} ({r.requester_relationship.replace('_', ' ')})
                    </p>
                    {r.notes && <p className="font-mono text-[10px] text-slate-400 mt-1">Note: {r.notes}</p>}
                  </div>
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 border ${r.status === 'failed' ? 'border-red-500/50 text-red-300' : 'border-[#7b4fce]/50 text-[#b794f4]'}`}>
                    {r.status.replace(/_/g, ' ')}
                  </span>
                </div>

                {warnings.map((w) => (
                  <p key={w} className="mb-3 font-mono text-[11px] text-amber-300 flex gap-2"><Clock className="w-3.5 h-3.5" /> Overdue: {w}</p>
                ))}

                {/* Stage timeline */}
                <ol className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-5">
                  {STAGES.map((s) => {
                    const at = r[s.at] as string | null;
                    return (
                      <li key={s.key} className={`p-2 border font-mono text-[10px] ${at ? 'border-emerald-500/40 text-emerald-300' : 'border-slate-800 text-slate-600'}`}>
                        <p className="uppercase tracking-wider">{s.label}</p>
                        <p className="mt-1 text-[9px] text-slate-500">{fmt(at)}</p>
                      </li>
                    );
                  })}
                </ol>

                {r.status === 'failed' && (
                  <div className="mb-5 p-3 bg-red-900/20 border border-red-500/40 font-mono text-[11px] text-red-300 space-y-1">
                    <p className="flex gap-2"><ShieldAlert className="w-4 h-4" /> Failed at the {r.failed_stage} stage ({fmt(r.failed_at)}), attempt {r.failure_count}</p>
                    <p className="break-words">{r.failure_detail}</p>
                    <p>{r.retryable ? 'Safe to retry: it resumes from the failed stage.' : 'Not retryable: needs manual review first.'}</p>
                  </div>
                )}

                {/* Next action */}
                <div className="flex flex-wrap gap-3 items-end">
                  {r.status === 'requested' && (
                    <form action={verifyIdentityAction} className="flex flex-wrap gap-2 items-end">
                      <input type="hidden" name="requestId" value={r.id} />
                      <div>
                        <label className={labelClass} htmlFor={`method-${r.id}`}>How was the requester verified?</label>
                        <input id={`method-${r.id}`} name="method" required className={`${inputClass} min-w-[280px]`} placeholder="Request came from the parent account's email address" />
                      </div>
                      <button type="submit" className="px-4 py-2 border border-[#00c8ff]/50 text-[#00c8ff] font-mono text-xs uppercase tracking-widest hover:bg-[#00c8ff]/10">
                        Mark identity verified
                      </button>
                    </form>
                  )}

                  {r.status === 'identity_verified' && (
                    <form action={disableAccessAction}>
                      <input type="hidden" name="requestId" value={r.id} />
                      <button type="submit" className="px-4 py-2 border border-amber-500/50 text-amber-300 font-mono text-xs uppercase tracking-widest hover:bg-amber-500/10">
                        Disable access (block login)
                      </button>
                    </form>
                  )}

                  {['access_disabled', 'purge_in_progress', 'storage_purged', 'database_purged', 'auth_deleted', 'failed'].includes(r.status) && (r.status !== 'failed' || r.retryable) && (
                    <form action={runPurgeAction} className="flex flex-wrap gap-2 items-end">
                      <input type="hidden" name="requestId" value={r.id} />
                      <div>
                        <label className={labelClass} htmlFor={`confirm-${r.id}`}>Type DELETE to confirm</label>
                        <input id={`confirm-${r.id}`} name="confirm" required autoComplete="off" className={`${inputClass} w-32`} />
                      </div>
                      <button type="submit" className="px-4 py-2 border border-red-500/50 text-red-300 font-mono text-xs uppercase tracking-widest hover:bg-red-500/10">
                        {r.status === 'access_disabled' ? 'Permanently delete data' : 'Retry / resume deletion'}
                      </button>
                    </form>
                  )}

                  {r.status === 'failed' && r.retryable === false && (
                    <form action={markReviewedAction} className="flex flex-wrap gap-2 items-end">
                      <input type="hidden" name="requestId" value={r.id} />
                      <div>
                        <label className={labelClass} htmlFor={`review-${r.id}`}>What was reviewed or fixed?</label>
                        <input id={`review-${r.id}`} name="reviewNote" required className={`${inputClass} min-w-[280px]`} placeholder="Moved the stray file into the student's folder" />
                      </div>
                      <button type="submit" className="px-4 py-2 border border-amber-500/50 text-amber-300 font-mono text-xs uppercase tracking-widest hover:bg-amber-500/10">
                        Mark reviewed, allow retry
                      </button>
                    </form>
                  )}

                  <Link href={`/admin/privacy?preview=${r.id}`} className="px-4 py-2 border border-slate-700 text-slate-400 font-mono text-xs uppercase tracking-widest hover:border-[#00c8ff]/50 hover:text-[#00c8ff]">
                    Preview files
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Completed */}
        <h2 className="font-display font-bold uppercase tracking-wider text-sm mb-4">Completed ({closed.length})</h2>
        {closed.length === 0 && <p className="text-slate-500 font-mono text-xs">None yet.</p>}
        {closed.length > 0 && (
          <div className="overflow-x-auto border border-slate-800">
            <table className="w-full font-mono text-[11px]">
              <thead className="text-left text-slate-500 uppercase tracking-widest">
                <tr>
                  <th className="p-3">Deleted user ID</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Requested by</th>
                  <th className="p-3">Requested</th>
                  <th className="p-3">Completed</th>
                  <th className="p-3">Files</th>
                </tr>
              </thead>
              <tbody>
                {closed.map((r) => (
                  <tr key={r.id} className="border-t border-slate-800 text-slate-400">
                    <td className="p-3 break-all">{r.subject_user_id}</td>
                    <td className="p-3">{r.subject_role}</td>
                    <td className="p-3">{r.requester_email}</td>
                    <td className="p-3">{fmt(r.requested_at)}</td>
                    <td className="p-3">{fmt(r.completed_at)}</td>
                    <td className="p-3">{r.storage_objects_deleted ?? 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
