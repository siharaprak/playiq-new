import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module7OverviewPage() {
  return <CourseModuleOverviewView moduleNum={7} nodesRecord={getCourseModuleNodes(7)} />;
}
