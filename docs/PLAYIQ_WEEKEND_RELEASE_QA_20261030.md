# PlayIQ weekend release — integration copyback

Date: 2026-10-30. Project: PlayIQ Course 1. Lab: `PLAYIQ_ORION_WIZARD_LAB`.
Agent: Codex main/release integrator. Cycle: `playiq-weekend-test-20261030`.
Active department: Course Release Implementation. Evidence: local source, artifacts,
synthetic browser, offline action fixtures and actual local PostgreSQL/WASM only.

## Authority and ownership

The operator approved the 15-section course, source-to-file gap fixes, four usability
corrections, parallel workers and a committed GitHub/Iris handoff. No production
deployment, hosted migration, credentials, provider changes or external messaging
was performed. Original dirty checkout `/Users/blackwizard/Repos/PlayIQ/playiq-new`
was preserved. Implementation is isolated at `/private/tmp/playiq-weekend-test-20261030`,
branch `codex/playiq-weekend-test-20261030`, based on origin/main
`7ee00fc254b7dc48f0d51de657eaa089d1be0a42`.

Workers had disjoint write scopes: curriculum/tutorial artifacts; learning-record data
then blocker reports; inline lesson UI; responsive Orion panel. Main owned integration,
assessment, enrollment security, real SQL tests, release verification and publication.
A separate reviewer examined data/access changes and independently retested fixes.
Canonical governance instruction bundle hash:
`23a0a855e74eaefb8defb51f9fba279d3a78b965d5e676d11aa773a153a12319`.
This copyback is not a durable Mempalace write or cross-agent runtime-enforcement receipt.

## Delivered source behavior

- Exactly Module 00 plus Modules 1–14; Capstone 14. All lesson bodies retained.
- Separate, default-disabled beta/final shells. No replacement or reseeding of old live modules.
- M1 character-first guardrail tutorial, ten questions and reusable save-kit prompt.
  Downloads/ZIPs must genuinely exist; learner downloads, extracts and reopens them.
  Browser AI never claims silent local-disk access. Manual text save is fallback only.
- 62 real inline choices at resolved lesson anchors; confirmed draft saving, reload,
  explicit next action and retained failed selection with Retry. Longer workbook notes
  remain optional reflections, not duplicate compulsory assignments.
- M00 assessment choices/drafts persist before advancing. Results load when ready with
  retry and one clear Continue; a reviewed assessment snapshot is hash-bound at approval.
- M9 prepares, previews and downloads `personal_learning_knowledge_file.md`, titled
  **Personal Learning Knowledge File**, from approved M00–8 evidence. It is File 2 of
  six, not a seventh file. Missing/draft evidence remains explicit. Beta feedback and
  later Assistant work never enter that file. Manual external Project upload is separate.
- Same external Tutor Project from M00; M9 build, M10 tests/use, separate Assistant
  M11 build/M12 tests, optional character possibilities M13, Capstone M14.
- Beta technical report before completion, with bounded technical context, idempotent
  report reference and exact readback before a confirmed ticket. No screenshot capture,
  external notification or promise that someone has reviewed it. Survey only after saved completion.
- Larger Orion desktop panel, phone/tablet bounds, character show/hide, minimize/reopen,
  keyboard viewport logic and preserved chat/draft. Production 3D rollout mode unchanged.
- Platform steps checked against fetched official docs, with account/rollout fallbacks;
  these are not claims of real ChatGPT/Claude/Gemini account tests.
- Operator-managed enrollments, verified cookie auth, owner/release/shell RLS, bounded
  answer and SQL option validation. Mutable profile role/status cannot grant this release.

## Reproducible local checks

From the repository root, using Node 26.9 in this verification:

```sh
npm ci --ignore-scripts
node --test scripts/assessment-flow.test.mjs scripts/course-learning-record.test.mjs scripts/course-blocker.test.mjs scripts/course-release-rls.test.mjs src/components/course-release/lesson-activities.test.mjs src/components/guided-ai/GuidedAIPanel.test.mjs scripts/orion-action-contract.test.mjs
node --conditions=react-server --test scripts/weekend-release.test.mjs src/components/course-release/course-release.test.mjs
./node_modules/.bin/tsc --noEmit --incremental false
npm run build
```

