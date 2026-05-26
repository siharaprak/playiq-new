import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module7ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 7, 4);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_7_ID} 
      moduleNum={7} 
    />
  );
}
