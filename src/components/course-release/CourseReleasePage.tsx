import Link from 'next/link';
import { notFound } from 'next/navigation';
import { loadCourseReleaseState } from '@/app/(dashboard)/student/course-actions';
import { courseShellEnabled, loadCourseLessons, type CourseLesson } from '@/lib/course-release/content';
import type { CourseShell } from '@/lib/course-release/learning-record';
import CourseShellClient from './CourseShellClient';
import styles from './course-release.module.css';

export type CourseSearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CourseReleasePage({ shell, searchParams }: {
  shell: CourseShell;
  searchParams: CourseSearchParams;
}) {
  // Server-only flags fail closed. Disabled releases cannot render or load learner data.
  if (!courseShellEnabled(shell)) notFound();
  const initialResult = await loadCourseReleaseState(shell);
  if (!initialResult.ok) {
    return (
      <main className={styles.accessNotice}>
        <h1>Course access could not be confirmed</h1>
        <p role="alert">{initialResult.error}</p>
        <p>No course record was changed. Ask the team to check your student enrollment and the release database migration.</p>
        <Link href="/login">Go to sign in</Link>
      </main>
    );
  }
  const requested = (await searchParams).module;
  if (requested !== undefined && (typeof requested !== 'string' || !/^(?:[0-9]|1[0-4])$/.test(requested))) notFound();

  let lessons: CourseLesson[];
  try {
    lessons = loadCourseLessons(shell);
  } catch {
    return (
      <main className={styles.accessNotice}>
        <h1>The course reading files are not ready</h1>
        <p>No progress was changed. The team needs to include the complete October 30 course source in this preview build.</p>
        <Link href="/student/home">Return to student home</Link>
      </main>
    );
  }
  const moduleNumber = requested !== undefined ? Number(requested) : initialResult.ok
    ? lessons.find(lesson => !initialResult.data.records.some(record => record.moduleNumber === lesson.moduleNumber && record.completed))?.moduleNumber ?? 14
    : 0;

  return (
    <CourseShellClient
      key={`${shell}-${moduleNumber}`}
      shell={shell}
      lesson={lessons[moduleNumber]}
      navigation={lessons.map(({ moduleNumber: number, title }) => ({ moduleNumber: number, title }))}
      initialResult={initialResult}
    />
  );
}
