import { notFound } from 'next/navigation';
import { loadCourseLessons } from '@/lib/course-release/content';
import PreviewClient from './preview-client';

// Synthetic UI harness, impossible to enable in a production Next.js build.
export const dynamic = 'force-dynamic';
export default async function CourseReleasePreview({searchParams}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (process.env.NODE_ENV === 'production' || process.env.PLAYIQ_COURSE_PREVIEW !== 'true') notFound();
  const query = await searchParams;
  const shell = query.shell === 'final' ? 'final' : 'beta';
  const moduleNumber = typeof query.module === 'string' && /^(?:[0-9]|1[0-4])$/.test(query.module) ? Number(query.module) : 0;
  const lessons = loadCourseLessons(shell);
  return <PreviewClient key={`${shell}-${moduleNumber}-${query.mode}`} shell={shell}
    fail={query.mode === 'fail'} failSaves={query.mode === 'savefail'} lesson={lessons[moduleNumber]}
    navigation={lessons.map(({moduleNumber,title}) => ({moduleNumber,title}))} />;
}
