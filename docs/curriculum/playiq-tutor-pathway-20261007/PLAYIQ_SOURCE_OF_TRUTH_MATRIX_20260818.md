# PlayIQ Source-of-Truth Matrix - 2026-08-18

## Purpose

This matrix separates PlayIQ course content, Orion authoring standards,
website implementation, project-management records, and older supporting tracks.
It is an alignment document, not authority to deploy or publish.

## Canonical lanes

| Lane | Canonical location | Current status | Evidence / next action |
|---|---|---|---|
| Orion Brain authoring source | `/Users/blackwizard/Repos/Sienvi/AI Brains/PlayIQ/ORION (PlayIQ) Brain` | Current local source; folder is not itself a Git checkout | `03_COURSE_SYSTEM/PLAYIQ_COURSE_AUTHORING_SYSTEM.md` added and hash-verified. Keep this as the Brain source and use the committed team mirror below. |
| Committed Orion team mirror | `teamsienvi/Sienvi-Agency-Agents-OS` branch `codex/playiq-course-authoring-system` | Committed and pushed | Latest commit `6e8261f`; includes `profiles/playiq/COURSE_AUTHORING_SYSTEM.md` and `profiles/playiq/ORION_STUDENT_TUTOR_PROJECT_COMPILATION_INSTRUCTIONS.md`. |
| Active course source | `/Users/blackwizard/Library/CloudStorage/GoogleDrive-teamsienvi@gmail.com/My Drive/PlayIQ` | Current working course source | Module 0 v2 is now in `PlayIQ course/Reconstructed_Batch1/` with matching Markdown, PDF, and verification report. |
| Module 0 source specification | `PlayIQ course/Module_0_Assessment_Spec.md` | Proposed source spec; still has pending PDI and parent-trigger decisions | Use as architecture input; do not claim those technical decisions are shipped. |
| Website repository | `https://github.com/siharaprak/playiq-new` | Module 0 alignment and explicit assessment handoff committed and pushed on `codex/playiq-course-alignment` | Latest commit `8bfb9dc`; main remains unchanged at `62ab36a5ed0f90cb06db6508a3894c9c0a526868`. Open PR from the pushed branch for Iris review. |
| Project management records | `/Users/blackwizard/Library/CloudStorage/GoogleDrive-teamsienvi@gmail.com/My Drive/Project Management App/sienvi-sihara-playiq-client-workspace-45085360` | Separate PM lane | Use for tasks, approvals, and client coordination; it is not the course source. |
| Mailbox coordination | `/Users/blackwizard/Library/CloudStorage/GoogleDrive-teamsienvi@gmail.com/My Drive/AgencyOS/mailbox` | Active alignment lane | Keep status and reconciliation evidence here. |
| Supporting SebastianCore records | `/Users/blackwizard/Repos/Sienvi/SebastianCore/docs` | Supporting governance/history only | SebastianCore does not own PlayIQ product context or course content. |

## Current course decisions

- Orion is the named guide throughout the course.
- Orion's roles progress from genie to teacher to tutor to a student-customized
  AI personality. Orion Master is the governance identity.
- The Genie Principle is a recurring course thread: better questions create
  better possibilities; students remain thinkers and verify results.
- Each module needs an opening hook and beta feedback only at the module end in
  the beta route.
- The Exam & Performance System is integrated into the Capstone, not a separate
  module.
- The creation outcomes include Prompt Engineer, Game Design Engineer, Physical
  Object Dream Creator, AI Chef, Personal Expense Assistant, and Learning
  Dashboard Builder.

## Module 0 delivery status

| Artifact | Status | SHA-256 |
|---|---|---|
| `Reconstructed_Batch1/Module_0_Student_Text.md` | Drive-current v2 | `affa811e176bfdc2fba46ac6beb252a81991de8a2d166b7d7ed1f480131c1e94` |
| `Reconstructed_Batch1/Module_0_Student_Text.pdf` | Drive-current v2; 18 pages; sampled visually | `8a89e0c82655184f394d0f946774ef2765c642794326e369b447d5366b80439b` |
| `Reconstructed_Batch1/Module_0_Verification_Report.md` | Drive-current v2; evidence-bounded | `346119f65365ce1d40494e80ecc7d093f9242cb5e21ed41eee6b326d71b62b5f` |

Module 0 v2 includes the parent gate, Genie opening, five diagnostic cards,
three baseline challenges, Rescue/Advance/Goal mapping, personalized reveal
framework, workspace orientation, evidence capture, Blueprint/YAML update,
readiness card, mastery check, and beta-only feedback section.

## Capstone update

The active Capstone student text now includes six creation tracks: Prompt
Engineer, Game Design Engineer, Physical Object Dream Creator, AI Chef,
Personal Expense Assistant, and Learning Dashboard Builder. The dashboard brief
requires students to visualize useful learning patterns and label estimates or
missing data rather than inventing metrics.

| Artifact | Status | SHA-256 |
|---|---|---|
| `Reconstructed_Batch3/Capstone_Student_Text.md` | Drive-current assignment update | `0790e73179277150ed16d2aa24c538d7163c3cce311b75a9ab9e6cc4fd7c769a` |
| `Reconstructed_Batch3/Capstone_Student_Text.pdf` | Drive-current paired PDF; text check passed | `96db09486d803a7dfa89ab9282b5ce689db29f4c7dff21d372a0a4959fe809d4` |
| `Reconstructed_Batch3/Capstone_Verification_Report.md` | Drive-current report update | `41ed35b0dfe38c5b09d6b664205d3df04bdd1f340ff72d0b446754645d7fdb1b` |

## Website implementation status

