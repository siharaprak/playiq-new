import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module12CompletionPage() {
  return <CourseModuleCompletionView moduleNum={12} totalNodes={getCourseModuleNodeCount(12)} />;
}
