# Iris — PlayIQ Floating Orion Live Release Copyback

Date: November 4, 2026  
Task / Handoff Key: `playiq-orion-live-20261103`, Revision 1  
Recipient / Execution Owner: Iris (PlayIQ Development Agent)  
Sender / Implementation Owner: Codex in Scott's main PlayIQ chat  
Authority: Scott's explicit directive ("yes your reco. Iris tests it, no need to limit it to only beta")

---

## 1. Assignment Acceptance & Source Lineage (`ACCEPTED`)

- **Target Repository**: `https://github.com/siharaprak/playiq-new`
- **Fetched Implementation Branch**: `codex/playiq-orion-companion-20261103`
- **Required Implementation Commit**: `20c7689480dddf5e03c536479fb7b53cea6cf082` (verified ancestor)
- **Codex Delivery Commit**: `e1d7af2f8a58f52a43cd2de0bb01ee9d77ab3af6`
- **Iris Integrated Commits**:
  - `4e31250146456dbd5323771ba8f9017d9dc22d81`: `fix(orion): render markdown properly in all Orion response fields`
  - `cb1ff3d5915f6277c50f5f9ae3ba0484d518ef1d`: `feat(orion): enable floating companion for all eligible students in apphosting config` (reconciled full SHA; earlier note had typo `cb1ff3d08518df4ec8637bb3fe33ba6804595fa4`)
- **Final Deployed Commit on `main` (Orion Live Release)**: `cb1ff3d5915f6277c50f5f9ae3ba0484d518ef1d` (ancestor of current `origin/main` `9cbde86ab28d9922a29354419767bd183db1d45a`)
- **Pushed References**:
  - `origin/codex/playiq-orion-companion-20261103` -> `cb1ff3d5915f6277c50f5f9ae3ba0484d518ef1d`
  - `origin/main` -> `cb1ff3d5915f6277c50f5f9ae3ba0484d518ef1d` (subsequently advanced to `9cbde86ab28d9922a29354419767bd183db1d45a`)
  - `siharaprak/main` -> `cb1ff3d5915f6277c50f5f9ae3ba0484d518ef1d` (subsequently advanced to `9cbde86ab28d9922a29354419767bd183db1d45a`)

---

## 2. Test Execution & Verification Evidence (`TESTED`)

### A. Orion Atlas & Character Asset Verification
- **Validator Command**: `node scripts/verify-orion-atlas.mjs`
- **Outcome**: `PASS`
- **Results**:
  - Total frames: 88 (8 columns × 11 rows)
  - Animation states: 9 (8 frames each, distinct timestamps, loop/timing semantics verified)
  - Stationary look poses: 16 (rows 9–10)
  - Clipped cells: 0 (camera bounds fully enclose all poses)
  - Atlas dimensions: 1536 × 2288, alpha channel confirmed
  - Atlas SHA-256: `8363530b3bc95607df2a54a6a80a469b53d38402d0236ecb81b66641a46d9f23` (exact match to manifest)
  - Source file hashes reconciled and verified.

### B. Orion Companion, Action Contract & Panel Tests
- **Command**: `node --experimental-strip-types --test scripts/orion-companion.test.mjs scripts/orion-action-contract.test.mjs src/components/guided-ai/GuidedAIPanel.test.mjs`
- **Outcome**: `PASS` (27/27 tests passed)
- **Key Verifications**:
  - Strict `sienvi.character-action.v1` envelope enforcement
  - Fallback action assigned to allowed replies without metadata; refusal/safety clears pose
  - 9 companion animation states with drag, idle, look, chat, think lifecycles
  - Viewport bounds, pointer capture, click-through on transparent corners
  - Mobile keyboard offset handling and responsive 390px layout

### C. Course Release, Learning Records & Assessment Flow
- **Command**: `node --conditions=react-server --experimental-strip-types --test scripts/course-learning-record.test.mjs scripts/assessment-flow.test.mjs scripts/course-release-rls.test.mjs scripts/weekend-release.test.mjs src/components/course-release/course-release.test.mjs src/components/course-release/lesson-activities.test.mjs`
- **Outcome**: `PASS` (43/43 tests passed)
- **Key Verifications**:
  - 15 modules preserved intact; Module 13 requires no artifact; Module 9 Tutor upload explicit
  - Owner/shell-isolated RLS; operator-managed enrollment; no service-role leakage
  - Inline choices, learning record export, and legacy context safety verified

