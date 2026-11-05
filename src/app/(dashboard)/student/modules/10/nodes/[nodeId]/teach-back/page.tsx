import React from 'react';
import { CourseNodeTeachBackView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';
import { submitTeachBackAction } from '../../../actions';

export default async function Module10NodeTeachBackPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeTeachBackView
      moduleNum={10}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(10)}
      submitTeachBackAction={submitTeachBackAction}
    />
  );
}
