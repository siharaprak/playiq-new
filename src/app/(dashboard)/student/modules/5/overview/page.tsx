import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module5OverviewPage() {
  return <CourseModuleOverviewView moduleNum={5} nodesRecord={getCourseModuleNodes(5)} />;
}
