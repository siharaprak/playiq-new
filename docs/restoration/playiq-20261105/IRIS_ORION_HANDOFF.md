# Iris Orion Handoff and Course Material Direction

November 5, 2026. Recipient: Iris and her existing Antigravity PlayIQ workspace.

**Primary task: retain and verify the new floating Orion in the established PlayIQ site.** The companion is already implemented in Git; do not start another character project or assume it must be rebuilt. The related course instruction is simple: restore the last approved course interface and update the material inside it with the new fifteen-module curriculum. **No UI or UX redesign.**

## Start with the existing Orion work

Repository: `https://github.com/siharaprak/playiq-new`.
Inspected current integration base: `9cbde86ab28d9922a29354419767bd183db1d45a`.

| Existing change | Exact Git revision |
|---|---|
| Floating Orion implementation and committed assets | `20c7689480dddf5e03c536479fb7b53cea6cf082` |
| Iris's Markdown response rendering fix | `4e31250146456dbd5323771ba8f9017d9dc22d81` |
| All-eligible-student companion setting | `cb1ff3d5915f6277c50f5f9ae3ba0484d518ef1d` |
| Main including Iris copyback | `9cbde86ab28d9922a29354419767bd183db1d45a` |

The implementation is an ancestor of the inspected main. Fetch and inspect your own origin, branch, dirty status and newer commits before writing. Do not reset/stash someone else's work, replay changes already integrated, or replace main with an older branch. Use an isolated working branch when needed.

The existing `IRIS_PLAYIQ_ORION_LIVE_COPYBACK_20261103.md` reports publication. Its text contains an incorrect full `cb1ff3d...` SHA, and the listed HTTP checks use localhost. Reconcile against Git and the actual hosting deployment before declaring a new live verification. This is a source/evidence correction, not an instruction to redeploy a working feature unnecessarily.

## Preserve the character and single chat

Reuse these current implementation files and assets:

- `src/components/guided-ai/OrionCompanion.tsx` and its CSS.
- Current `GuidedAIPanel.tsx`, its response rendering, `panel-layout.ts`, and existing authenticated `/api/guided-ai` path.
- `src/lib/orion/` action validation, companion state, positioning/presentation policy and shared preferences.
- `src/app/(dashboard)/student/layout.tsx` eligibility and server-controlled companion mode.
- `public/character-assets/orion/companion-v1/atlas.png` and `manifest.json`, plus the existing Orion artwork/model sources. No regenerated robot or borrowed Wizard pet artwork.

Atlas SHA256: `8363530b3bc95607df2a54a6a80a469b53d38402d0236ecb81b66641a46d9f23`.
Manifest SHA256: `45dfbc6c9bfb2731f662bcd20ff15808bbbf9ac0721e493c49efb9214ab2cb70`.

Keep transparent free movement, drag-versus-click distinction, idle on release, existing animation/action states, saved position, reset/dock/hide/restore, reduced-motion support and transparent click-through. Keep one real chat with the existing safety/authentication controls and preserved conversation/draft on minimize. Lesson pictures and the original assessment introduction remain separate from the floating live companion.

`ORION_COMPANION_MODE=all` is already in the inspected `apphosting.yaml`; “all” still means existing eligible students, not anonymous access or bypassing the initial assessment. Use the established host/account configuration; do not create a provider, rotate keys, broaden permissions, change enrollment, or add infrastructure.

Do not install `desktop/orion-macos`, relaunch the native demonstration, change Scott's Wizard pet, bake new sprites, or add hats/reward inventories. Those are not this handoff. Do not restore the obsolete boxed/circular live launcher when recovering the original course pages.

The earlier persistent-visibility request and `hidden={chatOpen}` mismatch are recorded in the supporting contract. Scott's latest direction is a material update with no new UI/UX design. Preserve the current working companion and do not improvise chat size/behaviour changes under the course restoration. Return any necessary Orion defect as a specific issue instead of silently expanding scope.

## Verify without duplicating completed work

First determine what is already running. Return the deployed full SHA/build identifier and actual URL from the existing host, not just the SHA written in a document. Test with an authorized normal student account as well as any admin review: character loads, drag does not open chat, click opens the same chat, minimize/reopen retains text, position/preferences restore, mobile controls/composer remain usable, and safe real replies/errors leave a sensible animation state. Report not-run checks explicitly; do not alter real learner records to manufacture a pass.

Existing related checks remain in `scripts/orion-companion.test.mjs`, `scripts/orion-action-contract.test.mjs`, `src/components/guided-ai/GuidedAIPanel.test.mjs`, and `scripts/verify-orion-atlas.mjs`. Run an independent typecheck if code is changed; the project build skips TypeScript internally. Keep dev-only review/export routes unavailable in production. The older Orion-specific release authority remains in its existing handoff; it does not authorize an unreviewed course replacement.

## Course direction to carry forward

1. **Restore the last approved course presentation, not the entire old application.** Scott confirmed `evidence/original-module-1-lesson.png` and its full colour treatment. Reuse the established branded PNG, typography, colours, artwork, videos, original welcome/assessment and lesson/activity/check flow. Source reference: `7ee00fc254b7dc48f0d51de657eaa089d1be0a42`; keep current security, Orion and persistence fixes.
2. **Use the new full curriculum**, not the old course text: `docs/curriculum/playiq-weekend-test-20261030/`. Fifteen sections: Module 00 plus Modules 1 through 14, Capstone at 14. Tutor build 9, Tutor tests 10, separate Assistant build 11, Assistant tests 12, optional character-story seed 13. Keep the full character tutorial in Module 1. Apply the practical Module 2 discovery correction during Scott's first-three-module review.
3. **Scott reviews complete Modules 00, 1 and 2 here first.** After he approves those, finish the remaining course, verify it, then commit/push the application release. Iris publishes that already-reviewed build for Sihara and beta testers. No intermediate Sihara design-approval loop, and no early course publication merely to obtain Scott's approval.

Do not use `codex/playiq-interactive-review-20261104` as the design or production data implementation. It is rejected, browser-only/offline demonstration work. The approved curriculum is already committed separately.

Preserve genuine saved learning answers from Modules 00 through 8, the reviewed Module 9 `personal_learning_knowledge_file.md` download as File 2 of six, the same external Tutor Project from Module 00, separate Assistant context, and beta-only end-of-module feedback. Keep the early technical blocker report and existing parent progress features.

The media audit found that old clips 9 and 10 are general learning-coach content, not proven Tutor/Assistant build tutorials. Preserve the files, but do not remap them by filename or label them as updated build instruction. See `MEDIA_MODULE_MAP.md`. No new video generation or branding project is requested.

## Supporting references and receipt

The short instructions above are the task direction. The following files support precise implementation and checking; they do not request additional redesign:

- `VISUAL_BASELINE.md` and the original screenshot evidence.
- `MEDIA_MODULE_MAP.md` for content-based media placement and remaining narration checks.
- `RESTORATION_CONTRACT.md` for approved course/data requirements and authority boundaries.
- `MODULE_2_DISCOVERY_CORRECTION.md` for the missing practical step.
- `ACCEPTANCE_CHECKLIST.md` for the first-three-module review and eventual release proof.
- `SOURCE_MANIFEST.json` and `verify-packet.mjs` for source/artifact identity.

Reply through the existing mailbox process with what Orion work is already integrated/live, what you verified, the exact checked-out/deployed SHA and target, any concrete defects, and the first-three-module review plan. One Iris implementation owner; no duplicate deployments or agent-created infrastructure. Do not send messages to Sihara or Scott's contacts on his behalf without separate authority.
