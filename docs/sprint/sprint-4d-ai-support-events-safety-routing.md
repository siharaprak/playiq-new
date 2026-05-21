# Sprint 4D — Guided AI Support Events + Unsafe Assistance Routing

**Status:** Complete
**Date:** 2026-05-22
**Depends on:** Sprint 4A (foundation), Sprint 4B (lesson rescue), Sprint 4C (integrity hardening)

---

## Overview

Sprint 4D adds two capabilities to the Guided AI layer:

1. **Event logging** — All Guided AI interactions are now logged to `events_log` with safe-only metadata (no raw prompts, responses, selectedText, or studentAttempt stored).

2. **Unsafe assistance routing** — Formal classification and routing of unsafe requests (direct answer seeking, homework outsourcing, assessment answer requests, personal info, self-harm/crisis, prohibited content).

---

## Event Types Added

| Enum Value | When Logged | Key Metadata |
|---|---|---|
| `guided_ai_used` | Every successful Guided AI response | mode, moduleNumber, nodeId, pageType |
| `guided_ai_refused` | Integrity or safety refusal | refusalReason, routingTarget |
| `guided_ai_effort_required` | Deeper help blocked due to insufficient effort | effortRequired, hintLevel |
| `guided_ai_hint_ladder_step` | Hint mode usage | hintLevel (1, 2, or 3) |
| `guided_ai_quiz_practice_generated` | Quiz practice items generated | mode (no questions/answers logged) |
| `guided_ai_teachback_required` | Teach-back prompt triggered | teachBackRequired, hintLevel |
| `lesson_rescue_used` | Lesson Rescue mode used | confusionType (bounded enum) |
| `learn_your_way_updated` | Learn Your Way preference signals written | mode |
| `unsafe_assistance_routed` | Unsafe request routed to safe alternative | refusalReason (classification), routingTarget |

---

## Safe Metadata Policy

### Allowed in event metadata
- `mode`, `moduleNumber`, `nodeId`, `pageType`
- `integrityAction`, `refusalReason` (category only)
- `routingTarget`, `hintLevel`, `retryCount`
- `effortRequired`, `teachBackRequired`, `confusionType`
- `source: "guided_ai"`, `noPromptStored: true`, `noResponseStored: true`

### Forbidden — never logged
- Raw message / prompt
- Raw selectedText
- Raw studentAttempt
- Raw AI response
- Full system prompt
- Email, full name, personal info

---

## Unsafe Assistance Classification + Routing

### Classifications
| Classification | Detection | Route | Behavior |
|---|---|---|---|
| `self_harm_or_crisis` | Reuses `blocked-terms.ts` self_harm_risk patterns | `blocked` | Supportive message + crisis resources. Never disciplinary. |
| `prohibited_content` | Reuses `blocked-terms.ts` profanity/slurs/sexual/bullying | `blocked` | Refocus on learning. |
| `unsafe_personal_info` | Email/phone/password patterns | `blocked` | Safety message. |
| `direct_answer_request` | Keyword pattern match | `hint` | Redirect to hint mode. |
| `homework_outsourcing` | Keyword pattern match | `coach` | Redirect to coach mode. |
| `assessment_answer_request` | Keyword pattern match | `hint` | Redirect to practice. |
| `low_effort_deeper_help` | Effort gating logic | `hint` | Prompt for attempt. |

### Self-Harm / Crisis Handling
- Uses the same safe message from `src/lib/server/blocked-terms.ts`: `SELF_HARM_SAFE_MESSAGE`
- Directs student to trusted adult, school counselor, or Crisis Text Line (741741)
- **Never** sounds like discipline
- **Never** provides methods, instructions, or dangerous details
- Logs only the category `self_harm_or_crisis` — never raw text

### Event Logging Rules
- Refusals log `guided_ai_refused`
- Unsafe routing additionally logs `unsafe_assistance_routed` (only when routing actually occurs)
- Normal safe requests do NOT generate refusal/routing events
- All logging is fire-and-forget — failures never break the student experience

---

## Files Changed

| File | Change |
|---|---|
| `supabase/migrations/20260522000000_sprint4_guided_ai_support_events.sql` | NEW — 9 enum values |
| `src/lib/events/types.ts` | MODIFIED — Added 9 event types, guided_ai target, GuidedAiSupportEventInputSchema |
| `src/lib/events/learning-events.ts` | MODIFIED — Added 7 event helper functions |
| `src/lib/guided-ai/safety-routing.ts` | NEW — Classification, routing, response builders |
| `src/lib/guided-ai/types.ts` | MODIFIED — Added SafetyRoute to response schema |
| `src/lib/guided-ai/run-guided-mode.ts` | MODIFIED — Safety routing pre-check + event logging at 9 points |
| `src/components/guided-ai/GuidedAiResponse.tsx` | MODIFIED — Safety route card UI |
| `docs/sprint/sprint-4d-ai-support-events-safety-routing.md` | NEW — This document |
| `docs/sprint/sprint-4-guided-ai-layer-integrity-controls.md` | MODIFIED — Cross-reference |

---

## What Was Left Untouched

- `/api/chat` (legacy tech debt)
- `src/lib/gemini.ts` (formal grading)
- `src/lib/gating.ts` (module progression)
- Module `actions.ts` files
- Student progress tables
- Discussion board
- Parent/admin dashboards
- Existing Guided AI integrity rules (extended, not replaced)
- `skill_nodes` / data alignment issues
- Legacy tables: `attempts`, `reports`, `proof_artifacts`

---

## QA Checklist

- [ ] Normal Guided AI use logs `guided_ai_used`
- [ ] Hint use logs `guided_ai_hint_ladder_step`
- [ ] Level 3 hint logs `guided_ai_teachback_required`
- [ ] Quiz practice logs `guided_ai_quiz_practice_generated`
- [ ] Learn Your Way logs `learn_your_way_updated`
- [ ] Lesson Rescue logs `lesson_rescue_used`
- [ ] Direct answer request refused safely
- [ ] Direct answer request logs `guided_ai_refused`
- [ ] Unsafe route logs `unsafe_assistance_routed`
- [ ] Homework outsourcing refused safely
- [ ] Assessment answer request refused safely
- [ ] Low-effort deeper help logs `guided_ai_effort_required`
- [ ] No raw prompts/responses/attempts/selectedText in event metadata
- [ ] Existing modes still work
- [ ] Existing formal grading still works
- [ ] Existing gating still works
- [ ] Build/typecheck pass

---

## Known Limitations

- **Rate limiting**: Not implemented. Relies on Gemini API rate limits.
- **Migration**: Must be applied via Supabase SQL Editor (no local Supabase CLI).
- **Analytics dashboard**: No event analytics UI yet — events are queryable via SQL.
- **Modules 3-10**: Guided AI not expanded beyond Module 1-2.
- **`/api/chat`**: Still exists as legacy tech debt.

## Future Work

- Rate limiting for /api/guided-ai
- `/api/chat` retirement or auth hardening
- Event analytics dashboard for teachers/admins
- Guided AI expansion to Modules 3-10
- ML-based classification (replace keyword patterns)