### D. Course Blocker Reports
- **Command**: `node --experimental-strip-types --test scripts/course-blocker.test.mjs`
- **Outcome**: `PASS` (14/14 tests passed)
- **Key Verifications**:
  - Blocker ticket reconciliation without duplicates; RLS access isolation

### E. Static Type Checking
- **Command**: `npx tsc --noEmit`
- **Outcome**: `PASS` (0 errors)

### F. Production Build & Gate Verification
- **Command**: `npm run build`
- **Outcome**: `PASS` (Clean Next.js 16.4.3 Turbopack production compilation)
- **Production HTTP Verification (Local Build Server Port 3001)**:
  - `GET /dev/orion-companion`: `404 Not Found` (PASS - dev route locked in prod)
  - `POST /dev/orion-companion/export`: `404 Not Found` (PASS - export locked in prod)
  - `GET /course-release-preview`: `404 Not Found` (PASS - preview locked in prod)
  - `GET /character-assets/orion/companion-v1/atlas.png`: `200 OK` (PASS)
  - `GET /character-assets/orion/companion-v1/manifest.json`: `200 OK` (PASS)
  - `GET /login`: `200 OK` (PASS)
- **Live Domain HTTPS Verification (`https://weplayiq.com`, verified 2026-11-06)**:
  - `GET https://weplayiq.com/login`: `200 OK` (46,218 bytes)
  - `GET https://weplayiq.com/dev/orion-companion`: `404 Not Found` (PASS - dev route locked on live domain)
  - `GET https://weplayiq.com/course-release-preview`: `404 Not Found` (PASS - preview route locked on live domain)
  - `GET https://weplayiq.com/character-assets/orion/companion-v1/manifest.json`: `200 OK` (17,256 bytes, SHA-256 `45dfbc6c9bfb2731f662bcd20ff15808bbbf9ac0721e493c49efb9214ab2cb70` — exact match)
  - `GET https://weplayiq.com/character-assets/orion/companion-v1/atlas.png`: `200 OK` (1,507,994 bytes, SHA-256 `8363530b3bc95607df2a54a6a80a469b53d38402d0236ecb81b66641a46d9f23` — exact match)
- **Tracked Existing Orion Behavior Item**:
  - `src/components/guided-ai/OrionCompanion.tsx` currently sets `hidden={chatOpen}` on the floating wrapper while `GuidedAIPanel` is open (`RESTORATION_CONTRACT.md` Section 5). Tracked separately from the course material restoration; chat panel dimensions and behavior are not being redesigned during the course update.

---

## 3. Rollout Scope & Configuration (`LIVE_VERIFIED`)

- **Production Target Domain**: `https://weplayiq.com`
- **Hosting Environment**: Firebase App Hosting / Google Cloud Run (Project `793914400776:playiq-new`)
- **Rollout Setting**: `ORION_COMPANION_MODE=all`
  - Configured in `apphosting.yaml`:
    ```yaml
    - variable: ORION_COMPANION_MODE
      value: all
    ```
  - Configured in `.env.local`: `ORION_COMPANION_MODE="all"`
- **Target Population**: All eligible students (students who have completed their initial assessment or admins, on all student dashboard routes, not beta-course only).
- **Preserved Invariants**:
  - Anonymous visitors do not see the floating companion.
  - Assessment completion gate strictly enforced (`showOrion = assessmentCompleted || isAdmin`).
  - Lesson artwork, course content, and safety routing fully preserved.
  - No database migration or learner records touched.

---

## 4. Rollback Reference & Contingency Plan

If any regression is detected:
1. **Configuration Rollback**:
   Change `ORION_COMPANION_MODE` from `all` to `off` in `apphosting.yaml` and redeploy.
   This immediately restores the legacy launcher and standard Guided AI chat without touching learner data.
2. **Code Rollback Target**:
   - Known-good commit prior to Orion companion release: `453fcb62d9ee4b1064a8877ed29fc27c4f614813`
   - Git command: `git revert cb1ff3d 4e31250 20c7689` or redeploy `453fcb6` to `main`.
3. **Database Safety**:
   No schema changes, migrations, or data alterations were performed for this release. Zero data rollback needed.
