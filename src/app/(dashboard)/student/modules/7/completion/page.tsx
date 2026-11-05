import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module7CompletionPage() {
  return <CourseModuleCompletionView moduleNum={7} totalNodes={getCourseModuleNodeCount(7)} />;
}
