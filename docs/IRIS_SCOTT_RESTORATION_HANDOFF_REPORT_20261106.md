# PlayIQ — Orion & 15-Module Course Restoration Handoff Report (Iris → Scott)

- **Date**: November 6, 2026
- **Task Key**: `playiq-restoration-20261105`
- **Implementation Owner**: Iris (Antigravity PlayIQ Workspace)
- **Contract Base Commit**: `6b31f19b55b4676c9aeb0e7c38aa377975b2eefb` (`codex/playiq-restoration-contract-20261105` / `9cbde86ab28d9922a29354419767bd183db1d45a`)
- **Visual Baseline Reference**: `7ee00fc254b7dc48f0d51de657eaa089d1be0a42` (`docs/restoration/playiq-20261105/evidence/original-module-1-lesson.png`)
- **Curriculum Source**: `docs/curriculum/playiq-weekend-test-20261030/` (`Module_00_Student_Text.md` through `Module_14_Student_Text.md` + `MODULE_2_DISCOVERY_CORRECTION.md`)

---

## 1. Executive Summary

Per Scott's handoff directive (`docs/restoration/playiq-20261105/IRIS_ORION_HANDOFF.md`), we preserved the live floating Orion companion and restored the last approved dark cosmic interactive course interface (`7ee00fc254b7dc48f0d51de657eaa089d1be0a42`), then updated all course material inside that interface across the complete **15-module curriculum (`Module 00` through `Module 14`)** without redesigning the UI or UX.

Following the staged review workflow:
1. **Stage 1 (Completed & Approved)**: Restored the interactive Student Dashboard (`/student/home`) and completed **Modules 00, 1, and 2**, fixed UI centering and dark-mode contrast on `BetaBlockerReport`, and updated Orion so the floating character always remains visible when the chat window is opened.
2. **Stage 2 (Completed & Verified)**: Completed **Modules 3 through 14** inside the restored interactive interface, fixed sequential module/node unlocking on the dashboard and direct URL routes, and verified all 90 automated tests, database parity checks, TypeScript checks, and the full production Next.js build (`145/145` routes).

---

## 2. Floating Orion Companion — Preserved & Enhanced

- **Preserved Architecture**:
  - Kept the existing floating sprite-atlas companion (`src/components/guided-ai/OrionCompanion.tsx`, 9 animation states, 16 stationary look poses), alpha hit-mask click-through on transparent pixels, pointer-capture drag (`> 6px` threshold), saved normalized viewport position (`playiq:orion-companion-position:v1`), single authenticated chat drawer (`src/components/guided-ai/GuidedAIPanel.tsx`), `sienvi.character-action.v1` action contract, safety refusal posture reset, and mobile `visualViewport` keyboard handling.
  - Did **not** rebuild Orion or restore the obsolete boxed launcher.
- **Always-Visible Orion When Chat Opens**:
  - Updated `src/components/guided-ai/GuidedAIPanel.tsx` to pass `chatOpen={false}` to `<OrionCompanion />` so the floating Orion character is never hidden when the chat drawer opens.
  - Updated `openChat()` in `src/components/guided-ai/OrionCompanion.tsx` so that on desktop viewports (`>= 960px`), if Orion is sitting on the right side where the chat drawer opens, Orion smoothly steps left (`v.width - 760`) to remain visible beside the chat drawer.
- **Copyback SHA Reconciliation**:
  - Reconciled the full 40-character commit SHA `cb1ff3d5915f6277c50f5f9ae3ba0484d518ef1d` in `docs/IRIS_PLAYIQ_ORION_LIVE_COPYBACK_20261103.md` and the AgencyOS mailbox.

---

## 3. Restored Interactive Course Interface & 15-Module Material Update (`M00–M14`)

### 3.1 Preserved Visual & Brand Baseline
- Kept `src/app/globals.css`, `src/app/layout.tsx`, `src/components/layout/PlayIQLogo.tsx`, and `public/images/playiq-logo-cropped.png` byte-identical to `SOURCE_MANIFEST.json`.
- Fixed top navbar overlap (`pt-24`) across student dashboard, module overview, lesson/activity/mini-check/teach-back, quiz, boss-battle, proof-artifact, and assessment views.
- Fixed `BetaBlockerReport` (`src/components/course-release/BetaBlockerReport.tsx` and `src/components/course-release/course-release.module.css`) so it renders centered (`max-width: 48rem; margin: 1.5rem auto 0`) with dark-cosmic card/input fallbacks instead of white-on-white text when mounted inside dark interactive pages.

### 3.2 Module-by-Module Implementation Summary

