import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module5CompletionPage() {
  return <CourseModuleCompletionView moduleNum={5} totalNodes={getCourseModuleNodeCount(5)} />;
}
