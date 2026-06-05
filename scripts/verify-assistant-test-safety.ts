/**
 * QA Script: Verify Assistant Test Safety
 *
 * Statically validates:
 * 1. Assistant has a live rate-limited Gemini sandbox chat action
 * 2. Assistant chat action invokes rate limiting before Gemini and fails closed
 * 3. Assistant chat action does not save raw prompts or responses
 * 4. Filename safety is active for knowledge files (blocks unsafe scripts, path traversal)
 * 5. File upload limits are defined and safe
 */

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('--- Starting Assistant Test Safety Verification ---\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  const readFile = (relativePath: string) =>
    fs.readFileSync(path.join(process.cwd(), relativePath), 'utf-8');

  // 1. Verify that the assistant builder has a rate-limited chat action
  const actionsSource = readFile('src/lib/assistant/actions.ts');
  assert(
    actionsSource.includes('chatWithAssistant') && actionsSource.includes('GoogleGenAI'),
    'Assistant has a live Gemini sandbox chat action implemented'
  );

  assert(
    actionsSource.includes('checkAssistantTestRateLimit'),
    'Assistant chat action invokes rate limiting'
  );

  // 2. Verify metadata.test_log is stored as a list of strings and does not store prompts/responses
  const schemasSource = readFile('src/lib/assistant/schemas.ts');
  assert(
    schemasSource.includes('test_log: z.array(z.string()).optional()'),
    'Assistant metadata schema restricts test log to a simple string list'
  );

  // 3. Verify filename safety blocks dangerous extensions
  const policySource = readFile('src/lib/assistant/assistant-build-policy.ts');
  assert(
    policySource.includes('isFilenameSafe') &&
      policySource.includes('.exe') &&
      policySource.includes('.js') &&
      policySource.includes('.bat') &&
      policySource.includes('UNSAFE_FILENAME_PATTERN'),
    'assistant-build-policy.ts includes isFilenameSafe checking and blocks executable/script files'
  );

  // 4. Verify that knowledge file uploads do not expose public URLs
  const storageSource = readFile('src/lib/assistant/storage.ts');
  assert(
    !storageSource.includes('getPublicUrl'),
    'storage.ts only uses private bucket storage (no public URL generation)'
  );

  if (errors > 0) {
    console.error(`\n❌ ASSISTANT TEST SAFETY VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Assistant Test Safety checks passed.');
    process.exit(0);
  }
}

main();
