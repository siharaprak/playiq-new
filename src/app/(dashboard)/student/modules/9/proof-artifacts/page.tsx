import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module9ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 9, 6);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_9_ID} 
      moduleNum={9} 
    />
  );
}
