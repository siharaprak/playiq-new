import 'server-only';
import { supabaseAdmin } from '@/lib/supabase/admin';

/**
 * Phase 2 privacy remediation: tracked account-deletion lifecycle.
 *
 * requested -> identity_verified -> access_disabled -> purge_in_progress
 *   -> storage_purged -> database_purged -> auth_deleted -> completed
 * Any purge stage can end in `failed` (with stage, detail, retryable flag).
 *
 * Safety rules:
 * - Storage files are deleted explicitly, before any database rows.
 * - If storage deletion fails or cannot be verified, the database and auth
 *   stages do NOT run.
 * - The database stage is one transaction (privacy_purge_user_data) that
 *   verifies nothing is left and rolls back otherwise.
 * - Callers (server actions) must check admin authorization first.
 */

export type DeletionStatus =
  | 'requested'
  | 'identity_verified'
  | 'access_disabled'
  | 'purge_in_progress'
  | 'storage_purged'
  | 'database_purged'
  | 'auth_deleted'
  | 'completed'
  | 'failed';

export type PurgeStage = 'storage' | 'database' | 'auth';

export interface DeletionRequest {
  id: string;
  subject_user_id: string;
  subject_role: string | null;
  subject_label: string | null;
  requester_email: string;
  requester_relationship: string;
  notes: string | null;
  status: DeletionStatus;
  last_completed_stage: string | null;
  identity_verification_method: string | null;
  requested_at: string;
  identity_verified_at: string | null;
  access_disabled_at: string | null;
  purge_started_at: string | null;
  storage_purged_at: string | null;
  database_purged_at: string | null;
  auth_deleted_at: string | null;
  completed_at: string | null;
  failed_at: string | null;
  failed_stage: string | null;
  failure_detail: string | null;
  failure_count: number;
  retryable: boolean | null;
  storage_objects_deleted: number | null;
  database_rows_deleted: Record<string, number> | null;
}

/** Internal response targets shown to admins only (not published). */
export const ACCESS_DISABLE_TARGET_HOURS = 48;
export const COMPLETION_TARGET_DAYS = 30;

const PROOF_BUCKET = 'proof-artifacts';
const KNOWLEDGE_BUCKET = 'knowledge-files';
const PURGE_LEASE_MINUTES = 10;
const BAN_DURATION = '876000h'; // ~100 years: blocks sign-in and token refresh

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export class DeletionWorkflowError extends Error {}

/** A failure that must not be retried automatically (needs a person to look first). */
class NonRetryableError extends DeletionWorkflowError {}

function nowIso() {
  return new Date().toISOString();
}

async function getRequest(requestId: string): Promise<DeletionRequest> {
  const { data, error } = await supabaseAdmin
    .from('deletion_requests')
    .select('*')
    .eq('id', requestId)
    .single();
  if (error || !data) throw new DeletionWorkflowError('Deletion request not found');
  return data as DeletionRequest;
}

async function updateRequest(requestId: string, patch: Record<string, unknown>) {
  const { error } = await supabaseAdmin
    .from('deletion_requests')
    .update({ ...patch, updated_at: nowIso() })
    .eq('id', requestId);
  if (error) throw new DeletionWorkflowError(`Could not update deletion request: ${error.message}`);
}

// ---------------------------------------------------------------------------
// Stage 0: open a request
// ---------------------------------------------------------------------------

