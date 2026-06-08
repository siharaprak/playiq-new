import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

interface BlockerItem {
  id: string;
  area: string;
  issue: string;
  severity: 'P0' | 'P1' | 'P2';
  evidence: string;
  status: 'PASS' | 'FAIL' | 'PASS with deferred debt';
  requiredFix: string;
  decision: 'HOLD' | 'PASS';
}

async function main() {
  console.log('=== PlayIQ Sprint 10 Blocker Audit Runner ===\n');

  const checklistPath = path.resolve(process.cwd(), 'docs/runbooks/staging-to-production-readiness-checklist.md');
  const backupPath = path.resolve(process.cwd(), 'docs/runbooks/beta-backup-rollback-release-procedures.md');
  
  const placeholders = ['[User/Deploy Lead]', 'TBD', 'TODO', 'placeholder', 'PENDING', 'None', 'N/A', 'NOT PERFORMED'];

  // Read checklist file values
  let stagingUrl = 'PENDING';
  let stagingSmoke = 'PENDING';
  let rollbackTarget = 'TBD';
  let backupsStatus = 'TBD';
  let envStagingProof = 'PENDING';
  let envProdProof = 'PENDING';
  let ownersMissing = true;

  if (fs.existsSync(checklistPath)) {
    const content = fs.readFileSync(checklistPath, 'utf8');
    const stagingUrlMatch = content.match(/-\s+\*\*Staging Deployment URL\*\*:\s*(.+)/);
    const stagingSmokeMatch = content.match(/-\s+\*\*Staging Smoke \(Live Vercel\)\*\*:\s*(.+)/);
    const rollbackMatch = content.match(/-\s+\*\*Previous Stable Vercel Deployment ID\*\*:\s*(.+)/);
    const backupsMatch = content.match(/-\s+\*\*Supabase Backups Status\*\*:\s*(.+)/);
    const stagingProofMatch = content.match(/-\s+\*\*Staging Environment Proof\*\*:\s*(.+)/);
    const prodProofMatch = content.match(/-\s+\*\*Production Environment Proof\*\*:\s*(.+)/);
    
    if (stagingUrlMatch) stagingUrl = stagingUrlMatch[1].trim();
    if (stagingSmokeMatch) stagingSmoke = stagingSmokeMatch[1].trim();
    if (rollbackMatch) rollbackTarget = rollbackMatch[1].trim();
    if (backupsMatch) backupsStatus = backupsMatch[1].trim();
    if (stagingProofMatch) envStagingProof = stagingProofMatch[1].trim();
    if (prodProofMatch) envProdProof = prodProofMatch[1].trim();

    const hasOwnerPlaceholder = content.includes('[User/Deploy Lead]') || content.includes('TODO');
    ownersMissing = hasOwnerPlaceholder;
  }

  // Blocker audits list
  const blockers: BlockerItem[] = [];

  // 1. Staging preview deployment URL
  const stagingUrlFail = placeholders.some(ph => stagingUrl.toLowerCase().includes(ph.toLowerCase()));
  blockers.push({
    id: 'S10-01',
    area: 'Staging Deploy',
    issue: 'Missing live preview staging deployment URL on Vercel.',
    severity: 'P1',
    evidence: `staging-to-production-readiness-checklist.md: "${stagingUrl}"`,
    status: stagingUrlFail ? 'FAIL' : 'PASS',
    requiredFix: 'Deploy the release commit to Vercel staging preview target and update checklist.',
    decision: stagingUrlFail ? 'HOLD' : 'PASS'
  });

  // 2. Live smoke tests
  const smokeFail = placeholders.some(ph => stagingSmoke.toLowerCase().includes(ph.toLowerCase()));
  blockers.push({
    id: 'S10-02',
    area: 'Live Staging Smoke',
    issue: 'Staging smoke checks not completed on the live URL.',
    severity: 'P1',
    evidence: `staging-to-production-readiness-checklist.md: "${stagingSmoke}"`,
    status: smokeFail ? 'FAIL' : 'PASS',
    requiredFix: 'Execute verification smoke script on live staging URL and update status.',
    decision: smokeFail ? 'HOLD' : 'PASS'
  });

  // 3. Human owner assignments
  blockers.push({
    id: 'S10-03',
    area: 'Owners Assignment',
    issue: 'Human roles (Deploy, Support, Monitoring, Backup, Rollback) have placeholder values.',
    severity: 'P1',
    evidence: 'staging-to-production-readiness-checklist.md: owners section',
    status: ownersMissing ? 'FAIL' : 'PASS',
    requiredFix: 'Replace placeholder TODO values with assigned human owner names.',
    decision: ownersMissing ? 'HOLD' : 'PASS'
  });

  // 4. Specific Vercel rollback target
  const rollbackFail = placeholders.some(ph => rollbackTarget.toLowerCase().includes(ph.toLowerCase()));
  blockers.push({
    id: 'S10-04',
    area: 'Rollback Target',
    issue: 'The rollback target does not map to a specific stable Vercel deployment ID.',
    severity: 'P1',
    evidence: `staging-to-production-readiness-checklist.md: "${rollbackTarget}"`,
    status: rollbackFail ? 'FAIL' : 'PASS',
    requiredFix: 'Identify and document a verified stable Vercel deployment ID/commit.',
    decision: rollbackFail ? 'HOLD' : 'PASS'
  });

  // 5. Database backups confirmation
  const backupFail = placeholders.some(ph => backupsStatus.toLowerCase().includes(ph.toLowerCase()));
  blockers.push({
    id: 'S10-05',
    area: 'Database Backup',
    issue: 'Supabase backups manual confirmation is missing or unverified.',
    severity: 'P1',
    evidence: `staging-to-production-readiness-checklist.md: "${backupsStatus}"`,
    status: backupFail ? 'FAIL' : 'PASS',
    requiredFix: 'Verify backups are enabled in Supabase DB console and update checklist to PASS.',
    decision: backupFail ? 'HOLD' : 'PASS'
  });

  // 6. Production env proof
  const prodEnvFail = placeholders.some(ph => envProdProof.toLowerCase().includes(ph.toLowerCase()));
  blockers.push({
    id: 'S10-06',
    area: 'Production Secrets / Deployment Env Proof',
    issue: 'Production deployment environment has not been independently verified in Vercel production.',
    severity: 'P1',
    evidence: 'verify-beta-env-readiness local checks pass, but deployment-platform proof pending.',
    status: prodEnvFail ? 'FAIL' : 'PASS',
    requiredFix: 'Human deploy owner verifies required environment variable names exist in Vercel production without printing values.',
    decision: prodEnvFail ? 'HOLD' : 'PASS'
  });

  // 7. Stripe paid integration
  blockers.push({
    id: 'S10-07',
    area: 'Stripe Config',
    issue: 'Stripe/payment remains disabled/deferred for free invite-only beta.',
    severity: 'P2',
    evidence: 'sprint-9d go/no-go confirms Stripe disabled/deferred.',
    status: 'PASS with deferred debt',
    requiredFix: 'Keep Stripe disabled/deferred. Do not enable paid checkout during beta.',
    decision: 'PASS'
  });

  // Print markdown table
  console.log('| ID | Area | Issue | Severity | Evidence | Status | Required Fix | Decision |');
  console.log('| -- | ---- | ----- | -------- | -------- | ------ | ------------ | -------- |');
  for (const item of blockers) {
    console.log(
      `| ${item.id} | ${item.area} | ${item.issue} | ${item.severity} | ${item.evidence} | ${item.status} | ${item.requiredFix} | ${item.decision} |`
    );
  }

  let holds = blockers.filter(item => item.decision === 'HOLD');
  console.log('\n-----------------------------------------');
  if (holds.length > 0) {
    console.error(`Status: HOLD. Blocker audit failed with ${holds.length} open P0/P1 launch blockers.`);
    exit(1);
  } else {
    console.log('Status: SUCCESS. All blockers resolved successfully.');
    exit(0);
  }
}

main().catch((err) => {
  console.error('Blocker audit runner crashed:', err);
  exit(1);
});
