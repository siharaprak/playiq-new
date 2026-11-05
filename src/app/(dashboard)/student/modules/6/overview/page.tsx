import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module6OverviewPage() {
  return <CourseModuleOverviewView moduleNum={6} nodesRecord={getCourseModuleNodes(6)} />;
}