| Module | Route | Curriculum Alignment & Key Interactive Features |
| :--- | :--- | :--- |
| **Module 00** | `/student/assessment` | 3-Moment flow: Moment 1 Parent & Student Co-Pilot Setup (6 Ground Rules + AI platform check), Moment 2 Orion Diagnostic (provisional Learning Blueprint framed as starting hypotheses), Moment 3 AI Workspace Orientation (`PlayIQ Tutor Project` setup for ChatGPT/Claude/Gemini + Starter System Instructions + 3-Question Verification Check + `Module0CompletedView` review mode). |
| **Module 1** | `/student/modules/1/*` | *Create Your Character & Learn the AI Learning Code*: 4 Skill Tree nodes including Part 00 First-Win Character Lab (10-question one-at-a-time discovery interview, 3 Must-Keep Visual Features, `My_Character_Card_v1.md`, Orion reference sheet `/course-release/orion-reference.png`), 6 PlayIQ AI Modes, 6-Rung Question Ladder, 4-Step Verification Ritual, Learn How You Learn Lab, Quiz, Boss Battle, and Proof Artifacts. |
| **Module 2** | `/student/modules/2/*` | *Digital Smarts & Human Responsibility*: 6 Skill Tree nodes incorporating `MODULE_2_DISCOVERY_CORRECTION.md` (Node 2 practical 10-question one-at-a-time Tutor Discovery step inside the existing Module 00 `PlayIQ Tutor Project` producing an approved Tutor Guardrail Summary), Coach vs. Crutch vs. Gray Zone, 5-Point Policy Check, Voice Protection, 5-Step Truth Filter & Triple-P Check, Focus Sprints, Quiz, Boss Battle, and Proof Artifacts. |
| **Module 3** | `/student/modules/3/*` | *The Pre-Learn System*: 4 Skill Tree nodes covering the 5-Part Pre-Learn Map, 3-way entry comparison (Round A Map-First, Round B Example-First, Round C Question-First), 10-Line Pre-Learn Brief, Map Scout character connection, Quiz, Boss Battle, and Proof Artifacts. |
| **Module 4** | `/student/modules/4/*` | *Lesson Rescue Mode*: 5 Skill Tree nodes covering Stop-Name-Choose-Prove, 6 Gap Types, G/M/S line-by-line scanning, Analogy vs. Step-by-Step vs. Diagnostic-Question rescue comparison, Rescue Signal character connection, Quiz, Boss Battle, and Proof Artifacts. |
| **Module 5** | `/student/modules/5/*` | *Compression Learning*: 4 Skill Tree nodes covering Strip-Link-Test compression, 5-Line / 3-Bullet / 1-Sentence Ladder, 6-Part One-Page Core Sheet, Core Crystal character unlock, Quiz, Boss Battle, and Proof Artifacts. |
| **Module 6** | `/student/modules/6/*` | *Self-Testing & Mistake Bank*: 4 Skill Tree nodes covering the Illusion of Competence, 4-Step Self-Test Loop, 6 Mistake Bank categories, One-at-a-Time vs. Full-Set quiz comparison, Spaced-Review Reminder Plan, Calibration Lens character unlock, Quiz, Boss Battle, and Proof Artifacts. |
| **Module 7** | `/student/modules/7/*` | *Build Knowledge Files Your Tutor Can Trust*: 4 Skill Tree nodes covering Source Facts vs. Summaries vs. Unverified Guesses, 8-Part Tutor-Ready Study Pack (`Topic_Study_Pack_v1.md`), Messy vs. Clean Knowledge File test, Memory Vault character unlock, Quiz, Boss Battle, and Proof Artifacts. |
| **Module 8** | `/student/modules/8/*` | *Protect Your Voice & Make Your Answers Clear*: 4 Skill Tree nodes covering Ghostwriter vs. Coach, Brain-First / Outline-First / Rough-Draft-First comparison, Claim-Support-Why-It-Matters answer structure, Voice-Protection Rubric Check, Signal Voice character unlock, Quiz, Boss Battle, and Proof Artifacts. |
| **Module 9** | `/student/modules/9/*` | *Build Your AI Tutor*: 6 Skill Tree nodes + `Module9TutorGenerator` + exclusive **`personal_learning_knowledge_file.md` (File 2 of 6) Review & Download Section** in `ModuleLearningRecordPanel.tsx` (M00–M08 approval coverage grid, missing-module check, collapsible Markdown preview, Copy Markdown button, and `.md` download), 6-file `PlayIQ_Tutor_Kit` assembly in the Module 00 `PlayIQ Tutor Project`, Read-Back Check, and `tutor_test_log.md` initialized as `not_tested` for Module 10. |
| **Module 10** | `/student/modules/10/*` | *Test Your Tutor and Learn With It*: 4 Skill Tree nodes (`src/data/module10TutorTestContent.ts`) covering all 6 Tutor Tests (Profile & Rule Recall, First Explanation Fit, No-Spoiler Homework Guardrail, Mistake-Coaching Response, Study Pack Grounding, Teach-Back & Verification Check), one-variable-at-a-time refinement, and `tutor_test_log.md` completion. |
| **Module 11** | `/student/modules/11/*` | *Build Your Personal AI Assistant*: 4 Skill Tree nodes (`src/data/module11AssistantBuildContent.ts`) + `/student/modules/11/assistant-builder` covering Tutor vs. Assistant separation (creating a separate `PlayIQ Assistant Project`), 10-question Assistant Discovery interview, 6-file `PlayIQ_Assistant_Kit` (`assistant_instructions.md`, `assistant_profile.md`, `workflow_playbooks.yaml`, `task_templates.md`, `assistant_test_log.md`, `assistant_setup_checklist.md`), and First Handshake Check. |
| **Module 12** | `/student/modules/12/*` | *Test Your Assistant and See What It Could Do*: 4 Skill Tree nodes (`src/data/module12AssistantTestContent.ts`) covering all 5 Assistant Tests (Role & Scope Recall, Core Workflow Execution, Missing-Information Check, Safety & No-Cheating Boundary Test, Privacy & Verification Stress Test), refinement, and safe future expansion ideas. |
| **Module 13** | `/student/modules/13/*` | *Your Orion Character's Next Adventure*: Exploration-only possibility preview (`src/data/module13CharacterPreviewContent.ts`) showing how `My_Character_Card_v1.md` can anchor a future separate creative story/storyboard/cartoon project. **No required quiz, Boss Battle, proof artifact, or Tutor upload.** |
| **Module 14** | `/student/modules/14/*` | *Capstone — The Master Trial*: Interactive Master Trial (`src/data/module14CapstoneContent.ts` + `Module14CapstoneForm.tsx`) covering Part 0 Safe Topic Selection, Part 1 6-Stage Exam & Performance System, Parts 2–3 Honest 3-Record Learning Dashboard (no invented PDI scores), Part 4 Skills Demonstration Tracks A–E (Prompt Engineer, Game Design Engineer, Physical Object Dream Creator, AI Chef, Personal Expense Assistant concept), Parts 5–6 Tutor Final Course Review & Family Review, Part 7 Quick Quiz, Part 8 Capstone Boss Battle (Explain, Show, Choose), and the Family Note (including the optional \$4,999 follow-up course note). Legacy `/student/modules/capstone/overview` redirects to `/student/modules/14/overview`. |

