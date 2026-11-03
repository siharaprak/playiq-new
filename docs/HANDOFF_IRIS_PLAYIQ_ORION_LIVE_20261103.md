# Iris: test and release the floating Orion website companion

Task/handoff key: `playiq-orion-live-20261103`, revision 1.
One intended recipient and execution owner: Iris, using her existing PlayIQ development agent.
Sender/implementation owner: Codex in Scott's main PlayIQ chat.
State at preparation: code committed and locally verified; deployment NOT performed; Iris acceptance and real-account checks pending.

## 1. Scott's final decision and exact authority

Scott confirmed: "yes your reco. Iris tests it, no need to limit it to only beta".

You are authorized to test this website release and, once its checks pass, deploy/activate it on the existing verified `weplayiq.com` production project for **all eligible students**, using `ORION_COMPANION_MODE=all`. Do not stop at a beta-course-only rollout. You do not need another general deployment approval after successful testing within this exact scope.

This approval covers the Orion companion release only. It does not authorize another course redesign, course-final promotion, enrollment/database changes, new providers, credentials, infrastructure, unrelated clients, or a desktop-pet installation. Keep existing assessment-completion/role gates, authentication, AI safety and access controls. All eligible students means students already entitled to see Orion, not anonymous visitors or a bypass of the initial assessment.

This handoff supersedes older Orion local-only/beta-only rollout instructions and the release proposal in the original review note, solely for this Orion update. Older course deployment handoffs retain their own separate scope. The mailbox register's legacy `STAGING_PREVIEW_ONLY` header is not a new scope decision for this explicitly approved job; do not change other lanes to production.

## 2. Retrieve the committed source — no Scott-local paths required

- Repository: https://github.com/siharaprak/playiq-new
- Branch: `codex/playiq-orion-companion-20261103`
- Required implementation commit: `20c7689480dddf5e03c536479fb7b53cea6cf082`
- Implementation base: `453fcb62d9ee4b1064a8877ed29fc27c4f614813`
- This handoff: `docs/HANDOFF_IRIS_PLAYIQ_ORION_LIVE_20261103.md`
- Full local QA/design/release notes: `docs/ORION_COMPANION_BETA_REVIEW_20261103.md`
- Screenshots: `docs/orion-companion-evidence/`
- Paste-ready receiver prompt: `docs/IRIS_PLAYIQ_ORION_LIVE_PROMPT_20261103.txt`

Verify the root, origin and dirty status of YOUR checkout before changing anything. Fetch the named branch and current main; use an isolated clean checkout or worktree. Confirm the required implementation commit is an ancestor of the fetched release branch. Preserve newer main changes: use the normal merge/PR process, never replace main with an old snapshot, reset another person's work, force-push or blindly apply a stale ZIP. The release branch includes the latest handoff as well as the implementation; use both.

SebastianCore is not the PlayIQ product repository. No product implementation belongs there. Use your existing approved company instruction/governance setup; no private SebastianCore instruction bundle is being exported in this delivery. Do not install a governance runtime or create agents to execute this handoff. Report the instruction source/version you actually loaded rather than claiming automatic inheritance or cross-agent synchronization.

## 3. Accept the assignment and coordinate ownership

Read the full handoff and QA note. Acknowledge task key/revision, fetched branch SHA, required implementation ancestry, your clean checkout and actual deployment capabilities before protected writes. Use the existing supported task-claim mechanism if present; do not invent a lease/fencing receipt. Otherwise coordinate exclusive manual ownership with Scott: one Iris deployment job, no duplicate deployment agents. A mailbox file is a delivery record, not a distributed lock. If another owner is already deploying this change, reconcile rather than racing.

Use bounded existing-host tooling, no autonomous swarm or recurring operation. Keep the same task key on retries. After a deployment timeout, inspect the hosting provider's deployment ID/current version before retrying; an unknown result is not permission to deploy twice. Stop only the affected release action if authority, target or outcome cannot be established.

## 4. Preserve the approved experience

- Keep existing Orion lesson/assessment illustrations where they belong in the page.
- Floating, transparent Orion replaces the old floating launcher/large boxed animated character as the live companion, not the course layout.
- Click opens the same existing Guided AI chat. Drag moves Orion without opening chat. When chat is open, the floating body is hidden and the Orion portrait appears in its header; minimize restores the companion and retains the conversation/draft in the mounted session.
- Saved position, reset, dock/undock, text-only/hide and motion preferences must remain usable. Mobile uses a smaller character. Transparent areas must not block lesson controls.
- Keep `/api/guided-ai` and its current authentication/safety/action validation. There is no new AI, provider or student data store here.
- Do not launch/install `desktop/orion-macos`, activate OS-wide overlays, alter Scott's Wizard pet, or enable the development sprite baker on the public site.
- No course-reward inventory, unlock economy, outfits/paint jobs or boss scoring is released by this work. Do not present the cosmetic adapter/demo as a finished reward feature.

## 5. Verify and integrate before activation

Identify the existing PlayIQ hosting project, production domain and deploy method using your established authorized access. Capture the current deployed commit/deployment reference and current `ORION_COMPANION_MODE` before changing it. Preserve unrelated environment variables, including `ORION_3D_MODE`, course beta/final flags, API keys and enrollment settings. Use an existing approved preview/staging target for initial checks if one exists; do not create infrastructure. A bounded `admin`-only production check is authorized if the existing workflow requires production to test this change. Do not use real learners' answers as test data.

Run the existing related checks on the integrated source (install locked dependencies only if needed):

