import React from 'react';
import { CourseNodeTeachBackView } from '@/components/modules/CourseNodePhaseViews';
import { getCourseModuleNodes } from '@/lib/modules/courseModuleNodes';
import { submitTeachBackAction } from '../../../actions';

export default async function Module3NodeTeachBackPage({ params }: { params: Promise<{ nodeId: string }> }) {
  const { nodeId } = await params;
  return (
    <CourseNodeTeachBackView
      moduleNum={3}
      nodeId={nodeId}
      nodesRecord={getCourseModuleNodes(3)}
      submitTeachBackAction={submitTeachBackAction}
    />
  );
}
