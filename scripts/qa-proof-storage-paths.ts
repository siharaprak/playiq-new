import { getProofArtifactStoragePath, assertValidProofStoragePath } from '../src/lib/proof-artifacts/storage-paths';
import { detectDangerousFileName } from '../src/lib/proof-artifacts/file-validation';

function run() {
  console.log('--- QA: Proof Storage Paths & Validation ---');

  let failed = 0;
  const studentId = '11111111-1111-1111-1111-111111111111';
  const artifactId = '22222222-2222-2222-2222-222222222222';

  // Test 1: Valid Path Construction
  const res1 = getProofArtifactStoragePath({ studentId, artifactId, moduleIdOrModuleNumber: 1, fileName: 'My File.pdf' });
  if (res1.error || res1.path !== `student/${studentId}/module/1/artifact/${artifactId}/my-file.pdf`) {
    console.error(`❌ FAILED Test 1: Expected valid path, got ${res1.path} | Error: ${res1.error}`);
    failed++;
  }

  // Test 2: Double Extension Safe
  const res2 = getProofArtifactStoragePath({ studentId, artifactId, moduleIdOrModuleNumber: 'm2', fileName: 'my.notes.v2.docx' });
  if (res2.error || !res2.path) {
    console.error(`❌ FAILED Test 2: Expected valid path for safe double ext, got error: ${res2.error}`);
    failed++;
  }

  // Test 3: Disguised Executable
  const bad1 = detectDangerousFileName('proof.pdf.exe');
  if (!bad1.dangerous) {
    console.error(`❌ FAILED Test 3: Expected proof.pdf.exe to be dangerous`);
    failed++;
  }

  const bad2 = detectDangerousFileName('recording.mp4.js');
  if (!bad2.dangerous) {
    console.error(`❌ FAILED Test 4: Expected recording.mp4.js to be dangerous`);
    failed++;
  }
  
  const bad3 = detectDangerousFileName('notes.exe.pdf');
  if (!bad3.dangerous) {
    console.error(`❌ FAILED Test 5: Expected notes.exe.pdf to be dangerous`);
    failed++;
  }

  // Test 6: Path Traversal
  const bad4 = getProofArtifactStoragePath({ studentId, artifactId, moduleIdOrModuleNumber: 1, fileName: '../../../etc/passwd' });
  if (!bad4.error) {
    console.error(`❌ FAILED Test 6: Expected path traversal block`);
    failed++;
  }

  if (failed > 0) {
    console.error(`\n❌ FAILED ${failed} path QA tests.`);
    process.exit(1);
  }

  console.log('✅ All Path & Validation QA passed.');
  process.exit(0);
}

run();
