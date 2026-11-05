import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module5ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 5, getCourseModuleNodeCount(5));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(5)}
      moduleNum={5}
    />
  );
}
