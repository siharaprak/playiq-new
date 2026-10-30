# PlayIQ weekend test - Course Source Lane Copyback

## Identity, authority, and scope

- Project: PlayIQ Course 1.
- Lab: `PLAYIQ_ORION_WIZARD_LAB`.
- Agent/owner: Codex course-source worker; one owner for this package.
- Cycle: `playiq-weekend-test-20261030`.
- Active department: Course Release Implementation.
- Worktree: `/private/tmp/playiq-weekend-test-20261030`.
- Write scope: `docs/curriculum/playiq-weekend-test-20261030/` only.
- Original source: `docs/curriculum/playiq-15-module-course-20261027/`, read-only.
- Approval basis: operator approved the key-gap implementation, multiple-agent
  release preparation, committed branch and Iris weekend-test handoff. This
  worker is explicitly not permitted to stage/commit, contact others, deploy,
  change providers/credentials, or edit another owner's files.

## Instruction-load receipt

Loaded AGENTS.md and the four canonical SebastianCore sources, in full, before
course edits. This is a loading receipt, not proof of live runtime enforcement.
No Next.js code was authored in this lane; local Next guide requirement does
not apply to these course documents/build scripts. The PDF skill was loaded
before PDF authoring and its operation marker is recorded below after running.

| Source | SHA-256 |
|---|---|
| Current worktree AGENTS.md | `063098f6cb31bb44c6f8fbea25b3876de7ee1e5f7d00a50dbab506f6415eb7f0` |
| SebastianCore governance/PERSONALITY_STACK.md | `9c1925a82bd7eb3455edf44962288a8b8f485e59ff909862e11349c138eeb564` |
| SebastianCore wizard_labs/billionaire_brother_derek/System Instructions Prompt for Bill.txt | `a55bca8f1836f8b04ce3fd2c1cdba8294282e0da5cf865e7e12041dc5ec4eb57` |
| SebastianCore governance/AGENT_EXECUTION_CONTRACT.md | `a5c3a6310a28a19da6f1b57b345b839ef80cb2cb128f8e0718075fb4f01de422` |
| SebastianCore state/tasks/execution_policy.json | `51a223a7c801bdc082944177c0553d605424844ef2ee638047b1d0051baa111e` |

Canonical four-file bundle hash: `023a52d80aa606e60f2ed575a91b8be9ea7f8b0816f051595a7e0ec1ed96be81`.
Algorithm: SHA-256 of the `shasum -a 256` output lines for the four canonical
absolute source paths in the order above, excluding AGENTS.md. PDF skill
SHA-256: `a6e20f4ae66364a06d577dd51e0ce66ee2ef955be129cbe195e0a27f403daaf8`.

The four canonical source contents are unchanged in this follow-up. Their
**raw content concatenation SHA-256** in the table's canonical order is
`23a0a855e74eaefb8defb51f9fba279d3a78b965d5e676d11aa773a153a12319`,
matching the release owner's acknowledged bundle. This differs from the
earlier hash-list algorithm above, not from a source change. Current AGENTS
was reread after Next regenerated its notice; no Next code was written here.
OpenAI Docs and PDF skills were reread in full. OpenAI Docs skill hash:
`aa6829e21df2223167c85d2e49b6337a7345c84c1033f1ec10182c7882b36d45`.

## Completed source changes

All fifteen complete lessons retained. Modules 00-8 now explicitly save chosen
approved answers on PlayIQ. Module 9 reviews/downloads the Markdown Personal
Learning Knowledge File and manually uploads/read-checks it in the existing
external Module 00 Tutor Project. This remains one of six outputs, not seven.
Compiler/crossreferences distinguish saved site records, external chats,
manual downloads/uploads, missing evidence, and testable preferences.
Module 10 tests; Modules 11-12 keep the assistant separate; Module 13 remains
optional with no new assignment; Module 14 remains Capstone. Beta feedback is
the last source section and only for the beta shell.

## Verification performed

- Ran the PDF skill's `mark_artifact_operation_started.mjs` successfully
  before initial PDF authoring (create / 1 output / pdf), and once with edit /
  1 output / pdf before the directly approved packaging follow-up revision.
  The official-tutorial follow-up also ran one edit / 1 output / pdf marker
  before authoring. No model/inference provider call.
- Rebuilt complete Markdown, white responsive/copyable HTML, and white Letter
  PDF using bundled Node/marked/Python/ReportLab/pypdf dependencies.
- **253/253** source/local-artifact checks passed using `verify_revision.py`.
  This includes all 15 module sources, balanced prompts, beta feedback final,
  existing local links, six-file count, explicit site-download/Project-upload
  journey, missing-input handling, complete character tutorial, all six Tutor
  tests, preserved full existing content, and the approved packaging/optional
  character-Project update. Original Module 1 discovery/image/reuse steps and
  existing Module 13 creative path/reflections are preserved explicitly.
- **143 pages** in final print PDF; pdfinfo confirms Letter, no encryption,
  no embedded JavaScript. All 15 titles and the new download/upload steps
  are present in extracted text. PDF size: **1,738,063 bytes**.
