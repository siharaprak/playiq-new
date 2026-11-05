import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module4CompletionPage() {
  return <CourseModuleCompletionView moduleNum={4} totalNodes={getCourseModuleNodeCount(4)} />;
}
