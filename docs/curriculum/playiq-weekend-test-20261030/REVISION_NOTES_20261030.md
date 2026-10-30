# PlayIQ weekend-test revision notes - October 30, 2026

## Approved release direction

Module 00 plus Modules 1-14 = 15 sections total. Module 14 is the final Capstone.
The October 27 complete source is preserved as a separate unchanged baseline.
This revision applies the approved source-of-truth correction: course answers
collected on PlayIQ become a student-reviewed downloadable **Personal Learning
Knowledge File** for the existing external Tutor Project in Module 9.

## Exact content changes

1. **Modules 00-8:** added clear website answer/review/approve/Save/reopen
   instructions and module-specific end checkpoints before beta feedback.
   Existing labs and creative/tutorial content remain intact. Student answers
   from private external chats or paper workbooks are not magically collected.
2. **Module 00:** clarified assessment-to-result-to-Continue flow and where to
   answer. Changed the profile starter into readable starting learning notes;
   students need not upload an unexplained file. Readiness checkboxes begin
   unchecked. AI praise is not proof of mastery or a passed handshake.
3. **Modules 1-3:** removed selected fixed-brain/forever language and hard-coded
   example outcomes in calibration templates. Preferences remain experiments,
   not a permanent learning-style identity. The character first-win tutorial
   and its ten discovery questions are preserved, not replaced by algebra.
4. **Module 8:** kept the full writing/authorship lesson; corrected its bridge
   so Module 9 builds and Module 10 tests.
5. **Module 9:** replaced the YAML profile with the downloadable Markdown
   **personal_learning_knowledge_file.md**, as File 2 of the same six. Added
   website coverage/approval review, missing-input handling, actual download
   and reopen, manual upload into the same Module 00 external Project,
   read-back comparison, no-upload fallback, duplicate/version checks, and
   explicit instruction to save Project instructions and check them.
6. **Modules 10-14:** clarified website/external boundaries without cutting
   Tutor tests, the learning loop, assistant build/tests, optional creative
   preview, dashboard, Master Trial, or graduation. Module 13 has no new
   required work. Module 14 remains Capstone.
7. **Compiler instructions:** now distinguish authenticated website collection
   from external AI drafting. They protect approval/provenance, forbid guessed
   learner evidence and cross-student data, keep missing values explicit,
   and preserve the Markdown file rather than creating a duplicate profile.
8. **All compiled editions:** rebuilt from the complete sources; dated October
   30; same 15 HTML module section IDs; white-background reading and print.

## Further approved source changes and evidence boundaries

### Additional directly approved packaging/character update

- Module 1's save step now asks for real downloadable named files or a ZIP
  of existing approved content when the environment can provide them. The
  student downloads/extracts locally, reopens, and checks the card and actual
  chosen image. Manual file creation is a fallback only, not the default.
- The one reusable prompt forbids invented files/links, installers, device
  access, and a browser AI claiming it created a folder on the device. The
  character kit is the already-approved card plus chosen image if available;
  a text-only kit contains the card alone. It adds no required deliverables.
- Module 9 reuses the prompt for the same six outputs, preserving the
  downloaded `personal_learning_knowledge_file.md` as File 2 unchanged. If the
  AI cannot preserve that file, the student adds their original locally.
- Module 11 reuses it for the existing Assistant Brief/instructions, and an
  existing approved reference only if needed, in a separate local folder.
- Module 13 adds optional short Project setup/read-back steps using that
  saved character kit only. Tutor learning profile, private records, and
  Assistant data are excluded. It remains a seed, not an assignment or gate.
- The four review corrections were subsequently approved and are covered in
  the next section; unrelated course/business scope remains excluded.

### Four review corrections now approved

- Corrected the M00/M1/M9/M11/M13 platform steps using fetched primary docs.
  Removed the guessed ChatGPT profile-icon route, distinguished instruction
  editors from Sources/project knowledge/Gem Knowledge, corrected Claude
  create/save labels, and made Gemini Save vs preview explicit.
- Recorded URLs/date and the specific source limitations. Claude's interface
  rollout and Google's November Gems transition require account-aware parent
  help, not a guessed universal path or a new required account/feature.
- Every module distinguishes online choice controls and confirmed saving/
  Continue from workbook-only entries. It does not claim every printed line
  is a digital input or that a selection automatically persisted.
- Beta testers can use technical blocker reporting before completion. This
  is separate from the end-of-module survey and excluded from Tutor exports.
- The full existing course, save-kit lesson, exact six-file Tutor workflow,
  separate Assistant, optional character seed, and final Capstone are retained.
- No live account/provider test, deployment, or cloud migration is claimed.

### Remaining evidence boundaries

- Not fine-tuning or retraining of a student's base AI model.
- Not automatic website access to an external AI account or its private chats.
- Not proof that a student learned faster, passed tests, or completed uploads.
- Not proof of website integration, RLS, storage migration, live provider
  behavior, deployment, publication to GitHub/Drive, or Iris acceptance.
- Not new modules, required character upgrades, or a Module 13 assignment.
- Not a finalized future-course price/offer or internship placement promise.

The parent release owner must reconcile exact course controls/routes with app
implementation, perform independent release tests, commit/publish the scoped
branch, and provide Iris a revision-pinned weekend-test handoff. Production
deployment remains outside this task's approval.
