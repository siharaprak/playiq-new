/**
 * QA Script: Verify Tutor Build Policy
 *
 * Tests the tutor-build-policy.ts module:
 * 1. isTutorBuildComplete returns correct results for various states
 * 2. canActivateTutor blocks correctly
 * 3. canPublishTutor blocks correctly
 * 4. isFilenameSafe blocks dangerous filenames
 * 5. PlayIQ integrity baseline is present
 * 6. Draft is NOT treated as completion
 */

import {
  isTutorBuildComplete,
  canActivateTutor,
  canPublishTutor,
  isFilenameSafe,
  PLAYIQ_INTEGRITY_BASELINE,
  PLAYIQ_TUTOR_SYSTEM_PREFIX,
  TUTOR_BUILD_MIN_COMPLETE_STATUS,
  TUTOR_CHAT_MAX_MESSAGES_PER_SESSION,
  TUTOR_CHAT_MAX_INPUT_LENGTH,
  BLOCKED_KNOWLEDGE_FILE_EXTENSIONS,
} from '../src/lib/tutor/tutor-build-policy';
import type {
  TutorProfile,
  TutorVersion,
  KnowledgeFile,
} from '../src/lib/tutor/types';

async function main() {
  console.log('--- Starting Tutor Build Policy QA ---\n');
  let errors = 0;

  const assert = (condition: boolean, message: string) => {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
    } else {
      console.error(`❌ FAIL: ${message}`);
      errors++;
    }
  };

  // ── Test Data Factories ────────────────────────────────────────────

  const makeProfile = (overrides: Partial<TutorProfile> = {}): TutorProfile => ({
    id: 'test-profile-id',
    student_id: 'test-student-id',
    course_id: 'test-course-id',
    name: 'TestBot',
    status: 'draft',
    current_version_id: 'test-version-id',
    fingerprint_snapshot: {},
    doctrine_config: {
      purpose: 'Help me learn math',
      teaching_style: 'Socratic',
      explanation_preferences: 'Use analogies',
      subject_focus: 'Mathematics',
    },
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  });

  const makeVersion = (overrides: Partial<TutorVersion> = {}): TutorVersion => ({
    id: 'test-version-id',
    tutor_profile_id: 'test-profile-id',
    version_number: 1,
    instructions: {
      instruction_set: 'Help me understand concepts step by step.',
      rules: ['Never give direct answers'],
    },
    knowledge_file_ids: [],
    change_summary: 'Initial version',
    created_by: 'test-student-id',
    created_at: new Date().toISOString(),
    ...overrides,
  });

  const makeKnowledgeFile = (overrides: Partial<KnowledgeFile> = {}): KnowledgeFile => ({
    id: 'test-file-id',
    student_id: 'test-student-id',
    tutor_profile_id: 'test-profile-id',
    file_name: 'study-notes.pdf',
    file_url: 'test-student-id/test-profile-id/study-notes.pdf',
    file_size: 1024,
    mime_type: 'application/pdf',
    created_at: new Date().toISOString(),
    ...overrides,
  });

  // ═══════════════════════════════════════════════════════════════════
  // 1. DRAFT IS NOT COMPLETION
  // ═══════════════════════════════════════════════════════════════════

  assert(
    TUTOR_BUILD_MIN_COMPLETE_STATUS !== 'draft',
    'TUTOR_BUILD_MIN_COMPLETE_STATUS is NOT draft'
  );

  assert(
    TUTOR_BUILD_MIN_COMPLETE_STATUS === 'active',
    'TUTOR_BUILD_MIN_COMPLETE_STATUS is "active"'
  );

  const draftProfile = makeProfile({ status: 'draft' });
  const draftResult = isTutorBuildComplete(draftProfile, [makeVersion()], [makeKnowledgeFile()], true);
  assert(
    !draftResult.complete,
    'Draft profile is NOT marked as complete'
  );

  assert(
    draftResult.missingItems.some((item) => item.includes('status')),
    'Draft profile missing items includes status requirement'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 2. FULL COMPLETION (all criteria met)
  // ═══════════════════════════════════════════════════════════════════

  const fullProfile = makeProfile({ status: 'active' });
  const fullResult = isTutorBuildComplete(fullProfile, [makeVersion()], [makeKnowledgeFile()], true);
  assert(
    fullResult.complete,
    'Fully configured active profile with version, knowledge file, and test is COMPLETE'
  );

  assert(
    fullResult.missingItems.length === 0,
    'No missing items when all criteria met'
  );

  assert(
    fullResult.completionPercent === 100,
    `Completion percentage is 100% (got ${fullResult.completionPercent}%)`
  );

  // ═══════════════════════════════════════════════════════════════════
  // 3. NULL PROFILE
  // ═══════════════════════════════════════════════════════════════════

  const nullResult = isTutorBuildComplete(null, [], [], false);
  assert(!nullResult.complete, 'Null profile is NOT complete');
  assert(nullResult.completionPercent === 0, 'Null profile is 0% complete');

  // ═══════════════════════════════════════════════════════════════════
  // 4. MISSING INDIVIDUAL CRITERIA
  // ═══════════════════════════════════════════════════════════════════

  // Missing name
  const noName = makeProfile({ name: '', status: 'active' });
  const noNameResult = isTutorBuildComplete(noName, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noNameResult.complete, 'Profile without name is NOT complete');

  // Missing purpose
  const noPurpose = makeProfile({
    status: 'active',
    doctrine_config: { purpose: '', teaching_style: 'Socratic', explanation_preferences: 'Use analogies', subject_focus: 'Math' },
  });
  const noPurposeResult = isTutorBuildComplete(noPurpose, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noPurposeResult.complete, 'Profile without purpose is NOT complete');

  // Missing teaching style
  const noStyle = makeProfile({
    status: 'active',
    doctrine_config: { purpose: 'Help me', teaching_style: '', explanation_preferences: 'Use analogies', subject_focus: 'Math' },
  });
  const noStyleResult = isTutorBuildComplete(noStyle, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noStyleResult.complete, 'Profile without teaching style is NOT complete');

  // Missing explanation preferences
  const noExpl = makeProfile({
    status: 'active',
    doctrine_config: { purpose: 'Help me', teaching_style: 'Socratic', explanation_preferences: '', subject_focus: 'Math' },
  });
  const noExplResult = isTutorBuildComplete(noExpl, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noExplResult.complete, 'Profile without explanation preferences is NOT complete');

  // Missing subject focus
  const noSubject = makeProfile({
    status: 'active',
    doctrine_config: { purpose: 'Help me', teaching_style: 'Socratic', explanation_preferences: 'Analogies', subject_focus: '' },
  });
  const noSubjectResult = isTutorBuildComplete(noSubject, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noSubjectResult.complete, 'Profile without subject focus is NOT complete');

  // No versions
  const noVersions = isTutorBuildComplete(makeProfile({ status: 'active' }), [], [makeKnowledgeFile()], true);
  assert(!noVersions.complete, 'Profile without versions is NOT complete');

  // No current_version_id
  const noCurrentVersion = makeProfile({ status: 'active', current_version_id: null });
  const noCurrentVersionResult = isTutorBuildComplete(noCurrentVersion, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noCurrentVersionResult.complete, 'Profile without current_version_id is NOT complete');

  // Empty instructions
  const emptyInstructions = makeVersion({ instructions: { instruction_set: '', rules: [] } });
  const emptyInstrResult = isTutorBuildComplete(makeProfile({ status: 'active' }), [emptyInstructions], [makeKnowledgeFile()], true);
  assert(!emptyInstrResult.complete, 'Version with empty instructions is NOT complete');

  // No knowledge files
  const noFiles = isTutorBuildComplete(makeProfile({ status: 'active' }), [makeVersion()], [], true);
  assert(!noFiles.complete, 'Profile without knowledge files is NOT complete');

  // Not tested
  const notTested = isTutorBuildComplete(makeProfile({ status: 'active' }), [makeVersion()], [makeKnowledgeFile()], false);
  assert(!notTested.complete, 'Profile without sandbox test is NOT complete');

  // ═══════════════════════════════════════════════════════════════════
  // 5. ACTIVATION GATE
  // ═══════════════════════════════════════════════════════════════════

  const canActivate = canActivateTutor(makeProfile({ status: 'draft' }), [makeVersion()]);
  assert(canActivate.canActivate, 'Valid draft profile CAN be activated');

  const alreadyActive = canActivateTutor(makeProfile({ status: 'active' }), [makeVersion()]);
  assert(!alreadyActive.canActivate, 'Already active profile CANNOT be re-activated');

  const noNameActivate = canActivateTutor(makeProfile({ name: '' }), [makeVersion()]);
  assert(!noNameActivate.canActivate, 'Profile without name CANNOT be activated');

  const noPurposeActivate = canActivateTutor(
    makeProfile({ doctrine_config: { purpose: '', teaching_style: 'Socratic', explanation_preferences: 'Analogies', subject_focus: 'Math' } }),
    [makeVersion()]
  );
  assert(!noPurposeActivate.canActivate, 'Profile without purpose CANNOT be activated');

  // ═══════════════════════════════════════════════════════════════════
  // 6. PUBLISH GATE
  // ═══════════════════════════════════════════════════════════════════

  const canPublish = canPublishTutor(makeProfile({ status: 'active' }), [makeKnowledgeFile()]);
  assert(canPublish.canPublish, 'Active profile with knowledge files CAN be published');

  const draftPublish = canPublishTutor(makeProfile({ status: 'draft' }), [makeKnowledgeFile()]);
  assert(!draftPublish.canPublish, 'Draft profile CANNOT be published');

  const noFilesPublish = canPublishTutor(makeProfile({ status: 'active' }), []);
  assert(!noFilesPublish.canPublish, 'Active profile without files CANNOT be published');

  // ═══════════════════════════════════════════════════════════════════
  // 7. FILENAME SAFETY
  // ═══════════════════════════════════════════════════════════════════

  assert(isFilenameSafe('study-notes.pdf'), 'Normal filename is safe');
  assert(isFilenameSafe('my_learning_profile.txt'), 'Underscore filename is safe');
  assert(!isFilenameSafe(''), 'Empty filename is NOT safe');
  assert(!isFilenameSafe('../../../etc/passwd'), 'Path traversal is NOT safe');
  assert(!isFilenameSafe('file\x00.pdf'), 'Null byte filename is NOT safe');
  assert(!isFilenameSafe('script.exe'), '.exe is NOT safe');
  assert(!isFilenameSafe('payload.bat'), '.bat is NOT safe');
  assert(!isFilenameSafe('hack.js'), '.js is NOT safe');
  assert(!isFilenameSafe('phish.html'), '.html is NOT safe');
  assert(!isFilenameSafe('evil.ps1'), '.ps1 is NOT safe');
  assert(!isFilenameSafe('a'.repeat(256) + '.pdf'), 'Overly long filename is NOT safe');

  // ═══════════════════════════════════════════════════════════════════
  // 8. INTEGRITY BASELINE
  // ═══════════════════════════════════════════════════════════════════

  assert(
    PLAYIQ_INTEGRITY_BASELINE.rules.length > 0,
    'Integrity baseline has rules defined'
  );

  assert(
    PLAYIQ_INTEGRITY_BASELINE.rules.some(r => r.toLowerCase().includes('homework')),
    'Integrity baseline includes homework refusal rule'
  );

  assert(
    PLAYIQ_INTEGRITY_BASELINE.rules.some(r => r.toLowerCase().includes('direct answer')),
    'Integrity baseline includes direct answer refusal rule'
  );

  assert(
    PLAYIQ_TUTOR_SYSTEM_PREFIX.includes('MANDATORY RULES'),
    'System prefix includes MANDATORY RULES label'
  );

  assert(
    PLAYIQ_TUTOR_SYSTEM_PREFIX.includes('politely refuse'),
    'System prefix includes refusal instruction'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 9. CONSTANTS
  // ═══════════════════════════════════════════════════════════════════

  assert(
    TUTOR_CHAT_MAX_MESSAGES_PER_SESSION > 0 && TUTOR_CHAT_MAX_MESSAGES_PER_SESSION <= 100,
    `Chat max messages is bounded (${TUTOR_CHAT_MAX_MESSAGES_PER_SESSION})`
  );

  assert(
    TUTOR_CHAT_MAX_INPUT_LENGTH > 0 && TUTOR_CHAT_MAX_INPUT_LENGTH <= 5000,
    `Chat max input length is bounded (${TUTOR_CHAT_MAX_INPUT_LENGTH})`
  );

  assert(
    BLOCKED_KNOWLEDGE_FILE_EXTENSIONS.length > 0,
    `Blocked file extensions list is non-empty (${BLOCKED_KNOWLEDGE_FILE_EXTENSIONS.length} entries)`
  );

  // ═══════════════════════════════════════════════════════════════════
  // RESULT
  // ═══════════════════════════════════════════════════════════════════

  if (errors > 0) {
    console.error(`\n❌ QA FAILED with ${errors} errors.`);
    process.exit(1);
  } else {
    console.log('\n✅ All Tutor Build Policy QA checks passed.');
    process.exit(0);
  }
}

main();