```sh
node --experimental-strip-types --test scripts/orion-companion.test.mjs scripts/orion-action-contract.test.mjs src/components/guided-ai/GuidedAIPanel.test.mjs
node --conditions=react-server --experimental-strip-types --test scripts/course-learning-record.test.mjs scripts/assessment-flow.test.mjs scripts/course-release-rls.test.mjs scripts/weekend-release.test.mjs src/components/course-release/course-release.test.mjs src/components/course-release/lesson-activities.test.mjs
node --experimental-strip-types --test scripts/course-blocker.test.mjs
node scripts/verify-orion-atlas.mjs
npx tsc --noEmit
npm run build
```

The combined related set is 84 tests (27 + 43 + 14). Run blocker/SSR tests without `--conditions=react-server`. The atlas validator also checks the source hashes: if newer source changes alter face/poses/baker/GLB, do not ignore the mismatch or silently bless new art; reconcile the change and obtain visual review for any changed character appearance. Use existing approved deployment secrets only; never paste them into copybacks or commit `.env`.

Local checks are already recorded as passed, but synthetic loopback build values are NOT production credentials or provider acceptance. The build skips TypeScript internally, which is why the independent typecheck is mandatory. Four inherited `/images/[...slug]` filesystem-tracing warnings and one avatar-image lint advisory are documented; do not expand this into an unrelated cleanup or dependency upgrade. An actual new failure must be assessed, not called passed because local checks once passed.

## 6. Real-account acceptance and rollout

1. Deploy the integrated candidate with `ORION_COMPANION_MODE=admin` to the existing authorized test target (or bounded admin-only production check described above). Do not enable `beta` as the final setting. Verify an actual authorized admin session; do not grant admin to a student to make testing easier.
2. Test the existing chat with a safe question using its normal session cookie and already configured provider. Confirm genuine replies, thinking/reaction handling and no stuck animation after completion/error. No tool permissions or answer-safety guardrails may be weakened.
3. On desktop and a real phone/touch device with its keyboard, test drag vs click, release, scroll, resize, reset, dock, hide/restore and reduced motion; verify text/composer remain reachable. Check Safari/Chrome where available. Unavailable required device testing is reported, not fabricated. If a critical device or account behavior cannot be verified, hold broad activation and tell Scott exactly what remains.
4. Minimize/reopen chat with an unsent safe draft and confirm it stays. Reload and confirm saved position/preferences. Confirm clicking through transparent corners reaches an underlying control. Verify no second boxed animated Orion appears and lesson/reference images remain.
5. Smoke the existing assessment/eligibility gates and course save/export flow with an approved existing test account and harmless test content. Confirm no schema migration, enrollment edit or course promotion is required for this presentation change. Do not modify other learners' records. Verify the atlas/manifest return successfully and development-only GET `/dev/orion-companion`, POST `/dev/orion-companion/export`, and `/course-release-preview` remain 404 in the production build.
6. If the checks pass, integrate/deploy through the existing normal production process and set **`ORION_COMPANION_MODE=all` on the actual production project**. Apply the host's normal rebuild/redeploy process as required for its server environment. Do not leave the final production setting at `admin` or `beta` and call the all-student release complete.
7. Verify the actual public domain points to the intended deployment, then use an approved eligible STUDENT session (not just admin) to verify the new companion on existing student pages. Check the new course route only if already enabled; do not enable a new course shell to test Orion. Anonymous/parent visitors must not gain this student companion through the change. Existing assessment gating must still behave as designed.

If testing fails, do not activate `all`. If a regression appears after activation, restore `ORION_COMPANION_MODE=off` (or the captured prior state if appropriate), apply the required restart/redeploy, and verify the legacy launcher/chat works. Keep the prior known-good deployment reference as the code rollback option. Do not delete learner data, drop tables, rotate keys or bypass permissions.

## 7. Completion evidence to return to the mailbox

Return `IRIS_PLAYIQ_ORION_LIVE_COPYBACK_20261103.md` to the same AgencyOS mailbox and report to Scott. Use these separate states:

- `ACCEPTED`: exact source/commit and ownership acknowledged.
- `TESTED`: redacted account/browser/device checks with pass/fail/not-run and observed outputs.
- `LIVE_VERIFIED`: deployed commit, deployment ID, actual production URL, `ORION_COMPANION_MODE=all` observed on the correct target, eligible-student verification and rollback reference.
- `BLOCKED` or `ROLLED_BACK`: exact step/error and effective setting/deployed version, without pretending the feature is live.

Include the integrated Git SHA/PR, actual deploy timestamps, tested routes, screenshots without private learner data, genuine provider reply confirmation, remaining limitations and rollback verification. Do not include passwords, tokens, private learner answers or claims that a local build proves hosted health. A pushed branch or an admin-only preview is not `LIVE_VERIFIED`. Receiving/reading this handoff is not completion. Do not message Sihara or send WhatsApp on Scott's behalf unless separately asked.

## Evidence boundary and copyback metadata

Project PlayIQ; lab PLAYIQ_ORION_WIZARD_LAB; recipient Iris; cycle `orion-live-20261103`; department `website-release`; single current step `verify-and-publish-release-handoff` at sender, followed by receiver acceptance/testing/deployment in sequence. This is an explicit human-directed job, not proof of an automatically enforced agent ownership/capacity system.

Atlas SHA-256: `8363530b3bc95607df2a54a6a80a469b53d38402d0236ecb81b66641a46d9f23`.
Implementation source, local test evidence and illustrations are committed in the named branch. Publication/Drive byte verification will be recorded separately. No production mutation has been performed by Codex, no Iris acceptance receipt exists at preparation, and no durable MemPalace write is claimed.
