import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module3ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 3, getCourseModuleNodeCount(3));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(3)}
      moduleNum={3}
    />
  );
}
