# Orion panel responsiveness — scoped implementation copyback

Date: 2026-10-30 (America/Edmonton)  
Project: PlayIQ  
Lab: `PLAYIQ_ORION_WIZARD_LAB`  
Agent: Orion Panel Responsiveness worker  
Cycle: `playiq-weekend-test-20261030`  
Active department / SOP step: Course Release Implementation  
Evidence classification: **local pure/static verification; browser/device and staging behavior NOT yet verified**.

## Ownership and scope

Only `/private/tmp/playiq-weekend-test-20261030` was edited. The original main checkout was not modified. Main is the sole release owner; this worker did not stage, commit, push, deploy, message anyone, migrate a database, read credentials, or call a provider. No services were started by this worker. Other workers' files were not changed.

Operator approval: the scoped assignment explicitly approves the Orion panel correction and delegates this lane. No production approval is inferred from it.

## Implemented

- Floating chat now defaults to up to **544 × 736 CSS pixels**, bounded by the current viewport.
- Accessible **Expand Orion chat / Restore Orion chat size** control uses approximately 68% of desktop width (up to 1200px) and available height. Restore/minimize preserve the conversation and drafts.
- Phones, short landscape viewports, and tight zoom viewports use almost all available space with usable margins. `VisualViewport` resize/scroll updates account for the software keyboard and viewport pan; ordinary resize and CSS `dvh` provide fallback behavior. Safe-area inset handling protects device edges.
- Character section has a named **Show Orion character / Hide character for more reading space** toggle. It automatically starts collapsed on narrow or short viewports unless the student chooses otherwise. Character content stays mounted and animation rendering pauses while hidden; existing 3D/static and motion preference behavior is retained.
- Character, message thread, and tall composer controls have bounded scrolling. Preference selectors, attempt fields, teach-back, hint ladder, and study-tool controls remain available without forcing the conversation to zero height in ordinary small-screen layouts.
- Floating panel is a named **non-modal** dialog: Escape minimizes; opening focuses the panel rather than summoning a mobile keyboard; minimizing returns focus to the launcher. Expand/minimize have 44px targets and meaningful accessible names. Inputs have explicit accessible names. Controls remain keyboard-operable.
- Inline panel also uses the collapsible character and bounded scroll regions. Closing it hides rather than unmounts its contents, preserving chat/character state.
- Scoped reduced-motion CSS suppresses panel/launcher decorations when requested. Existing Orion reduced-motion, text-only, static fallback, preferences, assets, and action contract are untouched.

## Changed paths

1. `src/components/guided-ai/GuidedAIPanel.tsx`
2. `src/components/guided-ai/GuidedAIPanel.module.css` (new)
3. `src/components/guided-ai/panel-layout.ts` (new pure calculation)
4. `src/components/guided-ai/GuidedAIPanel.test.mjs` (new focused tests)
5. `docs/PLAYIQ_ORION_PANEL_QA_20261030.md` (this copyback; `docs/` may require exact force-add by release owner)

## Verification actually performed

From the isolated worktree:

```sh
node --experimental-strip-types --test src/components/guided-ai/GuidedAIPanel.test.mjs scripts/orion-action-contract.test.mjs
./node_modules/.bin/tsc --noEmit --incremental false
./node_modules/.bin/eslint src/components/guided-ai/GuidedAIPanel.tsx src/components/guided-ai/panel-layout.ts
git diff --check -- src/components/guided-ai/GuidedAIPanel.tsx src/components/guided-ai/panel-layout.ts src/components/guided-ai/GuidedAIPanel.module.css src/components/guided-ai/GuidedAIPanel.test.mjs
```

- **17/17 tests passed:** 10 new panel/layout/source-contract tests plus 7 existing character-action contract tests.
- Pure geometry checks include desktop expand/restore, phone, keyboard resize/pan, landscape, zoom-equivalent small dimensions, invalid numeric inputs, and 220 viewport/state combinations bounded within the visual viewport.
- Full worktree TypeScript check passed at verification time.
- Scoped ESLint: no errors; 4 pre-existing warnings (unused `error` state value and three existing unoptimized `<img>` uses). These are not new network/provider paths.
- Whitespace diff check passed.
- An independent local byte comparison against this worktree's `HEAD` confirmed `requestGuidedAi`, `handleSubmit`, `handleTeachBackSubmit`, and `handleNextHint` are unchanged. Authenticated `/api/guided-ai`, integrity/refusal processing, effort/teach-back controls, and action synchronization are preserved.
- Node emits the existing typeless-package ES-module warning during strip-types tests; tests succeed without changing package configuration.

