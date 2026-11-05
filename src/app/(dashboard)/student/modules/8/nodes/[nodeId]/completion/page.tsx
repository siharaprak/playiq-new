import React from 'react';
import { CourseNodeCompletionView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';

export default async function Module8NodeCompletionPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeCompletionView
      moduleNum={8}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(8)}
    />
  );
}
