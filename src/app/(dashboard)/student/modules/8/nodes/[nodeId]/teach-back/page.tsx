import React from 'react';
import { CourseNodeTeachBackView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';
import { submitTeachBackAction } from '../../../actions';

export default async function Module8NodeTeachBackPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeTeachBackView
      moduleNum={8}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(8)}
      submitTeachBackAction={submitTeachBackAction}
    />
  );
}