These checks do **not** prove native keyboard behavior, a screenshot/rendering pass, authenticated student interaction, WebGL performance, provider responses, or production readiness.

## Main-owner browser QA and Iris staging gate

Main may mount the real component in the already gated synthetic development preview, e.g. `<GuidedAIPanel isFloating moduleNumber={1} pageType="lesson" orion3d={false} />`. No auth bypass or provider injection was added. Development-only simulated replies already present in the component can exercise display without an AI call. Do not send the real chat form during synthetic-only testing.

Before claiming the panel ready, inspect these cases:

1. Desktop 1440×900: open, select a study tool, type a draft, show local simulated text, expand/restore, hide/show character, minimize/reopen. Text and draft must remain; focus must return to the launcher on minimize. Test Escape and keyboard-only navigation. The non-modal dialog intentionally does not trap focus or block the course.
2. Phone 390×844 and small phone 320×568: no horizontal page overflow, visible minimize, collapsed-by-default character, usable study-tool dropdown, readable thread, legible composer. Open character/settings and confirm bounded scrolling.
3. Short/landscape 844×390 and 320×256: all controls must remain reachable. Add long attempt/teach-back/preference UI and long reply/code text; composer and thread should independently scroll.
4. Software keyboard on real iOS/Android: focus message/attempt/teach-back, check keyboard resize/pan and dismissal; verify the composer remains reachable and safe areas are respected. Desktop emulation is not proof of a real mobile keyboard.
5. Browser zoom 200%/400%, reduced motion, text-only mode, static `orion3d={false}`, WebGL fallback, and character settings: no trapped focus or loss of chat; animations stop as requested.
6. With a legitimate staging student account, exercise existing safety/refusal/effort/hint/teach-back behavior only under the main owner's approved staging test plan.

### 3D release flag — staging only

Student layout's existing production default remains **`ORION_3D_MODE=admin`**. This worker did not edit the layout or change the global default. A static character for an ordinary student can therefore be expected configuration, not proof of an animation defect.

Iris may explicitly set **`ORION_3D_MODE=all` only in the authorized staging/preview environment** to test student animation, then verify reduced-motion/text-only/static/WebGL fallbacks. A staged flag change does not establish that 3D is live for all production students. Production activation requires separate release-owner approval.

## Instruction load and source hashes

Read in this lane before code changes: current worktree `AGENTS.md`, local Next.js `use-client` and CSS guides, and all four canonical SebastianCore sources named in the assignment. Canonical sources were read only from `/Users/blackwizard/Repos/Sienvi/SebastianCore`.

Four-source concatenated SHA-256 (in specified order):
`23a0a855e74eaefb8defb51f9fba279d3a78b965d5e676d11aa773a153a12319` — matches the supplied pinned bundle.

| Source | SHA-256 |
| --- | --- |
| `governance/PERSONALITY_STACK.md` | `9c1925a82bd7eb3455edf44962288a8b8f485e59ff909862e11349c138eeb564` |
| `wizard_labs/billionaire_brother_derek/System Instructions Prompt for Bill.txt` | `a55bca8f1836f8b04ce3fd2c1cdba8294282e0da5cf865e7e12041dc5ec4eb57` |
| `governance/AGENT_EXECUTION_CONTRACT.md` | `a5c3a6310a28a19da6f1b57b345b839ef80cb2cb128f8e0718075fb4f01de422` |
| `state/tasks/execution_policy.json` | `51a223a7c801bdc082944177c0553d605424844ef2ee638047b1d0051baa111e` |
| Worktree `AGENTS.md` | `063098f6cb31bb44c6f8fbea25b3876de7ee1e5f7d00a50dbab506f6415eb7f0` |

Output hashes at this worker's verification checkpoint:

| Output | SHA-256 |
| --- | --- |
| `GuidedAIPanel.tsx` | `3548919e88dd7814a149945e164adb5845981bafa228d16c0fde78adcbf0eb04` |
| `panel-layout.ts` | `b43f5e785c53b9c51af037135b837bf6d5a30331e8fb760ada36b97134a1c5ab` |
| `GuidedAIPanel.module.css` | `fd776e3cf38aa0a8f7f3507204c73b2bb8d5a4cc2cddb51f97a1b4b863c4396d` |
| `GuidedAIPanel.test.mjs` | `78a2df5a45a2bed67aabba76ca5036763205da991d29ed29dd8912f9ec852b4e` |

This is an ordinary repository copyback, not a durable-memory write or a claim of runtime governance enforcement. No memory receipt or production acceptance is claimed.
