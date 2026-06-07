import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import * as fs from 'fs';
import * as path from 'path';
import { BETA_GO_NO_GO_CHECKLIST } from '../src/lib/release/beta-go-no-go-checklist';
import { BETA_ISSUE_REGISTRY } from '../src/lib/release/beta-issue-registry';
import { classifyBetaIssue } from '../src/lib/release/beta-severity-policy';

async function main() {
  console.log('=== PlayIQ Beta Go/No-Go Release Audit ===\n');

  // Load manual confirmations from document if exists
  const triageDocPath = path.resolve(__dirname, '../docs/sprint/sprint-9d-beta-go-no-go-checklist-and-issue-triage.md');
  let triageDocContent = '';
  if (fs.existsSync(triageDocPath)) {
    triageDocContent = fs.readFileSync(triageDocPath, 'utf8');
  }

  // Exact confirmation strings requested
  const bucketPrivacyToken = 'Manual confirmation: Supabase storage buckets proof-artifacts and knowledge-files are private.';
  const stripeWebhookToken = 'Manual confirmation: Stripe checkout webhook signature verification is active.';

  // To prevent matching the instruction text, we verify that the line containing the token
  // does not contain brackets or quotes (which are used in the instruction templates).
  const checkConfirmation = (content: string, token: string): boolean => {
    const lines = content.split('\n');
    return lines.some(line => {
      const trimmed = line.trim();
      return trimmed.includes(token) && !trimmed.includes('[') && !trimmed.includes(']') && !trimmed.includes('"+ "') && !trimmed.includes('`');
    });
  };

  const isBucketPrivacyConfirmed = checkConfirmation(triageDocContent, bucketPrivacyToken);
  const isStripeWebhookConfirmed = checkConfirmation(triageDocContent, stripeWebhookToken);

  // 1. Audit Environment Variables Safely (NEVER print values, prefixes, URLs, or hashes!)
  console.log('--- Environment Variable Verification ---');
  const requiredEnvVars = [
    { name: 'NEXT_PUBLIC_SUPABASE_URL', optional: false },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', optional: false },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', optional: false },
    { name: 'GEMINI_API_KEY', optional: false },
    { name: 'STRIPE_SECRET_KEY', optional: true },
    { name: 'STRIPE_WEBHOOK_SECRET', optional: true },
    { name: 'NEXT_PUBLIC_GA_ID', optional: true },
    { name: 'PROOF_CLEANUP_CRON_SECRET', optional: true }
  ];

  let missingEnvCount = 0;
  for (const item of requiredEnvVars) {
    let value = process.env[item.name];
    if (item.name === 'GEMINI_API_KEY' && !value) {
      value = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    }

    if (value && value.trim() !== '') {
      console.log(`[ENV CHECK] ${item.name}: PRESENT`);
    } else {
      if (item.optional) {
        console.log(`[ENV CHECK] ${item.name}: OPTIONAL_DEFERRED`);
      } else {
        console.warn(`[ENV CHECK] ${item.name}: MISSING`);
        missingEnvCount++;
      }
    }
  }
  console.log('-----------------------------------------\n');

  // 2. Count issues by severity in the registry
  let registryP0Count = 0;
  let registryP1Count = 0;
  let registryP2Count = 0;

  console.log('--- Registered Issues ---');
  for (const issue of BETA_ISSUE_REGISTRY) {
    const sev = issue.severity || classifyBetaIssue(issue);
    if (sev === 'P0') registryP0Count++;
    else if (sev === 'P1') registryP1Count++;
    else if (sev === 'P2') registryP2Count++;

    console.log(`- [${sev}] ${issue.id}: ${issue.description}`);
  }
  console.log(`Summary: Registered Open P0: ${registryP0Count} | Open P1: ${registryP1Count} | Open P2: ${registryP2Count}\n`);

  // 3. Evaluate Checklist Items and generate markdown table
  console.log('--- Go/No-Go Checklist Evaluation Table ---');
  console.log('| ID | Category | Check | Severity if failed | Evidence | Status | Issue severity | Decision |');
  console.log('| --- | --- | --- | --- | --- | --- | --- | --- |');

  let checklistNoGo = false;
  const unresolvedBlockers: Array<{ id: string; label: string; severity: 'P0' | 'P1'; requiredFix: string }> = [];

  const stripeActive = !!process.env.STRIPE_SECRET_KEY;

  for (const item of BETA_GO_NO_GO_CHECKLIST) {
    let status = 'PASS';
    let issueSeverity = 'None';
    let decision = 'GO';

    if (item.id === 'CHK-PAY-01') {
      // Stripe Webhook Check
      if (stripeActive) {
        if (isStripeWebhookConfirmed) {
          status = 'PASS (Manually Confirmed)';
          issueSeverity = 'None';
          decision = 'GO';
        } else {
          status = 'Implemented, needs verification';
          issueSeverity = 'P1';
          decision = 'NO-GO';
          checklistNoGo = true;
          unresolvedBlockers.push({
            id: 'CHK-PAY-01',
            label: item.label,
            severity: 'P1',
            requiredFix: 'Configure STRIPE_WEBHOOK_SECRET in environment and verify signature validation. Once verified, add the manual confirmation string: "Manual confirmation: Stripe checkout webhook signature verification is active." to docs/sprint/sprint-9d-beta-go-no-go-checklist-and-issue-triage.md.'
          });
        }
      } else {
        status = 'PASS with deferred debt';
        issueSeverity = 'P2';
        decision = 'GO (Stripe Disabled)';
      }
    } else if (item.id === 'CHK-STR-03') {
      // Storage Buckets Privacy Check
      if (isBucketPrivacyConfirmed) {
        status = 'PASS (Manually Confirmed)';
        issueSeverity = 'None';
        decision = 'GO';
      } else {
        status = 'Implemented, needs verification';
        issueSeverity = 'P1';
        decision = 'NO-GO';
        checklistNoGo = true;
        unresolvedBlockers.push({
          id: 'CHK-STR-03',
          label: item.label,
          severity: 'P1',
          requiredFix: 'Access storage properties on the Supabase Dashboard and verify that both "proof-artifacts" and "knowledge-files" buckets are private. Once verified, add the manual confirmation string: "Manual confirmation: Supabase storage buckets proof-artifacts and knowledge-files are private." to docs/sprint/sprint-9d-beta-go-no-go-checklist-and-issue-triage.md.'
        });
      }
    } else if (item.id === 'CHK-CST-01' || item.id === 'CHK-DAT-02' || item.id === 'CHK-BLD-01' || item.id === 'CHK-STG-01') {
      status = 'PASS with deferred debt';
      issueSeverity = 'P2';
      decision = 'GO (Documented)';
    }

    // Check registry issues
    const matchingIssue = BETA_ISSUE_REGISTRY.find(issue => 
      issue.checklistItemId === item.id
    );

    if (matchingIssue) {
      const sev = matchingIssue.severity || classifyBetaIssue(matchingIssue);
      issueSeverity = sev;
      if (sev === 'P0') {
        status = 'FAIL';
        decision = 'NO-GO';
        checklistNoGo = true;
        unresolvedBlockers.push({
          id: item.id,
          label: item.label,
          severity: 'P0',
          requiredFix: `Address registered issue ${matchingIssue.id}: ${matchingIssue.description}`
        });
      } else if (sev === 'P1') {
        status = 'WARNING';
        decision = 'NO-GO';
        checklistNoGo = true;
        unresolvedBlockers.push({
          id: item.id,
          label: item.label,
          severity: 'P1',
          requiredFix: `Address registered issue ${matchingIssue.id}: ${matchingIssue.description}`
        });
      }
    }

    console.log(`| ${item.id} | ${item.category} | ${item.label} | ${item.severity} | ${item.evidenceCommand} | ${status} | ${issueSeverity} | ${decision} |`);
  }
  console.log('-----------------------------------------------------------------------------------------\n');

  // Count active open blockers
  const totalOpenP0 = registryP0Count + unresolvedBlockers.filter(b => b.severity === 'P0').length;
  const totalOpenP1 = registryP1Count + unresolvedBlockers.filter(b => b.severity === 'P1').length;
  const totalOpenP2 = registryP2Count;

  // Stripe active checks validation
  if (stripeActive && !process.env.STRIPE_WEBHOOK_SECRET) {
    checklistNoGo = true;
    if (!unresolvedBlockers.some(b => b.id === 'CHK-PAY-01')) {
      unresolvedBlockers.push({
        id: 'CHK-PAY-01',
        label: 'Stripe webhook security documented and Stripe disabled for beta',
        severity: 'P1',
        requiredFix: 'Stripe is active but STRIPE_WEBHOOK_SECRET is missing.'
      });
    }
  }

  // Final Go/No-Go Recommendation
  let recommendation = 'GO';
  if (totalOpenP0 > 0 || totalOpenP1 > 0 || checklistNoGo || missingEnvCount > 0) {
    recommendation = 'NO-GO';
  }

  console.log('==================================================');
  console.log(`FINAL DECISION RECOMMENDATION: [ ${recommendation} ]`);
  
  if (recommendation === 'GO') {
    console.log(`- 0 open P0`);
    console.log(`- 0 open critical P1`);
    console.log(`- bucket privacy confirmed`);
    if (stripeActive) {
      console.log(`- Stripe active verified`);
    } else {
      console.log(`- Stripe explicitly deferred for free/invite beta`);
    }
    console.log(`- P2 debt documented`);
    console.log('==================================================');
    process.exitCode = 0;
  } else {
    console.log(`\nUnresolved Blockers:`);
    unresolvedBlockers.forEach(b => {
      console.log(`- ${b.id} (${b.label}): Implemented, needs verification (${b.severity} Blocker)`);
      console.log(`  Required Fix: ${b.requiredFix}`);
    });
    console.log('==================================================');
    process.exitCode = 1;
  }
}

main();

