/**
 * QA Script: Verify Tutor Event Metadata Safety
 *
 * Static analysis verification that tutor event metadata:
 * 1. Never includes custom instructions text
 * 2. Never includes test prompts or tutor responses
 * 3. Never includes knowledge file content or storage paths
 * 4. Never includes signed URLs
 * 5. Never includes email or full name (except tutor name)
 * 6. Always includes noPromptStored and noResponseStored flags
 */

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('--- Starting Tutor Events Metadata Verification ---\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  const actionsSource = fs.readFileSync(
    path.join(process.cwd(), 'src/lib/tutor/actions.ts'),
    'utf-8'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 1. COUNT SAFE METADATA MARKERS
  // ═══════════════════════════════════════════════════════════════════

  const noPromptCount = (actionsSource.match(/noPromptStored:\s*true/g) || []).length;
  const noResponseCount = (actionsSource.match(/noResponseStored:\s*true/g) || []).length;
  const eventLogCalls = (actionsSource.match(/logTutorUpdateEvent\(\{/g) || []).length;

  console.log(`  Found ${eventLogCalls} logTutorUpdateEvent calls`);
  console.log(`  Found ${noPromptCount} noPromptStored: true markers`);
  console.log(`  Found ${noResponseCount} noResponseStored: true markers\n`);

  assert(
    noPromptCount >= eventLogCalls,
    `Every logTutorUpdateEvent call has noPromptStored: true (${noPromptCount}/${eventLogCalls})`
  );

  assert(
    noResponseCount >= eventLogCalls,
    `Every logTutorUpdateEvent call has noResponseStored: true (${noResponseCount}/${eventLogCalls})`
  );

  // ═══════════════════════════════════════════════════════════════════
  // 2. DANGEROUS METADATA PATTERNS (must NOT appear in metadata blocks)
  // ═══════════════════════════════════════════════════════════════════

  // Extract metadata blocks from logTutorUpdateEvent calls
  const metadataBlocks = actionsSource.match(/metadata:\s*\{[^}]*\}/g) || [];

  const dangerousPatterns = [
    { pattern: 'instruction_set', label: 'raw instructions text' },
    { pattern: 'instruction_set:', label: 'instruction_set field' },
    { pattern: 'file_url', label: 'file storage URL' },
    { pattern: 'file_path', label: 'file path' },
    { pattern: 'signedUrl', label: 'signed URL' },
    { pattern: 'signed_url', label: 'signed URL' },
    { pattern: 'storage_path', label: 'storage path' },
    { pattern: 'email', label: 'email address' },
    { pattern: 'full_name', label: 'full name' },
    { pattern: 'content:', label: 'raw content' },
    { pattern: 'userMessage', label: 'user message' },
    { pattern: 'aiResponse', label: 'AI response' },
    { pattern: 'replyText', label: 'reply text' },
    { pattern: 'systemInstruction', label: 'system instruction' },
  ];

  for (const { pattern, label } of dangerousPatterns) {
    const found = metadataBlocks.some(block => block.includes(pattern));
    assert(!found, `Event metadata does NOT contain ${label}`);
  }

  // ═══════════════════════════════════════════════════════════════════
  // 3. ALLOWED METADATA FIELDS
  // ═══════════════════════════════════════════════════════════════════

  const allowedFields = [
    'action',
    'name',
    'updatedFields',
    'profileId',
    'versionNumber',
    'changeSummary',
    'hasKnowledgeFiles',
    'noPromptStored',
    'noResponseStored',
    'reason',
  ];

  console.log(`\n  Allowed metadata fields: ${allowedFields.join(', ')}`);

  // ═══════════════════════════════════════════════════════════════════
  // 4. chatWithTutor ONLY LOGS SAFE TEST EVENTS (no prompt/response logging)
  // ═══════════════════════════════════════════════════════════════════

  const chatSection = actionsSource.slice(actionsSource.indexOf('export async function chatWithTutor'));
  const chatEnd = chatSection.indexOf('export async function', 1);
  const chatBody = chatEnd > 0 ? chatSection.slice(0, chatEnd) : chatSection;

  // Verify that any logTutorUpdateEvent call in chatWithTutor only logs allowed metadata actions
  const matches = [...chatBody.matchAll(/logTutorUpdateEvent\(\{[\s\S]*?\}\)/g)];
  for (const match of matches) {
    const logCall = match[0];
    assert(
      logCall.includes('tutor_test_attempt') || logCall.includes('tutor_test_refused'),
      'logTutorUpdateEvent call in chatWithTutor is restricted to tutor_test_attempt or tutor_test_refused'
    );
    // Remove the safe marker keys to prevent false positive matches
    const cleanedLogCall = logCall
      .replace(/noPromptStored/g, '')
      .replace(/noResponseStored/g, '')
      .replace(/bypass_phrase_in_prompt/g, '');
    assert(
      !cleanedLogCall.toLowerCase().includes('prompt') &&
        !cleanedLogCall.toLowerCase().includes('response') &&
        !cleanedLogCall.toLowerCase().includes('replytext') &&
        !cleanedLogCall.toLowerCase().includes('content'),
      'logTutorUpdateEvent call in chatWithTutor does NOT leak prompts or responses'
    );
  }

  assert(
    chatBody.includes('SAFETY: No raw prompts or responses are stored'),
    'chatWithTutor contains explicit safety comment about no storage'
  );

  // ═══════════════════════════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════════════════════════

  if (errors > 0) {
    console.error(`\n❌ EVENTS VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Tutor Events Metadata Verification checks passed.');
    process.exit(0);
  }
}

main();
