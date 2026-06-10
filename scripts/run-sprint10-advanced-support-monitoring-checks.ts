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
  console.log('=== PlayIQ Sprint 10D Advanced Support and Monitoring Master Runner ===\n');

  const commands = [
    { desc: 'TypeScript Static Compile Check', cmd: 'npx tsc --noEmit' },
    { desc: 'ESLint Code Quality Audit', cmd: 'npm run lint' },
    { desc: 'Verifying advanced support workflows and safety boundaries', cmd: 'npm run verify:advanced-beta-support-workflows' },
    { desc: 'Auditing support issue category tag consistency', cmd: 'npm run audit:support-categories' },
    { desc: 'Running Sprint 10C master security & support checks', cmd: 'npm run verify:sprint10-security-support' },
    { desc: 'Evaluating Sprint 10 readiness checks', cmd: 'npm run verify:sprint10-readiness' },
    { desc: 'Auditing Sprint 10 blockers', cmd: 'npm run audit:sprint10-blockers' },
    { desc: 'Verifying production config secrets', cmd: 'npm run verify:production-config-secrets' },
    { desc: 'Verifying staging to production readiness', cmd: 'npm run verify:staging-to-production' },
    { desc: 'Verifying backup, rollback, and release procedures', cmd: 'npm run verify:backup-rollback-release' },
    { desc: 'Verifying UAT readiness checklist', cmd: 'npm run verify:uat-readiness' },
    { desc: 'Verifying beta release workflow', cmd: 'npm run verify:beta-release' },
    { desc: 'Auditing beta go-no-go checklist constraints', cmd: 'npm run audit:beta-go-no-go' },
    { desc: 'Auditing support issue cosmetic vs critical priority', cmd: 'npm run audit:issue-priority' },
    { desc: 'Validating Next.js project production build', cmd: 'npm run build' }
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
  console.log('                 FINAL SPRINT 10D MONITORING & READINESS REPORT');
  console.log('======================================================================');

  if (anyFailed) {
    console.log('FINAL READINESS STATE: [ HOLD ]');
    console.log('Status: One or more validation checks failed.');
    console.log('Action: Review the error outputs and address any outstanding blockers.');
    console.log('======================================================================');
    exit(1);
  } else {
    console.log('FINAL READINESS STATE: [ READY_FOR_PRODUCTION_APPROVAL_SUPPORT_READY_MONITORING_READY ]');
    console.log('Status: All advanced support workflows, category audits, and monitoring readiness checks passed.');
    console.log('\n--- Release Operational Notices (HOLD policy) ---');
    console.log('1. Production deployment remains on HOLD.');
    console.log('2. This status does NOT mean production is deployed.');
    console.log('3. This status does NOT mean production smoke tests have passed.');
    console.log('4. This status does NOT mean beta invites have been sent.');
    console.log('5. The monitoring cadence is ready, but it is not actively proven under production traffic.');
    console.log('======================================================================');
    exit(0);
  }
}

main().catch((err) => {
  console.error('Master runner crash:', err);
  exit(1);
});
