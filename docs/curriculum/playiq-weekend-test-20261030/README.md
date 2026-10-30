# PlayIQ Course 1 - Weekend Test Source Package

Revision: 2026-10-30. Source baseline: `../playiq-15-module-course-20261027`.
This is the release candidate course source, not proof of deployment or a
passed student beta. App implementation, publication, and Iris handoff are
owned by the release coordinator, not this course-source lane.

## Course count and sequence

**15 sections total: Module 00 plus Modules 1-14. Module 14 is Capstone.**

| Section | Focus |
|---|---|
| 00 | Parent setup, assessment, initial Tutor Project |
| 1 | Full character/guardrail first-win tutorial and AI Learning Code |
| 2-6 | Responsibility, pre-learning, rescue, compression, retrieval and testing |
| 7-8 | Knowledge Files/Study Pack, writing coaching and authorship |
| 9 | Review/download the learning file and build the Tutor in the existing Project |
| 10 | Six Tutor tests, one improvement/retest, repeatable learning loop |
| 11-12 | Separate personal assistant build and testing |
| 13 | Optional character-to-story/storyboard/cartoon seed; no assignment |
| 14 | Master Trial, Learning Dashboard, final review and graduation |

All fifteen full lessons, prompts, labs, workbook questions, Boss Battles,
and test instructions are retained. This is not an abridged outline.

## What changed

- Students save short approved learning answers on PlayIQ in Modules 00-8.
  Failed saves are not success; reopen/resume checks are explicit.
- Website answers, paper workbooks, and private external AI chats are distinct.
  External learning summaries must be brought back manually to the site.
- Module 9 reviews/exports `personal_learning_knowledge_file.md`, the **Personal
  Learning Knowledge File**, then guides manual upload/read-back in the same
  parent-approved Module 00 Tutor Project. Missing evidence stays labelled.
- The Markdown profile replaces the previous profile as **one of six files**.
  Other files remain instruction set, rules, course record, test log, checklist.
- Assessment results show when ready with one Continue action. No secret phrase
  or implied automatic external account access.
- Learning preferences are testable settings, not fixed learner diagnoses or
  guarantees. The file supplies context; it does not train the base AI model.
- Module 1 teaches packaging existing approved work as real named downloads
  or a ZIP when available, followed by local extraction/reopen checks. Manual
  saving is fallback-only. Modules 9 and 11 reuse that skill without adding
  outputs; Module 9 preserves the downloaded File 2 unchanged.
- Module 13 has optional steps for a separate character-story Project using
  only the Module 1 saved kit, not private Tutor/Assistant data. Still no
  required Project, story, storyboard, cartoon, or added assignment.
- Official platform setup guidance is checked against fetched OpenAI, Claude,
  and Gemini primary docs. Instructions editors and reference uploads are
  separate; account/rollout/eligibility differences use a graceful fallback.
  This is **official-doc verified, not account tested**.
- Digital question controls, confirmed saving/Continue, and workbook-only
  entries are distinguished. Beta technical blockers can be reported before
  completion, separately from the final module feedback survey.
- Beta feedback is the final source section of each module. The final website
  shell hides it; the beta shell shows it. This review/print edition retains
  labelled beta feedback so Sihara can inspect the complete beta source.

## Read the course

- `PLAYIQ_COMPLETE_COURSE_MASTER_20261030.html`: complete light reading edition;
  module section IDs remain `module-0` through `module-14` for app extraction.
- `PLAYIQ_COMPLETE_COURSE_MASTER_20261030.md`: combined complete student text.
- `output/pdf/PLAYIQ_COMPLETE_COURSE_LIGHT_PRINT_20261030.pdf`: white Letter PDF.
- `Module_00_Student_Text.md` through `Module_14_Student_Text.md`: editable sources.
- `ORION_STUDENT_TUTOR_PROJECT_COMPILATION_INSTRUCTIONS.md`: collection and
  six-file compilation contract for the course guide/external Tutor handoff.
- `QA_COPYBACK_20261030.md`, `VERIFICATION_RESULTS.json`, and
  `SOURCE_MANIFEST.json`: source/artifact evidence and boundary record.
- `OFFICIAL_PLATFORM_TUTORIAL_VERIFICATION_20261030.md`: fetched source URLs,
  observed controls, rollout caveats, and explicit account-testing limits.

## Rebuild and verify

From this directory with Node, `marked`, Python, ReportLab, and `pypdf`:

1. `node build_combined_master.mjs`
2. `node make_reading_html.mjs` (or set `PLAYIQ_MARKED_PATH` to the installed
   `marked` ESM entry if it is supplied by a bundled dependency runtime).
3. `python3 make_light_print_pdf.py`
4. `python3 verify_revision.py`

The PDF skill's artifact-operation marker must be run by an author before
PDF authoring. Rendering and visual inspection remain required; text checks
alone are not layout QA. Font defaults target macOS Arial/Courier New.

`prepare_weekend_revision.py` is the one-time baseline migration, **not** a
normal rebuild step. Running it again resets module/build-script edits to
that migration's output. Edit current sources and use the four builders above.

No services, accounts, real learner data, provider calls, production deployment,
Git operations, or Drive publication are performed by these builders.
