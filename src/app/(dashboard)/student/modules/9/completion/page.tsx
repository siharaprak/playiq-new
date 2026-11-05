import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module9CompletionPage() {
  return <CourseModuleCompletionView moduleNum={9} totalNodes={getCourseModuleNodeCount(9)} />;
}
