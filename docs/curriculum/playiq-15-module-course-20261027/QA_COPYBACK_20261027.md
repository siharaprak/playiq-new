# PlayIQ Course Expansion — QA Copyback

## Work identity

- **Project:** PlayIQ Course 1 (teen course)
- **Lab:** `PLAYIQ_ORION_WIZARD_LAB`
- **Agent:** Codex
- **Cycle:** `playiq-course-expansion-20261027`
- **Active department:** Curriculum & Learning Design
- **Approval receipt:** The operator directly approved the full course rewrite
  and confirmed the final count as 15 sections: Module 00 plus Modules 1–14,
  with Module 14 as the Capstone. The existing request to commit/publish the
  approved course package is being carried out on a topic branch and in a new
  dated Drive folder. No Iris message or production deployment was authorized
  or performed.

## Source and change boundary

- **PlayIQ checkout:** `/private/tmp/playiq-course-expansion-20261027`
- **Git remote:** `https://github.com/siharaprak/playiq-new.git`
- **Branch:** `codex/playiq-course-expansion-20261027`
- **Course package commit:** `d74f89b9676639859c2fe0de8b70de94ec28f5d0`
- **Base revision:** `bca04d16b435b4359867fd99ef06448eadd558db`
- **Drive revision folder:** `PlayIQ_15_Module_Course_20261027`
- **Drive folder ID:** `1NyhtAiUq8e3gfYTOyT1WFB5yowcVaGOb`
- **Drive parent:** `1Ze1u3sP_uMjdVMvYHUXCzB_au7kNc0GM`

Modules 00–8 retain the October 20 revision's lesson content, with the Module
00 label and required cross-references reconciled. Modules 9–14 implement the
approved sequence: one continuous six-file Tutor build in the existing
Module 00 Project; Tutor tests and learning loop; a separate student-owned
Personal Assistant build/test pair; an optional character-to-cartoon preview;
and the final Master Trial Capstone in Module 14. The revision notes document
the older Orion Brain outline conflict and the decision not to edit that
separate source as part of this package.

## Verification performed

- 15 numbered student-text sources present: Module 00 and Modules 1–14.
- **130/130** automated structural, content, link, HTML, PDF, and asset checks
  passed using `verify_revision.py`.
- Combined Markdown and navigable white-background HTML rebuilt from the
  module sources.
- White-background Letter PDF rebuilt and text-checked; **127 pages**.
- Representative pages visually inspected across the cover, Module 1, Module
  9, Modules 10–13, Capstone, and final page. The Module 9 output clearly says
  one existing Project plus six files.
- Source hashes are recorded in `SOURCE_MANIFEST.json`; the 15 module hashes
  are repeated below for copyback integrity.
- The focused course branch was pushed to GitHub. The push created only the
  named topic branch; no pull request, merge, Iris message, or deployment was
  created.
- Drive readback shows 26 package files in the revision folder, plus the
  `assets` and `output` subfolders. The asset and print-PDF listings each show
  one file in the expected location. Module 9 was fetched back and confirms
  the same existing Project plus six files. Drive reports the PDF at
  1,684,469 bytes, matching the local artifact.

| Source | SHA-256 |
|---|---|
| Module 00 | `8134106a5127099bcfb31533afdad36e8bfac98a5dc49235dc7f2cc5e015cd3a` |
| Module 1 | `c1f8b5165e5cca0698c879547ddfc6bd225fa3d88826c7a47350044540f9b751` |
| Module 2 | `2c031437cd735a98951f43ebd74666df292704776ef37c01d014fabe9fa2e6ac` |
| Module 3 | `ea28fc6ce377e8da61f02499125b2f0c47e984e17c0dc5dea6eabd034d9addef` |
| Module 4 | `7d14bf53f0a4a8c6c9e5eb9522019919e0e179f658afc413d5b82ad03816922f` |
| Module 5 | `3579b64fc8a75bc090df71cb12f23f84f661215af1d4355c40b79b0839a0d314` |
| Module 6 | `407fdc429524971c6fd9bfdd2d98a08b2e0f9df357b3cd57f978442e28e86ad1` |
| Module 7 | `b01f2c2418516ddeab43e866ccb99ce4c9f984d08fe8138a487672a8212cfdaa` |
| Module 8 | `da0569eb551864fba8e9a4e5607e28f759d224ddd1b48fdb9d28799a5b87165c` |
| Module 9 | `c3b4a3d251ff7f714ed9e46e406fc82b141e650f4046eedc8e43e13d7ac6aeda` |
| Module 10 | `03fad848b1aa34bc04b5d863d70fb0bdd38ab18496d5d9c2522dfe4327d70b89` |
| Module 11 | `905848183bd60326df55b2ee7eb627b7dc6b52a40046c4a2d995f9a237fa4b80` |
| Module 12 | `5557aea46f1098dbebaccf512e66a96da671b92a499adc6395de6d9cd6efb366` |
| Module 13 | `9ebb12d1fa03e920c8cb455c13c109cc77b59b13d2eb361a73c848ca9d3c61eb` |
| Module 14 | `b736a8bbf7f1f79d16421c4bb0fc6f4dafc40ca939bd3c4c86846797c7ec30e5` |

## Evidence classification and limits

- **Current evidence:** source and locally compiled artifacts only.
- **Not verified:** student beta outcomes, learner completion, external AI
  account behavior, website integration, parent-dashboard behavior, or live
  production deployment.
- **Git publication:** topic branch pushed; course content is in commit
  `d74f89b9676639859c2fe0de8b70de94ec28f5d0`.
- **Drive publication:** 28 package files uploaded in the dated revision
  folder with the expected folder layout; direct folder listing and selected
  content readback completed.
- **Next step:** site integration and a handoff to Iris remain separate work;
  create either only if the operator asks. Production deployment is not part
  of this course-source change.
