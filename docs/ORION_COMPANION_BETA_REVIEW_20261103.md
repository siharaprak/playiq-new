# Orion companion — website beta review candidate

Status: LOCAL_IMPLEMENTATION_VERIFIED; NOT_DEPLOYED; REAL_ACCOUNT_UAT_PENDING.

## Source and approved direction

Product repository: `https://github.com/siharaprak/playiq-new.git`.
Review branch: `codex/playiq-orion-companion-20261103`.
Base: `453fcb62d9ee4b1064a8877ed29fc27c4f614813`.
Implementation is isolated from the original, dirty main checkout.

Scott approved keeping lesson/assessment illustrations, introducing a draggable web companion, and retaining one existing Orion conversation. The character must not become a second AI, replace the course layout, or create new learner assignments. No production deployment is included. The temporary macOS companion was quit at Scott's request; the separate Wizard pet was not changed.

## What changed

- Transparent animated sprite companion, rendered from the existing Orion GLB and procedural poses. No Black Wizard artwork was copied. The Wizard atlas was only a format reference.
- Real pointer capture and dragging, directional movement poses, release-to-idle, saved per-browser position, viewport clamping and reset. Transparent image areas pass clicks to controls underneath.
- Click/Enter opens the existing Guided AI panel. Drag release does not open it. Arrow keys reposition the expanded character. Minimize returns focus to Orion and preserves the existing conversation/draft in memory.
- One presentation at a time: opening chat hides the floating body and shows the existing Orion portrait in the chat header. It does not overlay the conversation/composer with another animated robot. Closing chat restores the companion.
- Dock/undock and hide-character/text-only controls retain chat access. Motion settings share the existing `playiq_orion_prefs_v1` preference record. The OS motion setting is respected when no override is set.
- Mobile companion uses a 120×130 display footprint rather than 192×208; docked control is 56×56. Options controls have a 44-pixel minimum target. Visual viewport resize/pan bounds are used, including keyboard-sized viewport tests. Page-hidden/docked/text-only/chat-open rendering work is paused/throttled. Companion is omitted from print.
- Existing lesson artwork, assessments, course text, save/export logic, API/authentication/safety controls, enrollment and database schema are unchanged.
- Local review harness follows navigation between course modules instead of losing the companion. Marketing popup is excluded from this one development harness, not redesigned on public pages.

## Release gate and rollback

`ORION_COMPANION_MODE` is a server-side presentation switch. No environment file or hosting setting has been changed by this work.

| Value | Effect |
| --- | --- |
| unset, `off`, unknown | Existing boxed Orion/launcher UI remains unchanged. Default. |
| `admin` | New companion for verified admin profiles; old presentation for others. |
| `beta` | New companion only on `/student/course-beta` (and its child paths). Existing beta access/enrollment checks still govern access. |
| `all` | New companion throughout eligible student pages. Only after review. |

The existing assessment-completed/admin visibility gate remains in place. This switch grants no access to courses, chats, profiles, provider tools, or databases. The separate final course and old module routes keep the old presentation in `beta` mode.

Suggested activation order after approval: deploy to the existing review/staging environment with `admin`, verify a real authorized admin account, test an enrolled student on the separate beta shell with `beta`, then obtain approval before considering `all` on production. Change no unrelated hosting settings. Runtime activation/deployment is not performed by this document.

Rollback: set `ORION_COMPANION_MODE=off` (or remove it) and apply the normal hosting configuration/restart process. The existing launcher and boxed character code are retained. No migration or learner-data rollback is needed.

## Evidence collected on November 3, 2026

These are local/synthetic results, not evidence of a live deployment or successful provider conversation.

- 84 related automated tests pass: 70 in the server-condition set and 14 blocker/SSR tests under normal React conditions. This includes action allowlists, companion state/policy/viewport behavior, course module integrity, approved learning-file export, offline SQL/RLS and existing panel contracts. Do not run the SSR blocker tests with `--conditions=react-server`: that selects a React server export without `renderToStaticMarkup` and causes a harness error.
- `npx tsc --noEmit` passes independently. The existing Next config skips type validation during build, so build alone is not the typecheck receipt.
- Focused ESLint: zero errors; one advisory about the small static avatar `<img>`. No broad lint cleanup was attempted.
- Optimized production build passes with synthetic loopback Supabase values. Initial restricted-network attempt failed to fetch the existing Google Fonts; retry with authorized network access succeeded. Four existing dynamic-filesystem tracing warnings remain in `/images/[...slug]`; that route was not changed.
- Production-mode local HTTP proof, with both development flags deliberately set true: GET `/dev/orion-companion` 404; POST `/dev/orion-companion/export` 404; GET `/course-release-preview` 404; atlas PNG 200. Test server was loopback-only, not published.
- Atlas validator: all 88 cells contain transparent Orion artwork; nine eight-frame animation rows, sixteen stationary look directions, no clipped cells, distinct frames, source/atlas hashes match. Stationary views are not locomotion clips.
- Actual browser pointer drag changed position from (1066,460) to (724,340), released idle and did not open chat. Reload restored (724,340).
- Actual browser click opened the existing chat; minimize restored companion focus. A synthetic unsent draft survived minimize/reopen. No AI request was sent.
- Actual dock/undock and text-only controls work; hidden-character and dock preference survived reload.
- Actual navigation from Module 1 to Module 9 kept the companion and displayed the Tutor/knowledge-file lesson. Course content was not replaced by a summary.
- Actual click through a transparent corner above a high-z-index test panel reached its underlying button, changing its label to `Underlying control clicked`.
- Phone-sized browser proof at 390×844: companion 120×130 remained within the viewport; chat bounds were x=8, y=8, width=368, height=828 (available visual viewport excludes the scrollbar). No physical phone or on-screen keyboard was used; the keyboard geometry is covered by pure layout tests, not an iOS interaction claim.
- Actual artwork failure path: the local generated manifest version was temporarily made invalid, producing a readable fallback and a working chat action. Original version 1 was restored immediately; atlas/source hashes were revalidated.

