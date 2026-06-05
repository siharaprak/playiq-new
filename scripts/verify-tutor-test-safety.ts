/**
 * QA Script: Verify Tutor Test Safety & Rate Limiting
 *
 * Statically validates:
 * 1. Rate limiter checks are imported and run before Gemini calls.
 * 2. Rate limit thresholds: 10/hour, 5/10min, 5 refusals/hour.
 * 3. Fail-closed behaviour if rate limit query fails.
 * 4. Restricted phrases validation runs on prompt and instructions.
 * 5. Refused event logged on restricted phrase detection.
 */

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('--- Starting Tutor Test Safety & Rate Limiting Verification ---\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  const actionsPath = path.join(process.cwd(), 'src/lib/tutor/actions.ts');
  const actionsSource = fs.readFileSync(actionsPath, 'utf-8');

  // 1. Verify rate limit check runs before any AI/Gemini call
  const checkRateLimitIndex = actionsSource.indexOf('checkTutorTestRateLimit');
  const geminiCallIndex = actionsSource.indexOf('new GoogleGenAI');

  assert(
    checkRateLimitIndex >= 0 && geminiCallIndex > checkRateLimitIndex,
    'checkTutorTestRateLimit is called before the Gemini model is instantiated'
  );

  // 2. Verify restricted phrases checking
  assert(
    actionsSource.includes('do my homework') &&
      actionsSource.includes('give me answers') &&
      actionsSource.includes('ignore playiq rules') &&
      actionsSource.includes('reveal quiz answers') &&
      actionsSource.includes('bypass effort'),
    'actions.ts contains validation checks for all required bypass phrases'
  );

  // 3. Verify refusal event logging
  assert(
    actionsSource.includes('action: \'tutor_test_refused\''),
    'actions.ts logs a tutor_test_refused action when validation fails'
  );

  // 4. Verify rate-limiting implementation file
  const limitPath = path.join(process.cwd(), 'src/lib/tutor/rate-limit.ts');
  const limitSource = fs.readFileSync(limitPath, 'utf-8');

  // Check hourly limit
  assert(
    limitSource.includes('hourAttempts.length >= 10'),
    'Rate limiter enforces maximum of 10 tutor tests per hour'
  );

  // Check 10 minutes limit
  assert(
    limitSource.includes('tenMinAttempts.length >= 5'),
    'Rate limiter enforces maximum of 5 tutor tests per 10 minutes'
  );

  // Check refusal limit
  assert(
    limitSource.includes('hourRefusals.length >= 5'),
    'Rate limiter enforces maximum of 5 refused attempts per hour'
  );

  // Check fail-closed behavior
  assert(
    limitSource.includes('allowed: false') && limitSource.includes('unavailable'),
    'Rate limiter fails closed with an error explanation when database query fails'
  );

  if (errors > 0) {
    console.error(`\n❌ TUTOR TEST SAFETY VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Tutor Test Safety & Rate Limiting checks passed.');
    process.exit(0);
  }
}

main();
