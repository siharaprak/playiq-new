# PlayIQ answer-to-file map and data/export copyback — 2026-10-30

## Scope and evidence boundary

Project: PlayIQ. Lab: `PLAYIQ_ORION_WIZARD_LAB`. Agent/owner: DATA_EXPORT worker.
Cycle: `playiq-weekend-test-20261030`. Active department/SOP step: Course Release Implementation.
Worktree: `/private/tmp/playiq-weekend-test-20261030`. One owner for the five paths below.

Local source implementation and offline fixtures, including synthetic PostgreSQL/WASM tests.
No hosted database migration was applied, no real learner answers were used, no provider was called, no environment credentials were
read or changed, and nothing was committed, published, or deployed by this worker.
Other workers own the course shell/UI, assessment, and rewritten course package.

The student keeps the SAME parent-approved **external Tutor Project** started in Module 00.
PlayIQ collects short, safe, student-authored learning records; Module 9 downloads
`personal_learning_knowledge_file.md` (display title: **Personal Learning Knowledge File**) for student/parent review and manual upload.
This is file 2 of the existing six, replacing the old Student Tutor Profile Knowledge File.
It is not a seventh file, in-platform Tutor Builder, fine-tuning, or automatic external upload.

## Source basis

Full lesson experiment/record/checkpoint sections from
`docs/curriculum/playiq-15-module-course-20261027/Module_00_Student_Text.md`
through `Module_14_Student_Text.md`, especially the structured evidence records and
privacy choices. These are the prior full source package, not the legacy app quiz summaries.
The separate content owner is updating the October 30 reading package.

The canonical executable field inventory is `MODULE_FIELDS` in
`src/lib/course-release/learning-record.ts`. Related worksheet sub-answers share a labelled
text field to preserve actual observations without adding duplicate assignments. For example,
the three explanation-format tests each preserve reaction, ratings, and what worked in one
field; no format preference or score is inferred. The full printable lesson remains available.
Every field is optional; an omitted answer remains pending, not fabricated. Completion is a
student self-report, not a measured mastery claim. Module 13 requires no written answer or artifact.

### Modules 00–8: approved learning context for the Module 9 download

| Module | Fields and source mapping | Tutor use / limits |
| --- | --- | --- |
| 00 — assessment/workspace | `learningContext`, `imaginationGoal`; five signal questions and reasons in `explanationSignal`, `pacingSignal`, `challengeResponse`, `aiExperience`, `motivation`; the three challenges in `accuracyCheck`, `ownWordsExplanation`, `explanationReflection`, `planningChallenge`; `rescueSubject`, `advanceSubject`, `personalGoal`; setup/readiness/handshake in `workspaceCheck` | Initial hypotheses and actual setup result, not a diagnosis or proof of a completed workspace. No signatures, parent name, credentials, private URLs, or personal contact details. |
| 1 — character and AI Learning Code | `characterWin` (guardrail/reuse result, not all images); `aiUseReflection`, `modeAndPrompts`, `verification`; comparison topic in `topic`; `analogyResult`, `stepsResult`, `bigPictureResult`, `explanationStart`; `explainModeResult`, `hintModeResult`, `studyBoundaries` | Test an explanation opening and hint/verification boundary; character work is a short first-win summary, not a second required project. |
| 2 — responsibility/focus | `responsibility`, `schoolPolicy`, `voiceComparison`, `truthFilter`; three sprint results in `focus5`, `focus10`, `focus15`; synthesis in `focusBlock`, `reset`, `distraction`, `voiceBoundary` | Distinguish authorship boundary from measured focus preference. Store the actual focus observations and reset, not a fixed attention diagnosis. |
| 3 — pre-learning | `topic`, `prelearnMap`; trial results in `mapResult`, `exampleResult`, `questionResult`; synthesis in `entryComparison`; `boundaryExample`, `prelearnBrief`, `recallResult`, `classDebrief` | Entry setting is conditional on topic. An upcoming class/debrief stays pending if it has not happened. |
| 4 — lesson rescue | `topicAndSource`, `confusionPoint`, `gapHypothesis`; method comparison in `analogyResult`, `stepsResult`, `questionsResult`, `rescueComparison`; proposed first move/fallback in `rescueStart`; actual explanation/example/check answer in `teachBack`; `remainingGap` | Preserve before/after understanding, frustration, hints, teach-back and confounding conditions. Do not claim one method always works. |
| 5 — compression/retrieval | `topicAndSource`, `compression`; three methods in `audioResult`, `visualResult`, `teachBackResult`; `reviewComparison`, `reviewStart`, `uncertainty` | Record actual retrieval and accuracy correction; preference is not a memory score. |
| 6 — quizzes/mistake repair | `topicAndSource`, `singleQuizResult`, `fullQuizResult`, `quizStart`; `mistake`, `correction`, `matchedQuestion`, `afterWrongAnswer`, `reviewPlan`, `reminderMethod` | Keep mistake category as hypothesis, actual matched-question result, review dates/results or pending. A chat promise never counts as a scheduled reminder. |
| 7 — Knowledge Files | `topicAndSources`, `studyPack`, `messyResult`, `organizedResult`, `fileComparison`, `knowledgeUse`, `fileCorrections`, `privacyDecision` | Approved source IDs, scope, messy/clean comparison, traceability and unsupported-claim observations. Full Study Pack stays separate; do not paste private notes or books. |
| 8 — writing/voice | `taskAndPermission`, `answerMap`, optional safe `originalDraft` / `revisedDraft`; `coachingChoices`, `voiceComparison`, `writingSupport`, `authorshipBoundary`, `samplePrivacy` | Samples must be student-authored, safe and deliberately included. Leave them blank to exclude them. No right to impersonate/ghostwrite is conferred. |

