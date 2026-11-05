import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module8OverviewPage() {
  return <CourseModuleOverviewView moduleNum={8} nodesRecord={getCourseModuleNodes(8)} />;
}
