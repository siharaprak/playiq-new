import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module5ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 5, 4);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_5_ID} 
      moduleNum={5} 
    />
  );
}
