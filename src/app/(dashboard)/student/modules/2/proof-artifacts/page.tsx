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
