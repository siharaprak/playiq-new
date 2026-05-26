import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module4ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 4, 5);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_4_ID} 
      moduleNum={4} 
    />
  );
}
