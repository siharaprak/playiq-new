import { execSync } from 'child_process';

interface CommandToCheck {
  name: string;
  command: string;
  isP0: boolean;
}

const RELEASE_COMMANDS: CommandToCheck[] = [
  { name: 'TypeScript Typecheck', command: 'npx tsc --noEmit', isP0: true },
  { name: 'ESLint Code Audit', command: 'npm run lint', isP0: false },
  { name: 'Next.js Production Build', command: 'npm run build', isP0: true },
  { name: 'verify:role-access-matrix', command: 'npm run verify:role-access-matrix', isP0: true },
  { name: 'verify:progression-edge-cases', command: 'npm run verify:progression-edge-cases', isP0: true },
  { name: 'verify:proof-upload-failures', command: 'npm run verify:proof-upload-failures', isP0: true },
  { name: 'verify:tutor-profile-failures', command: 'npm run verify:tutor-profile-failures', isP0: true },
  { name: 'verify:assistant-profile-failures', command: 'npm run verify:assistant-profile-failures', isP0: true },
  { name: 'verify:parent-dashboard-visibility', command: 'npm run verify:parent-dashboard-visibility', isP0: true },
  { name: 'verify:staging-reset-safety', command: 'npm run verify:staging-reset-safety', isP0: true },
  { name: 'verify:upload-abuse-protection', command: 'npm run verify:upload-abuse-protection', isP0: true },
  { name: 'verify:error-monitoring', command: 'npm run verify:error-monitoring', isP0: true },
  { name: 'verify:proof-access-matrix', command: 'npm run verify:proof-access-matrix', isP0: true },
  { name: 'verify-admin-rbac', command: 'npm run verify-admin-rbac', isP0: true },
  { name: 'verify:knowledge-files', command: 'npm run verify:knowledge-files', isP0: true },
  { name: 'qa:tutor-build-policy', command: 'npm run qa:tutor-build-policy', isP0: true },
  { name: 'verify:assistant-test-safety', command: 'npm run verify:assistant-test-safety', isP0: true },
  { name: 'qa:guided-ai', command: 'npm run qa:guided-ai', isP0: true },
  { name: 'verify:ai-events', command: 'npm run verify:ai-events', isP0: true },
  { name: 'verify:pre-sprint5', command: 'npm run verify:pre-sprint5', isP0: true },
  { name: 'verify:sprint8-blockers', command: 'npm run verify:sprint8-blockers', isP0: true },
  { name: 'audit:beta-blockers', command: 'npm run audit:beta-blockers', isP0: true },
  { name: 'verify:logging-safety', command: 'npm run verify:logging-safety', isP0: true },
  { name: 'verify:cost-controls', command: 'npm run verify:cost-controls', isP0: true },
  { name: 'audit:analytics-coverage', command: 'npm run audit:analytics-coverage', isP0: true },
  { name: 'audit:db-read-patterns', command: 'npm run audit:db-read-patterns', isP0: false },
  { name: 'verify:student-journey', command: 'npm run verify:student-journey', isP0: true },
  { name: 'verify:support-schema', command: 'npm run verify:support-schema', isP0: true },
  { name: 'verify:enrollment-integrity', command: 'npm run verify:enrollment-integrity', isP0: true }
];

async function main() {
  console.log('=== PlayIQ Beta Release Validation Runner ===');
  console.log(`Executing ${RELEASE_COMMANDS.length} verification scripts...\n`);

  const results: { name: string; status: string; isP0: boolean; errorMsg?: string }[] = [];
  let p0Failed = false;

  for (const item of RELEASE_COMMANDS) {
    if (p0Failed) {
      console.log(`[SKIPPED] ${item.name} (due to previous P0 failure)`);
      results.push({ name: item.name, status: 'SKIPPED', isP0: item.isP0 });
      continue;
    }

    console.log(`⏳ Running ${item.name}...`);
    try {
      // Execute the command synchronously in workspace root directory
      execSync(item.command, { stdio: 'inherit' });
      console.log(`✅ ${item.name}: PASS`);
      results.push({ name: item.name, status: 'PASS', isP0: item.isP0 });
    } catch (err: any) {
      console.error(`❌ ${item.name}: FAIL`);
      results.push({ name: item.name, status: 'FAIL', isP0: item.isP0, errorMsg: err.message });
      
      if (item.isP0) {
        console.error(`\n🚨 CRITICAL P0 FAILURE: ${item.name} failed! Aborting execution suite.`);
        p0Failed = true;
      }
    }
  }

  console.log('\n======================================================================');
  console.log('                   RELEASE EVIDENCE SUITE SUMMARY');
  console.log('======================================================================');
  console.log('| Verification Task                       | Priority | Status   |');
  console.log('|-----------------------------------------|----------|----------|');
  
  let failedCount = 0;
  for (const r of results) {
    const nameStr = r.name.padEnd(39);
    const priorityStr = (r.isP0 ? 'P0' : 'P2').padEnd(8);
    const statusStr = r.status.padEnd(8);
    console.log(`| ${nameStr} | ${priorityStr} | ${statusStr} |`);
    if (r.status === 'FAIL') {
      failedCount++;
    }
  }
  console.log('======================================================================\n');

  if (p0Failed || failedCount > 0) {
    console.error(`❌ Release Evidence Suite Failed: ${failedCount} failures detected.`);
    process.exitCode = 1;
  } else {
    console.log('✅ Release Evidence Suite Passed successfully.');
    process.exitCode = 0;
  }
}

main();
