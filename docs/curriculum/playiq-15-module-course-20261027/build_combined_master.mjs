import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, "PLAYIQ_COMPLETE_COURSE_MASTER_20261027.md");
const header = `# PlayIQ Teen AI Study Accelerator (Ages 13–17)
## Complete Course Master — Module 00 and Modules 1–14 (15 sections total)
### Course structure and tutorial expansion — 2026-10-27

## Course architecture and learner journey

PlayIQ helps students use AI as a coach while keeping their own imagination,
judgment, authorship, privacy, and verification in control. Students start
one private, parent-approved Tutor Project in Module 00 and add small,
evidence-labeled, student-approved learning records across the course. Module
7 is the first formal Knowledge File/Study Pack build. Module 9 assembles the
Tutor in one continuous tutorial; Module 10 tests and improves it. Module 11
builds the student's own Personal Assistant in a separate Project, and
Module 12 tests that assistant. Module 13 is an optional character-to-story
possibility preview, not an assignment. Module 14 is the final Capstone.

The initial assessment produces hypotheses and a baseline, not a diagnosis
or a fixed learning-style identity. Orion keeps student reports separate
from observed and experimental evidence, shows proposed updates, and waits
for student approval. A format preference is a starting point to test, not a
guarantee that one format will always teach best. The course does not claim
that an external AI account is connected to the PlayIQ website unless that
integration is verified.

PHASE 1: FOUNDATION (Module 00 and Modules 1–2)
- Module 00: Parent-supported setup, cinematic assessment, and the first Tutor Project
- Module 1: Character and guardrail first-win tutorial, then AI Learning Code
- Module 2: Human responsibility, authorship, integrity, and focus evidence

PHASE 2: LEARNING ACCELERATOR (Modules 3–6)
- Module 3: Pre-Learn System and post-class evidence
- Module 4: Lesson Rescue Mode and confusion-gap evidence
- Module 5: Compression Learning and retrieval comparison
- Module 6: Self-Testing, Mistake Bank, confidence, and review planning

PHASE 3: TUTOR FOUNDATION (Modules 7–10)
- Module 7: Source-aware Knowledge Files and first Study Pack
- Module 8: Writing clarity, coaching, and authorship boundaries
- Module 9: Build the existing personal Tutor Project from course evidence
- Module 10: Test the Tutor, improve one behavior, and use its learning loop

PHASE 4: PERSONAL ASSISTANT (Modules 11–12)
- Module 11: Build the student's own Personal Assistant for one safe task
- Module 12: Test the Personal Assistant and understand its limits

PHASE 5: POSSIBILITY AND CAPSTONE (Modules 13–14)
- Module 13: Optional character-to-story-to-storyboard-to-cartoon preview
- Module 14: Master Trial, Learning Dashboard, final review, and graduation

COURSE COUNT
- Module 00 plus Modules 1–14 = 15 sections total
- Module 14 is the Capstone and the final course section

The student course text below is compiled in module order from the source files
in this directory. Edit the individual source modules, then run the Node
builder in this directory to rebuild this reading copy.

## How to use this edition

Module 1 begins with an exact character-creation tutorial: the existing Orion
reference, a starting image prompt, ten discovery questions asked one at a
time, a student-approved Character Guardrail Card, a new-scene reuse test,
and save/reopen instructions. A labeled text route is available if image
generation is unavailable. It does not count as an image-generation pass.

Modules 2-4 include a light character connection inside an existing activity.
There are no additional character assignments from Module 5 onward until
Module 13's optional possibility preview. The Tutor Project already begins in
Module 00; it is developed throughout the course. The character connections
do not postpone it or create another required Project.

Each module has a short possibility hook and visible progress markers. Follow
the complete lesson and its activities. Mark your next unfinished Part in
existing course notes when pausing, then resume with the same work. Module 9
is one continuous Tutor-build tutorial with all six final files. Module 10
owns the six Tutor tests. Modules 11 and 12 are a separate assistant build
and test. Module 13 requires no student artifact. Module 14 is the Capstone.
Module 8's teaching is intact.

The module assessment and creative work are different evidence. Keep one
student-approved Course Learning Record entry per module. A preferred image
color is a design choice; a learning rule requires relevant observed evidence
and a retest condition. Never infer a fixed learning type from the character.

This is the complete student reading edition, including the existing labs,
workbook questions, Boss Battles, Tutor checkpoints, and beta-only end
feedback. It is not a timed summary. The total learner duration and live
website flow still need student beta evidence; this source edition does not
prove either.

---
`;

const names = [
  "Module_00_Student_Text.md",
  ...Array.from({ length: 14 }, (_, i) => `Module_${String(i + 1).padStart(2, "0")}_Student_Text.md`),
];
const sections = names.map((name) => readFileSync(join(root, name), "utf8").trim());
writeFileSync(output, `${header}\n\\newpage\n\n${sections.join("\n\n\\newpage\n\n")}\n`, "utf8");
process.stdout.write(`Wrote ${output}\n`);
