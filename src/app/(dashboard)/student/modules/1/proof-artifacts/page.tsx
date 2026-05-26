import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module1ProofArtifactsPage() {
  // Module 1 gating check (phase: artifacts, moduleNumber: 1, nodeCount: 4)
  await enforceModuleGating('artifacts', 1, 4);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_1_ID} 
      moduleNum={1} 
    />
  );
}
