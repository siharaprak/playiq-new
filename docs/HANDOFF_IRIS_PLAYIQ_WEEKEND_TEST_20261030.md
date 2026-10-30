# Iris — PlayIQ weekend beta release

Status: implemented, committed and locally verified; hosted staging acceptance pending.
This handoff supersedes older deployment prompts for this weekend release only.
Do not deploy to production or overwrite unrelated work.

## Retrieve the exact work

- Repository: https://github.com/siharaprak/playiq-new
- Branch: `codex/playiq-weekend-test-20261030`
- Implementation commit: `5a3ea59a693e9ce15781431b93dc1dbece5ea1e3`
- Base: `7ee00fc254b7dc48f0d51de657eaa089d1be0a42`.
- Current full source: `docs/curriculum/playiq-weekend-test-20261030/`.
- Reading edition: `PLAYIQ_COMPLETE_COURSE_MASTER_20261030.html` in that folder.
- White print edition: `output/pdf/PLAYIQ_COMPLETE_COURSE_LIGHT_PRINT_20261030.pdf`,
  **143 pages**. Public copy: `public/course-release/course-print.pdf`.
- Main acceptance/copyback: `docs/PLAYIQ_WEEKEND_RELEASE_QA_20261030.md`.
- Data map: `docs/PLAYIQ_ANSWER_TO_FILE_MAP_20261030.md`.
- Technical report guide: `docs/PLAYIQ_BLOCKER_REPORT_20261030.md`.

Use your own checkout path, not Scott's absolute Mac paths. Inspect Git status and remote
first. Fetch the named branch and use a clean isolated checkout; never reset/stash another
person's work. Confirm the implementation commit is an ancestor of the fetched branch.
Do not assume main already includes this release. No changes are required in SebastianCore.
The October 27 package is a preserved baseline dependency, not the newest draft.

## What you are activating

Exactly **15 sections**: Module 00, Modules 1–14, Capstone at 14.
M1 begins with the complete character/guardrail tutorial, ten design questions and a real
download/extract/reopen save-kit lesson. M9 builds the Tutor; M10 tests and uses it.
M11 builds a separate personal Assistant; M12 tests and explores its use. M13 is optional
character/story possibility-seeding, never a required cartoon or artifact. M14 finishes.
Do not shorten Modules 8/9, renumber, replace full lessons with summaries, or add assignments.

62 inline choices save genuine drafts and give a clear next step after confirmation.
Other workbook lines remain optional saved reflections. M00 assessment answers/drafts persist
before advancing; results load when ready and provide one clear Continue/retry.
M00–8 approved evidence is reviewed and downloaded in M9 as
`personal_learning_knowledge_file.md` — **Personal Learning Knowledge File**, File 2 of six.
Use the SAME external Tutor Project opened in M00, not the old in-app Tutor Builder.
Missing results remain missing; download is not upload, model training or a passed Tutor test.

Beta technical reports are available BEFORE completion; optional surveys appear only AFTER
saved completion. Reports use confirmed ticket IDs and retry reconciliation; nothing claims
the team was notified. Orion expands on desktop, fits phone/tablet, allows character collapse
and preserves the conversation/draft on minimize. Existing AI safety/action boundaries remain.
Platform tutorials are official-document verified, not real-account tested.

## Staging procedure — no production mutation

1. Identify the already-approved staging deployment AND its separate database. Confirm a
   recoverable backup and migration history. If there is no authorized staging target,
   stop and ask Scott which target to use; do not use production as a shortcut.
2. In the clean checkout run `npm ci --ignore-scripts`, the test commands in the QA copyback,
   separate `tsc --noEmit --incremental false`, and a build with the existing approved
   staging environment. Do not expose credentials or fetch new provider keys.
3. Check `public.profiles`, `auth.uid()`, and `student_assessment_profiles` exist.
   There is NO required `profiles.status` column/backfill. New release tables must either
   not exist or exactly match their tracked applied migration; do not blindly rerun CREATE.
4. Apply only these two exact migrations, in order, via the authorized staging operator:

   - `supabase/migrations/20261030090000_course_release_learning_records.sql`
   - `supabase/migrations/20261030091000_course_release_blockers.sql`

   Do not run an unscoped `supabase db push` against a linked production project.
   Migrations create owner/release/shell-isolated evidence and operator-managed enrollment.
   Do not weaken grants/RLS or add service-role/student self-enrollment bypasses.
5. Verify the approved EXISTING student test account ID in staging, then explicitly enroll
   only that tester. This template needs a verified UUID before running:

   ```sql
   INSERT INTO public.course_release_enrollments
     (student_id, release_id, shell, enabled)
   VALUES ('<VERIFIED_EXISTING_STUDENT_UUID>'::uuid, 'playiq-2026-10-30', 'beta', true)
   ON CONFLICT (student_id, release_id, shell) DO UPDATE SET enabled = true;
   ```

   A writable profile role/status or admin login does not grant release access.
   Enrollment changes belong to the authorized operator, not a student route.
