import React from 'react';
import { CourseNodeActivityView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';
import { advanceNodePhase } from '../../../actions';

export default async function Module7NodeActivityPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeActivityView
      moduleNum={7}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(7)}
      advanceNodePhase={advanceNodePhase}
    />
  );
}
