import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('=== Production Smoke Readiness Verifier ===\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  // 1. Verify that storage buckets are manually confirmed private in the docs.
  const triageDocPath = path.resolve(process.cwd(), 'docs/sprint/sprint-9d-beta-go-no-go-checklist-and-issue-triage.md');
  if (fs.existsSync(triageDocPath)) {
    const content = fs.readFileSync(triageDocPath, 'utf8');
    const token = 'Manual confirmation: Supabase storage buckets proof-artifacts and knowledge-files are private.';
    
    // Ensure it doesn't match templates/instruction texts by ignoring brackets/quotes
    const lines = content.split('\n');
    const isConfirmed = lines.some(line => {
      const trimmed = line.trim();
      return trimmed.includes(token) && !trimmed.includes('[') && !trimmed.includes(']') && !trimmed.includes('`');
    });

    assert(isConfirmed, 'Supabase storage buckets (proof-artifacts and knowledge-files) manually confirmed private in docs.');
  } else {
    console.error(`❌ FAIL: Sprint triage document not found at: ${triageDocPath}`);
    errors++;
  }

  // 2. Assert that staging resets are strictly disabled in production
  const resetScriptPath = path.resolve(process.cwd(), 'scripts/reset-staging-test-data.ts');
  if (fs.existsSync(resetScriptPath)) {
    const content = fs.readFileSync(resetScriptPath, 'utf8');
    const hasProdGuard = content.includes("nodeEnv === 'production'") && 
                         content.includes("vercelEnv === 'production'") && 
                         content.includes("playiqEnv === 'production'");
    assert(hasProdGuard, 'Staging destructive resets are strictly disabled/blocked on production environments.');
  } else {
    console.warn('⚠️ Warning: reset-staging-test-data.ts not found. Skipping reset safety check.');
  }

  // 3. Confirm that Stripe policy is explicitly documented as deferred/disabled
  if (fs.existsSync(triageDocPath)) {
    const content = fs.readFileSync(triageDocPath, 'utf8');
    const hasStripeDeferred = content.includes('Stripe/payment is disabled/deferred for free/invite beta');
    assert(hasStripeDeferred, 'Stripe deferred/disabled policy for free/invite beta is explicitly documented.');
  }

  console.log('\n-----------------------------------------');
  if (errors > 0) {
    console.error(`Status: HOLD. Production smoke readiness failed with ${errors} error(s).`);
    process.exitCode = 1;
    setTimeout(() => process.exit(1), 100);
  } else {
    console.log('Status: SUCCESS. Production smoke readiness checklist verified.');
    process.exitCode = 0;
  }
}

main().catch((err) => {
  console.error('Production smoke readiness error:', err);
  process.exit(1);
});