6. In STAGING ONLY set `PLAYIQ_COURSE_BETA_ENABLED=true`.
   Leave `PLAYIQ_COURSE_FINAL_ENABLED=false` or unset. Do not enable the dev-only synthetic
   harness; it cannot be used for acceptance. For an authorized staging student 3D-character
   test, use `ORION_3D_MODE=all` there only; leave production's existing rollout unchanged.
7. Deploy the branch to that staging target. The new beta URL path is
   `/student/course-beta?module=0` (use its actual staging hostname).
   Student home routes to the new course only when its flag is enabled.
   Old live module routes and their data remain intact. Verify the deployed server bundle
   contains the current compiled HTML and the print/reference assets return successfully.

## Required live acceptance before giving Sihara the test link

- Use two approved existing STUDENT accounts with normal cookies, plus anonymous and
  unenrolled cases. Check owner isolation, wrong-shell denial and disabled enrollment.
  SQL-editor/service-role visibility is not evidence of student RLS.
- Complete M00 assessment safely. Choice/draft reload works; reveal appears when ready
  without a mystery trigger; Retry works on an actual provider error. Check no duplicate
  provider call is needed merely to reopen saved results.
- In M1 select a real inline choice: confirm Save, reload, check it returns. Simulate a
  failed save: no false completion/next confirmation, preserve answer and allow Retry.
- Save a safe, approved M00–8 sample. Review assessment values before approval. If the
  assessment changes after display, approval must fail until reload/review. Unapprove,
  resave and export again: that content must be excluded. Old external copies are not
  automatically recalled; replace/remove them manually as needed.
- M9 preview/download uses the exact Markdown filename, genuine evidence and missing
  markers, excluding beta feedback/other users/Assistant details. Read the actual downloaded
  bytes. Manually upload into the existing approved external Tutor Project and verify it can
  reference the file; this external account step needs the parent's/student's authority.
  Preserve original File 2 unchanged when packaging the other five files.
- Test M10's actual Tutor behavior checks and separate Assistant M11/M12. Never mark an
  unrun test passed. Reminders need a real supported scheduling feature and confirmation.
- M13 can be completed by reading only; no required new Project/story/image/answer.
  Capstone is 14 and navigation shows 15 sections.
- Report a beta blocker before completion. Confirm its real ticket in staging; repeat
  the same reference after an uncertain response and verify no duplicate. Survey only
  after saved completion, and never copied into the learning file.
- On a real phone with its keyboard, tablet and desktop: Orion composer is reachable,
  expansion/character hide/minimize preserve text, keyboard/focus work and WebGL has a
  graceful static fallback. Check authenticated AI replies/actions without broadening
  permissions. Local synthetic UI tests did not establish this.
- Leave final-course activation OFF. Its digital route excludes beta forms; the current
  143-page review/print master still includes beta survey text. A feedback-free final print
  edition and final promotion are a later signoff, not part of this weekend beta activation.

## Evidence and stop conditions

253/253 source checks and 85/85 application/Orion checks passed locally. TypeScript,
scoped lint (zero errors), production build, file tracing and representative PDF visual
checks passed. Independent SQL review retested inherited privileges and 3,948 choice cases.
No real hosted migration, cross-device account persistence or external AI upload was tested.
Four inherited image-tracing build warnings and dependency audit advisories are recorded,
not concealed or auto-fixed broadly. Full details and hashes are in the QA copyback.

PDF SHA-256:
`0fd70a051f84cca1936a44657d7089f353478bf851cfd5a404d577fa303cf9f8`.
90000 migration SHA-256:
`d49b9410e89d22fbabe5a6464be4b632c001adccf7cc76e7e5cb1954e44a8e52`.
91000 migration SHA-256:
`a8afbc0ad3a72a29d6e8f6055d29f010ffad7fd054bc43d9e273802cb2562047`.

If staging/auth/storage/schema fails, stop activation and report the exact failing step.
Never substitute synthetic localStorage, fake learner evidence, service-role access or
guessed success. Safe rollback: disable beta flag/affected enrollment, retain evidence;
do not drop tables or delete learner records. No paid testing/marketing/pricing tasks here.

Return a dated mailbox copyback with deployed commit and actual staging URL, migration
receipts, redacted account-based test outcomes, blocker ticket readback, remaining failures
and Sihara-ready status. Do not include secrets or private learner answers. Do not claim
production deployment or message Sihara on Scott's behalf without separate authorization.
