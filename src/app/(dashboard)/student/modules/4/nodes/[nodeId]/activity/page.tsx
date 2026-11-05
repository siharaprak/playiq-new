import React from 'react';
import { CourseNodeActivityView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';
import { advanceNodePhase } from '../../../actions';

export default async function Module4NodeActivityPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeActivityView
      moduleNum={4}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(4)}
      advanceNodePhase={advanceNodePhase}
    />
  );
}
