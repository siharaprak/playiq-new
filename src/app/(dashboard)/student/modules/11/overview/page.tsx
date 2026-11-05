import React from 'react';
import CourseModuleOverviewView from '@/components/modules/CourseModuleOverviewView';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module11OverviewPage() {
  return <CourseModuleOverviewView moduleNum={11} nodesRecord={getCourseModuleNodes(11)} />;
}
