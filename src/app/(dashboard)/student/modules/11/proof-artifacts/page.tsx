import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module11ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 11, getCourseModuleNodeCount(11));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(11)}
      moduleNum={11}
    />
  );
}
