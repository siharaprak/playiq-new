import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module6ProofArtifactsPage() {
  await enforceModuleGating('artifacts', 6, 4);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_6_ID} 
      moduleNum={6} 
    />
  );
}
