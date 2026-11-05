import React from 'react';
import { CourseNodeMiniCheckView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';
import { advanceNodePhase } from '../../../actions';

export default async function Module6NodeMiniCheckPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeMiniCheckView
      moduleNum={6}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(6)}
      advanceNodePhase={advanceNodePhase}
    />
  );
}
