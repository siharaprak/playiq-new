import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module6CompletionPage() {
  return <CourseModuleCompletionView moduleNum={6} totalNodes={getCourseModuleNodeCount(6)} />;
}
