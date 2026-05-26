import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module8ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 8, 4);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_8_ID} 
      moduleNum={8} 
    />
  );
}
