import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module12ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 12, getCourseModuleNodeCount(12));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(12)}
      moduleNum={12}
    />
  );
}
