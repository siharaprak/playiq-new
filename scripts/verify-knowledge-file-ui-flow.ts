/**
 * QA Script: Verify Knowledge File UI Flow
 *
 * Statically validates that the UI:
 * 1. Has drag-and-drop or file selection upload triggers.
 * 2. Displays list of attached files correctly.
 * 3. Integrates detach/delete call safely.
 * 4. Implements user validation warnings/rules for files.
 */

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  console.log('--- Starting Knowledge File UI Flow Verification ---\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  const uiPath = path.join(process.cwd(), 'src/components/tutor/KnowledgeFileUpload.tsx');
  const uiSource = fs.readFileSync(uiPath, 'utf-8');

  // 1. Verify drag-and-drop and input triggers
  assert(
    uiSource.includes('onDragOver') && uiSource.includes('onDragLeave') && uiSource.includes('onDrop'),
    'KnowledgeFileUpload handles drag over, leave, and drop events'
  );
  assert(
    uiSource.includes('type="file"') && uiSource.includes('onChange={'),
    'KnowledgeFileUpload includes standard file selection input and onChange handler'
  );

  // 2. Verify file list rendering
  assert(
    uiSource.includes('files.map') || uiSource.includes('files.length'),
    'KnowledgeFileUpload maps over file collection to render list'
  );

  // 3. Verify delete / detach handler integration
  assert(
    uiSource.includes('deleteKnowledgeFile(') || uiSource.includes('onFilesChange('),
    'KnowledgeFileUpload integrates file removal flow'
  );

  // 4. Verify maximum files check
  assert(
    uiSource.includes('files.length >= MAX_FILES'),
    'KnowledgeFileUpload checks for MAX_FILES limit before accepting new files'
  );

  // 5. Verify size checks
  assert(
    uiSource.includes('file.size > MAX_SIZE_BYTES'),
    'KnowledgeFileUpload validates single file size against MAX_SIZE_BYTES'
  );

  if (errors > 0) {
    console.error(`\n❌ KNOWLEDGE FILE UI FLOW VERIFICATION FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Knowledge File UI Flow checks passed.');
    process.exit(0);
  }
}

main();
