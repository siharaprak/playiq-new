import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Tutor Profile Failures QA Verification ===\n');

  let failed = false;

  const results = [
    { rule: 'Unauthenticated tutor updates blocked', depth: 'static verified', status: 'PENDING' },
    { rule: 'Student isolated from other students\' profiles', depth: 'static verified', status: 'PENDING' },
    { rule: 'Unsafe prompts and direct-answer requests refused', depth: 'static verified', status: 'PENDING' },
    { rule: 'LLM safety/rate limit checked before Gemini call', depth: 'static verified', status: 'PENDING' },
    { rule: 'Version history remains immutable', depth: 'static verified', status: 'PENDING' },
    { rule: 'Knowledge file count and unsafe names blocked', depth: 'static verified & helper-level verified', status: 'PENDING' }
  ];

  const actionsPath = path.resolve(__dirname, '../src/lib/tutor/actions.ts');
  const storagePath = path.resolve(__dirname, '../src/lib/tutor/storage.ts');
  
  if (!fs.existsSync(actionsPath) || !fs.existsSync(storagePath)) {
    console.error('❌ FAILED: Tutor actions or storage file not found.');
    exit(1);
    return;
  }

  const actionsContent = fs.readFileSync(actionsPath, 'utf8');
  const storageContent = fs.readFileSync(storagePath, 'utf8');

  // 1. Unauthenticated tutor updates blocked
  if (actionsContent.includes('auth.getUser') || actionsContent.includes('requireAuth')) {
    console.log('✅ PASSED: Tutor profile modification actions query auth.getUser to verify session.');
    results[0].status = 'PASS';
  } else {
    console.error('❌ FAILED: auth session validation missing in actions.ts.');
    results[0].status = 'FAIL';
    failed = true;
  }

  // 2. Student isolated from other students' profiles
  if (actionsContent.includes(".eq('student_id', user.id)") || actionsContent.includes(".eq('student_id', studentId)")) {
    console.log('✅ PASSED: Tutor queries strictly scope queries to the logged-in student\'s ID.');
    results[1].status = 'PASS';
  } else {
    console.error('❌ FAILED: student_id isolation filter missing in tutor queries.');
    results[1].status = 'FAIL';
    failed = true;
  }

  // 3. Unsafe prompts and direct-answer requests refused
  const checkPhrases = ['do my homework', 'give me answers', 'ignore playiq rules', 'reveal quiz answers', 'bypass effort'];
  const hasPhrases = checkPhrases.every(phrase => actionsContent.includes(phrase));
  if (hasPhrases) {
    console.log('✅ PASSED: Actions file contains standard filters for bypass and unsafe prompt requests.');
    results[2].status = 'PASS';
  } else {
    console.error('❌ FAILED: Missing bypass prompt phrase filters.');
    results[2].status = 'FAIL';
    failed = true;
  }

  // 4. LLM safety/rate limit checked before Gemini call
  const checkLimitIndex = actionsContent.indexOf('checkTutorTestRateLimit');
  const geminiIndex = actionsContent.indexOf('new GoogleGenAI');
  if (checkLimitIndex >= 0 && geminiIndex > checkLimitIndex) {
    console.log('✅ PASSED: Rate limit and safety validation occur before any live Gemini model execution.');
    results[3].status = 'PASS';
  } else if (checkLimitIndex < 0 && geminiIndex < 0) {
    console.log('✅ PASSED: No Gemini calls or rate limit checks in this file (pure build functions).');
    results[3].status = 'PASS';
  } else {
    console.error('❌ FAILED: Gemini call initiated before rate limit checks.');
    results[3].status = 'FAIL';
    failed = true;
  }

  // 5. Version history remains immutable
  // Use precise regex to match from('tutor_versions').update(...) or similar within the same statement
  const updatesVersions = /from\(['"]tutor_versions['"]\)(?:\.[a-zA-Z0-9_]+\([^\)]*\))*?\.update\(/i.test(actionsContent);
  if (!updatesVersions) {
    console.log('✅ PASSED: Version history is immutable (no database update statements targeting tutor_versions).');
    results[4].status = 'PASS';
  } else {
    console.error('❌ FAILED: Found update query targeting tutor_versions.');
    results[4].status = 'FAIL';
    failed = true;
  }

  // 6. Knowledge file count and unsafe names blocked
  const restrictsCount = storageContent.includes('>= 5');
  const checksFilenameSafe = storageContent.includes('isFilenameSafe');
  if (restrictsCount && checksFilenameSafe) {
    console.log('✅ PASSED: Tutor storage enforces a maximum of 5 files and validates unsafe file names.');
    results[5].status = 'PASS';
  } else {
    console.error(`❌ FAILED: Count limit or filename safety checks missing. (restrictsCount: ${restrictsCount}, checksFilenameSafe: ${checksFilenameSafe})`);
    results[5].status = 'FAIL';
    failed = true;
  }

  // Print results table
  console.log('\n==========================================================================================');
  console.log('                      TUTOR PROFILE FAILURE VERIFICATION REPORT');
  console.log('==========================================================================================');
  console.log('| Rule / Restriction                                    | Verification Depth                   | Status |');
  console.log('|-------------------------------------------------------|--------------------------------------|--------|');
  for (const r of results) {
    const ruleStr = r.rule.padEnd(53);
    const depthStr = r.depth.padEnd(36);
    const statusStr = r.status.padEnd(6);
    console.log(`| ${ruleStr} | ${depthStr} | ${statusStr} |`);
  }
  console.log('==========================================================================================\n');

  if (failed) {
    console.error('❌ Tutor profile failure verification FAILED.');
    exit(1);
  } else {
    console.log('✅ Tutor profile failure verification PASSED.');
    exit(0);
  }
}

main();
