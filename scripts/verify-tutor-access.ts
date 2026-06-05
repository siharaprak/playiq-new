/**
 * QA Script: Verify Tutor Access Controls
 *
 * Static analysis verification that:
 * 1. chatWithTutor requires auth
 * 2. chatWithTutor verifies ownership
 * 3. chatWithTutor has input bounds
 * 4. chatWithTutor uses PlayIQ integrity prefix
 * 5. Knowledge files use private storage (not public)
 * 6. getKnowledgeFileSignedUrl has auth check
 * 7. No raw prompts/responses stored to DB
 * 8. TutorTestSandbox is labeled as test environment
 * 9. Parent dashboard only sees safe status fields
 */

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('--- Starting Tutor Access Verification ---\n');
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
  // 1. chatWithTutor SAFETY
  // ═══════════════════════════════════════════════════════════════════

  const actionsSource = readFile('src/lib/tutor/actions.ts');

  assert(
    actionsSource.includes("if (!user) return { ok: false, error: 'Not authenticated' }"),
    'chatWithTutor requires auth (found auth guard)'
  );

  assert(
    actionsSource.includes("if (profile.student_id !== user.id)"),
    'chatWithTutor verifies profile ownership'
  );

  assert(
    actionsSource.includes('TUTOR_CHAT_MAX_MESSAGES_PER_SESSION'),
    'chatWithTutor enforces message count limit'
  );

  assert(
    actionsSource.includes('TUTOR_CHAT_MAX_INPUT_LENGTH'),
    'chatWithTutor enforces input length limit'
  );

  assert(
    actionsSource.includes('PLAYIQ_TUTOR_SYSTEM_PREFIX'),
    'chatWithTutor uses PlayIQ integrity system prefix'
  );

  assert(
    !actionsSource.includes("from('events_log').insert") ||
    !actionsSource.match(/chatWithTutor[\s\S]*?from\('events_log'\)\.insert/),
    'chatWithTutor does NOT insert into events_log (no raw prompt/response storage)'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 2. KNOWLEDGE FILE STORAGE IS PRIVATE
  // ═══════════════════════════════════════════════════════════════════

  const storageSource = readFile('src/lib/tutor/storage.ts');

  assert(
    storageSource.includes('supabaseAdmin'),
    'Signed URLs use admin client (private bucket access)'
  );

  assert(
    storageSource.includes("if (!user) throw new Error('Not authenticated')"),
    'getKnowledgeFileSignedUrl requires auth'
  );

  assert(
    storageSource.includes('user.id === studentId') || storageSource.includes("role === 'admin'"),
    'getKnowledgeFileSignedUrl checks ownership or admin role'
  );

  assert(
    storageSource.includes('createSignedUrl'),
    'Uses createSignedUrl (not getPublicUrl) — files are private'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 3. KNOWLEDGE FILE UPLOAD SAFETY
  // ═══════════════════════════════════════════════════════════════════

  const uploadSource = readFile('src/components/tutor/KnowledgeFileUpload.tsx');

  assert(
    uploadSource.includes('MAX_FILES'),
    'KnowledgeFileUpload has MAX_FILES limit'
  );

  assert(
    uploadSource.includes('MAX_SIZE_BYTES'),
    'KnowledgeFileUpload has MAX_SIZE_BYTES limit'
  );

  assert(
    uploadSource.includes('ALLOWED_TYPES'),
    'KnowledgeFileUpload has MIME type allowlist'
  );

  assert(
    uploadSource.includes('isFilenameSafe'),
    'KnowledgeFileUpload validates filename safety'
  );

  assert(
    !uploadSource.includes('getPublicUrl'),
    'KnowledgeFileUpload does NOT expose public URLs'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 4. TUTOR TEST SANDBOX IS TEST ONLY
  // ═══════════════════════════════════════════════════════════════════

  const sandboxSource = readFile('src/components/tutor/TutorTestSandbox.tsx');

  assert(
    sandboxSource.includes('testing sandbox') || sandboxSource.includes('Test'),
    'TutorTestSandbox is labeled as test environment'
  );

  assert(
    sandboxSource.includes('chatWithTutor'),
    'TutorTestSandbox uses the bounded chatWithTutor action'
  );

  assert(
    !sandboxSource.includes("from('") && !sandboxSource.includes('supabase.'),
    'TutorTestSandbox does NOT make direct DB calls (uses server actions only)'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 5. PARENT DASHBOARD DOES NOT EXPOSE TUTOR CONTENT
  // ═══════════════════════════════════════════════════════════════════

  const rollupsSource = readFile('src/lib/data/progress-rollups.ts');

  assert(
    rollupsSource.includes("head: true") &&
    rollupsSource.includes("tutor_profiles") &&
    rollupsSource.includes("count: 'exact'"),
    'Parent rollups query tutor_profiles using count-only (no content exposed)'
  );

  assert(
    rollupsSource.includes("tutor_build_status: tutorStatus"),
    'Parent rollups export tutor_build_status (safe enum, not raw content)'
  );

  assert(
    !rollupsSource.includes('doctrine_config') && !rollupsSource.includes('instructions'),
    'Parent rollups do NOT include doctrine_config or instructions'
  );

  assert(
    !rollupsSource.includes('knowledge_files') || !rollupsSource.includes(".select('*')"),
    'Parent rollups do NOT fetch full knowledge file records'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 6. chatWithTutor ONLY SELECTS FILE NAMES (not URLs)
  // ═══════════════════════════════════════════════════════════════════

  const chatSection = actionsSource.slice(actionsSource.indexOf('chatWithTutor'));

  assert(
    chatSection.includes(".select('file_name')"),
    'chatWithTutor only selects file_name from knowledge_files (not file_url or full *)'
  );

  // ═══════════════════════════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════════════════════════

  if (errors > 0) {
    console.error(`\n❌ ACCESS VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Tutor Access Verification checks passed.');
    process.exit(0);
  }
}

main();