All Modules 00–8 additionally have:

- `evidenceStatus`: what the student observed versus reported, unknown or pending;
- `tutorRule`: student-worded, proposed setting to test;
- `retest`: next topic, condition or date for review.

Every module except optional Module 13 additionally permits `lessonChoices` (label:
Saved in-lesson choices). The shell saves the learner's selected answers with their question
identifiers in that bounded text field; they are student reports, not inferred mastery.
The SQL validator mirrors this extra field. Modules 00–8 choices enter the Markdown only
when the student approves that module; Modules 9–14 remain excluded from this profile.

These fields preserve evidence alongside the proposed instruction. Export approval is a
separate module-level checkbox; it does **not** silently approve a permanent rule or override
the existing Tutor Project instructions. The student reviews the whole module's included
fields before approving. To exclude only a writing sample, clear that sample before saving;
to exclude the entire module, uncheck Tutor export approval and save.

### Modules 9–14: saved progress/reflection, excluded from the pre-integration profile

| Module | Saved fields | Limit |
| --- | --- | --- |
| 9 — Tutor integration | `discovery`, `integration`, `buildCheck` | Review/download file 2 of six; manually upload to existing external Tutor Project. Personality/name discovery belongs in the instruction/build flow; no invented answers. |
| 10 — Tutor testing/use | `tutorTests`, `revision`, `learningMission` | Actual tests, retest and learning use. Not included retroactively in the Module 00–8 profile. |
| 11 — separate Assistant | `assistantBrief`, `assistantBuild` | New, separate Assistant Project; do not copy private Tutor context by default. |
| 12 — Assistant testing | `assistantTests`, `assistantRevision` | Actual normal/missing-detail/boundary results and reminder availability. |
| 13 — possibilities | optional `futureIdea` | No required artifact, story, storyboard, cartoon, upload, or written answer. |
| 14 — Capstone | `capstone`, `dashboard`, `skillsDemonstration`, `nextStep` | Student evidence only; no fabricated progress/PDI or automatic scoring. |

## Legacy Module 00 assessment context and approval

Only these `student_assessment_profiles` fields may be displayed for review or captured:

`grade_level`, `explanation_style`, `pacing_preference`, `challenge_response`,
`ai_literacy_level`, `motivation_driver`, `baseline_task1_answer`,
`baseline_task2_response`, `baseline_task3_response`, `rescue_target_subject`,
`advance_target_subject`, `personal_goal`.

Explicitly excluded: display name, email, IDs, parent/contact/account data, signatures,
AI-generated reveal/blueprint, computed baseline scores, PDI, progress claims, raw unrelated
quiz attempts, beta feedback and other people's records.

