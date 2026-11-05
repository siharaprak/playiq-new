import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module9ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 9, getCourseModuleNodeCount(9));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(9)}
      moduleNum={9}
    />
  );
}
