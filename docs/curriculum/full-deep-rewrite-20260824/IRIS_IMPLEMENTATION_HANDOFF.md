# Iris Implementation Handoff — Approved PlayIQ Course Rewrite

## Authority and status

- Repository: `https://github.com/siharaprak/playiq-new`
- Source branch: `codex/playiq-course-alignment`
- Curriculum directory: `docs/curriculum/full-deep-rewrite-20260824/`
- Approval: the complete Module 0–10 and Capstone rewrite was approved on 2026-08-25.
- Source boundary: use this Git-tracked curriculum package for implementation. Do not substitute the older V6 draft, archived PDFs, or compressed reconstructed modules.

## Approved source files

1. `Module_0_Student_Text.md`
2. `Module_1_Student_Text.md`
3. `Module_2_Student_Text.md`
4. `Module_3_Student_Text.md`
5. `Module_4_Student_Text.md`
6. `Module_5_Student_Text.md`
7. `Module_6_Student_Text.md`
8. `Module_7_Student_Text.md`
9. `Module_8_Student_Text.md`
10. `Module_9_Student_Text.md`
11. `Module_10_Student_Text.md`
12. `Capstone_Student_Text.md`

The combined reading copy is `PLAYIQ_CURRENT_COMBINED_COURSE_DRAFT_20260824.md`. Its SHA-256 is `c4af7824cc88bd67ff09259cf4f3d1d36597e6e262892493b981c9b8bd8d5bbc`.

## Implementation directive

Map the approved curriculum into the existing PlayIQ student experience without shortening, paraphrasing, or silently dropping sections. Preserve the established visual system and application architecture unless a curriculum requirement needs a UI change.

For every module:

- Preserve the opening social-style excitement hook.
- Preserve Orion's progression as genie, guide, teacher, and customizable tutor.
- Render instructions, examples, guided activities, response fields, Blueprint updates, Knowledge File updates, proof artifacts, and mastery checks as usable student interactions.
- Make every requested action explicit; students must never have to guess where to type, click, continue, save, or involve a parent.
- Keep beta-tester feedback behind the beta route and place it only at the end of the module.
- Preserve parent approval, privacy, safety, and account boundaries.
- Do not invent PDI scores, automatic uploads, guaranteed outcomes, or background AI behavior not supported by the application.

Important journey requirements:

- Parent setup occurs before the student-facing Orion/genie opening, while Module 0 also gives the student a clear parent-connection check.
- Module 0 must use a clear Continue to Orion's Assessment action rather than asking the student to tell Orion that the workspace is ready.
- Module 9 must guide the learner through creating the personal-tutor Project inside the parent-approved frontier-AI account and using the accumulated assessment/Knowledge File evidence.
- Module 10 must preserve the safe real-person assistant build.
- The Capstone must preserve the Exam & Performance System, six creation tracks, Learning Dashboard, final tutor files, parent review, and student ownership.

## Required QA before completion is claimed

1. Compare every rendered module against its corresponding approved Markdown file.
2. Confirm no approved teaching, activity, assessment, proof, mastery, or safety section was omitted.
3. Test student navigation from Module 0 through the Capstone.
4. Test the parent-first setup and parent-review points.
5. Confirm beta feedback is invisible on the standard route and appears only at each beta module ending.
6. Test desktop and mobile layouts for clipping, unreadable fields, broken controls, and lost student answers.
7. Confirm Module 9's personal-tutor Project instructions and the Capstone deliverables are operationally clear.
8. Record screenshots or a short walkthrough showing the implemented journey.
9. Report the implementation commit, changed paths, tests run, known limitations, and deployment status separately.

## Completion boundary

The curriculum is approved and available in GitHub. This does not by itself prove that the LMS integration, database behavior, merge to the default branch, or production deployment is complete. Iris should return implementation evidence for review before those states are claimed.
