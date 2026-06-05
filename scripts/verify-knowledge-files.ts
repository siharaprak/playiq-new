/**
 * QA Script: Verify Knowledge File Security
 *
 * Static analysis verification that:
 * 1. Knowledge files use private storage bucket (not public)
 * 2. MIME type validation is enforced
 * 3. File size limits are enforced
 * 4. Max file count per tutor is enforced
 * 5. Filename safety is validated
 * 6. Storage paths are not exposed to clients
 * 7. Signed URLs are not rendered as raw text
 * 8. Parents cannot access knowledge files
 * 9. Student cross-access is blocked by RLS
 * 10. Dangerous extensions are blocked
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  BLOCKED_KNOWLEDGE_FILE_EXTENSIONS,
  isFilenameSafe,
} from '../src/lib/tutor/tutor-build-policy';

async function main() {
  console.log('--- Starting Knowledge File Security Verification ---\n');
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
  // 1. STORAGE IS PRIVATE
  // ═══════════════════════════════════════════════════════════════════

  const storageSource = readFile('src/lib/tutor/storage.ts');

  assert(
    storageSource.includes("from('knowledge-files')"),
    'Storage uses "knowledge-files" bucket'
  );

  assert(
    storageSource.includes('createSignedUrl'),
    'Download uses signed URLs (private bucket)'
  );

  assert(
    !storageSource.includes('getPublicUrl'),
    'Storage NEVER uses getPublicUrl (confirming private)'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 2. UPLOAD COMPONENT VALIDATION
  // ═══════════════════════════════════════════════════════════════════

  const uploadSource = readFile('src/components/tutor/KnowledgeFileUpload.tsx');

  assert(
    uploadSource.includes('MAX_FILES = 5'),
    'Max files limit is 5'
  );

  assert(
    uploadSource.includes('MAX_SIZE_BYTES = 10 * 1024 * 1024'),
    'Max file size is 10MB'
  );

  assert(
    uploadSource.includes("'application/pdf'"),
    'PDF is in allowed MIME types'
  );

  assert(
    uploadSource.includes("'text/plain'"),
    'TXT is in allowed MIME types'
  );

  assert(
    uploadSource.includes('isFilenameSafe'),
    'Filename safety validation is applied at upload'
  );

  assert(
    uploadSource.includes('upsert: false'),
    'Upload uses upsert: false (prevents overwriting)'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 3. FILE_URL IS NOT EXPOSED TO CLIENTS
  // ═══════════════════════════════════════════════════════════════════

  // Check that the TutorBuilderContainer and related client components
  // do not render file_url or storage path as raw text

  const containerSource = readFile('src/components/tutor/TutorBuilderContainer.tsx');

  assert(
    !containerSource.includes('file_url'),
    'TutorBuilderContainer does NOT reference file_url'
  );

  assert(
    !containerSource.includes('signedUrl'),
    'TutorBuilderContainer does NOT reference signedUrl'
  );

  // Check upload component
  assert(
    !uploadSource.includes('getKnowledgeFileSignedUrl'),
    'Upload component does NOT call getKnowledgeFileSignedUrl (no download from upload UI)'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 4. PARENT DASHBOARD DOES NOT QUERY KNOWLEDGE FILES
  // ═══════════════════════════════════════════════════════════════════

  const parentHomePath = 'src/app/(dashboard)/parent/home/page.tsx';
  const parentHomeSource = readFile(parentHomePath);

  assert(
    !parentHomeSource.includes('knowledge_files'),
    'Parent home page does NOT query knowledge_files table'
  );

  assert(
    !parentHomeSource.includes('file_url'),
    'Parent home page does NOT reference file_url'
  );

  assert(
    !parentHomeSource.includes('file_name'),
    'Parent home page does NOT reference knowledge file names'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 5. RLS POLICIES EXIST
  // ═══════════════════════════════════════════════════════════════════

  const migrationSource = readFile('supabase/migrations/20260527_tutor_tables_documentation.sql');

  assert(
    migrationSource.includes('knowledge_files ENABLE ROW LEVEL SECURITY'),
    'RLS is enabled on knowledge_files table'
  );

  assert(
    migrationSource.includes('knowledge_files_student_crud'),
    'Student CRUD RLS policy exists for knowledge_files'
  );

  assert(
    migrationSource.includes('auth.uid() = student_id'),
    'RLS enforces student_id = auth.uid() (cross-access blocked)'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 6. BLOCKED EXTENSIONS
  // ═══════════════════════════════════════════════════════════════════

  const criticalBlocked = ['.exe', '.bat', '.js', '.html', '.ps1', '.sh'];
  for (const ext of criticalBlocked) {
    assert(
      (BLOCKED_KNOWLEDGE_FILE_EXTENSIONS as readonly string[]).includes(ext),
      `${ext} is in blocked extensions list`
    );

    assert(
      !isFilenameSafe(`test${ext}`),
      `isFilenameSafe rejects files with ${ext} extension`
    );
  }

  // ═══════════════════════════════════════════════════════════════════
  // 7. DELETE ONLY IN DRAFT STATE
  // ═══════════════════════════════════════════════════════════════════

  assert(
    storageSource.includes("profile.status !== 'draft'"),
    'deleteKnowledgeFile blocks deletion when profile is not draft'
  );

  // ═══════════════════════════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════════════════════════

  if (errors > 0) {
    console.error(`\n❌ KNOWLEDGE FILE SECURITY VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Knowledge File Security Verification checks passed.');
    process.exit(0);
  }
}

main();
