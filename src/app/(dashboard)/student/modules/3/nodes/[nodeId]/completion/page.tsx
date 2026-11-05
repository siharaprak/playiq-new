import React from 'react';
import { CourseNodeCompletionView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module3NodeCompletionPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeCompletionView
      moduleNum={3}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(3)}
    />
  );
}
