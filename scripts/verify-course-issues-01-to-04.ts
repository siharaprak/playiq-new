import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import {
  buildPersonalLearningKnowledgeFile,
  RELEASE_ID,
} from '../src/lib/course-release/learning-record';
import { validateTextResponseDeterministic } from '../src/lib/gemini';
import {
  PERSONAL_ASSISTANT_BUILDER_PROMPTS,
  PERSONAL_ASSISTANT_KIT_DOCS,
  STARTER_ASSISTANT_SYSTEM_INSTRUCTIONS,
} from '../src/lib/assistant/starter-kit';

const ROOT = process.cwd();
const read = (rel: string) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

async function main() {
  console.log('--- Verifying PlayIQ Course Fixes (Issues 01–04 + 5-Prompt Local Memory Kit) ---\n');

  // Issue 01
  const overviewSrc = read('src/components/modules/CourseModuleOverviewView.tsx');
  assert.ok(
    overviewSrc.includes('showRecordForm={true}'),
    'CourseModuleOverviewView must pass showRecordForm={true} so Modules 03–08 display Save Draft & Save & Confirm Module Learning Record',
  );
  assert.ok(
    !overviewSrc.includes('showRecordForm={moduleNum >= 9}'),
    'CourseModuleOverviewView must not hide the learning record form on Modules 03–08',
  );

  const now = '2026-11-23T18:00:00.000Z';
  const records = Array.from({ length: 9 }, (_, m) => ({
    moduleNumber: m,
    answers: { tutorRule: `Module ${m} verified rule from experiment.` },
    includeInTutor: true,
    completed: true,
    updatedAt: now,
  }));
  const exported = buildPersonalLearningKnowledgeFile(
    { records, assessmentProfile: null },
    'beta',
    now,
  );
  assert.deepEqual(
    exported.missingModules,
    [],
    `Expected zero missing/excluded modules when M00–M08 are approved & completed (release ${RELEASE_ID})`,
  );
  for (let m = 3; m <= 8; m++) {
    assert.ok(
      exported.markdown.includes(`> Module ${m} verified rule from experiment\\.`),
      `Module 09 export must include approved Module 0${m} record`,
    );
  }
  console.log('✅ PASS: Issue 01 — Modules 03–08 Learning Record form exposed & Module 09 export verified');

  // Issue 02
  assert.equal(validateTextResponseDeterministic('', 'Which Project do you use in Module 10?').ok, false);
  assert.equal(validateTextResponseDeterministic('idk', 'Which Project do you use in Module 10?').ok, false);
  assert.equal(validateTextResponseDeterministic('sdfghjkl zxcvbnm qwrtyp', 'Explain why a Tutor checks first').ok, false);
  assert.equal(
    validateTextResponseDeterministic(
      'Which Project do you use in Module 10?',
      'Which Project do you use in Module 10?',
    ).ok,
    false,
  );
  assert.equal(
    validateTextResponseDeterministic(
      'In Module 10, I test inside my existing Module 00 PlayIQ Tutor Project.',
      'Which Project do you use in Module 10?',
    ).ok,
    true,
  );

  const autoSaveSrc = read('src/hooks/useFormAutoSave.ts');
  assert.ok(autoSaveSrc.includes('__playiq_v2_sig'), 'useFormAutoSave must enforce content signature matching');
  assert.ok(read('src/components/forms/TeachBackForm.tsx').includes('teachback-autosave-m${moduleId}'));
  assert.ok(read('src/components/modules/CourseNodePhaseViews.tsx').includes('submitCourseActivityAction'));
  assert.ok(read('src/components/modules/CourseNodePhaseViews.tsx').includes('submitCourseMiniCheckAction'));
  assert.ok(
    read('src/app/(dashboard)/student/modules/1/nodes/[nodeId]/activity/page.tsx').includes('submitActivityAction'),
  );
  assert.ok(
    read('src/app/(dashboard)/student/modules/1/nodes/[nodeId]/mini-check/page.tsx').includes('submitMiniCheckAction'),
  );
  assert.ok(
    read('src/app/(dashboard)/student/modules/2/nodes/[nodeId]/activity/page.tsx').includes('submitActivityAction'),
  );
  assert.ok(
    read('src/app/(dashboard)/student/modules/2/nodes/[nodeId]/mini-check/page.tsx').includes('submitMiniCheckAction'),
  );
  assert.ok(read('src/app/(dashboard)/student/modules/14/actions.ts').includes('evaluateCapstoneMasterTrial'));
  console.log('✅ PASS: Issue 02 — Answer validation & prompt-signature auto-save guard verified across M01–M14');

  // Issue 03
  const actionsSrc = read('src/lib/assistant/actions.ts');
  const insertBlockMatch = actionsSrc.match(/\.from\('assistant_profiles'\)\s*\.insert\(\{([\s\S]*?)\}\)/);
  assert.ok(insertBlockMatch, 'createAssistantProfile must insert into assistant_profiles');
  assert.ok(
    insertBlockMatch[1].includes('owner_user_id: user.id'),
    'assistant_profiles insert must populate owner_user_id: user.id',
  );
  assert.ok(
    insertBlockMatch[1].includes('student_id: user.id'),
    'assistant_profiles insert must populate student_id: user.id',
  );
  console.log('✅ PASS: Issue 03 — Module 11 assistant_profiles owner_user_id + student_id insert verified');

  // Issue 04 + 5-Prompt Local Memory Vault
  assert.equal(PERSONAL_ASSISTANT_BUILDER_PROMPTS.length, 5, 'Must provide all 5 sequential builder prompts');
  assert.equal(PERSONAL_ASSISTANT_KIT_DOCS.length, 4, 'Must provide all 4 starter templates & reference files');
  assert.ok(STARTER_ASSISTANT_SYSTEM_INSTRUCTIONS.includes('00_MY_COMPASS.md'));
  assert.ok(STARTER_ASSISTANT_SYSTEM_INSTRUCTIONS.includes('/closeout'));
  assert.ok(STARTER_ASSISTANT_SYSTEM_INSTRUCTIONS.includes('Reminder Reality Check'));
  assert.ok(
    PERSONAL_ASSISTANT_BUILDER_PROMPTS[4].promptText.includes('STRICTLY FORBIDDEN'),
    'Prompt 5 must enforce the anti-weak-AI Locked Spine rule',
  );
  assert.ok(
    !JSON.stringify(PERSONAL_ASSISTANT_BUILDER_PROMPTS).toLowerCase().includes('mempalace'),
    'Student-facing prompts must never leak internal MemPalace or GitHub tooling names',
  );
  assert.ok(
    fs.existsSync(path.join(ROOT, 'src/app/(dashboard)/student/modules/12/assistant-builder/page.tsx')),
    'Module 12 assistant-builder route must exist',
  );
  for (const relFile of [
    'public/curriculum/pdf/Module_10_15M_Student_Text.pdf',
    'public/curriculum/pdf/Module_11_Student_Text.pdf',
    'public/curriculum/pdf/Module_12_Student_Text.pdf',
    'public/worksheets/Module_11_Worksheet.md',
    'public/worksheets/Module_11_Worksheet.doc',
    'public/worksheets/Module_12_Worksheet.md',
    'public/worksheets/Module_12_Worksheet.doc',
  ]) {
    assert.ok(fs.existsSync(path.join(ROOT, relFile)), `Required asset ${relFile} must exist`);
  }
  assert.ok(
    overviewSrc.includes('Module12AssistantKitPanel'),
    'CourseModuleOverviewView must render Module12AssistantKitPanel on Modules 11 and 12',
  );
  console.log(
    '✅ PASS: Issue 04 — Module 12 5-Prompt Personal Assistant Builder, Local Memory Vault, PDFs, Worksheets, and Studio route verified',
  );

  // Admin Student Roster 15-Module Parity
  const adminRosterSrc = read('src/app/(dashboard)/admin/users/page.tsx');
  const adminActionsSrc = read('src/app/(dashboard)/admin/users/actions.ts');
  assert.ok(
    adminRosterSrc.includes('COURSE_15_MODULES') && adminRosterSrc.includes('isNodeKeyForCourseModule'),
    'Admin Student Roster must render all 15 modules via COURSE_15_MODULES and isolate M10–M14 via isNodeKeyForCourseModule',
  );
  assert.ok(
    !adminRosterSrc.includes("num: 11, title: 'Capstone'"),
    'Admin Student Roster must not cap module progression at legacy Module 11',
  );
  assert.ok(
    adminActionsSrc.includes('resetSingleModule') &&
      adminActionsSrc.includes('adjustStudentModuleProgress') &&
      adminActionsSrc.includes('course_release_learning_records'),
    'Admin user actions must support 15-module resets and adjustments including course_release_learning_records',
  );
  console.log('✅ PASS: Admin Student Roster — Full 15-module (M00–M14) progression, isolated node counts, and reset/adjustment controls verified');

  console.log('\n🎉 All Issues 01–04 + Admin 15-Module Roster verification assertions passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