export async function openDeletionRequest(input: {
  subject: string; // user id or account email
  requesterEmail: string;
  requesterRelationship: 'parent' | 'account_holder' | 'admin_initiated' | 'other';
  notes?: string;
  createdBy: string;
}): Promise<string> {
  const subject = input.subject.trim();
  if (!subject) throw new DeletionWorkflowError('Enter the account email or user ID to delete');
  if (!input.requesterEmail.trim()) throw new DeletionWorkflowError('Requester email is required');

  const query = supabaseAdmin.from('profiles').select('id, email, full_name, role');
  const { data: profile } = UUID_RE.test(subject)
    ? await query.eq('id', subject).maybeSingle()
    : await query.ilike('email', subject).maybeSingle();

  if (!profile) throw new DeletionWorkflowError('No PlayIQ account found for that email or ID');
  if (profile.role === 'admin') throw new DeletionWorkflowError('Admin accounts cannot be deleted through this workflow');

  const { data: openRequest } = await supabaseAdmin
    .from('deletion_requests')
    .select('id')
    .eq('subject_user_id', profile.id)
    .neq('status', 'completed')
    .maybeSingle();
  if (openRequest) return openRequest.id;

  const { data, error } = await supabaseAdmin
    .from('deletion_requests')
    .insert({
      subject_user_id: profile.id,
      subject_role: profile.role,
      subject_label: [profile.full_name, profile.email].filter(Boolean).join(' · '),
      requester_email: input.requesterEmail.trim(),
      requester_relationship: input.requesterRelationship,
      notes: input.notes?.trim() || null,
      status: 'requested',
      last_completed_stage: 'requested',
      created_by: input.createdBy,
    })
    .select('id')
    .single();

  if (error || !data) throw new DeletionWorkflowError(`Could not open request: ${error?.message}`);
  return data.id;
}

// ---------------------------------------------------------------------------
// Stage 1: identity verified
// ---------------------------------------------------------------------------

export async function markIdentityVerified(requestId: string, method: string, adminId: string) {
  const req = await getRequest(requestId);
  if (req.status !== 'requested') {
    throw new DeletionWorkflowError(`Identity can only be verified on a new request (current: ${req.status})`);
  }
  if (!method.trim()) throw new DeletionWorkflowError('Describe how the requester was verified');

  await updateRequest(requestId, {
    status: 'identity_verified',
    last_completed_stage: 'identity_verified',
    identity_verification_method: method.trim(),
    identity_verified_by: adminId,
    identity_verified_at: nowIso(),
  });
}

// ---------------------------------------------------------------------------
// Stage 2: access disabled
// ---------------------------------------------------------------------------

export async function disableAccess(requestId: string) {
  const req = await getRequest(requestId);
  if (req.status !== 'identity_verified') {
    throw new DeletionWorkflowError(`Access can only be disabled after identity is verified (current: ${req.status})`);
  }
  const uid = req.subject_user_id;

  // Ban the login: blocks new sign-ins and session refresh
  const { data: authUser, error: getErr } = await supabaseAdmin.auth.admin.getUserById(uid);
  if (getErr && !/not found/i.test(getErr.message)) {
    throw new DeletionWorkflowError(`Could not look up login: ${getErr.message}`);
  }
  if (authUser?.user) {
    const { error: banErr } = await supabaseAdmin.auth.admin.updateUserById(uid, { ban_duration: BAN_DURATION });
    if (banErr) throw new DeletionWorkflowError(`Could not disable login: ${banErr.message}`);
  }

  // Existing app-level suspension flag
  const { error: profileErr } = await supabaseAdmin.from('profiles').update({ status: 'suspended' }).eq('id', uid);
  if (profileErr) throw new DeletionWorkflowError(`Could not suspend profile: ${profileErr.message}`);

  await updateRequest(requestId, {
    status: 'access_disabled',
    last_completed_stage: 'access_disabled',
    access_disabled_at: nowIso(),
  });
}

// ---------------------------------------------------------------------------
// Storage discovery and deletion
// ---------------------------------------------------------------------------

interface StorageTarget {
  bucket: string;
  path: string;
}

async function existingBuckets(): Promise<Set<string>> {
  const { data, error } = await supabaseAdmin.storage.listBuckets();
  if (error) throw new DeletionWorkflowError(`Could not list storage buckets: ${error.message}`);
  return new Set((data ?? []).map((b: { id: string }) => b.id));
}

