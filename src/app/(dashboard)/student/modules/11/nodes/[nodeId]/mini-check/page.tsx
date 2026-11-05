import React from 'react';
import { CourseNodeMiniCheckView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';
import { advanceNodePhase } from '../../../actions';

export default async function Module11NodeMiniCheckPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeMiniCheckView
      moduleNum={11}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(11)}
      advanceNodePhase={advanceNodePhase}
    />
  );
}
