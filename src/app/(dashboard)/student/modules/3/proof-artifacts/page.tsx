import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module3ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 3, 4);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_3_ID} 
      moduleNum={3} 
    />
  );
}
