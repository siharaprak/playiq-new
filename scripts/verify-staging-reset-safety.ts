import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Staging Reset Safety QA Verification ===\n');

  let failed = false;

  const results = [
    { rule: 'Aborts on production environment detected', depth: 'static verified', status: 'PENDING' },
    { rule: 'Runs in dry-run mode by default', depth: 'static verified', status: 'PENDING' },
    { rule: 'Requires explicit confirmation values', depth: 'static verified', status: 'PENDING' },
    { rule: 'Scopes queries to test profiles only', depth: 'static verified', status: 'PENDING' },
    { rule: 'Contains no TRUNCATE or unbounded DELETE statements', depth: 'static verified', status: 'PENDING' },
    { rule: 'Uses explicit allowlist/localhost guards over fuzzy URL matches', depth: 'static verified', status: 'PENDING' }
  ];

  const resetScriptPath = path.resolve(__dirname, '../scripts/reset-staging-test-data.ts');
  if (!fs.existsSync(resetScriptPath)) {
    console.error('❌ FAILED: reset-staging-test-data.ts script not found.');
    exit(1);
    return;
  }

  const content = fs.readFileSync(resetScriptPath, 'utf8');

  // 1. Aborts on production environment detected
  const hasProdGuard = content.includes("nodeEnv === 'production'") && 
                       content.includes("vercelEnv === 'production'") && 
                       content.includes("playiqEnv === 'production'");
  if (hasProdGuard) {
    console.log('✅ PASSED: Reset script refuses execution when production environment is detected.');
    results[0].status = 'PASS';
  } else {
    console.error('❌ FAILED: Production environment safety guards missing.');
    results[0].status = 'FAIL';
    failed = true;
  }

  // 2. Runs in dry-run mode by default
  const hasDryRunDefault = content.includes("process.argv.includes('--execute')") && 
                           content.includes('isExecute ?');
  if (hasDryRunDefault) {
    console.log('✅ PASSED: Reset script defaults to dry-run unless --execute argument is specified.');
    results[1].status = 'PASS';
  } else {
    console.error('❌ FAILED: Dry-run defaults or --execute check missing.');
    results[1].status = 'FAIL';
    failed = true;
  }

  // 3. Requires explicit confirmation values
  const hasConfirmation = content.includes("confirmReset !== 'RESET_PLAYIQ_STAGING_TEST_DATA'");
  if (hasConfirmation) {
    console.log('✅ PASSED: Reset script requires CONFIRM_STAGING_RESET set to RESET_PLAYIQ_STAGING_TEST_DATA.');
    results[2].status = 'PASS';
  } else {
    console.error('❌ FAILED: Explicit confirmation value validation missing.');
    results[2].status = 'FAIL';
    failed = true;
  }

  // 4. Scopes queries to test profiles only
  const scopesToTestProfiles = content.includes('.or(\'email.like.%@playiq.test,email.like.%@test.playiq.io\')') && 
                               content.includes('testProfileIds');
  if (scopesToTestProfiles) {
    console.log('✅ PASSED: Reset script scopes database deletions strictly to profiles with test email domains.');
    results[3].status = 'PASS';
  } else {
    console.error('❌ FAILED: Database queries do not scope profile deletion to approved domains.');
    results[3].status = 'FAIL';
    failed = true;
  }

  // 5. Contains no TRUNCATE or unbounded DELETE statements
  const hasTruncate = content.toLowerCase().includes('truncate');
  
  // Verify that any delete statement is bounded (e.g. .delete().in() or .delete().eq() rather than just .delete() without filters)
  const deleteLines = content.split('\n').filter(line => line.includes('.delete()'));
  let deleteIsBounded = true;
  for (const line of deleteLines) {
    // If a line does not chain into a filter on the same line or nearby
    const lineIndex = content.indexOf(line);
    const slice = content.substring(lineIndex, lineIndex + 100);
    if (!slice.includes('.in(') && !slice.includes('.eq(')) {
      deleteIsBounded = false;
    }
  }

  if (!hasTruncate && deleteIsBounded) {
    console.log('✅ PASSED: No TRUNCATE calls or unbounded delete statements found in reset script.');
    results[4].status = 'PASS';
  } else {
    console.error(`❌ FAILED: Truncate found or unbounded deletes detected. (hasTruncate: ${hasTruncate}, deleteIsBounded: ${deleteIsBounded})`);
    results[4].status = 'FAIL';
    failed = true;
  }

  // 6. Prefer explicit allowlist/localhost guards over fuzzy URL matches
  const hasUrlGuards = content.includes('PLAYIQ_ALLOWED_RESET_PROJECT_REF') && 
                       content.includes('localhost') && 
                       content.includes('127.0.0.1');
  if (hasUrlGuards) {
    console.log('✅ PASSED: Reset script verifies NEXT_PUBLIC_SUPABASE_URL matches explicit reference or localhost.');
    results[5].status = 'PASS';
  } else {
    console.error('❌ FAILED: Explicit localhost / project reference guards missing.');
    results[5].status = 'FAIL';
    failed = true;
  }

  // Print results table
  console.log('\n==========================================================================================');
  console.log('                      STAGING RESET SAFETY VERIFICATION REPORT');
  console.log('==========================================================================================');
  console.log('| Rule / Safety Gate                                    | Verification Depth                   | Status |');
  console.log('|-------------------------------------------------------|--------------------------------------|--------|');
  for (const r of results) {
    const ruleStr = r.rule.padEnd(53);
    const depthStr = r.depth.padEnd(36);
    const statusStr = r.status.padEnd(6);
    console.log(`| ${ruleStr} | ${depthStr} | ${statusStr} |`);
  }
  console.log('==========================================================================================\n');

  if (failed) {
    console.error('❌ Staging reset safety verification FAILED.');
    exit(1);
  } else {
    console.log('✅ Staging reset safety verification PASSED.');
    exit(0);
  }
}

main();
