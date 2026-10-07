import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const output = join(root, "PLAYIQ_CURRENT_COMBINED_COURSE_MASTER_20261007.md");
const header = `# PlayIQ Teen AI Study Accelerator (Ages 13–17)
## Current Combined Course Master — Modules 0–10 and Capstone (Module 11)
### Course-long Tutor Project alignment revision — 2026-10-07

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
- Module 1: AI Learning Code, question ladder, explanation/hint comparison
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

---
`;

const names = [
  ...Array.from({ length: 11 }, (_, i) => `Module_${i}_Student_Text.md`),
  "Capstone_Student_Text.md",
];
const sections = names.map((name) => readFileSync(join(root, name), "utf8").trim());
writeFileSync(output, `${header}\n\\newpage\n\n${sections.join("\n\n\\newpage\n\n")}\n`, "utf8");
process.stdout.write(`Wrote ${output}\n`);
