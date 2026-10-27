# PlayIQ Course 1 - 15-section expansion

Revision date: 2026-10-27.

## Course count and architecture

There are **15 sections total**: Module 00 plus Modules 1-14. **Module 14 is
the Capstone and final course section.** There is no separate Capstone after
Module 14.

The course sequence is:

| Section | Focus |
|---|---|
| Module 00 | Parent-supported setup, assessment, and the Tutor Project |
| Modules 1-8 | Existing character/guardrail and learning curriculum |
| Module 9 | Complete build of the six-file Tutor in the existing Module 00 Project |
| Module 10 | Tutor behavior testing, one improvement, and a repeatable learning loop |
| Module 11 | Build the student's own Personal Assistant in a separate Project |
| Module 12 | Test that assistant and understand limits around memory/actions/reminders |
| Module 13 | Optional character-to-story-to-storyboard-to-cartoon possibility preview |
| Module 14 | Master Trial, Learning Dashboard, final review, and graduation |

The complete source-of-truth for Orion's recordkeeping and Tutor compilation
is `ORION_STUDENT_TUTOR_PROJECT_COMPILATION_INSTRUCTIONS.md`.

## Read the course

- `PLAYIQ_COMPLETE_COURSE_MASTER_20261027.html`: white-background reading
  edition with module navigation and copy controls.
- `PLAYIQ_COMPLETE_COURSE_MASTER_20261027.md`: compiled full student text.
- `output/pdf/PLAYIQ_COMPLETE_COURSE_LIGHT_PRINT_20261027.pdf`: printable
  white-background edition.
- `Module_00_Student_Text.md` through `Module_14_Student_Text.md`: editable
  source for every module.
- `ORION_STUDENT_TUTOR_PROJECT_COMPILATION_INSTRUCTIONS.md`: Orion's
  course-long evidence and six-file Tutor workflow.

## Source and scope

Modules 00-8 carry forward the October 20, 2026 PlayIQ lesson content, with
the new Module 00 label and necessary cross-references to the Module 11
Personal Assistant placement. Modules 9-14 are the approved expansion and
sequence change. The October 20 revision remains a separate prior snapshot.

This package changes course content and its source/read/print artifacts only.
It does not modify the website, parent dashboard, student records, external
AI accounts, beta routing, or production deployment. The site's older Module
9 copy must be reviewed against the updated six-file/Module 00 Tutor workflow
before Iris deploys it. This package does not claim that website update is done.

The learning preference activities are framed as student-specific hypotheses
to test, not fixed learner types or a guarantee that matching one format will
always improve learning. The student compares actual explanation, practice,
and retrieval evidence and remains free to change preferences.

## Rebuild and verify

From this directory, with Node.js, `marked`, Python, ReportLab, and `pypdf`
available:

1. `node build_combined_master.mjs`
2. `node make_reading_html.mjs`
3. `python3 make_light_print_pdf.py`
4. `python3 verify_revision.py`

`REVISION_NOTES_20261027.md` records the course decisions and source
reconciliation. `QA_COPYBACK_20261027.md` records verified artifacts and
remaining boundaries. `SOURCE_MANIFEST.json` records hashes for the package.
