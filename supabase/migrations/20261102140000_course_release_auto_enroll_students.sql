-- Auto-enroll new student accounts in the current beta course release.
-- Requested by the course owner (Scott, 2026-11-02): every student account gets the
-- beta release. Fires when a profile is created as a student, or when its role is
-- changed to student (the parent "create apprentice" flow upserts role after signup).
--
-- Safety: only operator/server contexts enroll (service role, auth signup trigger,
-- SQL editor). A signed-in user editing their own profile (JWT role 'authenticated')
-- never self-enrolls, preserving the "no student self-enrollment" rule.
-- ON CONFLICT DO NOTHING respects any enrollment an operator has disabled.
BEGIN;

CREATE OR REPLACE FUNCTION public.course_release_auto_enroll_student()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public AS $$
BEGIN
  IF NEW.role::text = 'student'
     AND (TG_OP = 'INSERT' OR OLD.role IS DISTINCT FROM NEW.role)
     AND COALESCE(auth.role(), '') <> 'authenticated' THEN
    INSERT INTO public.course_release_enrollments (student_id, release_id, shell, enabled)
    VALUES (NEW.id, 'playiq-2026-10-30', 'beta', true)
    ON CONFLICT (student_id, release_id, shell) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.course_release_auto_enroll_student() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS course_release_auto_enroll_student ON public.profiles;
CREATE TRIGGER course_release_auto_enroll_student
  AFTER INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.course_release_auto_enroll_student();

COMMIT;