- Module 1-11 opening hooks and Capstone end feedback are present in the
  verified main tree.
- Module 0 assessment UI is aligned to the v2 course experience in commit
  `00be3b5` on `codex/playiq-course-alignment`: Orion's genie/guide/tutor
  opening, question-led possibility framing, learning-faster language,
  intuition-as-signal framing, and possibility-safe reveal copy. The canonical
  Module 0 title is now `The Assessment & AI Workspace Orientation`.
- The existing parent setup route and assessment persistence flow were read
  back and retained; no speculative PDI formula, trigger taxonomy, or runtime
  database change was added.
- The branch was pushed to the public repository. No production deployment or
  main-branch merge was performed. Iris should review the exact commit/PR
  before updating the live site.
- The student-facing source now includes the Tutor Project Build Path in Module
  9, the Personal Tutor Project Handoff in the Capstone, and the durable Orion
  compilation instructions in `PlayIQ/Orion Tutor Build/`.

## Evidence classifications

- `Drive-current`: file exists at the active source path and hash was read back.
- `committed-and-pushed`: Git commit exists locally and the branch was pushed to
  the stated remote.
- `remote-main-read`: public repository ref/tree was read without changing it.
- `pending-reconciliation`: source or implementation still requires direct
  comparison before editing.
- `not-deployed`: no claim about production behavior.
- `committed-and-pushed`: PlayIQ website branch `codex/playiq-course-alignment`
  at commit `8bfb9dc`.
- `Drive-current`: combined reading copy hash
  `014c2630d906276ea20bdef6e784a1bc59ec864126b3bf54aba711131d005714`.
- `Drive-current`: Orion student-tutor compilation instructions hash
  `904c7b9dd2e22b21a0be1ebe6a80566828b6fed2b4981905c58bf3ea60f34207`.

## Full deep rewrite update - 2026-08-24

- Module 0, Modules 1-10, and the Capstone have full student-ready Markdown and
  matching PDFs in the active `Reconstructed_Batch1/2/3` folders.
- Previous versions are recoverable from
  `PlayIQ course/Archive_20260824_Pre_Full_Deep_Rewrite`.
- Current combined Markdown: 7,839 lines; hash
  `c4af7824cc88bd67ff09259cf4f3d1d36597e6e262892493b981c9b8bd8d5bbc`.
- Current combined PDF: 199 pages; hash
  `261a9e2025abf35f4c41e73211172cc3f945433bda9f613a0ed2eedebeecfffd`.
- Commit-backed course package: `siharaprak/playiq-new`, branch
  `codex/playiq-course-alignment`, commit `8022a3d`.
- Durable authoring-standard update: `teamsienvi/Sienvi-Agency-Agents-OS`,
  branch `codex/playiq-course-authoring-system`, commit `fc799f3`.
- Verification record: `PLAYIQ_FULL_DEEP_REWRITE_VERIFICATION_20260824.md`.
- Website/LMS integration, main-branch merge, and deployment remain separate
  implementation/release actions.

## Dated amendment — 2026-10-07: Course-long Tutor Project pathway

This amendment supersedes only conflicting course-flow statements above. The
historical evidence and earlier decisions remain preserved.

### Current approved course path

- The active PlayIQ course source remains the PlayIQ working Drive, not the
  Project Management App workspace and not SebastianCore.
- The student creates one parent-approved private **PlayIQ Tutor Project** in
  Module 0. Modules 1–8 add small, evidence-labeled, student-approved updates
  to that same Project; Module 7 is the first formal Study Pack/Knowledge File
  build.
- Module 9 integrates and tests the existing Module 0 Project. It does not
  create a second Tutor Project or repeat the parent setup.
- Module 10 remains the separate assistant-for-another-person exercise.
- The Capstone finalizes the Tutor first and then builds the student's own
  Personal Assistant in a separate Project as the final major build.
- Orion's assessment recordkeeping distinguishes student report, observed
  result, experiment evidence, and pending validation. No single result is
  promoted to a permanent learning-style label.
- The course CTA is **Continue to Orion's Assessment**. Its instructions must
  tell the student to sign into the parent-approved AI, open the same Tutor
  Project, and paste the provided prompt/answers. A website button is not proof
  of an external AI connection or save.

### Source package and evidence boundary

The dated review package is `docs/curriculum/playiq-tutor-pathway-20261007/`.
It contains the 12 student-facing Markdown sources (Modules 0–10 and
Capstone), the current combined master, the Orion compilation instructions,
the pathway alignment spec, and a QA record. This is course content for Iris
to review and implement; it is not a website code change or deployment.

The source package was committed as
`fd861862865db07f33a24e3e1a5a62153f6d0f98` on public branch
`codex/playiq-tutor-pathway-20261007` and pushed to GitHub. A follow-up release
evidence commit was also pushed. The white-background combined print PDF was
rendered, visually checked, and read back from Drive. The updated module
Markdown, combined master, this matrix, and Orion compilation instructions
were fetched back from Drive and matched against their local source checks;
the two new alignment/QA records were uploaded to the active PlayIQ folder.
Alignment spec: `1gBYbXA3_dGnc_hh1Ou0NzPxBzm3_5gma`; QA record:
`1lYxj54lqVVYElsLN909Dk9BtHWRkfLyN`.
Main-branch merge, production deployment, account integrations, and app code
are out of scope.

The prior module-level verification reports and per-module PDFs document
earlier drafts; they are not verification of this dated pathway change. For
the current printable reading copy, use
`PLAYIQ_CURRENT_COMBINED_COURSE_LIGHT_PRINT_20261007.pdf` and the matching
combined Markdown master. The individual student Markdown files are the
content sources for this revision.
