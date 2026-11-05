import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module3OverviewPage() {
  return <CourseModuleOverviewView moduleNum={3} nodesRecord={getCourseModuleNodes(3)} />;
}
