import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module4OverviewPage() {
  return <CourseModuleOverviewView moduleNum={4} nodesRecord={getCourseModuleNodes(4)} />;
}
