import React from 'react';
import CourseModuleCompletionView from '@/components/modules/CourseModuleCompletionView';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module11CompletionPage() {
  return <CourseModuleCompletionView moduleNum={11} totalNodes={getCourseModuleNodeCount(11)} />;
}
