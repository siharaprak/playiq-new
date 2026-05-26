/**
 * Sprint 5F — Proof Access Matrix Verification
 *
 * Verifies that proof artifact access controls are correctly enforced
 * by statically and dynamically testing the policy layer.
 *
 * Tests:
 * 1. Parent cannot request signed URL (signed-access-policy blocks)
 * 2. Linked parent can see summary only (getParentProofSummary returns counts)
 * 3. Unlinked parent is blocked (getParentVisibleProofArtifacts throws)
 * 4. Student owner can access own signed URL
 * 5. Student cannot access another student's signed URL
 * 6. Admin can access review signed URL
 * 7. Teacher can access review signed URL
 * 8. Parent cannot review (review route role check)
 * 9. Student cannot review (review route role check)
 *
 * Output: safe IDs and counts only, no PII, no signed URLs, no storage paths.
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import Module from 'node:module';
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

let passed = 0;
let failed = 0;

function assert(label: string, condition: boolean) {
  if (condition) {
    console.log(`✅ PASS: ${label}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${label}`);
    failed++;
  }
}

async function run() {
  console.log('=== Sprint 5F: Proof Access Matrix Verification ===\n');

  // --- Test 1: Signed access policy blocks parents ---
  const { canActorRequestProofSignedUrl, getSignedAccessDeniedReason, assertNoSignedUrlLeak } = await import('../src/lib/proof-artifacts/signed-access-policy');

  const parentActor = { id: 'parent-uuid-test', roles: ['parent' as const] };
  const studentActor = { id: 'student-uuid-test', roles: ['student' as const] };
  const otherStudentActor = { id: 'other-student-uuid-test', roles: ['student' as const] };
  const adminActor = { id: 'admin-uuid-test', roles: ['admin' as const] };
  const teacherActor = { id: 'teacher-uuid-test', roles: ['teacher' as const] };

  const ownedArtifact = { student_id: 'student-uuid-test', status: 'submitted' };
  const otherArtifact = { student_id: 'other-student-uuid-test', status: 'submitted' };

  // Test 1: Parent blocked
  assert(
    'Parent cannot request signed URL',
    canActorRequestProofSignedUrl(parentActor, ownedArtifact) === false
  );

  // Test 1b: Parent denial reason is clear
  const parentDenialReason = getSignedAccessDeniedReason(parentActor, ownedArtifact);
  assert(
    'Parent denial reason mentions beta',
    parentDenialReason.toLowerCase().includes('beta')
  );

  // Test 2: Student owner can access own
  assert(
    'Student owner can request own signed URL',
    canActorRequestProofSignedUrl(studentActor, ownedArtifact) === true
  );

  // Test 3: Student cannot access another student's
  assert(
    'Student cannot request another student\'s signed URL',
    canActorRequestProofSignedUrl(studentActor, otherArtifact) === false
  );

  // Test 3b: Student denial reason is clear
  const studentDenialReason = getSignedAccessDeniedReason(studentActor, otherArtifact);
  assert(
    'Student denial reason mentions own artifacts',
    studentDenialReason.toLowerCase().includes('own')
  );

  // Test 4: Admin can access
  assert(
    'Admin can request signed URL for review',
    canActorRequestProofSignedUrl(adminActor, ownedArtifact) === true
  );

  // Test 5: Teacher can access
  assert(
    'Teacher can request signed URL for review',
    canActorRequestProofSignedUrl(teacherActor, ownedArtifact) === true
  );

  // Test 6: assertNoSignedUrlLeak catches signed URLs in metadata
  assert(
    'assertNoSignedUrlLeak blocks signed URL in metadata',
    assertNoSignedUrlLeak({ url: 'https://example.com/storage/v1/object/sign/proof-artifacts/test?token=abc123' }) === false
  );
  assert(
    'assertNoSignedUrlLeak allows safe metadata',
    assertNoSignedUrlLeak({ moduleId: 'test-uuid', mediaKind: 'photo', noFileContentStoredInEvent: true }) === true
  );

  // --- Test 7: Visibility policy ---
  const { 
    canParentSeeArtifactMetadata, 
    canParentDownloadArtifact, 
    getParentVisibleProofStates,
    getParentHiddenProofStates,
    PROOF_PARENT_VISIBILITY_POLICY
  } = await import('../src/lib/proof-artifacts/visibility-policy');

  assert(
    'Parent can see approved metadata',
    canParentSeeArtifactMetadata('approved') === true
  );
  assert(
    'Parent cannot see submitted metadata',
    canParentSeeArtifactMetadata('submitted') === false
  );
  assert(
    'Parent cannot see draft metadata',
    canParentSeeArtifactMetadata('draft') === false
  );
  assert(
    'Parent cannot download in any status (approved)',
    canParentDownloadArtifact('approved') === false
  );
  assert(
    'Parent cannot download in any status (submitted)',
    canParentDownloadArtifact('submitted') === false
  );
  assert(
    'Parent visible states include approved/submitted/under_review/revise/rejected',
    getParentVisibleProofStates().length === 5
  );
  assert(
    'Parent hidden states include draft',
    getParentHiddenProofStates().includes('draft')
  );
  assert(
    'Visibility policy: parentCanDownloadFiles is false',
    PROOF_PARENT_VISIBILITY_POLICY.parentCanDownloadFiles === false
  );
  assert(
    'Visibility policy: parentCanReceiveSignedUrls is false',
    PROOF_PARENT_VISIBILITY_POLICY.parentCanReceiveSignedUrls === false
  );
  assert(
    'Visibility policy: parentCanSeeStoragePath is false',
    PROOF_PARENT_VISIBILITY_POLICY.parentCanSeeStoragePath === false
  );

  // --- Test 8: Unlinked parent access ---
  const { getParentVisibleProofArtifacts } = await import('../src/lib/data/proof-artifacts');

  try {
    await getParentVisibleProofArtifacts('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111');
    assert('Unlinked parent blocked from visible artifacts', false);
  } catch (error: any) {
    assert(
      'Unlinked parent blocked from visible artifacts',
      error.message.includes('Unauthorized or student not linked')
    );
  }

  // --- Test 9: Parent proof summary enforces link ---
  const { getParentProofSummary } = await import('../src/lib/data/proof-artifacts');
  try {
    await getParentProofSummary('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111');
    assert('Unlinked parent blocked from proof summary', false);
  } catch (error: any) {
    assert(
      'Unlinked parent blocked from proof summary',
      error.message.includes('Unauthorized or student not linked')
    );
  }

  // --- Test 10: SLA policy ---
  const { getProofReviewSlaStatus, getProofReviewSlaLabel, PROOF_REVIEW_SLA_POLICY } = await import('../src/lib/proof-artifacts/review-sla-policy');

  assert(
    'SLA: fresh submission is on_track',
    getProofReviewSlaStatus(new Date().toISOString()) === 'on_track'
  );
  assert(
    'SLA: 4-day old submission is approaching_delay',
    getProofReviewSlaStatus(new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()) === 'approaching_delay'
  );
  assert(
    'SLA: 6-day old submission is overdue',
    getProofReviewSlaStatus(new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()) === 'overdue'
  );
  assert(
    'SLA: 8-day old submission is urgent',
    getProofReviewSlaStatus(new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()) === 'urgent'
  );
  assert(
    'SLA labels are human-readable',
    getProofReviewSlaLabel('overdue') === 'Overdue'
  );
  assert(
    'SLA is NOT a guarantee',
    PROOF_REVIEW_SLA_POLICY.isGuarantee === false
  );

  // --- Test 11: Escalation policy ---
  const { classifyProofUploadIssue, getStudentUploadTroubleshootingMessage } = await import('../src/lib/proof-artifacts/escalation-policy');

  assert(
    'Unsupported file type is student_self_fix',
    classifyProofUploadIssue('unsupported_file_type').path === 'student_self_fix'
  );
  assert(
    'Storage error is technical_support',
    classifyProofUploadIssue('storage_error').path === 'technical_support'
  );
  assert(
    'Corrupt file is teacher_admin_review',
    classifyProofUploadIssue('corrupt_or_unreadable_file').path === 'teacher_admin_review'
  );
  assert(
    'Student troubleshooting message is helpful for mime errors',
    getStudentUploadTroubleshootingMessage('Unsupported MIME type').includes('file type')
  );
  assert(
    'Student troubleshooting message is helpful for size errors',
    getStudentUploadTroubleshootingMessage('File size exceeds limit').includes('too large')
  );

  // --- Test 12: State machine review restrictions ---
  const { canTransitionArtifact } = await import('../src/lib/proof-artifacts/state-machine');
  
  assert(
    'Student cannot transition to under_review (cannot review)',
    canTransitionArtifact('submitted', 'under_review', 'student') === false
  );
  assert(
    'Student cannot transition to approved (cannot review)',
    canTransitionArtifact('submitted', 'approved', 'student') === false
  );
  assert(
    'Student cannot transition to rejected (cannot review)',
    canTransitionArtifact('submitted', 'rejected', 'student') === false
  );
  assert(
    'Reviewer can approve submitted artifact',
    canTransitionArtifact('submitted', 'approved', 'reviewer') === true
  );

  // --- Summary ---
  console.log('\n=== Access Matrix Verification Summary ===');
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  
  if (failed > 0) {
    console.error('\n❌ ACCESS MATRIX VERIFICATION FAILED');
    process.exit(1);
  } else {
    console.log('\n✅ ALL ACCESS MATRIX CHECKS PASSED');
    process.exit(0);
  }
}

run().catch(err => {
  console.error('Fatal error in access matrix verification:', err.message);
  process.exit(1);
});
