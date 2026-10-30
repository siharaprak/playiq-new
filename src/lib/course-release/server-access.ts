import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createHash } from 'node:crypto';
import { RELEASE_ID, courseShellEnabled, sanitizeAssessmentProfile, type CourseShell } from './learning-record';

/** Enrollment is administered by the release operator, never a student's writable profile. */
export async function requireCourseReleaseAccess(shell: CourseShell) {
  if (!courseShellEnabled(shell, process.env)) throw new Error('This course shell is not enabled.');
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error('Course storage is not configured. Nothing was saved.');
  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: { getAll: () => cookieStore.getAll(), setAll: updates => {
      try { for (const {name,value,options} of updates) cookieStore.set(name,value,options); }
      catch { /* Read-only server rendering cannot refresh cookies. */ }
    } },
  });
  const {data:{user},error} = await supabase.auth.getUser();
  if (error || !user) throw new Error('Sign in to your enrolled student account and retry. Nothing was saved.');
  const {data:enrollment,error:enrollmentError} = await supabase.from('course_release_enrollments')
    .select('student_id').eq('student_id',user.id).eq('release_id',RELEASE_ID).eq('shell',shell).eq('enabled',true).maybeSingle();
  if (enrollmentError) throw new Error('Course enrollment could not be verified. Ask the team to check the release migration; nothing was saved.');
  if (!enrollment) throw new Error('This account is not enrolled in this course release. Ask the course team for access.');
  return {supabase,user};
}

/** Detects an assessment change between the displayed review and approved save. */
export function assessmentReviewToken(profile: unknown): string | null {
  const clean = sanitizeAssessmentProfile(profile);
  if (!clean) return null;
  const ordered = Object.fromEntries(Object.keys(clean).sort().map(key=>[key,clean[key]]));
  return createHash('sha256').update(JSON.stringify(ordered)).digest('hex');
}
