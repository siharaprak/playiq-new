# PlayIQ Course 1 - Character Tutorial and Engagement Revision

Revision date: 2026-10-20. Complete course: Module 0, Modules 1-10, and Capstone.

This edition implements the operator-approved course direction from the
Sihara review: a practical character and guardrail first win, brief character
connections in Modules 2-4, engaging openings, and pacing markers that retain
the existing teaching. It follows the 2026-10-07 Tutor Project source package.

## Read the course

- `PLAYIQ_CURRENT_COMBINED_COURSE_MASTER_20261020.html`: white-background
  reading copy, module navigation, local reference image, and copy buttons.
- `PLAYIQ_CURRENT_COMBINED_COURSE_MASTER_20261020.md`: complete compiled text.
- `output/pdf/PLAYIQ_CURRENT_COMBINED_COURSE_LIGHT_PRINT_20261020.pdf`: print copy.
- Individual `Module_*_Student_Text.md` and `Capstone_Student_Text.md`: editable
  student sources. Edit these and regenerate the combined editions.

## Source and scope

The active PlayIQ Drive source remains the working product source. This
directory is its dated Git-backed revision. Project-management records and
SebastianCore are supporting material, not curriculum owners. The separate
Sienvi Course One is outside scope.

Keep stable course numbers: Module 0, Modules 1-10, Capstone. The new first-win
tutorial is inserted at the start of the existing Module 1. It does not
renumber the course or remove its AI Learning Code lessons. Modules 8 and 9
retain every original teaching section, activity, test, and prompt.

One Tutor Project starts in Module 0 and develops across the course. Module 9
integrates that existing Project and produces six final outputs. Module 10
remains a prototype for an approved other person. The Capstone still finalizes
the Tutor, then builds the student's separate Personal Assistant.

The image reference is copied unchanged from the repository's existing
`public/images/orion-avatar.png`. No image model was trained or called to
create this course revision. Character instructions improve consistency;
they do not guarantee identity or constitute LoRA training.

## Rebuild

1. Run `node build_combined_master.mjs`.
2. Run `node make_reading_html.mjs` with the `marked` package available.
3. Run `python3 make_light_print_pdf.py` with ReportLab available.
4. Run `python3 verify_revision.py` for source preservation and output checks.

`REVISION_NOTES_20261020.md` records decisions and source reconciliation.
`QA_COPYBACK_20261020.md` records the actual checks and their evidence limits.
`SOURCE_MANIFEST.json` pins the module and source-asset hashes.

This package changes course content only. It does not change site routes,
database progress, external accounts, parent dashboard behavior, beta access,
or deployment. The local app's older Module 9 copy still needs integration
from this source before any deployment claim is made.
