/**
 * QA Script: Verify Proof Artifact Flow Policy
 * 
 * Verifies that:
 * 1. Notes are required for revise/reject
 * 2. Rejected is final
 * 3. Students can resubmit from revise
 */

import { PROOF_ARTIFACT_FLOW_POLICY, getStudentAllowedActions, getReviewNoteRequirement, getStudentStatusMessage } from '../src/lib/proof-artifacts/flow-policy';
import { canTransitionArtifact } from '../src/lib/proof-artifacts/state-machine';
import { ProofArtifactReviewInputSchema } from '../src/lib/proof-artifacts/types';

async function main() {
  console.log('--- Starting Flow Policy QA ---\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  // 1. Rejected is final for students
  assert(
    !canTransitionArtifact('rejected', 'submitted', 'student'),
    "State machine blocks 'rejected -> submitted' for students"
  );
  
  assert(
    getStudentAllowedActions('rejected').isFinal === true,
    "getStudentAllowedActions marks 'rejected' as final"
  );

  // 2. Revise can resubmit
  assert(
    canTransitionArtifact('revise', 'submitted', 'student'),
    "State machine allows 'revise -> submitted' for students"
  );
  
  assert(
    getStudentAllowedActions('revise').canResubmit === true,
    "getStudentAllowedActions marks 'revise' as resubmittable"
  );

  // 3. Notes required for revise and reject via Policy
  assert(
    getReviewNoteRequirement('revise') === true,
    "Policy requires notes for revise"
  );
  
  assert(
    getReviewNoteRequirement('rejected') === true,
    "Policy requires notes for rejected"
  );

  // 4. Notes required for revise and reject via Zod Schema
  const reviseWithoutNotes = ProofArtifactReviewInputSchema.safeParse({ status: 'revise' });
  assert(
    !reviseWithoutNotes.success,
    "Zod schema blocks 'revise' without notes"
  );

  const rejectWithoutNotes = ProofArtifactReviewInputSchema.safeParse({ status: 'rejected' });
  assert(
    !rejectWithoutNotes.success,
    "Zod schema blocks 'rejected' without notes"
  );

  const approveWithoutNotes = ProofArtifactReviewInputSchema.safeParse({ status: 'approved' });
  assert(
    approveWithoutNotes.success,
    "Zod schema allows 'approved' without notes"
  );

  const reviseWithNotes = ProofArtifactReviewInputSchema.safeParse({ status: 'revise', reviewNotes: 'Please fix X.' });
  assert(
    reviseWithNotes.success,
    "Zod schema allows 'revise' with notes"
  );

  // 5. Check student copy
  assert(
    getStudentStatusMessage('rejected').includes('not accepted'),
    "Student rejected message is correct"
  );

  if (errors > 0) {
    console.error(`\n❌ QA FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Flow Policy QA checks passed.');
    process.exit(0);
  }
}

main();
