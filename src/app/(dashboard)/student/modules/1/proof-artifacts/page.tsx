import React from 'react';
import { enforceModuleGating } from '@/lib/gating';
<<<<<<< HEAD
import StudentModuleArtifactsContainer from '@/components/artifacts/StudentModuleArtifactsContainer';
import { MODULES } from '@/lib/constants';
=======
import { submitArtifacts } from '../actions';
import { MODULES } from '@/lib/constants';
import { ProofArtifactSection } from '@/components/proof-artifacts/ProofArtifactSection';
>>>>>>> 5e4564f (feat(proof-artifacts): Sprint 5F - Access controls, SLA, escalation, and visibility policies)

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
