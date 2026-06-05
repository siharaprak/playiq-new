/**
 * QA Script: Verify Assistant Event Metadata Safety
 *
 * Static analysis verification that assistant event metadata:
 * 1. Never includes custom instructions text or boundaries
 * 2. Never includes test prompts or assistant responses
 * 3. Never includes knowledge file content or storage paths
 * 4. Never includes signed URLs
 * 5. Never includes email or full name
 */

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('--- Starting Assistant Events Metadata Verification ---\n');
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
    path.join(process.cwd(), 'src/lib/assistant/actions.ts'),
    'utf-8'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 1. COUNT EVENT LOG CALLS
  // ═══════════════════════════════════════════════════════════════════

  const eventLogCalls = (actionsSource.match(/logAssistantUpdateEvent\(\{/g) || []).length;
  console.log(`  Found ${eventLogCalls} logAssistantUpdateEvent calls`);

  // ═══════════════════════════════════════════════════════════════════
  // 2. DANGEROUS METADATA PATTERNS (must NOT appear in metadata blocks)
  // ═══════════════════════════════════════════════════════════════════

  const metadataBlocks = actionsSource.match(/metadata:\s*\{[^}]*\}/g) || [];

  const dangerousPatterns = [
    { pattern: 'system_prompt', label: 'raw instructions text' },
    { pattern: 'system_prompt:', label: 'system_prompt field' },
    { pattern: 'boundaries', label: 'raw boundaries text' },
    { pattern: 'purpose', label: 'raw purpose text' },
    { pattern: 'user_target', label: 'raw target user' },
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
    'name',
    'updatedFields',
    'profileId',
    'versionNumber',
    'changeSummary',
  ];

  console.log(`\n  Allowed metadata fields: ${allowedFields.join(', ')}`);

  // ═══════════════════════════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════════════════════════

  if (errors > 0) {
    console.error(`\n❌ EVENTS VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Assistant Events Metadata Verification checks passed.');
    process.exit(0);
  }
}

main();
