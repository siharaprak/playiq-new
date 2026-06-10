import { execSync } from 'child_process';

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
    console.error(`❌ Command failed: ${command}\n`);
    return false;
  }
}

async function main() {
  console.log('=== PlayIQ Sprint 10C Security and Support Validation Master Runner ===\n');

  const commands = [
    { desc: 'TypeScript Static Compile Check', cmd: 'npx tsc --noEmit' },
    { desc: 'ESLint Code Quality Audit', cmd: 'npm run lint' },
    { desc: 'Statically checking for service role leakage & boundary access', cmd: 'npm run verify:final-security-access' },
    { desc: 'Verifying beta support workflows and guidelines', cmd: 'npm run verify:beta-support-workflows' },
    { desc: 'Auditing support issue category tag consistency', cmd: 'npm run audit:support-categories' },
    { desc: 'Evaluating Sprint 10 master readiness checks', cmd: 'npm run verify:sprint10-readiness' },
    { desc: 'Auditing Sprint 10 blocker registry', cmd: 'npm run audit:sprint10-blockers' },
    { desc: 'Checking Vercel staging-to-production checklist config', cmd: 'npm run verify:staging-to-production' },
    { desc: 'Checking backups, rollback, and release runbooks status', cmd: 'npm run verify:backup-rollback-release' },
    { desc: 'Auditing production secret configs and variables', cmd: 'npm run verify:production-config-secrets' },
    { desc: 'Verifying UAT dashboard critical journeys', cmd: 'npm run verify:uat-readiness' },
    { desc: 'Running beta release procedures check', cmd: 'npm run verify:beta-release' },
    { desc: 'Evaluating beta launch go-no-go checklist constraints', cmd: 'npm run audit:beta-go-no-go' },
    { desc: 'Auditing support issue cosmetic vs critical priority rules', cmd: 'npm run audit:issue-priority' },
    { desc: 'Validating Next.js project production build bundles', cmd: 'npm run build' }
  ];

  let anyFailed = false;

  for (const item of commands) {
    console.log(`\n>>> [Executing] ${item.desc} ...`);
    const success = runCommand(item.cmd);
    if (!success) {
      anyFailed = true;
      break;
    }
  }

  console.log('\n======================================================================');
  console.log('                 FINAL SPRINT 10C READINESS REPORT');
  console.log('======================================================================');

  if (anyFailed) {
    console.log('FINAL READINESS STATE: [ HOLD ]');
    console.log('Status: One or more validation checks failed.');
    console.log('Action: Audit the logs above and resolve P0/P1 blockers before release.');
    console.log('======================================================================');
    exit(1);
  } else {
    console.log('FINAL READINESS STATE: [ READY_FOR_PRODUCTION_APPROVAL_SUPPORT_READY ]');
    console.log('Status: All security verification, support workflows, and build checks passed.');
    console.log('\n--- Release Operational Notices ---');
    console.log('1. Production deployment remains on HOLD.');
    console.log('2. This status means support and security readiness validation succeeded.');
    console.log('3. This does NOT mean production is deployed.');
    console.log('4. This does NOT mean the tiny beta batch has launched.');
    console.log('======================================================================');
    exit(0);
  }
}

main().catch((err) => {
  console.error('Master runner crash:', err);
  exit(1);
});