- Rendered initial representative pages 1, 7, 14, 102, 106-109, 127, 130, 137.
  Visually inspected the opening, assessment/reveal, character-first hook,
  review/download, Markdown/profile examples, upload/read-back/fallback,
  optional preview, Capstone and final beta section. No clipping, overlaps,
  missing-glyph squares, or dark-background defects observed in those samples.
  Whole-PDF text checks do not constitute whole-PDF visual inspection. These
  were the initial revision samples; see the follow-up visual record below.
- Module section IDs remain `module-0` through `module-14`. Full source text
  is included verbatim in the generated Markdown and rendered into the HTML.
- The original 15 module sources match their existing baseline manifest
  hashes; no source snapshot was overwritten.
- Source/artifact SHA-256 values are in `SOURCE_MANIFEST.json`; per-module
  hashes and every check are in `VERIFICATION_RESULTS.json`.

## Integration caveats for the release owner

See `COURSE_SOURCE_INTEGRATION_NOTES.md`. A later read-only source inspection
confirms the app export constant now uses `personal_learning_knowledge_file.md`
and the download button identifies it as Markdown; the earlier filename
mismatch is resolved in source. This is not a browser-download verification.
The repository ignores `docs/`, so the coordinator must explicitly include
this package in its scoped commit; none of it was staged by this worker.

## Directly approved follow-up: packaging and optional character Project

- Module 1 now teaches one reusable prompt for real downloadable named files
  or a ZIP when supported, containing only already approved existing work.
  Students download/extract/reopen locally. Browser AI must not claim direct
  local-folder creation. Manual saving is fallback-only; no fake links,
  installers, invented knowledge files, or added required deliverables.
- Module 9 reuses it for the same six outputs with the website-downloaded
  Personal Learning Knowledge File preserved unchanged as File 2. If exact
  preservation is unavailable, the student places that existing file in the
  local kit alongside the other five. No seventh profile is generated.
- Module 11 uses a separate Assistant folder with its already approved brief,
  instructions, and existing approved reference only when genuinely needed.
- Module 13 offers optional short private character-story Project setup and
  read-back using only the saved Module 1 character kit. No private Tutor
  profile/records or Assistant data; no required Project or assignment.
- The four review corrections were subsequently approved; see the current
  official-platform/digital-control section below.
- Follow-up visual QA: rendered/inspected pages **17, 18, 108, 109, 120, 128,
  129, 138** covering the reusable packaging lesson, fallback/reopen steps,
  exact-six-file Tutor reuse, separate Assistant kit, optional character-story
  Project, and final Capstone/beta section. Corrected a raw heading marker and
  a broken multiline emphasis span, then rerendered/reinspected 17, 18, 129.
  No clipped text, overlap, missing-glyph squares, leaked new Markdown tokens,
  or dark-background defects observed in the final changed samples. This is
  local artifact evidence, not a real AI download or Project test.

## Official-platform and digital-control follow-up

- Corrected M00/M1/M9/M11/M13 against actually fetched official OpenAI, Claude,
  and Gemini docs. The dated source/limitations note is
  `OFFICIAL_PLATFORM_TUTORIAL_VERIFICATION_20261030.md`.
- Removed the guessed ChatGPT profile-icon creation path and fixed the
  instructions/reference-file distinction: project instructions vs Sources,
  Claude Set project instructions/Save instructions vs project knowledge,
  available Gem Instructions/Save vs Knowledge. Preview alone is not saving.
- Official-source limitations remain explicit: the allowed OpenAI guide does
  not give a universal instruction-editor menu path; Claude has a Projects
  rollout; Google announces a personal-account Gems transition in November
  2026 with differing skills eligibility. Use the permitted parent-supported
  fallback, not a guessed path, new account, purchase, connector, or migration.
- All fifteen lessons distinguish digital questions from workbook entries,
  require confirmed saving before Continue, and explain pre-completion beta
  technical reports as separate from final module feedback. No changes to
  module numbering/depth, required assignments, or external business scope.
- Original save-kit/ZIP lesson, exact six-file Tutor outputs with unchanged
  downloaded File 2, separate Assistant, and optional character seed retained.
- Guidance status: **official-doc verified, not account tested**. Website
  security, real account setup, feature availability, and runtime behavior
  remain outside the source worker's evidence.
- Current platform-revision visual QA: rendered/inspected **3, 9, 10, 16, 18,
  19, 110, 111, 123, 124, 131, 132, 143**. Latest final renders of **9, 10,
  19, 110, 111, 123, 132, 143** confirm the actual platform cards/fallback,
  preserved Save your build prompt, File 2 handling, separate Assistant,
  optional character context, and complete final beta survey. No clipping,
  overlap, raw new heading/emphasis tokens, unreadable glyphs, or dark fills
  observed. Lower-level source headings now render as headings; compact beta
  surveys are kept together rather than stranding one question on a blank page.
- Internal verification-note Markdown links were removed from student lessons
  to avoid dead links when the HTML is embedded on the website. The internal
  source note remains in this package; lessons link directly to official help.
  All fifteen lessons have a regression check against those unserved links.

## Evidence boundaries / next permitted action

Evidence classification: source/local-artifact only. No real-provider calls,
student records, account interactions, Git stage/commit/push, Drive writes,
external messages, or production deployment in this lane. Source artifacts do
not prove website save/resume, download, auth/RLS, beta routing, or live account
behavior. The release coordinator owns independent integration tests, exact
control-label alignment, Git publication, and the pinned Iris handoff.

This is a scoped copyback report, not a durable memory/sync receipt.
