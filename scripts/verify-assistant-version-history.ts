/**
 * QA Script: Verify Assistant Version History and Snapshot Integrity
 *
 * Statically validates:
 * 1. createAssistantVersion increments version numbers
 * 2. current_version_id updates in assistant_profiles
 * 3. Assistant versions are immutable (no update/delete actions exist)
 * 4. Stored instructions are structured text/Zod schemas
 * 5. No prompts or responses are stored in assistant_versions
 */

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('--- Starting Assistant Version History & Snapshot Verification ---\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  const actionsPath = path.join(process.cwd(), 'src/lib/assistant/actions.ts');
  const actionsSource = fs.readFileSync(actionsPath, 'utf-8');

  // 1. Verify automatic version numbering
  assert(
    actionsSource.includes('version_number: nextVersionNumber') &&
      actionsSource.includes('nextVersionNumber = (latestVersions?.[0]?.version_number ?? 0) + 1'),
    'createAssistantVersion correctly increments the version number'
  );

  // 2. Verify current_version_id update on profile
  assert(
    actionsSource.includes('current_version_id: version.id') &&
      actionsSource.includes("from('assistant_profiles')") &&
      actionsSource.includes('current_version_id: version.id'),
    'createAssistantVersion updates profile.current_version_id after creation'
  );

  // 3. Verify immutability: check if any update or delete actions exist for assistant_versions
  const updatesVersions = actionsSource.includes("from('assistant_versions').update");
  const deletesVersions = actionsSource.includes("from('assistant_versions').delete");

  assert(
    !updatesVersions,
    'Assistant versions are immutable (no update actions exist for assistant_versions in actions.ts)'
  );
  assert(
    !deletesVersions,
    'Assistant versions are immutable (no delete actions exist for assistant_versions in actions.ts)'
  );

  // 4. Verify instructions schema
  const schemasPath = path.join(process.cwd(), 'src/lib/assistant/schemas.ts');
  const schemasSource = fs.readFileSync(schemasPath, 'utf-8');

  assert(
    schemasSource.includes('AssistantVersionInputSchema') &&
      schemasSource.includes('system_prompt'),
    'Assistant version instructions are defined in AssistantVersionInputSchema'
  );

  // 5. Verify no prompts or responses are in the schema
  assert(
    !schemasSource.includes(' prompt:') && !schemasSource.includes('response:'),
    'No raw prompts or responses are defined in assistant schemas'
  );

  if (errors > 0) {
    console.error(`\n❌ VERSION HISTORY VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Assistant Version History & Snapshot checks passed.');
    process.exit(0);
  }
}

main();
