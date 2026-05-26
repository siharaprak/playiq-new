import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module10ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 10, 7);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_10_ID} 
      moduleNum={10} 
    />
  );
}
