# Orion production handoff

Release candidate: [draft PR #2](https://github.com/siharaprak/playiq-new/pull/2), branch `codex/orion-playiq-integration`. This handoff covers Orion only. The existing [platform staging-to-production checklist](staging-to-production-readiness-checklist.md) records a June 2026 release and must be refreshed for this release before it is used as evidence.

## Implemented

- The PlayIQ Guided AI panel renders the supplied draft Orion GLB, with a poster fallback and pinned compact preview above the conversation.
- The existing authentication, course gates, Guided AI response, and safety routing remain in place.
- The client accepts only strict `sienvi.character-action.v1` metadata. The server assigns a mode-based fallback action to ordinary allowed replies when optional gesture metadata is absent. Refused or safety-routed replies have no gesture and clear any earlier pose. Timed gestures return to neutral after 1.8 seconds.
- Keyboard/front-view controls, captions, reduced motion, and text-only options are available. The model uses mechanical pivots and contains **zero embedded animation clips**.

## Evidence collected

- `npm run test:orion-contract`: 7 passed, 0 failed.
- `npx tsc --noEmit`: passed.
- Orion-scoped ESLint: 0 errors; 9 warnings in `GuidedAIPanel.tsx`.
- `$env:PLAYIQ_PREVIEW_BUILD='1'; npm run build`: passed using the approved development/test environment. The existing Turbopack NFT tracing warning remains. The production-mode local server answered `/login` with HTTP 200 on port 3001.
- The GLB and poster SHA-256 hashes match `public/character-assets/orion/asset-manifest.json`; the GLB is 6,006,476 bytes and the poster is 1,352,832 bytes.
- The project owner tested the production-mode preview with a synthetic student account and provided screenshots showing the real chat action caption. The stale-wave/refusal mismatch visible in those screenshots was fixed afterward. A signed-in browser regression pass against the final commit is still required.

## Gates before production release

- **Asset approval:** obtain and record human likeness review, asset-rights clearance, and final art approval. The manifest currently says `production_release: NOT_APPROVED`, `human_likeness_review: PENDING`, and `asset_rights: UNVERIFIED_PENDING_REAL_DATA`. Update those fields only from actual approvals and approved replacement assets.
- **Current release smoke:** deploy this exact PR commit to an approved staging environment; check signed-in student chat, allowed/refused/safety-routed replies, action timing, long conversation layout, GLB failure fallback, reduced motion, text-only mode, keyboard operation, and screen-reader announcements. Do not use real learner data or bypass access gates.
- **Current release operations:** verify production environment configuration, current backup and rollback deployment identifiers, monitoring and support owners, and staging results for this commit. The June 2026 entries in the platform checklist are historical and do not approve Orion.
- **Release approval:** obtain the project owner's explicit approval for this release after the evidence above is recorded. Keep PR #2 as a draft until these gates are closed; merging or promoting it would publish the unapproved draft asset.

No production deployment is included in this handoff.
