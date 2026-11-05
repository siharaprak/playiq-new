import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module10CompletionPage() {
  return <CourseModuleCompletionView moduleNum={10} totalNodes={getCourseModuleNodeCount(10)} />;
}
