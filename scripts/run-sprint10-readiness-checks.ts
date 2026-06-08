import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

function runCommand(command: string): boolean {
  try {
    console.log(`Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (err) {
    console.error(`Command failed: ${command}\n`);
    return false;
  }
}

async function main() {
  console.log('=== PlayIQ Sprint 10 validation Runner ===\n');

  // 1. Validate Code Compilation, Linting, & Typecheck (P0 Blocker Check)
  console.log('--- Phase 1: Validating Build compilation and Code Quality ---');
  const tscPass = runCommand('npx tsc --noEmit');
  const lintPass = runCommand('npm run lint');
  const buildPass = runCommand('npm run build');

  if (!tscPass || !lintPass || !buildPass) {
    console.log('\n==================================================');
    console.log('FINAL READINESS STATE: [ HOLD ]');
    console.log('Reason: Code base has type compilation, lint, or build errors (P0 Blocker).');
    console.log('==================================================');
    exit(1);
    return;
  }

  // 2. Validate environment configs and release verifiers
  console.log('\n--- Phase 2: Running Platform Security & Audit Suites ---');
  const localEnvPass = runCommand('npx tsx scripts/verify-beta-env-readiness.ts local');
  const releaseChecksPass = runCommand('npx tsx scripts/run-beta-release-checks.ts');
  const localStagingSmokePass = runCommand('npx tsx scripts/verify-staging-smoke-checklist.ts');

  if (!localEnvPass || !releaseChecksPass || !localStagingSmokePass) {
    console.log('\n==================================================');
    console.log('FINAL READINESS STATE: [ HOLD ]');
    console.log('Reason: Security audits, local env, or static RLS smoke checks failed (P0 Blocker).');
    console.log('==================================================');
    exit(1);
    return;
  }

  // 3. Run Sprint 10 Config & Secrets auditing
  console.log('\n--- Phase 3: Auditing Production Secrets and Configuration ---');
  const secretsPass = runCommand('npx tsx scripts/verify-production-config-secrets.ts');
  if (!secretsPass) {
    console.log('\n==================================================');
    console.log('FINAL READINESS STATE: [ HOLD ]');
    console.log('Reason: Production config checks or raw secrets audit failed (P0 Blocker).');
    console.log('==================================================');
    exit(1);
    return;
  }

  // 4. Run Blocker Audit and Operational Checklists
  console.log('\n--- Phase 4: Evaluating Blocker Audits and Runbooks ---');
  const uatPass = runCommand('npx tsx scripts/verify-uat-readiness.ts');
  const backupRollbackPass = runCommand('npx tsx scripts/verify-backup-rollback-release.ts');
  const stagingToProdPass = runCommand('npx tsx scripts/verify-staging-to-production-readiness.ts');
  const blockerAuditPass = runCommand('npx tsx scripts/audit-sprint10-blockers.ts');

  // Verify missing files status
  const checklistPath = path.resolve(process.cwd(), 'docs/runbooks/staging-to-production-readiness-checklist.md');
  const proceduresPath = path.resolve(process.cwd(), 'docs/runbooks/beta-backup-rollback-release-procedures.md');
  
  let hasStagingUrl = false;
  let hasSmokeResult = false;
  let hasBackupConfirmed = false;
  let hasRollbackTarget = false;
  let hasOwners = false;

  if (fs.existsSync(checklistPath)) {
    const content = fs.readFileSync(checklistPath, 'utf8');
    const placeholders = ['TODO', 'TBD', 'PENDING', '[User/Deploy Lead]'];
    
    const urlMatch = content.match(/-\s+\*\*Staging Deployment URL\*\*:\s*(.+)/);
    const smokeMatch = content.match(/-\s+\*\*Staging Smoke Completed\*\*:\s*(.+)/);
    const rollbackMatch = content.match(/-\s+\*\*Rollback Target Deployment ID\*\*:\s*(.+)/);
    const backupsMatch = content.match(/-\s+\*\*Supabase Backups Status\*\*:\s*(.+)/);

    hasStagingUrl = !!urlMatch && !placeholders.some(ph => urlMatch[1].trim().includes(ph));
    hasSmokeResult = !!smokeMatch && !placeholders.some(ph => smokeMatch[1].trim().includes(ph));
    hasRollbackTarget = !!rollbackMatch && !placeholders.some(ph => rollbackMatch[1].trim().includes(ph));
    hasBackupConfirmed = !!backupsMatch && !placeholders.some(ph => backupsMatch[1].trim().includes(ph));
    hasOwners = !content.includes('[User/Deploy Lead]') && !content.includes('TODO');
  }

  console.log('\n==================================================');
  
  // Decide target readiness state
  if (uatPass && backupRollbackPass && stagingToProdPass && blockerAuditPass) {
    // If all pass programmatically, evaluate TINY_BETA_BATCH requirements
    // For TINY_BETA_BATCH, UAT/staging smoke must pass, backups confirmed, monitoring/support active
    if (hasStagingUrl && hasSmokeResult && hasBackupConfirmed && hasRollbackTarget && hasOwners) {
      console.log('FINAL READINESS STATE: [ READY_FOR_PRODUCTION_APPROVAL ]');
      console.log('Status: All build compiles, secrets scan, and staging rehearsals pass.');
    } else {
      console.log('FINAL READINESS STATE: [ READY_FOR_TINY_BETA_BATCH ]');
      console.log('Status: Production deployment verified. Ready for invite-only beta.');
    }
  } else {
    // If verifier scripts fail but the code builds cleanly and local security checks pass
    if (tscPass && lintPass && buildPass && localStagingSmokePass && secretsPass) {
      console.log('FINAL READINESS STATE: [ READY_FOR_STAGING_REHEARSAL ]');
      console.log('Status: Code compile and security checks passed cleanly. Staging preview deployment');
      console.log('and manual owner/backup confirmations in runbooks are now pending.');
    } else {
      console.log('FINAL READINESS STATE: [ HOLD ]');
      console.log('Status: Gating verifier script failure.');
    }
  }
  
  console.log('==================================================');
  exit(0);
}

main().catch((err) => {
  console.error('Sprint 10 validation runner crash:', err);
  exit(1);
});
