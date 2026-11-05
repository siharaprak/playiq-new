import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module7ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 7, getCourseModuleNodeCount(7));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(7)}
      moduleNum={7}
    />
  );
}
