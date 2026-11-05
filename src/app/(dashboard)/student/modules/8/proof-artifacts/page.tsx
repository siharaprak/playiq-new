import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { getDbModuleIdForCourseModule } from '@/lib/constants';
import { getCourseModuleNodeCount } from '@/lib/modules/courseModuleNodes';

export default async function Module8ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 8, getCourseModuleNodeCount(8));

  return (
    <StudentModuleArtifactsContainer
      moduleId={getDbModuleIdForCourseModule(8)}
      moduleNum={8}
    />
  );
}
