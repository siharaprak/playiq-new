-- supabase/migrations/20260606000001_sprint9b_telemetry_indexes.sql
--
-- Performance indexes to support high-volume events_log scans, cost usage rollups,
-- rate limiters, and dynamic operational alerts.
--

CREATE INDEX IF NOT EXISTS idx_events_log_student_created ON public.events_log (student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_log_type_created ON public.events_log (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_log_target_created ON public.events_log (target_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_proof_artifact_submissions_status_created ON public.proof_artifact_submissions (status, created_at DESC);
