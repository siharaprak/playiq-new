import CourseReleasePage, { type CourseSearchParams } from '@/components/course-release/CourseReleasePage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function BetaCoursePage({ searchParams }: { searchParams: CourseSearchParams }) {
  return <CourseReleasePage shell="beta" searchParams={searchParams} />;
}
