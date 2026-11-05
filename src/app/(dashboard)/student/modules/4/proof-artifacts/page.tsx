import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module4ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 4, getCourseModuleNodeCount(4));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(4)}
      moduleNum={4}
    />
  );
}
