import CourseReleasePage, { type CourseSearchParams } from '@/components/course-release/CourseReleasePage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function FinalCoursePage({ searchParams }: { searchParams: CourseSearchParams }) {
  return <CourseReleasePage shell="final" searchParams={searchParams} />;
}
