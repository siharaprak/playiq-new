-- Independent beta technical blockers, available before lesson completion.
-- Requires 20261030090000_course_release_learning_records.sql enrollment predicate.
-- Apply only through the approved preview/staging release process; not run by this worker.
BEGIN;

CREATE TABLE public.course_release_blockers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  release_id text NOT NULL CHECK (release_id = 'playiq-2026-10-30'),
  module_number smallint NOT NULL CHECK (module_number BETWEEN 0 AND 14),
  message text NOT NULL CHECK (char_length(btrim(message)) BETWEEN 10 AND 4000
    AND public.course_release_text_valid(message, 4000)),
  browser text NOT NULL CHECK (char_length(btrim(browser)) > 0 AND public.course_release_text_valid(browser, 120)),
  device text NOT NULL CHECK (char_length(btrim(device)) > 0 AND public.course_release_text_valid(device, 120)),
  page_path text NOT NULL CHECK (page_path = '/student/course-beta'
    OR page_path = '/student/course-beta?module=' || module_number::text),
  severity text NOT NULL CHECK (severity IN ('blocked', 'problem')),
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX course_release_blockers_triage ON public.course_release_blockers(release_id, severity, created_at DESC);
CREATE INDEX course_release_blockers_owner ON public.course_release_blockers(student_id, release_id);

ALTER TABLE public.course_release_blockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_release_blockers FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.course_release_blockers FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.course_release_blockers TO authenticated;
-- The server-default timestamp cannot be supplied by an authenticated client.
GRANT INSERT (id, student_id, release_id, module_number, message, browser, device, page_path, severity)
  ON public.course_release_blockers TO authenticated;
CREATE POLICY course_release_blocker_read ON public.course_release_blockers
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = student_id AND public.course_release_can_access('beta'));
CREATE POLICY course_release_blocker_insert ON public.course_release_blockers
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = student_id AND public.course_release_can_access('beta'));

COMMENT ON TABLE public.course_release_blockers IS 'Beta technical reports, owner/enrollment restricted. Independent of completion and surveys; never Tutor knowledge. No screenshot, attachment, IP or full URL collection. Student updates/deletes are not granted.';
NOTIFY pgrst, 'reload schema';
COMMIT;
