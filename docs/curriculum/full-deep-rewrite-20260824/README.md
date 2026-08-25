# PlayIQ Full Course Deep Rewrite - 2026-08-24

## Status

This directory is the commit-backed implementation handoff for the approved
student-facing course rewrite. It contains Module 0, Modules 1-10, the
Capstone, and one combined reading copy.

Founder/team approval for the complete curriculum package was confirmed on
2026-08-25. The course content is approved for Iris to map into the existing
PlayIQ LMS experience. UI integration, testing, merge, and deployment remain
separate implementation steps and must not be represented as complete until
verified.

The active editorial source remains the Sienvi PlayIQ Google Drive. These files
give Iris and the website team an exact Git revision to review and integrate.

## What changed

- Replaced compressed outline-like modules with full student-ready lessons.
- Added fast, clear, low-pressure opening hooks.
- Integrated explanations, examples, guided questions, active comparisons,
  response templates, evidence interpretation, proof, and mastery.
- Explained each Learning Supercharger Blueprint setting as a testable tutor
  behavior rather than a permanent learning-style label.
- Connected every module's evidence to the final personal tutor Project.
- Added beta feedback only at the end of each module.
- Integrated the Exam & Performance System, six creation tracks, Learning
  Dashboard, parent review, and final tutor files into the Capstone.
- Removed unsupported PDI calculations, automatic dashboard claims, guaranteed
  outcomes, and silent upload/deployment assumptions.

## Integration boundary

These are curriculum source files. This commit does not claim that the LMS UI,
database, assessment forms, or production website now render every activity.
Iris should map each section to the existing module UI, preserve beta-only
feedback gating, and validate the student journey before merge or deployment.

## Combined source

`PLAYIQ_CURRENT_COMBINED_COURSE_DRAFT_20260824.md`

- 7,839 lines
- SHA-256: `c4af7824cc88bd67ff09259cf4f3d1d36597e6e262892493b981c9b8bd8d5bbc`

## Iris handoff

See `IRIS_IMPLEMENTATION_HANDOFF.md` in this directory for the exact source
list, integration requirements, QA checklist, and completion evidence needed.