`loadCourseReleaseState` returns the allowlisted *current* assessment answers for student
review. Saving Module 00 with `includeInTutor=true` captures a separate allowlisted snapshot
in that shell's Module 00 record. Downloads use that saved snapshot, never a later live
assessment. Later changes to the legacy assessment are therefore **not** automatically
exported. Saving Module 00 again while approved refreshes the snapshot; UI must make this
clear and let the student inspect the assessment answers before approval/save. Unapproving
Module 00 clears the snapshot and excludes all its context from future downloads.

Integration requirement for the UI owner: show the allowlisted assessment values/labels
beside the Module 00 approval choice; state that those values are included on approval.
Do not use "an assessment was found" alone as evidence that the student reviewed it.
The main-owned action interface now carries `assessmentReviewToken`, a SHA-256 over the
canonical allowlisted assessment answers returned with the displayed profile. Module 00
approval compares that token with a fresh server read. If the assessment changed after the
page was reviewed, the action rejects the save and asks the learner to reload, review, and
approve again. The persisted snapshot is exactly the freshly read context whose token matched;
later legacy changes do not enter future downloads without another reviewed approval/save.
This is a bound review check, not a general optimistic-lock protocol for lesson answer edits.

## Persistence/API contract

Server actions: `src/app/(dashboard)/student/course-actions.ts`.

- `loadCourseReleaseState(shell)` → `{ok:true,data:{records,assessmentProfile,assessmentReviewToken}}` or `{ok:false,error}`.
- `saveCourseModuleRecord({shell,moduleNumber,answers,includeInTutor,completed,assessmentReviewToken?})` → confirmed read-back record or explicit failure; the review token is checked on Module 00 approval.
- `downloadPersonalLearningKnowledgeFile(shell)` → `{ok:true,markdown,filename,missingModules}` or explicit failure.
- `saveCourseBetaFeedback({moduleNumber,rating,feedback})` → success/failure; beta only, after saved lesson completion.

Release is fixed to `playiq-2026-10-30`; module range 0–14. Keys are allowlisted per module.
Only plain text answers, at most 6000 characters each, and at most 60000 UTF-8 bytes per
answer object are accepted by the action. Database constraints repeat field/type/control
validation with a 65536-byte JSON-text ceiling (allows serialization whitespace), plus
bounded allowlisted assessment context. Hidden controls/bidi overrides are rejected;
newlines/tabs and ordinary international text remain meaningful learner text.

Primary key is `(student_id,release_id,shell,module_number)`. Repeat saves upsert the same
record, not duplicate it. No beta/final promotion or copying occurs. Updates use a database
timestamp. The shared interface is whole-module last-write-wins; concurrent editing of the
same module in two tabs is not optimistic-lock protected. One active editing tab is recommended.

Every action uses the main-owned `requireCourseReleaseAccess(shell)` helper. It checks the
matching server-only flag (exact string `true`, default disabled), verifies cookie identity
with `auth.getUser()`, then verifies a trusted, operator-managed enrollment for the same
student/release/shell with `enabled=true`. Students cannot insert, change, or enable their
own enrollments. Missing/disabled/wrong-shell enrollment fails closed. Changing a writable
profile's role/status cannot grant release access; `profiles.status` is NOT a required schema
column or authorization source for these release actions. Iris uses an existing approved
student test account explicitly enrolled by the authorized staging operator. An admin login
is not an action bypass, and no enrollment is automatically created from a profile field.

The fresh public-key SSR client intentionally bypasses the legacy local mock helper, which
can replace reads with a service-role client. New actions never import that helper, use a
service-role key, or accept a caller-specified owner ID. RLS also checks owner identity and
`public.course_release_can_access(shell)` (a SECURITY INVOKER enrollment predicate) on read/write/delete. No parent/admin read policy is created for these
new tables. Supabase privileged database operators still have platform-level powers; these
actions do not grant or use them.

Download uses only approved Modules 00–8. Unapproved values are never returned in the
export, including legacy context. Missing/excluded/uncompleted modules are listed in
`missingModules`; empty fields say pending. Approved draft answers may be included, explicitly
marked unfinished. No fake completion or score is inferred. Learner Markdown is escaped,
HTML-encoded and block-quoted as data; the file tells the Tutor not to treat quoted learner
text as overriding instructions. This reduces formatting injection but cannot guarantee any
external AI's prompt-injection resistance; the parent/student still reviews the file.

