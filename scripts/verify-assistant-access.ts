/**
 * QA Script: Verify Assistant Access Controls
 *
 * Static analysis verification that:
 * 1. Assistant server actions require auth
 * 2. Assistant server actions verify student ownership
 * 3. Knowledge files are only uploadable and deletable by the owner
 * 4. Parents and unauthorized users cannot see raw assistant instructions or knowledge files
 */

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('--- Starting Assistant Access Verification ---\n');
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

  // ═══════════════════════════════════════════════════════════════════
  // 1. actions.ts ACCESS CHECKS
  // ═══════════════════════════════════════════════════════════════════

  const actionsSource = readFile('src/lib/assistant/actions.ts');

  // Auth checking
  assert(
    actionsSource.includes("if (!user) return { ok: false, error: 'Not authenticated' }"),
    'actions.ts requires authentication for user operations'
  );

  // Profile creation
  assert(
    actionsSource.includes("eq('student_id', user.id)") && actionsSource.includes("existing"),
    'createAssistantProfile checks for existing profiles owned by student'
  );

  // Profile updates
  assert(
    actionsSource.includes("existing.student_id !== user.id") && actionsSource.includes("Not authorized to update this profile"),
    'updateAssistantProfile verifies profile ownership before update'
  );

  // Version creation
  assert(
    actionsSource.includes("profile.student_id !== user.id") && actionsSource.includes("Not authorized to create versions for this profile"),
    'createAssistantVersion verifies profile ownership before snapshot'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 2. storage.ts ACCESS CHECKS
  // ═══════════════════════════════════════════════════════════════════

  const storageSource = readFile('src/lib/assistant/storage.ts');

  // File records
  assert(
    storageSource.includes("if (!user) return { ok: false, error: 'Not authenticated' }"),
    'createAssistantKnowledgeFileRecord and deleteAssistantKnowledgeFile require auth'
  );

  assert(
    storageSource.includes("profile.student_id !== user.id") && storageSource.includes("Not authorized to add files to this profile"),
    'createAssistantKnowledgeFileRecord verifies profile ownership'
  );

  assert(
    storageSource.includes("file.student_id !== user.id") && storageSource.includes("Not authorized to delete this file"),
    'deleteAssistantKnowledgeFile verifies file ownership'
  );

  assert(
    storageSource.includes("profile.status !== 'draft'") && storageSource.includes("Cannot delete files from an active or published assistant profile"),
    'deleteAssistantKnowledgeFile restricts deletion to draft status only'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 3. PARENT PRIVACY BOUNDARIES
  // ═══════════════════════════════════════════════════════════════════

  const rollupsSource = readFile('src/lib/data/progress-rollups.ts');

  assert(
    rollupsSource.includes("assistant_profiles") && rollupsSource.includes("count: 'exact'") && rollupsSource.includes("head: true"),
    'Parent progress rollups query assistant_profiles with count-only (no raw contents fetched)'
  );

  assert(
    rollupsSource.includes("assistant_profiles_count:") && rollupsSource.includes("assistant_versions_count:"),
    'Parent rollups only expose safe count counts for assistant, not raw configs'
  );

  assert(
    !rollupsSource.includes('persona_config') && !rollupsSource.includes('system_prompt'),
    'Parent progress rollups do NOT reference persona_config or system_prompt'
  );

  // ═══════════════════════════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════════════════════════

  if (errors > 0) {
    console.error(`\n❌ ASSISTANT ACCESS VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Assistant Access Verification checks passed.');
    process.exit(0);
  }
}

main();