### 3.3 Database Foreign-Key Parity & Sequential Gating
- **Foreign-Key Compatibility + 15-Module Isolation**:
  - `MODULES` in `src/lib/constants.ts` retains the exact 12 canonical UUIDs (`MODULE_0_ID`..`MODULE_10_ID`, `CAPSTONE_ID`) so `public.modules(id)` foreign keys and DB parity scripts pass.
  - Modules 10–14 use namespaced `node_id` keys (`'m10-1'..'m14-1'`) in `student_node_progress` and `courseModuleNumber` in `assessment_submissions` / `proof_artifact_submissions` so legacy 12-module rows never bleed into New Modules 10–14.
  - `course_release_learning_records` stores records directly by `module_number` (`0..14`) and `student_id`.
- **Cumulative Sequential Unlocking**:
  - Fixed `/student/home` (`src/app/(dashboard)/student/home/page.tsx`) so Module $N$ unlocks **only** if Modules $1 \dots N-1$ are all unlocked and have their Skill Tree nodes mastered (`previousUnlockedAndCompleted = isUnlocked && isCompleted`).
  - Added `enforceSequentialModuleUnlock` in `src/lib/gating.ts` so non-admin students cannot skip ahead to a locked module or locked node by typing its URL directly.

---

## 4. Verification Summary

All verification commands and test suites passed with zero errors:

1. `npx tsx scripts/verify-module-constants.ts` → **PASS** (11/11 DB module UUIDs verified)
2. `npx tsx scripts/verify-static-db-curriculum-parity.ts` → **PASS** (49/49 DB skill nodes verified)
3. `node docs/restoration/playiq-20261105/verify-packet.mjs` → **PASS** (`sourceHashesChecked: 56`, `packetFiles: 15`)
4. `node scripts/verify-orion-atlas.mjs` → **PASS** (`frames: 88, animations: 9, stationaryLookPoses: 16`)
5. `node --experimental-strip-types --test scripts/restored-15-module-course.test.mjs` → **PASS** (6/6 tests)
6. `node --experimental-strip-types --test scripts/orion-companion.test.mjs scripts/orion-action-contract.test.mjs src/components/guided-ai/GuidedAIPanel.test.mjs` → **PASS** (27/27 tests)
7. `node --experimental-strip-types --test scripts/course-blocker.test.mjs` → **PASS** (14/14 tests)
8. `node --conditions=react-server --experimental-strip-types --test scripts/course-learning-record.test.mjs scripts/assessment-flow.test.mjs scripts/course-release-rls.test.mjs scripts/weekend-release.test.mjs src/components/course-release/course-release.test.mjs src/components/course-release/lesson-activities.test.mjs` → **PASS** (43/43 tests)
9. `npx tsc --noEmit --incremental false` → **PASS** (0 errors)
10. `npm run build` → **PASS** (145/145 routes compiled cleanly)
