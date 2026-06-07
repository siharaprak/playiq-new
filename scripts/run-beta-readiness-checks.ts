import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

function runCommand(command: string): boolean {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (err) {
    return false;
  }
}

async function main() {
  console.log('=== PlayIQ Beta Release Readiness Runner ===\n');

  // Check checklist files exist
  const filesToCheck = {
    stagingRehearsal: 'docs/runbooks/beta-staging-rehearsal.md',
    productionSmoke: 'docs/runbooks/beta-production-smoke-checklist.md',
    rollbackPlan: 'docs/runbooks/beta-launch-controls-and-rollback.md',
    supportProtocol: 'docs/runbooks/beta-first-user-support-protocol.md',
    knownIssues: 'docs/runbooks/beta-known-issues-and-deferred-debt.md',
  };

  const missingFiles: string[] = [];
  for (const [key, relativePath] of Object.entries(filesToCheck)) {
    const fullPath = path.resolve(process.cwd(), relativePath);
    if (!fs.existsSync(fullPath)) {
      missingFiles.push(relativePath);
    }
  }

  // 1. Run local environment variable check (required for staging)
  console.log('--- Checking local environment readiness ---');
  const envLocalPass = runCommand('npx tsx scripts/verify-beta-env-readiness.ts local');

  // 2. Run release checks (compilation, static audits, etc.)
  console.log('\n--- Running Beta Release Validation Suite ---');
  const releaseChecksPass = runCommand('npx tsx scripts/run-beta-release-checks.ts');

  // 3. Run staging smoke checks (static client leakage + connection verify)
  console.log('\n--- Running Staging Smoke Verification ---');
  const stagingSmokePass = runCommand('npx tsx scripts/verify-staging-smoke-checklist.ts');

  // If local env check or release checks or staging smoke checks fail, status is HOLD
  if (!envLocalPass || !releaseChecksPass || !stagingSmokePass) {
    console.log('\n==================================================');
    console.log('FINAL READINESS STATE: [ HOLD ]');
    console.log('Reason: Critical local checks, release verification, or staging smoke tests failed.');
    console.log('==================================================');
    process.exitCode = 1;
    setTimeout(() => process.exit(1), 100);
    return;
  }

  // At this point, staging readiness is validated.
  // Now let's see if we are ready for production approval.
  console.log('\n--- Evaluating Production Approval Criteria ---');

  // Run go/no-go audit
  console.log('Evaluating Go/No-Go checklists...');
  const goNoGoPass = runCommand('npx tsx scripts/audit-beta-go-no-go.ts');

  // Run production env checks
  console.log('Verifying staging/production environment variables...');
  const envStagingPass = runCommand('npx tsx scripts/verify-beta-env-readiness.ts staging');
  const envProdPass = runCommand('npx tsx scripts/verify-beta-env-readiness.ts production');

  // Run production smoke readiness check (statically checks manual confirmations)
  console.log('Verifying production smoke readiness...');
  const prodSmokePass = runCommand('npx tsx scripts/verify-production-smoke-readiness.ts');

  const allFilesExist = missingFiles.length === 0;
  if (!allFilesExist) {
    console.warn('⚠️ Warning: Missing required release runbooks/checklists:');
    missingFiles.forEach(f => console.warn(`   - ${f}`));
  }

  const isGo = goNoGoPass;

  const readyForProduction = 
    isGo &&
    envStagingPass &&
    envProdPass &&
    stagingSmokePass && // verified above
    prodSmokePass &&
    allFilesExist;

  console.log('\n==================================================');
  if (readyForProduction) {
    console.log('FINAL READINESS STATE: [ READY_FOR_PRODUCTION_APPROVAL ]');
    console.log('Status: All checklists, environment configs, and runbooks verified.');
  } else {
    console.log('FINAL READINESS STATE: [ READY_FOR_STAGING ]');
    console.log('Status: Staging readiness verified, but production requirements are pending.');
    if (!isGo) console.log('- Go/No-Go decision is not GO.');
    if (!envStagingPass || !envProdPass) console.log('- Staging/Production env var verification failed.');
    if (!prodSmokePass) console.log('- Production smoke readiness failed.');
    if (!allFilesExist) console.log('- Missing one or more operational documents/runbooks.');
  }
  console.log('==================================================');
  
  process.exitCode = 0;
}

main().catch((err) => {
  console.error('Master runner error:', err);
  process.exit(1);
});
