import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module10ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 10, getCourseModuleNodeCount(10));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(10)}
      moduleNum={10}
    />
  );
}