/** Recursively list every object under `prefix` (exact folder) in a bucket. */
async function listAllUnder(bucket: string, prefix: string): Promise<string[]> {
  const results: string[] = [];
  const pageSize = 1000;
  let offset = 0;

  for (;;) {
    const { data, error } = await supabaseAdmin.storage.from(bucket).list(prefix, { limit: pageSize, offset });
    if (error) throw new DeletionWorkflowError(`Could not list ${bucket}/${prefix}: ${error.message}`);
    const entries = data ?? [];

    for (const entry of entries) {
      const fullPath = `${prefix}/${entry.name}`;
      if (entry.id === null) {
        // Folder placeholder: recurse
        results.push(...(await listAllUnder(bucket, fullPath)));
      } else {
        results.push(fullPath);
      }
    }

    if (entries.length < pageSize) break;
    offset += pageSize;
  }
  return results;
}

function userFolders(uid: string): Record<string, string[]> {
  return {
    [PROOF_BUCKET]: [uid, `student/${uid}`],
    [KNOWLEDGE_BUCKET]: [uid],
  };
}

function isInsideUserFolder(uid: string, bucket: string, path: string): boolean {
  const folders = userFolders(uid)[bucket] ?? [];
  return folders.some((folder) => path.startsWith(`${folder}/`));
}

