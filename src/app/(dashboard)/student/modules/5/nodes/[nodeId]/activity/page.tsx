import React from 'react';
import { CourseNodeActivityView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';
import { advanceNodePhase } from '../../../actions';

export default async function Module5NodeActivityPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeActivityView
      moduleNum={5}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(5)}
      advanceNodePhase={advanceNodePhase}
    />
  );
}
