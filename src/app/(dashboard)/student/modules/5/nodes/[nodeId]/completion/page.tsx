import React from 'react';
import { CourseNodeCompletionView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module5NodeCompletionPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeCompletionView
      moduleNum={5}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(5)}
    />
  );
}