/** Storage paths recorded in the database for this user. */
async function databaseReferencedObjects(uid: string): Promise<StorageTarget[]> {
  const targets: StorageTarget[] = [];

  const { data: artifacts, error: aErr } = await supabaseAdmin
    .from('proof_artifacts')
    .select('storage_bucket, storage_path, media_path')
    .eq('student_id', uid);
  if (aErr) throw new DeletionWorkflowError(`Could not read proof_artifacts: ${aErr.message}`);
  for (const a of artifacts ?? []) {
    for (const p of [a.storage_path, a.media_path]) {
      if (p && !/^https?:\/\//i.test(p)) targets.push({ bucket: a.storage_bucket || PROOF_BUCKET, path: p });
    }
  }

  const { data: subs, error: sErr } = await supabaseAdmin
    .from('proof_artifact_submissions')
    .select('storage_bucket, storage_path, file_path')
    .eq('student_id', uid);
  if (sErr) throw new DeletionWorkflowError(`Could not read proof_artifact_submissions: ${sErr.message}`);
  for (const s of subs ?? []) {
    for (const p of [s.storage_path, s.file_path]) {
      if (p && !/^https?:\/\//i.test(p)) targets.push({ bucket: s.storage_bucket || PROOF_BUCKET, path: p });
    }
  }

  const { data: files, error: kErr } = await supabaseAdmin
    .from('knowledge_files')
    .select('storage_bucket, storage_path')
    .or(`student_id.eq.${uid},owner_user_id.eq.${uid}`);
  if (kErr) throw new DeletionWorkflowError(`Could not read knowledge_files: ${kErr.message}`);
  for (const f of files ?? []) {
    const p = f.storage_path;
    if (p && !/^https?:\/\//i.test(p)) targets.push({ bucket: f.storage_bucket || KNOWLEDGE_BUCKET, path: p });
  }

  return targets;
}

/** Objects that actually exist in storage under the user's own folders. */
async function listUserFolderObjects(uid: string, buckets: Set<string>): Promise<StorageTarget[]> {
  const objects: StorageTarget[] = [];
  for (const [bucket, folders] of Object.entries(userFolders(uid))) {
    if (!buckets.has(bucket)) continue;
    for (const folder of folders) {
      for (const path of await listAllUnder(bucket, folder)) objects.push({ bucket, path });
    }
  }
  return objects;
}

export interface StorageInventory {
  objects: StorageTarget[];
  missingBuckets: string[];
  outsideUserFolders: StorageTarget[];
}

/** Read-only: everything the storage stage would delete. Used for dry runs and the purge itself. */
export async function inventoryUserStorage(uid: string): Promise<StorageInventory> {
  if (!UUID_RE.test(uid)) throw new DeletionWorkflowError('Invalid user id');
  const buckets = await existingBuckets();
  const missingBuckets = Object.keys(userFolders(uid)).filter((b) => !buckets.has(b));
  const found = new Map<string, StorageTarget>();

  for (const o of await listUserFolderObjects(uid, buckets)) {
    found.set(`${o.bucket}/${o.path}`, o);
  }

  const outsideUserFolders: StorageTarget[] = [];
  for (const ref of await databaseReferencedObjects(uid)) {
    if (!buckets.has(ref.bucket)) continue; // bucket does not exist, so the object cannot exist
    if (!isInsideUserFolder(uid, ref.bucket, ref.path)) {
      outsideUserFolders.push(ref);
      continue;
    }
    found.set(`${ref.bucket}/${ref.path}`, ref);
  }

  return { objects: [...found.values()], missingBuckets, outsideUserFolders };
}

async function purgeStorage(uid: string): Promise<number> {
  const inventory = await inventoryUserStorage(uid);

  if (inventory.outsideUserFolders.length > 0) {
    const sample = inventory.outsideUserFolders.slice(0, 5).map((o) => `${o.bucket}/${o.path}`).join(', ');
    throw new NonRetryableError(
      `Found ${inventory.outsideUserFolders.length} file path(s) recorded for this user outside their own storage folder (${sample}). Stopped before deleting anything; needs manual review.`
    );
  }

  // Delete in batches per bucket
  const byBucket = new Map<string, string[]>();
  for (const o of inventory.objects) {
    byBucket.set(o.bucket, [...(byBucket.get(o.bucket) ?? []), o.path]);
  }
  for (const [bucket, paths] of byBucket) {
    for (let i = 0; i < paths.length; i += 500) {
      const batch = paths.slice(i, i + 500);
      const { error } = await supabaseAdmin.storage.from(bucket).remove(batch);
      if (error) throw new DeletionWorkflowError(`Storage delete failed in ${bucket}: ${error.message}`);
    }
  }

  // Verify against storage itself: nothing may remain in the user's folders.
  // (Database rows that point at these files are removed in the next stage.)
  const remaining = await listUserFolderObjects(uid, await existingBuckets());
  if (remaining.length > 0) {
    throw new DeletionWorkflowError(
      `Storage verification failed: ${remaining.length} file(s) still present after deletion`
    );
  }

  return inventory.objects.length;
}

// ---------------------------------------------------------------------------
// Stage 3+: purge (storage -> database -> auth -> completed)
// ---------------------------------------------------------------------------

// purge_in_progress is included so a run interrupted mid-way can resume once its lease expires
const RESUMABLE: DeletionStatus[] = [
  'access_disabled', 'purge_in_progress', 'storage_purged', 'database_purged', 'auth_deleted', 'failed',
];

async function claimPurgeLease(requestId: string): Promise<DeletionRequest> {
  const now = new Date();
  const leaseUntil = new Date(now.getTime() + PURGE_LEASE_MINUTES * 60_000).toISOString();

  const { data, error } = await supabaseAdmin
    .from('deletion_requests')
    .update({ purge_lock_until: leaseUntil, updated_at: now.toISOString() })
    .eq('id', requestId)
    .in('status', RESUMABLE)
    .or(`purge_lock_until.is.null,purge_lock_until.lt."${now.toISOString()}"`)
    .select('*')
    .maybeSingle();

  if (error) throw new DeletionWorkflowError(`Could not start purge: ${error.message}`);
  if (!data) {
    throw new DeletionWorkflowError(
      'Purge cannot start: access must be disabled first, or another purge run is already in progress'
    );
  }
  const req = data as DeletionRequest;
  if (req.status === 'failed' && req.retryable === false) {
    await updateRequest(requestId, { purge_lock_until: null });
    throw new DeletionWorkflowError('This request failed in a way that needs manual review before retrying');
  }
  return req;
}

async function recordFailure(requestId: string, stage: PurgeStage, err: unknown, failureCount: number) {
  const detail = err instanceof Error ? err.message : String(err);
  await updateRequest(requestId, {
    status: 'failed',
    failed_at: nowIso(),
    failed_stage: stage,
    failure_detail: detail.slice(0, 2000),
    failure_count: failureCount + 1,
    retryable: !(err instanceof NonRetryableError),
    purge_lock_until: null,
  });
}

/**
 * Runs (or resumes) the destructive stages. Stops at the first failure, records it,
 * and never runs a later stage after an earlier one failed.
 */
export async function runPurge(requestId: string): Promise<DeletionRequest> {
  const req = await claimPurgeLease(requestId);
  const uid = req.subject_user_id;
  const done = req.last_completed_stage;

  const reached = (stage: string) => {
    const order = ['requested', 'identity_verified', 'access_disabled', 'storage_purged', 'database_purged', 'auth_deleted', 'completed'];
    return done !== null && order.indexOf(done) >= order.indexOf(stage);
  };

  if (!reached('access_disabled')) {
    await updateRequest(requestId, { purge_lock_until: null });
    throw new DeletionWorkflowError('Access must be disabled before purging');
  }

  await updateRequest(requestId, {
    status: 'purge_in_progress',
    purge_started_at: req.purge_started_at ?? nowIso(),
    failed_stage: null,
    failure_detail: null,
    retryable: null,
  });

  // 1. Storage (must succeed before anything else is deleted)
  if (!reached('storage_purged')) {
    try {
      const count = await purgeStorage(uid);
      await updateRequest(requestId, {
        status: 'storage_purged',
        last_completed_stage: 'storage_purged',
        storage_purged_at: nowIso(),
        storage_objects_deleted: count,
      });
    } catch (err) {
      await recordFailure(requestId, 'storage', err, req.failure_count);
      return getRequest(requestId);
    }
  }

  // 2. Database (single transaction, self-verifying)
  if (!reached('database_purged')) {
    try {
      const { data, error } = await supabaseAdmin.rpc('privacy_purge_user_data', { p_user_id: uid });
      if (error) throw new DeletionWorkflowError(`Database purge failed: ${error.message}`);
      await updateRequest(requestId, {
        status: 'database_purged',
        last_completed_stage: 'database_purged',
        database_purged_at: nowIso(),
        database_rows_deleted: data,
      });
    } catch (err) {
      await recordFailure(requestId, 'database', err, req.failure_count);
      return getRequest(requestId);
    }
  }

  // 3. Auth login
  if (!reached('auth_deleted')) {
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(uid);
      if (error && !/not found/i.test(error.message)) {
        throw new DeletionWorkflowError(`Login deletion failed: ${error.message}`);
      }
      await updateRequest(requestId, {
        status: 'auth_deleted',
        last_completed_stage: 'auth_deleted',
        auth_deleted_at: nowIso(),
      });
    } catch (err) {
      await recordFailure(requestId, 'auth', err, req.failure_count);
      return getRequest(requestId);
    }
  }

  // 4. Completed: keep the proof record, drop the subject's name/email from it
  await updateRequest(requestId, {
    status: 'completed',
    last_completed_stage: 'completed',
    completed_at: nowIso(),
    subject_label: null,
    purge_lock_until: null,
  });
  return getRequest(requestId);
}

/**
 * After a non-retryable failure has been looked at (and the underlying data fixed),
 * an admin records what they checked and allows a retry. The retry still re-runs
 * every safety check, so this cannot bypass the storage guard.
 */
export async function markReviewedForRetry(requestId: string, reviewNote: string, adminEmail: string) {
  const req = await getRequest(requestId);
  if (req.status !== 'failed' || req.retryable !== false) {
    throw new DeletionWorkflowError('Only a failed, non-retryable request can be marked as reviewed');
  }
  if (!reviewNote.trim()) throw new DeletionWorkflowError('Describe what was reviewed or fixed');

  const entry = `[${nowIso()}] Reviewed by ${adminEmail}: ${reviewNote.trim()}`;
  await updateRequest(requestId, {
    retryable: true,
    notes: req.notes ? `${req.notes}\n${entry}` : entry,
  });
}

export async function listDeletionRequests(): Promise<DeletionRequest[]> {
  const { data, error } = await supabaseAdmin
    .from('deletion_requests')
    .select('*')
    .order('requested_at', { ascending: false })
    .limit(200);
  if (error) throw new DeletionWorkflowError(`Could not load deletion requests: ${error.message}`);
  return (data ?? []) as DeletionRequest[];
}
