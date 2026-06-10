import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Sprint 10D Advanced Beta Support Workflows Verification ===\n');

  let failed = false;

  const filesToVerify = [
    {
      name: 'Proof Submission Support Workflow',
      path: '../docs/runbooks/support-workflow-proof-submission-issues.md',
      checks: [
        { pattern: 'proof_upload', message: 'Must contain category label: proof_upload' },
        { pattern: 'proof_review', message: 'Must contain category label: proof_review' },
        { pattern: 'parents cannot access proof files', message: 'Must explicitly restrict parent proof file access' },
        { pattern: 'parents cannot receive proof signed URLs', message: 'Must explicitly restrict parent proof signed URL access' }
      ]
    },
    {
      name: 'Tutor Build Support Workflow',
      path: '../docs/runbooks/support-workflow-tutor-build-issues.md',
      checks: [
        { pattern: 'tutor_build', message: 'Must contain category label: tutor_build' },
        { pattern: 'never expose raw tutor instructions', message: 'Must repeat privacy rule: never expose raw tutor instructions' },
        { pattern: 'never expose raw prompts or raw responses', message: 'Must repeat privacy rule: never expose raw prompts or raw responses' },
        { pattern: 'never expose knowledge file contents', message: 'Must repeat privacy rule: never expose knowledge file contents' },
        { pattern: 'never expose storage paths', message: 'Must repeat privacy rule: never expose storage paths' },
        { pattern: 'parents receive safe summaries only', message: 'Must repeat privacy rule: parents receive safe summaries only' },
        { pattern: 'do not manually mutate activation/progress', message: 'Must repeat privacy rule: do not manually mutate activation/progress' }
      ]
    },
    {
      name: 'Assistant Build Support Workflow',
      path: '../docs/runbooks/support-workflow-assistant-build-issues.md',
      checks: [
        { pattern: 'assistant_build', message: 'Must contain category label: assistant_build' },
        { pattern: 'never expose raw assistant instructions', message: 'Must repeat privacy rule: never expose raw assistant instructions' },
        { pattern: 'never expose raw prompts or raw responses', message: 'Must repeat privacy rule: never expose raw prompts or raw responses' },
        { pattern: 'never expose knowledge file contents', message: 'Must repeat privacy rule: never expose knowledge file contents' },
        { pattern: 'never expose storage paths', message: 'Must repeat privacy rule: never expose storage paths' },
        { pattern: 'parents receive safe summaries only', message: 'Must repeat privacy rule: parents receive safe summaries only' },
        { pattern: 'do not manually mutate activation/progress', message: 'Must repeat privacy rule: do not manually mutate activation/progress' }
      ]
    },
    {
      name: 'Parent Questions Support Workflow',
      path: '../docs/runbooks/support-workflow-parent-questions.md',
      checks: [
        { pattern: 'parent_access', message: 'Must contain category label: parent_access' },
        { pattern: 'privacy_security', message: 'Must contain category label: privacy_security' },
        { pattern: 'billing_beta_policy', message: 'Must contain category label: billing_beta_policy' },
        { pattern: 'parents cannot access proof files', message: 'Must explicitly state parents cannot access proof files' },
        { pattern: 'parents cannot receive proof signed URLs', message: 'Must explicitly state parents cannot receive proof signed URLs' },
        { pattern: 'parents cannot inspect raw tutor/assistant instructions', message: 'Must explicitly state parents cannot inspect raw tutor/assistant instructions' },
        { pattern: 'parents cannot inspect raw AI prompts/responses/logs', message: 'Must explicitly state parents cannot inspect raw AI prompts/responses/logs' },
        { pattern: 'free invite-only beta', message: 'Must specify free invite-only beta policy' },
        { pattern: 'Stripe/payment disabled/deferred', message: 'Must specify Stripe/payment disabled/deferred policy' }
      ]
    },
    {
      name: 'Beta Monitoring Cadence Workflow',
      path: '../docs/runbooks/beta-monitoring-cadence.md',
      checks: [
        { pattern: 'monitoring_beta', message: 'Must contain category label: monitoring_beta' },
        { pattern: 'production deploy remains on HOLD', message: 'Must state production deploy remains on HOLD' },
        { pattern: 'this does not mean production is deployed', message: 'Must clarify production is not deployed' },
        { pattern: 'this does not mean production smoke passed', message: 'Must clarify smoke has not passed' },
        { pattern: 'this does not mean beta invites were sent', message: 'Must clarify invites have not been sent' },
        { pattern: 'monitoring cadence is ready, not actively proven under production traffic', message: 'Must clarify monitoring is not proven under traffic' },
        { pattern: 'no invite expansion while any P0 or P1', message: 'Must enforce expansion gate: no invite expansion while P0/P1 is open' },
        { pattern: 'no invite expansion before production smoke tests pass', message: 'Must enforce expansion gate: no invite expansion before production smoke passes' },
        { pattern: 'no invite expansion if the support queue backlog is unmanaged', message: 'Must enforce expansion gate: no invite expansion if backlog is unmanaged' },
        { pattern: 'no invite expansion if any parent privacy, proof upload, auth/login, or AI safety issues appear', message: 'Must enforce expansion gate: no invite expansion on critical issues' },
        { pattern: 'pause beta immediately if the rollback target becomes invalid', message: 'Must enforce beta pause trigger' }
      ]
    }
  ];

  // We obfuscate the absolute path literal string so the script won't self-flag
  const absoluteUrlPattern = 'file:/' + '//c:/Users/';

  const invalidPlaceholders = [
    'TODO',
    'TBD',
    'PENDING',
    'N/A',
    '[Owner]',
    '[Support Lead]',
    'Project Deploy Owner',
    'Project Support Lead',
    'placeholder',
    'sample@email.com',
    absoluteUrlPattern
  ];

  for (const wf of filesToVerify) {
    const fullPath = path.resolve(__dirname, wf.path);
    console.log(`Checking file: ${wf.name} (${path.relative(process.cwd(), fullPath)})`);

    if (!fs.existsSync(fullPath)) {
      console.error(`  ❌ FAILED: File does not exist.`);
      failed = true;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Placeholder and Absolute Path Check
    let hasPlaceholder = false;
    for (const placeholder of invalidPlaceholders) {
      if (content.includes(placeholder)) {
        console.error(`  ❌ FAILED placeholder check: Found forbidden pattern: "${placeholder}"`);
        failed = true;
        hasPlaceholder = true;
      }
    }
    if (!hasPlaceholder) {
      console.log('  ✅ Passed placeholder & absolute URL checks.');
    }

    // 2. Custom Rules Check
    let passedAllCustom = true;
    for (const check of wf.checks) {
      if (!content.toLowerCase().includes(check.pattern.toLowerCase())) {
        console.error(`  ❌ FAILED rule check: ${check.message} (missing: "${check.pattern}")`);
        failed = true;
        passedAllCustom = false;
      }
    }
    if (passedAllCustom) {
      console.log('  ✅ Passed all custom rule checks.');
    }

    // 3. Confirm alignment with support_issues table schema
    const mentionsDbSchema = content.includes('support_issues');
    const claimsNewDb = content.includes('create a new table') || content.includes('new ticket table');
    if (mentionsDbSchema && !claimsNewDb) {
      console.log('  ✅ Passed database schema alignment check.');
    } else {
      console.error('  ❌ FAILED: Workflows should align with support_issues DB table schema without creating new tables.');
      failed = true;
    }

    console.log();
  }

  // Also check the verifier scripts themselves for any file:/// URLs
  const scriptsToVerify = [
    'verify-advanced-beta-support-workflows.ts',
    'run-sprint10-advanced-support-monitoring-checks.ts',
    'audit-support-category-consistency.ts'
  ];

  for (const script of scriptsToVerify) {
    const fullPath = path.resolve(__dirname, script);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(absoluteUrlPattern)) {
        console.error(`❌ FAILED: Script ${script} contains absolute file URLs.`);
        failed = true;
      } else {
        console.log(`✅ Script ${script} passes absolute URL check.`);
      }
    }
  }

  if (failed) {
    console.error('❌ Sprint 10D Advanced Support Workflows verification FAILED.');
    exit(1);
  } else {
    console.log('✅ All Sprint 10D Advanced Support Workflows verification checks PASSED.');
    exit(0);
  }
}

main();
