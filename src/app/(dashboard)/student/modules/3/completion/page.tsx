import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module3CompletionPage() {
  return <CourseModuleCompletionView moduleNum={3} totalNodes={getCourseModuleNodeCount(3)} />;
}