Screenshots: `orion-companion-evidence/desktop-companion.jpg`, `mobile-companion.jpg`, `mobile-chat.jpg`. All show synthetic review content, not a learner account.

## Still required before wider release

1. Scott/Sihara review this website behavior, including the companion docking into the chat header while chat is open.
2. Real authorized admin/enrolled beta-student session: confirm eligibility, actual Guided AI replies/thinking/reactions, route navigation, position controls, existing save/export flow and fallback. Synthetic tests do not prove Supabase/provider/hosting health.
3. Physical iOS Safari and Android touch/keyboard checks; desktop Safari/Chrome checks and screen-reader review. The local browser and pure viewport tests are not this device matrix.
4. GitHub publication and receiver acceptance, then explicitly authorized review/staging deployment. Neither a local commit nor this document proves Iris has received it or a live site has changed.

Cosmetic slots exist only as an adapter for explicit unlock inputs. No real course-reward database, inventory, hat/outfit economy, boss scoring, paint-job renderer or automatic rewards were implemented. Those remain separate features, not promises in this release.

## Local review and sprite pipeline

From this branch's checkout with dependencies installed, use the project's normal `npm run dev` with `PLAYIQ_ORION_COMPANION_REVIEW=true`; open `/dev/orion-companion`. The harness uses synthetic lesson records. Use the bake button only to intentionally regenerate the committed art, then reload and run `node scripts/verify-orion-atlas.mjs`.

The baker uses the established meshopt GLB derived from the source GLB, the existing face renderer and named-pivot poses. A fixed orthographic camera/lighting and deterministic sample times produce a 1536×2288 alpha PNG: eight columns, eleven rows, 192×208 cells. Rows 0–8 are timed states; rows 9–10 contain sixteen stationary look directions. Pivot is (96,190); per-frame head/hand anchors are recorded for modular cosmetic overlays. One-shot wave/celebrate/boss states return to idle; move/think/chat/idle/drag states loop. Unknown action/prose cannot execute animation commands or tools.

Development export is same-origin, loopback-only, requires the explicit flag AND development mode, checks payload/image geometry and finite anchors, and writes only two fixed files in the companion asset directory. It cannot choose arbitrary output paths and is 404 in production. It uses no image provider or student data.

The optional `desktop/orion-macos` source is a separate local AppKit review host, not shipped by the website or installed automatically. `sh desktop/orion-macos/build.sh` compiles it into ignored `tmp/orion-desktop`; it must not be launched as part of website review. It is unsigned Mac-only prototype code, with local position/debug state and no daemon, launch item, provider, network or global input hooks. Native cross-app drag QA previously hit `AXError.notImplemented`; do not promote that prototype to native release readiness based on web tests. The browser companion cannot float over unrelated applications.

## Copyback record

- Project: PlayIQ.
- Lab: PLAYIQ_ORION_WIZARD_LAB (task-scoped label, not a global lane activation).
- Agent: Codex main; no new workers or recurring operations created.
- Cycle: orion-companion-20261103; active department: website-beta-implementation-and-local-QA.
- Approval basis: Scott's direct approval of the hybrid presentation and request to finish; public production activation remains gated on review.
- Evidence: local implementation, pure/offline tests, local browser observations and synthetic production build. NOT production/runtime/account acceptance.
- Durable memory receipt: none requested; no claim of a MemPalace write or cross-agent synchronization.
- Source SHA-256: atlas `8363530b3bc95607df2a54a6a80a469b53d38402d0236ecb81b66641a46d9f23`; manifest `45dfbc6c9bfb2731f662bcd20ff15808bbbf9ac0721e493c49efb9214ab2cb70`; companion `2a93201fb63d1f662479f34727dd0cb315298f11d47f2157ab23df61f6b777fe`; release policy `84ef02e0453708f6106f393dc121949d2d29e402d3a9a4fa746a2c619104448f`; state machine `ac4c4c18e236ad98d28d535169153d303e5e11cde903adc2af52ef0c16c96a6f`; unchanged action contract `d0cb2cdb71af285130c68f6c26d89f2fbe55cd2b439dd2aa4c5faf139e37ac4f`.

Next action: review the committed beta candidate, authorize GitHub delivery/review deployment, then complete the real-account/device acceptance checks. Do not reopen the desktop review pet or modify the official Wizard pet.
