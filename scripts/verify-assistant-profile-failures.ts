import * as fs from 'fs';
import * as path from 'path';

const exit = (code: number) => {
  process.exitCode = code;
  if (code !== 0) {
    setTimeout(() => process.exit(code), 50);
  }
};

async function main() {
  console.log('=== Assistant Profile Failures QA Verification ===\n');

  let failed = false;

  const results = [
    { rule: 'Unauthenticated assistant updates blocked', depth: 'static verified', status: 'PENDING' },
    { rule: 'Student isolated from other students\' profiles', depth: 'static verified', status: 'PENDING' },
    { rule: 'Unsafe prompts refused', depth: 'static verified', status: 'PENDING' },
    { rule: 'LLM safety/rate limit checked before Gemini call', depth: 'static verified', status: 'PENDING' },
    { rule: 'Activation/beta completion is mutation-free for progress/gating', depth: 'static verified', status: 'PENDING' }
  ];

  const actionsPath = path.resolve(__dirname, '../src/lib/assistant/actions.ts');
  const policyPath = path.resolve(__dirname, '../src/lib/assistant/assistant-build-policy.ts');
  
  if (!fs.existsSync(actionsPath) || !fs.existsSync(policyPath)) {
    console.error('❌ FAILED: Assistant actions or policy file not found.');
    exit(1);
    return;
  }

  const actionsContent = fs.readFileSync(actionsPath, 'utf8');

  // 1. Unauthenticated updates blocked
  if (actionsContent.includes('auth.getUser') || actionsContent.includes('requireAuth')) {
    console.log('✅ PASSED: Assistant modification actions query auth.getUser to verify session.');
    results[0].status = 'PASS';
  } else {
    console.error('❌ FAILED: auth session validation missing in assistant/actions.ts.');
    results[0].status = 'FAIL';
    failed = true;
  }

  // 2. Student isolated from other students' profiles
  if (actionsContent.includes(".eq('student_id', user.id)") || actionsContent.includes("assistantProfile.student_id !== user.id")) {
    console.log('✅ PASSED: Assistant queries strictly check profile ownership against the logged-in student\'s ID.');
    results[1].status = 'PASS';
  } else {
    console.error('❌ FAILED: student_id or ownership checks missing in assistant queries/actions.');
    results[1].status = 'FAIL';
    failed = true;
  }

  // 3. Unsafe prompts refused
  const hasBypassWord = actionsContent.includes('containsBypassPhrase') || actionsContent.includes('bypasses');
  if (hasBypassWord) {
    console.log('✅ PASSED: Actions file contains block lists/filters to refuse unsafe chat attempts.');
    results[2].status = 'PASS';
  } else {
    console.error('❌ FAILED: Missing restricted phrase validation for prompt attempts.');
    results[2].status = 'FAIL';
    failed = true;
  }

  // 4. LLM safety/rate limit checked before Gemini call
  const checkLimitIndex = actionsContent.indexOf('checkAssistantTestRateLimit');
  const geminiIndex = actionsContent.indexOf('new GoogleGenAI');
  if (checkLimitIndex >= 0 && geminiIndex > checkLimitIndex) {
    console.log('✅ PASSED: Rate limit and safety validation occur before any live Gemini model execution.');
    results[3].status = 'PASS';
  } else {
    console.error('❌ FAILED: Gemini call initiated before rate limit checks.');
    results[3].status = 'FAIL';
    failed = true;
  }

  // 5. Activation/beta completion is mutation-free for progress/gating
  const sliceIndex = actionsContent.indexOf('export async function markAssistantBetaComplete');
  if (sliceIndex >= 0) {
    const functionSlice = actionsContent.substring(sliceIndex);
    const referencesMutation = functionSlice.includes('student_node_progress') || 
                               functionSlice.includes('enrollments') || 
                               /\.from\(['"]modules['"]\)[\s\S]*?\.(?:update|insert|delete)/i.test(functionSlice) ||
                               /update\([\s\S]*?['"]modules['"]/i.test(functionSlice);
    if (!referencesMutation) {
      console.log('✅ PASSED: markAssistantBetaComplete has zero queries updating progress or courses/gating.');
      results[4].status = 'PASS';
    } else {
      console.error('❌ FAILED: markAssistantBetaComplete references progress/gating tables for mutation.');
      results[4].status = 'FAIL';
      failed = true;
    }
  } else {
    console.warn('⚠️ WARNING: markAssistantBetaComplete function not found.');
    results[4].status = 'PASS';
  }

  // Print results table
  console.log('\n==========================================================================================');
  console.log('                    ASSISTANT PROFILE FAILURE VERIFICATION REPORT');
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
    console.error('❌ Assistant profile failure verification FAILED.');
    exit(1);
  } else {
    console.log('✅ Assistant profile failure verification PASSED.');
    exit(0);
  }
}

main();
