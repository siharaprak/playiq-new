# Sprint 4A — Guided AI Layer + Integrity Controls

**Status:** Implemented
**Date:** 2026-05-21

---

## Overview

Sprint 4A adds a guided AI coaching layer to PlayIQ's Module 1 and Module 2 lesson/overview pages. This is **not** an open-ended chatbot — it is a bounded, mode-specific coaching system with programmatic integrity controls.

## Modes

| Mode | Status | Description |
|---|---|---|
| Explain | Active | Concept explanation with follow-up question |
| Hint | Active | Single hint from a 3-level hint ladder |
| Quiz Me | Active | Practice question generation, answer withheld |
| Coach | Active | Study planning and next-step advice |
| Learn Your Way | Beta | Lightweight preference diagnostic with bounded signal writes |
| Lesson Rescue | Beta | Confusion diagnostician with structured rescue workflow (activated in Sprint 4B) |
| Lesson Rescue Preview | Scaffold | Original scaffold stub, preserved for backward compat |

> See [sprint-4b-lesson-rescue.md](sprint-4b-lesson-rescue.md) for full Lesson Rescue documentation.
> See [sprint-4c-guided-ai-integrity-hardening.md](sprint-4c-guided-ai-integrity-hardening.md) for integrity hardening (hint ladder, effort gating, teach-back, quiz answer stripping).

## Architecture

### Files Created

| File | Purpose |
|---|---|
| `src/lib/guided-ai/types.ts` | Zod schemas, mode IDs, preference enums, API contracts |
| `src/lib/guided-ai/modes.ts` | Mode registry with 6 modes |
| `src/lib/guided-ai/prompts.ts` | Mode-specific Gemini prompt builders |
| `src/lib/guided-ai/integrity.ts` | Keyword-based integrity enforcement |
| `src/lib/guided-ai/context.ts` | Curriculum context loader from static files |
| `src/lib/guided-ai/run-guided-mode.ts` | Server-only orchestrator |
| `src/app/api/guided-ai/route.ts` | Authenticated API endpoint |
| `src/components/guided-ai/GuidedAIPanel.tsx` | Main UI panel (client component) |
| `src/components/guided-ai/ModeSelector.tsx` | Mode button group |
| `src/components/guided-ai/GuidedAiResponse.tsx` | Structured response renderer |

### Files Modified

| File | Change |
|---|---|
| Module 1 lesson page | Added GuidedAIPanel import + JSX |
| Module 2 lesson page | Added GuidedAIPanel import + JSX |
| Module 1 overview page | Added GuidedAIPanel import + JSX |
| Module 2 overview page | Added GuidedAIPanel import + JSX |

### Files NOT Modified

- `/api/chat/route.ts` — not touched
- `gemini.ts` — not touched (teach-back/boss-battle grading preserved)
- `gating.ts` — not touched
- `constants.ts` — not touched
- `learning-events.ts` — not touched
- All module actions files — not touched
- Discussion board — not touched
- Parent/admin dashboards — not touched

## Key Design Decisions

### 1. No Conversation History
Each request is stateless: mode + module/node context + message + optional fields. No chat history stored or sent to Gemini.

### 2. Zod Output Validation
Gemini JSON output is validated with Zod before returning to client. If parsing or validation fails, a safe fallback response is returned.

### 3. Bounded Preference Signals
Learn Your Way writes **only** enum values to `fingerprint_signals`:
- `explanation_style`: examples | steps | analogy | plain
- `pace_preference`: fast | slow | moderate
- `practice_preference`: practice_first | explanation_first
- `support_preference`: visual_analogy | plain_explanation | worked_examples

No free-text preferences stored.

### 4. No Raw Storage
No raw prompts, selected text, student attempts, or raw AI responses are stored in the database.

### 5. Integrity Controls
Programmatic keyword-based checks before and after Gemini call:
- Homework outsourcing detection
- Direct answer seeking detection
- Assessment answer request detection
- Minimum effort enforcement
- Unsafe personal information detection

### 6. Panel Placement
Collapsible panel placed after lesson content but before the primary "Begin Activity" CTA. Starts collapsed so it doesn't bury the progression flow.

## Tech Debt

- [ ] **Secure /api/chat with server-side auth or retire it after Guided AI replaces it.** Currently has no server-side auth check.
- [ ] **Extend event_type_enum** to include `guided_ai_used`, `learn_your_way_updated`, `lesson_rescue_previewed`. Requires a Supabase migration.
- [ ] **Add rate limiting** to `/api/guided-ai` when a rate limiter is available.
- [ ] **MODULE_NUM = 2 in Module 1 actions.ts** — pre-existing UUID mismatch, not fixed in this sprint.

## Not Fixed (Per Sprint Rules)

- /api/chat auth
- MODULE_NUM bug
- constants.ts mismatch
- Duplicate capstone
- skill_nodes table
- Gating logic
- Module actions
- Dashboard design

## Related Sprint Documents

- [Sprint 4B — Lesson Rescue](./sprint-4b-lesson-rescue.md)
- [Sprint 4C: Depth Gating & Hint Ladders](./sprint-4c-guided-ai-integrity-hardening.md)
- [Sprint 4D: AI Support Events & Safety Routing](./sprint-4d-ai-support-events-safety-routing.md)
- [Sprint 4E: Guided AI UX, Answer Policy, & Integrity Trends](./sprint-4e-guided-ai-ux-answer-policy-integrity-trends.md)
- [Sprint 4F: Guided AI Security, Cost, and Abuse Hardening](./sprint-4f-guided-ai-security-cost-abuse-hardening.md)
