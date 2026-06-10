import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Beta Support Workflows Verification ===\n');

  let failed = false;

  const workflows = [
    { name: 'Beta Support Master Runbook', path: '../docs/runbooks/beta-support-runbook.md' },
    { name: 'Onboarding Support Workflow', path: '../docs/runbooks/support-workflow-onboarding-issues.md' },
    { name: 'Login Support Workflow', path: '../docs/runbooks/support-workflow-login-issues.md' },
    { name: 'Hardware/Device Support Workflow', path: '../docs/runbooks/support-workflow-hardware-device-issues.md' }
  ];

  for (const wf of workflows) {
    const fullPath = path.resolve(__dirname, wf.path);
    console.log(`Checking: ${wf.name} (${path.relative(process.cwd(), fullPath)})`);

    if (!fs.existsSync(fullPath)) {
      console.error(`❌ FAILED: File does not exist.`);
      failed = true;
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    // 1. Check for placeholders
    const placeholders = ['TODO', 'TBD', 'PENDING', 'N/A', '[Owner]', '[Support Lead]'];
    const foundPlaceholders = placeholders.filter(p => content.includes(p));
    
    if (foundPlaceholders.length > 0) {
      console.error(`❌ FAILED: Found placeholder strings: ${JSON.stringify(foundPlaceholders)}`);
      failed = true;
    } else {
      console.log('✅ Passed placeholder check.');
    }

    // 2. Check for unsafe credential gathering
    const forbiddenKeywords = ['ask the user for their password', 'ask for their password', 'request passwords', 'request OTP', 'request magic link', 'ask for session tokens', 'ask for verification codes'];
    const foundForbidden = forbiddenKeywords.filter(k => content.toLowerCase().includes(k.toLowerCase()));

    // Make sure we explicitly state we must NEVER ask for these
    const reinforcesSafety = content.includes('never') || content.includes('NEVER') || content.includes('unsafe');

    if (foundForbidden.length > 0 && !reinforcesSafety) {
      console.error(`❌ FAILED: Document might contain unsafe data collection guidelines: ${JSON.stringify(foundForbidden)}`);
      failed = true;
    } else {
      console.log('✅ Passed safe data guidelines check.');
    }

    // 3. Confirm alignment with support_issues database system
    const mentionsDbSchema = content.includes('support_issues') || content.includes('support_issues.metadata');
    const claimsNewDb = content.includes('create a new table') || content.includes('new ticket table') || content.includes('ticket database table');

    if (mentionsDbSchema && !claimsNewDb) {
      console.log('✅ Passed database schema alignment check.');
    } else {
      console.error('❌ FAILED: Workflows should align with support_issues DB table schema without creating new tables.');
      failed = true;
    }

    // 4. Confirm Stripe remains disabled/deferred
    const mentionsStripeOrBilling = content.includes('Stripe') || content.includes('billing') || content.includes('payment');
    const isFreeBeta = content.includes('free') || content.includes('invite-only') || content.includes('disabled/deferred');

    if (mentionsStripeOrBilling && isFreeBeta) {
      console.log('✅ Passed Stripe beta check.');
    } else {
      console.error('❌ FAILED: Support runbooks must explicitly reflect free/invite-only disabled/deferred Stripe policies.');
      failed = true;
    }

    console.log();
  }

  if (failed) {
    console.error('❌ Support workflows verification FAILED.');
    exit(1);
  } else {
    console.log('✅ All support workflows verification checks PASSED.');
    exit(0);
  }
}

main();