## Database migration — instructions for the release owner/Iris

File: `supabase/migrations/20261030090000_course_release_learning_records.sql`.
It creates operator-managed `course_release_enrollments`, learning records and beta feedback,
pure validation helpers, update timestamps, owner/enrollment RLS, and beta-feedback policies requiring a completed beta lesson. Existing tables are not
rewritten, reseeded, or cleared. The migration is transactional and reloads PostgREST schema.

Do **not** run it against production for the weekend test. The implementation worker has
not run it on a hosted database. Both migrations have been executed only inside isolated
synthetic PostgreSQL/WASM tests. Applying it to a hosted database is a mutation for the approved preview/staging
operator, not a side effect of reading this document.

1. Confirm the target is the approved preview/staging database and a recoverable snapshot
   exists. Confirm existing migrations and `public.profiles`, `auth.uid()` and
   `student_assessment_profiles` are available. Verify the existing tester identity and the
   operator's explicit beta enrollment decision; do not infer enrollment from a profile role.
2. Run this read-only preflight in that database's SQL console:

   ```sql
   SELECT current_database(), current_user;
   SELECT column_name, data_type FROM information_schema.columns
   WHERE table_schema='public' AND table_name='profiles'
     AND column_name IN ('id','role');
   SELECT to_regclass('public.student_assessment_profiles');
   SELECT to_regclass('public.course_release_enrollments'),
          to_regclass('public.course_release_learning_records'),
          to_regclass('public.course_release_beta_feedback');
   ```

   No `profiles.status` addition or status backfill is needed. If new tables already exist,
   verify the migration history/schema rather than blindly rerunning CREATE statements.
3. Apply the exact SQL file once through the approved migration runner, or using the already
   approved preview connection supplied by the operator (never paste secrets into chat):

   ```sh
   psql "$PLAYIQ_PREVIEW_DATABASE_URL" -v ON_ERROR_STOP=1 -f supabase/migrations/20261030090000_course_release_learning_records.sql
   ```

   This command is an instruction, not a record that it ran. Do not run unscoped `db push`
   against a linked production project. Do not print the connection string.
4. The authorized staging operator explicitly grants the approved existing test account a
   matching `course_release_enrollments` row (`release_id='playiq-2026-10-30'`, `shell='beta'`,
   `enabled=true`) using the approved administrative database path. No student action can
   grant this. Verify RLS/policies/constraints, then exercise two distinct existing student
   accounts via normal cookie-authenticated sessions. Test anonymous, unenrolled, disabled
   enrollment and wrong-shell accounts are rejected. Mutating a profile role must not grant
   enrollment. One student cannot read, overwrite,
   delete or export the other's rows. Verify beta and final do not share records. Use normal
   JWT/RLS sessions, NOT SQL-editor/service-role results as proof of student isolation.
5. Enable **only** `PLAYIQ_COURSE_BETA_ENABLED=true` in the approved preview deployment;
   leave `PLAYIQ_COURSE_FINAL_ENABLED` unset/false until separately ready. New tables never
   automatically replace or renumber the old live course. Have the UI owner confirm routes.
6. Save Module 00 answers/approval, reload, export in Module 9, inspect the actual Markdown,
   confirm its missing data and snapshot, and manually upload only after student/parent review.
   Revoke approval, resave, redownload and confirm the old approved content is excluded.
   Existing local/external uploaded copies must be removed/replaced manually.

Quick shutdown is to disable the matching preview flag. Preserve saved evidence; do not drop
tables or delete beta answers as a rollback shortcut. Removing the beta course shell after
testing and any data-retention/deletion action need an explicit later release decision.

## Verification and copyback

Local commands completed:

```sh
node --experimental-strip-types --test scripts/course-learning-record.test.mjs
node --experimental-strip-types --test scripts/course-release-rls.test.mjs
./node_modules/.bin/tsc --noEmit --incremental false
./node_modules/.bin/eslint src/lib/course-release/learning-record.ts 'src/app/(dashboard)/student/course-actions.ts' scripts/course-learning-record.test.mjs
```

