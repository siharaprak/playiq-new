import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module10OverviewPage() {
  return <CourseModuleOverviewView moduleNum={10} nodesRecord={getCourseModuleNodes(10)} />;
}
