import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module6ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 6, getCourseModuleNodeCount(6));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(6)}
      moduleNum={6}
    />
  );
}
