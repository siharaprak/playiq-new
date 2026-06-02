import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';

export default async function Module2ProofArtifactsPage() {
  // Module 2 gating check (phase: artifacts, moduleNumber: 2, nodeCount: 6)
  await enforceModuleGating('artifacts', 2, 6);

  return (
    <StudentModuleArtifactsContainer 
      moduleId={MODULES.MODULE_2_ID} 
      moduleNum={2} 
    />
  );
}
