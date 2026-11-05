import React from 'react';
import { CourseNodeLessonView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';
import { advanceNodePhase } from '../../../actions';

export default async function Module6NodeLessonPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeLessonView
      moduleNum={6}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(6)}
      advanceNodePhase={advanceNodePhase}
    />
  );
}
