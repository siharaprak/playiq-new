# Sprint 4C — Guided AI Integrity Hardening

**Status:** Complete
**Depends on:** Sprint 4A (Guided AI Layer), Sprint 4B (Lesson Rescue)
**Date:** 2026-05-22

---

## Audit Results (Pre-Implementation)

| Dimension | Before Sprint 4C | After Sprint 4C |
|---|---|---|
| Minimum-effort gating | `input.length < 3` only | Per-mode depth gating: L2/L3 require effort proof |
| Hint ladder | Text in prompt only; Gemini picks level | Structured 3-level ladder with `hintLevel` in request/response |
| `hintLevel` in schema | ❌ | ✅ `1 \| 2 \| 3` in request + response |
| `retryCount` in schema | ❌ | ✅ `number` in request |
| `teachBackPrompt` in response | Only inside `LessonRescueData` | ✅ Standalone field on response |
| Panel local state | No hint/retry/teach-back tracking | ✅ Ephemeral `hintLevel`, `retryCount`, `teachBackActive` |
| Server-side depth enforcement | None (only basic checks) | ✅ Clamp + refuse + effortRequired |
| Quiz answer security | Answer in client payload (not rendered) | ✅ Stripped server-side before response |
| Raw data stored | None | None (unchanged) |

---

## Minimum-Effort Rules by Mode

| Mode | Level/Depth | Requirement | On Failure |
|---|---|---|---|
| **Hint** | Level 1 | Minimal context (≥3 chars) | Allowed |
| **Hint** | Level 2 | `studentAttempt ≥ 10` OR `selectedText ≥ 20` OR `message ≥ 20` | `effortRequired` returned immediately |
| **Hint** | Level 3 | `studentAttempt ≥ 15` | `effortRequired` returned immediately |
| **Explain** | Basic | Minimal context | Allowed |
| **Explain** | "just tell me the answer" | Pattern match | `refused` |
| **Quiz** | Generate questions | Minimal context | Allowed |
| **Quiz** | No attempt | No `studentAttempt` | `effortRequired` + answers stripped |
| **Quiz** | Weak attempt | `studentAttempt < 5` | `retryRequired` |
| **Coach** | Any | Minimal context | Allowed |
| **Lesson Rescue** | Any | `selectedText ≥ 20` OR `message ≥ 15` OR `studentAttempt ≥ 10` | `refused` |
| **Learn Your Way** | Any | Minimal context | Allowed |

---

## Hint Ladder Levels

| Level | Name | AI Output | Student Requirement | Teach-Back |
|---|---|---|---|---|
| 1 | **Nudge** | Guiding question, points to concept | None | No |
| 2 | **Direction** | Step/idea needed, partial structure | Effort proof (see above) | No (retry suggested) |
| 3 | **Micro-example** | Worked example (DIFFERENT scenario) | Stronger effort proof | **Required** |

- Level 3 ALWAYS requires teach-back. If Gemini omits `teachBackPrompt`, a safe fallback is used.
- No level ever reveals the final answer.

---

## Teach-Back / Retry Rules

- **Hint Level 2:** Response includes `retryRequired: true` with prompt to try.
- **Hint Level 3:** Response includes `teachBackRequired: true` with teach-back prompt.
- **Lesson Rescue:** Always includes `teachBackRequired: true`.
- **Quiz (no attempt):** `effortRequired: true` — answers not shown.
- **Quiz (weak attempt):** `retryRequired: true` — "try one more sentence."
- **Retry exhaustion:** `retryCount ≥ 2` + direct answer request → `refused` with redirect.
- Teach-back input appears as a **separate highlighted card** below the response.
- This is Guided AI teach-back, NOT the formal module teach-back grade.

---

## Client vs Server Responsibilities

### Client-Only (Ephemeral State — NOT in DB)
- `hintLevel` (1-3 per session)
- `retryCount` (per session)
- `teachBackActive` (boolean)
- `teachBackInput` (text)
- Hint level indicator UI
- Teach-back card rendering
- Effort field emphasis

### Server-Enforced
- Clamp `hintLevel` to 1-3 (reject values outside range)
- Clamp `retryCount` to 0-10
- Refuse deeper hints without effort (return `effortRequired` immediately, no silent downgrade)
- Strip `practiceItems[].answer` from all quiz responses
- Enforce teach-back for Level 3 hints
- Enforce quiz attempt before feedback
- Detect retry exhaustion (retryCount ≥ 2 + direct answer = refuse)
- All existing integrity rules (homework, direct answer, assessment, personal info)

### Not Stored in DB
- Raw prompts
- Raw Gemini responses
- Selected text
- Student attempts
- Teach-back input text
- Hint level or retry count

### Stored in DB (Bounded Signals Only)
- `fingerprint_signals`: Learn Your Way preferences (bounded enums)
- `fingerprint_signals`: Lesson Rescue signals (`rescue_used`, `rescue_confusion_type`)

---

## What Remains Deferred

- `event_type_enum` migration for `guided_ai_used` events
- Rate limiting on `/api/guided-ai`
- `/api/chat` retirement/securing
- `constants.ts` UUID mismatch fix
- `MODULE_NUM` bug in Module 1 actions
- Expansion beyond Module 1 & 2 for Guided AI panel

---

## Files Changed

| File | Change |
|---|---|
| `src/lib/guided-ai/types.ts` | Added `HintLevel`, `hintLevel`, `retryCount`, `previousIntegrityAction` to request; added 8 optional response fields |
| `src/lib/guided-ai/hint-ladder.ts` | **NEW** — 3-level hint ladder policy, effort checks, prompt instruction builder |
| `src/lib/guided-ai/integrity.ts` | Extended `applyModeIntegrityRules` with depth params; added effort gating, quiz effort, retry exhaustion |
| `src/lib/guided-ai/prompts.ts` | Hint prompt references dynamic level; user prompt includes `=== HINT LEVEL ===` section |
| `src/lib/guided-ai/run-guided-mode.ts` | Server-side clamp; effort metadata in refusals; quiz answer stripping; L3 teach-back enforcement |
| `src/components/guided-ai/GuidedAIPanel.tsx` | Ephemeral hint/retry/teach-back state; hint level indicator; teach-back card; next-hint button |
| `src/components/guided-ai/GuidedAiResponse.tsx` | Hint level badge; effort prompt card; retry prompt card |
| `docs/sprint/sprint-4c-guided-ai-integrity-hardening.md` | **NEW** — this document |

---

## QA Checklist

- [ ] Minimum-effort gates block deeper help without attempt
- [ ] Hint Level 1 works with minimal context
- [ ] Hint Level 2 requires effort
- [ ] Hint Level 3 requires stronger effort
- [ ] Hint Mode never reveals final answer
- [ ] Level 3 hint requires teach-back
- [ ] Quiz answers are not present in API payload before attempt
- [ ] Weak quiz attempt triggers retry prompt
- [ ] Lesson Rescue still works
- [ ] Direct answer request refused
- [ ] Homework outsourcing refused
- [ ] No raw prompts/responses/attempts stored
- [ ] Explain/Coach/Learn Your Way still work
- [ ] Existing formal teach-back grading still works
- [ ] Existing boss battle grading still works
- [ ] Existing module gating still works
- [ ] Build and typecheck pass
