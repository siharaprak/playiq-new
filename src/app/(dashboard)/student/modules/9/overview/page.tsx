import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module9OverviewPage() {
  return <CourseModuleOverviewView moduleNum={9} nodesRecord={getCourseModuleNodes(9)} />;
}