The first grouped suite passed **63/63**; server-conditioned suites **11/11**.
Existing Orion character suite additionally passed **11/11**, using Node's TypeScript
stripping with a temporary resolver for the existing extensionless imports (no app
source changed). Its existing `npm run test:orion-character` requires `tsx`, which was
not installed locally; the native resolver was used instead of fetching it. Total:
**85/85** checks across these suites. `server-only` content suites require the shown
`--conditions=react-server`; a bare Node call fails at that deliberate import boundary.

The source verifier, run with bundled Python/pypdf in the package directory, passed
**253/253**, 15 sources, **143 Letter pages**. Changed PDF pages were rendered and
visually inspected in the source lane; not every page received visual inspection.
`SOURCE_MANIFEST.json` records file hashes; both public and packaged PDFs hash to:
`0fd70a051f84cca1936a44657d7089f353478bf851cfd5a404d577fa303cf9f8`.

TypeScript passed separately (the inherited build config skips type errors). Scoped
ESLint passed with zero errors; pre-existing unused-variable/image warnings remain.
Production build passed using synthetic localhost Supabase values, not real credentials.
Both course route `.nft.json` traces include the actual compiled course HTML.
Four inherited dynamic image-route tracing warnings remain. Dependency audit reported
11 advisories (2 moderate, 9 high) in the existing dependency tree; no broad audit-fix
or claim of a vulnerability-free site is made.

## Independent security review

Earlier findings were fixed: missing `profiles.status` assumption, writable-profile
authorization, and assessment changing between displayed review and approved save.
The second review found inherited authenticated TRUNCATE privileges and SQL accepting
invalid digital options. Both were fixed before handoff.

The reviewer independently applied the migrations with broad default grants and
reported **24/24 privilege checks**, denied TRUNCATE on all four tables with both
students' records preserved, and **3,948 validation cases** matching SQL to TypeScript.
No remaining material findings in that focused review. Main's tracked real-SQL suite
also reproduces broad defaults, rejects destructive privilege attempts, rejects invalid
direct records, and executes enrollment/owner/shell/survey/blocker policies.
Migration 90000 reviewed hash:
`d49b9410e89d22fbabe5a6464be4b632c001adccf7cc76e7e5cb1954e44a8e52`.
Migration 91000 hash:
`a8afbc0ad3a72a29d6e8f6055d29f010ffad7fd054bc43d9e273802cb2562047`.

## Synthetic browser observations

The dev-only `/course-release-preview` harness uses injected local synthetic actions
and a prominent test banner; it is inaccessible in production. This is **not** a real
student session or hosted persistence proof.

- M1 choice B confirmed saved and returned checked after reload; actual earlier
  synthetic reflection text also returned. Saving choices changes completion to draft.
- Failed-save mode retained choice C, showed explicit failure/Retry, and did not offer
  its confirmed next action. Retry remained failed honestly.
- Beta blocker saved before completion with a confirmed synthetic ticket. Failure
  retained description and unchanged reference with no confirmation claim.
- Final M13 had no beta report/survey, required no artifact/answer, and could save preview
  completion then Continue to 14. M9 download remained disabled until review approval.
- Actual browser download used `personal_learning_knowledge_file.md`. Local readback
  showed the synthetic saved M1 text, approved draft status, readable chosen answer,
  explicit missing entries and no inferred assessment results. Not real learner evidence.
- Orion observed at 390×844, 768×1024 and 1280×900 requested sizes. Page had no horizontal
  overflow; panel remained bounded. Desktop expanded to approximately two-thirds width.
  Character toggle and minimize/reopen preserved a typed unsent draft. No AI send occurred.
- Physical phone keyboard, WebGL 3D performance, real provider replies and cross-device
  account persistence were not tested. Viewport override was reset after testing.

Temporary screenshots/downloads are synthetic QA, not learner data; none are published
as course evidence. Raw private meeting transcript is outside the release worktree and
must not enter Git or the release bundle. No `.env`, credentials or build/tmp caches belong
in this release.

## Remaining acceptance boundary

Iris must deploy this exact committed revision to approved staging, apply the two
migrations in order, explicitly enroll approved existing test students, enable only
beta, and verify real-cookie persistence/isolation, assessment provider behavior,
real downloadable content/manual external upload, reports and physical mobile behavior.
Until that acceptance succeeds, label this **implemented and locally verified; staging
acceptance pending**, not deployed/live/production ready. Flags-off is the safe rollback;
retain student evidence and do not drop tables.
