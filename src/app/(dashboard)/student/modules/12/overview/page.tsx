import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module12OverviewPage() {
  return <CourseModuleOverviewView moduleNum={12} nodesRecord={getCourseModuleNodes(12)} />;
}
