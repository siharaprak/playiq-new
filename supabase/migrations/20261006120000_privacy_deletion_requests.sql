-- Phase 2 privacy remediation: tracked account-deletion lifecycle
--
-- 1. public.deletion_requests: one row per deletion request, with a timestamp per stage.
--    RLS on; admins may read; all writes go through the server (service role) only.
-- 2. public.privacy_purge_user_data(uuid): removes every database row belonging to a user
--    in ONE transaction, then scans all uuid columns in the public schema and raises
--    (rolling everything back) if any reference to the user remains.
--    Storage objects are NOT handled here; the app deletes them explicitly first.

-- ---------------------------------------------------------------------------
-- 1. deletion_requests
-- ---------------------------------------------------------------------------
create table if not exists public.deletion_requests (
  id uuid primary key default gen_random_uuid(),

  -- Subject. Deliberately no FK: this record must outlive the deleted account.
  subject_user_id uuid not null,
  subject_role text,
  subject_label text,              -- email/name for admins; cleared when completed

  requester_email text not null,
  requester_relationship text not null
    check (requester_relationship in ('parent', 'account_holder', 'admin_initiated', 'other')),
  notes text,

  status text not null default 'requested'
    check (status in ('requested', 'identity_verified', 'access_disabled', 'purge_in_progress',
                      'storage_purged', 'database_purged', 'auth_deleted', 'completed', 'failed')),
  last_completed_stage text
    check (last_completed_stage in ('requested', 'identity_verified', 'access_disabled',
                                    'storage_purged', 'database_purged', 'auth_deleted', 'completed')),

  identity_verification_method text,
  identity_verified_by uuid,

  requested_at timestamptz not null default now(),
  identity_verified_at timestamptz,
  access_disabled_at timestamptz,
  purge_started_at timestamptz,
  storage_purged_at timestamptz,
  database_purged_at timestamptz,
  auth_deleted_at timestamptz,
  completed_at timestamptz,

  failed_at timestamptz,
  failed_stage text,
  failure_detail text,
  failure_count integer not null default 0,
  retryable boolean,

  storage_objects_deleted integer,
  database_rows_deleted jsonb,

  -- Lease that stops two purge runs on the same request at once
  purge_lock_until timestamptz,

  created_by uuid,
  updated_at timestamptz not null default now()
);

-- Only one open request per account at a time
create unique index if not exists deletion_requests_one_open_per_subject
  on public.deletion_requests (subject_user_id)
  where status <> 'completed';

create index if not exists deletion_requests_status_idx on public.deletion_requests (status);

alter table public.deletion_requests enable row level security;

-- Admins can read. No insert/update/delete policies: only the service role can write.
drop policy if exists deletion_requests_admin_select on public.deletion_requests;
create policy deletion_requests_admin_select on public.deletion_requests
  for select to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

revoke insert, update, delete, truncate on public.deletion_requests from anon, authenticated;
revoke all on public.deletion_requests from anon;

-- ---------------------------------------------------------------------------
-- 2. privacy_purge_user_data
-- ---------------------------------------------------------------------------
create or replace function public.privacy_purge_user_data(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_counts jsonb := '{}'::jsonb;
  v_remaining jsonb := '{}'::jsonb;
  n bigint;
  r record;
begin
  if p_user_id is null then
    raise exception 'privacy purge: user id is required';
  end if;

  select email into v_email from profiles where id = p_user_id;

  -- Guard: never purge an admin account through this path
  if exists (select 1 from profiles where id = p_user_id and role = 'admin')
     or exists (select 1 from user_roles where user_id = p_user_id and role = 'admin') then
    raise exception 'privacy purge: refusing to purge an admin account';
  end if;

  -- Guard: a parent's linked children must be deleted first (no orphaned child accounts)
  if exists (
    select 1 from parent_child_links l
    join profiles c on c.id = l.student_id
    where l.parent_id = p_user_id
  ) then
    raise exception 'privacy purge: parent still has linked child accounts; delete those first';
  end if;

  -- Detach references where this user acted on OTHER people's records (FKs without cascade)
  update discussion_replies    set removed_by = null         where removed_by = p_user_id;
  update discussion_topics     set removed_by = null         where removed_by = p_user_id;
  update proof_artifacts       set reviewed_by = null        where reviewed_by = p_user_id and student_id <> p_user_id;
  update support_issues        set assigned_to = null        where assigned_to = p_user_id;
  update discussion_categories set created_by = null         where created_by = p_user_id;
  update enrollments           set created_by = null         where created_by = p_user_id and student_id <> p_user_id;
  update link_invites          set claimed_by_user_id = null where claimed_by_user_id = p_user_id;
  update assistant_versions    set created_by = null         where created_by = p_user_id;
  update tutor_versions        set created_by = null         where created_by = p_user_id;

  -- Tables keyed by user id WITHOUT a foreign key (not reached by cascade)
  delete from fingerprint_signals where student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('fingerprint_signals', n);

  delete from events_log where student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('events_log', n);

  delete from assessment_submissions where student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('assessment_submissions', n);

  delete from attempts where student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('attempts', n);

  delete from mastery_checkpoints where student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('mastery_checkpoints', n);

  delete from student_node_progress where student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('student_node_progress', n);

  delete from proof_artifact_submissions where student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('proof_artifact_submissions', n);

  delete from proof_artifacts where student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('proof_artifacts', n);

  delete from reports where student_id = p_user_id or parent_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('reports', n);

  delete from shipments where student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('shipments', n);

  delete from support_tickets where student_id = p_user_id or reporter_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('support_tickets', n);

  delete from support_issues where student_id = p_user_id or reporter_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('support_issues', n);

  delete from parent_child_links where parent_id = p_user_id or student_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('parent_child_links', n);

  delete from audit_events where actor_user_id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('audit_events', n);

  -- Email-keyed records (beta/early-access leads, invites addressed to this user)
  if v_email is not null and v_email <> '' then
    delete from beta_applications where lower(email) = lower(v_email);
    get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('beta_applications', n);

    delete from early_access_leads where lower(email) = lower(v_email);
    get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('early_access_leads', n);

    delete from link_invites where lower(target_email) = lower(v_email);
    get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('link_invites_by_email', n);
  end if;

  -- Profile last: cascades to user_roles, enrollments, tutor/assistant profiles (and their
  -- versions, knowledge_files, feedback signals), discussion posts/reports, missions, etc.
  delete from profiles where id = p_user_id;
  get diagnostics n = row_count; v_counts := v_counts || jsonb_build_object('profiles', n);

  -- Verify: no uuid column anywhere in public may still reference this user
  for r in
    select c.table_name, c.column_name
    from information_schema.columns c
    join information_schema.tables t
      on t.table_schema = c.table_schema and t.table_name = c.table_name and t.table_type = 'BASE TABLE'
    where c.table_schema = 'public' and c.data_type = 'uuid' and c.table_name <> 'deletion_requests'
  loop
    execute format('select count(*) from public.%I where %I = $1', r.table_name, r.column_name)
      into n using p_user_id;
    if n > 0 then
      v_remaining := v_remaining || jsonb_build_object(r.table_name || '.' || r.column_name, n);
    end if;
  end loop;

  if v_remaining <> '{}'::jsonb then
    -- Raising rolls back every delete above: no partial database purge
    raise exception 'privacy purge incomplete, rolled back. Remaining references: %', v_remaining;
  end if;

  return v_counts;
end;
$$;

revoke all on function public.privacy_purge_user_data(uuid) from public, anon, authenticated;
grant execute on function public.privacy_purge_user_data(uuid) to service_role;
