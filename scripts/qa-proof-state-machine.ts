import { canTransitionArtifact } from '../src/lib/proof-artifacts/state-machine';

function run() {
  console.log('--- Proof State Machine QA ---');
  let failed = 0;

  const tests = [
    // Student allowed
    { current: 'draft', target: 'submitted', actor: 'student', allowed: true },
    { current: 'revise', target: 'submitted', actor: 'student', allowed: true },
    { current: 'rejected', target: 'submitted', actor: 'student', allowed: false },
    
    // Student forbidden
    { current: 'submitted', target: 'under_review', actor: 'student', allowed: false },
    { current: 'under_review', target: 'approved', actor: 'student', allowed: false },
    { current: 'approved', target: 'draft', actor: 'student', allowed: false },
    { current: 'draft', target: 'approved', actor: 'student', allowed: false },

    // Reviewer allowed
    { current: 'submitted', target: 'under_review', actor: 'reviewer', allowed: true },
    { current: 'under_review', target: 'approved', actor: 'reviewer', allowed: true },
    { current: 'under_review', target: 'rejected', actor: 'reviewer', allowed: true },
    { current: 'under_review', target: 'revise', actor: 'reviewer', allowed: true },

    // Reviewer forbidden
    { current: 'draft', target: 'under_review', actor: 'reviewer', allowed: false },
    { current: 'draft', target: 'approved', actor: 'reviewer', allowed: false },
  ];

  for (const t of tests) {
    const result = canTransitionArtifact(t.current as any, t.target as any, t.actor as any);
    if (result !== t.allowed) {
      console.error(`❌ FAILED: ${t.current} -> ${t.target} by ${t.actor}. Expected ${t.allowed}, got ${result}`);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n❌ FAILED ${failed} state machine tests.`);
    process.exit(1);
  }

  console.log(`✅ PASSED all state machine transition rules.`);
  process.exit(0);
}

run();
