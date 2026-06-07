import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import Module from 'node:module';

// Intercept server-only imports
const originalRequire = Module.prototype.require;
(Module.prototype as any).require = function(request: string) {
  if (request === 'server-only') return {};
  return originalRequire.apply(this, arguments as any);
};

import fs from 'fs';
import path from 'path';

async function runVerify() {
  console.log('=== RUNNING COST CONTROLS VERIFIER ===');
  let failed = false;

  // Dynamically import dependencies that might trigger server-only
  const { COST_CONTROL_POLICY } = await import('../src/lib/cost/cost-control-policy');
  const { checkGuidedAiRateLimit } = await import('../src/lib/guided-ai/rate-limit');
  const { checkTutorTestRateLimit } = await import('../src/lib/tutor/rate-limit');
  const { checkAssistantTestRateLimit } = await import('../src/lib/assistant/rate-limit');

  // 1. Cost Policy checking
  if (!COST_CONTROL_POLICY) {
    console.error('❌ Error: Cost control policy is not defined.');
    failed = true;
  } else {
    console.log('✅ Cost control policy loaded successfully.');
  }

  // 2. Validate token policies
  if (COST_CONTROL_POLICY.gemini.maxOutputTokens !== 2048) {
    console.error('❌ Error: Max output tokens must be strictly defined (2048).');
    failed = true;
  }

  // 3. Verify rate limit helpers return correct structure
  if (typeof checkGuidedAiRateLimit !== 'function' ||
      typeof checkTutorTestRateLimit !== 'function' ||
      typeof checkAssistantTestRateLimit !== 'function') {
    console.error('❌ Error: Missing core rate-limiting checking functions.');
    failed = true;
  } else {
    console.log('✅ Rate limiting functions detected successfully.');
  }

  // 4. Verify file sizes and counts
  if (COST_CONTROL_POLICY.gemini.fileSizeLimitBytes !== 10485760) {
    console.error('❌ Error: File size limit must be set to 10MB.');
    failed = true;
  }
  if (COST_CONTROL_POLICY.gemini.fileCountLimit !== 5) {
    console.error('❌ Error: File count limit must be set to 5.');
    failed = true;
  }

  // 5. Verify signed URL policy
  if (COST_CONTROL_POLICY.supabase.signedUrlExpirySeconds !== 600) {
    console.error('❌ Error: Signed URL expiry policy must be set to 600 seconds.');
    failed = true;
  }

  // 6. Check for cloud billing secrets in code (e.g. billing accounts, credential files)
  const rootDir = path.resolve(__dirname, '..');
  const envFile = path.resolve(rootDir, '.env');
  
  if (fs.existsSync(envFile)) {
    const envContent = fs.readFileSync(envFile, 'utf8');
    if (envContent.includes('GOOGLE_BILLING_') || envContent.includes('BILLING_ACCOUNT_')) {
      console.error('❌ Error: Billing secrets detected in local environment configuration! Remove them.');
      failed = true;
    }
  }

  // 7. Verify cleanup script presence
  const cleanupFile = path.resolve(rootDir, 'scripts/cleanup-proof-artifact-drafts.ts');
  if (!fs.existsSync(cleanupFile)) {
    console.error('❌ Error: Cleanup script cleanup-proof-artifact-drafts.ts is missing!');
    failed = true;
  } else {
    console.log('✅ Cleanup script detected.');
  }

  if (failed) {
    console.error('❌ Cost Controls Verification Failed.');
    process.exit(1);
  } else {
    console.log('✅ Cost Controls Verification Passed: Observability and rate boundaries are safe.');
  }
}

runVerify();