Updated results: **21/21 data/export offline tests pass**; **1/1 actual offline PostgreSQL/WASM
migration/RLS test passes**; **14/14 blocker-action/SSR tests pass** (36 tests combined).
TypeScript no-emit exit 0 and scoped blocker TS/TSX lint no errors; original data TS lint was
clean before main's corrections and is owned/reverified by main for final release.
ESLint ignores the `.mjs` test under the repository ignore rules (one informational warning);
Node executed it. Node also reports experimental/type-less-package notices, not failed tests.
The first test run exposed a Node 26 `stripTypeScriptTypes` mode mismatch; changing the test
to supported `mode:'strip'` resolved it. No application behavior was altered to hide that failure.

Tests check all module allowlists, validation bounds/controls, raw-text preservation,
explicit approval versus completion, context exclusions, safe Markdown, no Modules 9–14
or beta-feedback leakage, shell flags, trusted enrollment guard, SQL/TS allowlist parity and RLS
source clauses. Actions additionally execute against an in-memory **offline SDK fixture**
for save/readback, namespace isolation, approval revocation, immutable approved legacy
snapshot, stale assessment-review token rejection, missing-schema failure, and beta-feedback completion gating.

The main-owned PostgreSQL/WASM test executes the actual 90000/91000 migrations with synthetic
users and no `profiles.status` column, including owner/shell/enrollment isolation, inability
to self-enroll through profile mutation, feedback gating, and pre-completion blocker insertion.
These remain offline synthetic observations, **not** live hosted database/RLS proof. Hosted
database apply, real two-account isolation,
actual browser persistence, tablet/mobile UX, external manual upload and Iris acceptance
remain for the release owner to verify. No provider behavior, learner benefit or production
readiness is claimed. The main coordinator owns independent review and final commit/handoff.

Original DATA/EXPORT paths (subsequently corrected by the main release owner; this later
blocker task updates only this document, not these shared sources):

1. `src/lib/course-release/learning-record.ts`
2. `src/app/(dashboard)/student/course-actions.ts`
3. `supabase/migrations/20261030090000_course_release_learning_records.sql`
4. `scripts/course-learning-record.test.mjs`
5. `docs/PLAYIQ_ANSWER_TO_FILE_MAP_20261030.md`

### Explicit instruction-load receipt and pinned hashes

Loaded and followed from `/Users/blackwizard/Repos/Sienvi/SebastianCore`:

| Source | SHA-256 |
| --- | --- |
| `governance/PERSONALITY_STACK.md` | `9c1925a82bd7eb3455edf44962288a8b8f485e59ff909862e11349c138eeb564` |
| `wizard_labs/billionaire_brother_derek/System Instructions Prompt for Bill.txt` | `a55bca8f1836f8b04ce3fd2c1cdba8294282e0da5cf865e7e12041dc5ec4eb57` |
| `governance/AGENT_EXECUTION_CONTRACT.md` | `a5c3a6310a28a19da6f1b57b345b839ef80cb2cb128f8e0718075fb4f01de422` |
| `state/tasks/execution_policy.json` | `51a223a7c801bdc082944177c0553d605424844ef2ee638047b1d0051baa111e` |

Bundle version: `sebastiancore.agent_execution.v1` / `1.0.0`. This load acknowledgement
is not a claim of atomic multi-agent fencing, deployed enforcement or durable memory sync.
No unapproved writes were made to SebastianCore or its memory folders.
Combined instruction-bundle hash-list SHA-256:
`06fdc07d56460c36d22c8ea097cec223245247fb813a9e31047bd802ac34737b`
(individual `shasum -a 256` output in the four-file order above, then `shasum -a 256`).

Course source bundle hash: `f927ab2d49c9aceafcc2992243084459a910eb9d326088016a56048198708797`.
Reproduce with `shasum -a 256 docs/curriculum/playiq-15-module-course-20261027/Module_*_Student_Text.md | shasum -a 256`
from this worktree. This pins the hash-list bytes including the relative paths; it does not
claim the separate October 30 content worker's outputs were reviewed by this data worker.

Approval basis: the operator explicitly authorized the isolated PlayIQ implementation and
multi-worker release preparation. No authority was granted here for staging/commits by this
worker, production deployment, providers, credentials, messages to other people, or broad cleanup.
