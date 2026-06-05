/**
 * QA Script: Verify Assistant Build Policy
 *
 * Tests the assistant-build-policy.ts module:
 * 1. isAssistantBuildComplete returns correct results for various states
 * 2. canActivateAssistant blocks correctly
 * 3. canPublishAssistant blocks correctly
 * 4. isFilenameSafe blocks dangerous filenames
 * 5. PlayIQ integrity baseline is present
 * 6. Draft is NOT treated as completion
 */

import {
  isAssistantBuildComplete,
  canActivateAssistant,
  canPublishAssistant,
  isFilenameSafe,
  PLAYIQ_ASSISTANT_INTEGRITY_BASELINE,
  PLAYIQ_ASSISTANT_SYSTEM_PREFIX,
  ASSISTANT_BUILD_MIN_COMPLETE_STATUS,
  ASSISTANT_CHAT_MAX_MESSAGES_PER_SESSION,
  ASSISTANT_CHAT_MAX_INPUT_LENGTH,
  BLOCKED_KNOWLEDGE_FILE_EXTENSIONS,
} from '../src/lib/assistant/assistant-build-policy';
import type {
  AssistantProfile,
  AssistantVersion,
  KnowledgeFile,
} from '../src/lib/assistant/types';

async function main() {
  console.log('--- Starting Assistant Build Policy QA ---\n');
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

  const makeProfile = (overrides: Partial<AssistantProfile> = {}): AssistantProfile => ({
    id: 'test-profile-id',
    student_id: 'test-student-id',
    course_id: 'test-course-id',
    name: 'TestAssistant',
    status: 'draft',
    current_version_id: 'test-version-id',
    persona_config: {
      purpose: 'Help me review code',
      user_target: 'Students',
      boundaries: 'Never give answers',
    },
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  });

  const makeVersion = (overrides: Partial<AssistantVersion> = {}): AssistantVersion => ({
    id: 'test-version-id',
    assistant_profile_id: 'test-profile-id',
    version_number: 1,
    system_prompt: 'Help me understand concepts step by step.',
    tools_config: {
      knowledge_file_ids: [],
    },
    change_summary: 'Initial version',
    created_by: 'test-student-id',
    created_at: new Date().toISOString(),
    ...overrides,
  });

  const makeKnowledgeFile = (overrides: Partial<KnowledgeFile> = {}): KnowledgeFile => ({
    id: 'test-file-id',
    student_id: 'test-student-id',
    assistant_profile_id: 'test-profile-id',
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
    ASSISTANT_BUILD_MIN_COMPLETE_STATUS !== 'draft',
    'ASSISTANT_BUILD_MIN_COMPLETE_STATUS is NOT draft'
  );

  assert(
    ASSISTANT_BUILD_MIN_COMPLETE_STATUS === 'active',
    'ASSISTANT_BUILD_MIN_COMPLETE_STATUS is "active"'
  );

  const draftProfile = makeProfile({ status: 'draft' });
  const draftResult = isAssistantBuildComplete(draftProfile, [makeVersion()], [makeKnowledgeFile()], true);
  assert(
    !draftResult.complete,
    'Draft profile is NOT marked as complete'
  );

  assert(
    draftResult.missingItems.some((item) => item.includes('status') || item.includes('threshold')),
    'Draft profile missing items includes status requirement'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 2. FULL COMPLETION (all criteria met)
  // ═══════════════════════════════════════════════════════════════════

  const fullProfile = makeProfile({ status: 'active' });
  const fullResult = isAssistantBuildComplete(fullProfile, [makeVersion()], [makeKnowledgeFile()], true);
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

  const nullResult = isAssistantBuildComplete(null, [], [], false);
  assert(!nullResult.complete, 'Null profile is NOT complete');
  assert(nullResult.completionPercent === 0, 'Null profile is 0% complete');

  // ═══════════════════════════════════════════════════════════════════
  // 4. MISSING INDIVIDUAL CRITERIA
  // ═══════════════════════════════════════════════════════════════════

  // Missing name
  const noName = makeProfile({ name: '', status: 'active' });
  const noNameResult = isAssistantBuildComplete(noName, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noNameResult.complete, 'Profile without name is NOT complete');

  // Missing purpose
  const noPurpose = makeProfile({
    status: 'active',
    persona_config: { purpose: '', user_target: 'Students', boundaries: 'Math' },
  });
  const noPurposeResult = isAssistantBuildComplete(noPurpose, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noPurposeResult.complete, 'Profile without purpose is NOT complete');

  // Missing user target
  const noUserTarget = makeProfile({
    status: 'active',
    persona_config: { purpose: 'Help me', user_target: '', boundaries: 'Math' },
  });
  const noUserTargetResult = isAssistantBuildComplete(noUserTarget, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noUserTargetResult.complete, 'Profile without user target is NOT complete');

  // Missing boundaries
  const noBoundaries = makeProfile({
    status: 'active',
    persona_config: { purpose: 'Help me', user_target: 'Students', boundaries: '' },
  });
  const noBoundariesResult = isAssistantBuildComplete(noBoundaries, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noBoundariesResult.complete, 'Profile without boundaries is NOT complete');

  // No versions
  const noVersions = isAssistantBuildComplete(makeProfile({ status: 'active' }), [], [makeKnowledgeFile()], true);
  assert(!noVersions.complete, 'Profile without versions is NOT complete');

  // No current_version_id
  const noCurrentVersion = makeProfile({ status: 'active', current_version_id: null });
  const noCurrentVersionResult = isAssistantBuildComplete(noCurrentVersion, [makeVersion()], [makeKnowledgeFile()], true);
  assert(!noCurrentVersionResult.complete, 'Profile without current_version_id is NOT complete');

  // Empty instructions
  const emptyInstructions = makeVersion({ system_prompt: '' });
  const emptyInstrResult = isAssistantBuildComplete(makeProfile({ status: 'active' }), [emptyInstructions], [makeKnowledgeFile()], true);
  assert(!emptyInstrResult.complete, 'Version with empty instructions is NOT complete');

  // No knowledge files
  const noFiles = isAssistantBuildComplete(makeProfile({ status: 'active' }), [makeVersion()], [], true);
  assert(!noFiles.complete, 'Profile without knowledge files is NOT complete');

  // Not tested
  const notTested = isAssistantBuildComplete(makeProfile({ status: 'active' }), [makeVersion()], [makeKnowledgeFile()], false);
  assert(!notTested.complete, 'Profile without sandbox test is NOT complete');

  // ═══════════════════════════════════════════════════════════════════
  // 5. ACTIVATION GATE
  // ═══════════════════════════════════════════════════════════════════

  const canActivate = canActivateAssistant(makeProfile({ status: 'draft' }), [makeVersion()]);
  assert(canActivate.canActivate, 'Valid draft profile CAN be activated');

  const alreadyActive = canActivateAssistant(makeProfile({ status: 'active' }), [makeVersion()]);
  assert(!alreadyActive.canActivate, 'Already active profile CANNOT be re-activated');

  const noNameActivate = canActivateAssistant(makeProfile({ name: '' }), [makeVersion()]);
  assert(!noNameActivate.canActivate, 'Profile without name CANNOT be activated');

  const noPurposeActivate = canActivateAssistant(
    makeProfile({ persona_config: { purpose: '', user_target: 'Students', boundaries: 'Math' } }),
    [makeVersion()]
  );
  assert(!noPurposeActivate.canActivate, 'Profile without purpose CANNOT be activated');

  // ═══════════════════════════════════════════════════════════════════
  // 6. PUBLISH GATE
  // ═══════════════════════════════════════════════════════════════════

  const canPublish = canPublishAssistant(makeProfile({ status: 'active' }), [makeKnowledgeFile()]);
  assert(canPublish.canPublish, 'Active profile with knowledge files CAN be published');

  const draftPublish = canPublishAssistant(makeProfile({ status: 'draft' }), [makeKnowledgeFile()]);
  assert(!draftPublish.canPublish, 'Draft profile CANNOT be published');

  const noFilesPublish = canPublishAssistant(makeProfile({ status: 'active' }), []);
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
    PLAYIQ_ASSISTANT_INTEGRITY_BASELINE.rules.length > 0,
    'Integrity baseline has rules defined'
  );

  assert(
    PLAYIQ_ASSISTANT_INTEGRITY_BASELINE.rules.some(r => r.toLowerCase().includes('homework')),
    'Integrity baseline includes homework refusal rule'
  );

  assert(
    PLAYIQ_ASSISTANT_INTEGRITY_BASELINE.rules.some(r => r.toLowerCase().includes('direct answer')),
    'Integrity baseline includes direct answer refusal rule'
  );

  assert(
    PLAYIQ_ASSISTANT_SYSTEM_PREFIX.includes('MANDATORY RULES'),
    'System prefix includes MANDATORY RULES label'
  );

  assert(
    PLAYIQ_ASSISTANT_SYSTEM_PREFIX.includes('politely refuse'),
    'System prefix includes refusal instruction'
  );

  // ═══════════════════════════════════════════════════════════════════
  // 9. CONSTANTS
  // ═══════════════════════════════════════════════════════════════════

  assert(
    ASSISTANT_CHAT_MAX_MESSAGES_PER_SESSION > 0 && ASSISTANT_CHAT_MAX_MESSAGES_PER_SESSION <= 100,
    `Chat max messages is bounded (${ASSISTANT_CHAT_MAX_MESSAGES_PER_SESSION})`
  );

  assert(
    ASSISTANT_CHAT_MAX_INPUT_LENGTH > 0 && ASSISTANT_CHAT_MAX_INPUT_LENGTH <= 5000,
    `Chat max input length is bounded (${ASSISTANT_CHAT_MAX_INPUT_LENGTH})`
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
    console.log('\n✅ All Assistant Build Policy QA checks passed.');
    process.exit(0);
  }
}

main();
