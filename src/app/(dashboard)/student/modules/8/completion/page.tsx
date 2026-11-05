import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module8CompletionPage() {
  return <CourseModuleCompletionView moduleNum={8} totalNodes={getCourseModuleNodeCount(8)} />;
}
