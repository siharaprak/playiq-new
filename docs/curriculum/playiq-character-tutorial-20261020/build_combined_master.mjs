import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, "PLAYIQ_CURRENT_COMBINED_COURSE_MASTER_20261020.md");
const header = `# PlayIQ Teen AI Study Accelerator (Ages 13–17)
## Current Combined Course Master — Modules 0–10 and Capstone (Module 11)
### Character tutorial and engagement revision — 2026-10-20

## Course architecture and learner journey

PlayIQ helps students use AI as a coach while keeping their own imagination,
judgment, authorship, and verification in control. Students start one private,
parent-approved Tutor Project in Module 0 and add small, evidence-labeled,
student-approved updates as they complete each module. Module 7 is the first
formal Knowledge File/Study Pack build. Module 9 integrates and tests the
existing Tutor Project. Module 10 remains an assistant-design exercise for
another person. The Capstone finishes Tutor review, then builds the student's
own Personal Assistant in a separate project as the final major build.

The initial assessment produces hypotheses and a baseline, not a diagnosis or
a fixed learning-style identity. Orion keeps student reports separate from
observed and experimental evidence, shows proposed updates, and waits for
student approval. The course does not claim that an external AI account is
connected to the PlayIQ website unless that integration is verified.

PHASE 1: FOUNDATION (Modules 0–2)
- Module 0: Parent-supported setup, cinematic assessment, and the first Tutor Project
- Module 1: Character and guardrail first-win tutorial, then AI Learning Code
- Module 2: Human responsibility, authorship, integrity, and focus evidence

PHASE 2: LEARNING ACCELERATOR (Modules 3–6)
- Module 3: Pre-Learn System and post-class evidence
- Module 4: Lesson Rescue Mode and confusion-gap evidence
- Module 5: Compression Learning and retrieval comparison
- Module 6: Self-Testing, Mistake Bank, confidence, and review planning

PHASE 3: TUTOR AND ASSISTANT DESIGN (Modules 7–10)
- Module 7: Source-aware Knowledge Files and first Study Pack
- Module 8: Writing clarity, coaching, and authorship boundaries
- Module 9: Integrate and test the existing personal Tutor Project
- Module 10: Design an AI assistant for another person

CAPSTONE (Module 11)
- Performance evidence, selected creative build, and Learning Dashboard
- Final Tutor review, then the student's own separate Personal Assistant
- Parent review and student ownership reflection

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
There are no additional character assignments from Module 5 onward. The Tutor
Project already begins in Module 0; it is developed throughout the course.
The new connections do not postpone it or create another required Project.

Each module has a short possibility hook and visible progress markers. Follow
the complete lesson and its existing tests. Mark your next unfinished Part
in existing course notes when pausing, then resume with the same work.
Module 9 stays one complete preparation, assembly, application, and test
tutorial, with all six final outputs retained. Module 8's teaching is intact.

The module assessment and creative work are different evidence. Keep one
student-approved Course Learning Record entry per module. A preferred image
color is a design choice; a learning rule requires relevant observed evidence
and a retest condition. Never infer a fixed learning type from the character.

This is the complete student reading edition, including the existing labs,
workbook questions, Boss Battles, Tutor checkpoints, and beta-only end feedback.
It is not a timed summary. The total learner duration and live website flow
still need student beta evidence; this source edition does not prove either.

---
`;

const names = [
  ...Array.from({ length: 11 }, (_, i) => `Module_${i}_Student_Text.md`),
  "Capstone_Student_Text.md",
];
const sections = names.map((name) => readFileSync(join(root, name), "utf8").trim());
writeFileSync(output, `${header}\n\\newpage\n\n${sections.join("\n\n\\newpage\n\n")}\n`, "utf8");
process.stdout.write(`Wrote ${output}\n`);
