# Sprint 4B — Lesson Rescue (Full Beta)

**Status:** Implemented
**Date:** 2026-05-21
**Depends on:** Sprint 4A — Guided AI Layer + Integrity Controls

---

## Overview

Sprint 4B activates Lesson Rescue as a full guided beta workflow within the existing Sprint 4A Guided AI architecture. It diagnoses student confusion in pasted or selected lesson excerpts and guides them back to understanding — without giving direct answers.

## What Changed from Sprint 4A

| Before (4A) | After (4B) |
|---|---|
| `lesson_rescue_stub` mode, scaffold status, disabled in UI | `lesson_rescue` mode, beta status, enabled with BETA badge |
| No structured rescue output | `lessonRescue` field with confusionType, gapDiagnosis, rescueExplanation, checkQuestion, teachBackPrompt, nextStep |
| No Lesson Rescue-specific integrity rules | Minimum input requirement (selectedText 20+ OR message 15+ OR studentAttempt 10+) |
| No rescue fingerprint signals | `rescue_used` and `rescue_confusion_type` bounded signals |
| No selectedText input in UI | Dedicated "Paste the confusing sentence" textarea |

## Architecture

### Files Modified

| File | Changes |
|---|---|
| `src/lib/guided-ai/types.ts` | Added `lesson_rescue` to mode enum, `ConfusionType` enum, `LessonRescueDataSchema`, `lessonRescue` field on response |
| `src/lib/guided-ai/modes.ts` | Added `lesson_rescue` mode config with beta status |
| `src/lib/guided-ai/prompts.ts` | Added full `lesson_rescue` confusion diagnostician prompt |
| `src/lib/guided-ai/integrity.ts` | Added `lesson_rescue` to direct-answer checks, added `enforceLessonRescueMinimumInput`, extended `applyModeIntegrityRules` signature |
| `src/lib/guided-ai/run-guided-mode.ts` | Added Lesson Rescue output parsing, rescue-specific fallback, bounded signal writes |
| `src/components/guided-ai/ModeSelector.tsx` | Changed stub entry to `lesson_rescue` with beta badge |
| `src/components/guided-ai/GuidedAIPanel.tsx` | Added selectedText textarea, lesson_rescue mode handling |
| `src/components/guided-ai/GuidedAiResponse.tsx` | Added `LessonRescueCard` component for structured rescue rendering |

### Files NOT Modified

- `src/app/api/guided-ai/route.ts` — no changes needed (auto-picks up new mode via `isModeAvailable`)
- `src/lib/guided-ai/context.ts` — no changes needed (selectedText already supported)
- All existing modes (explain, hint, quiz, coach, learn_your_way) — untouched
- `lesson_rescue_stub` mode — preserved for backward compat

## Confusion Types (Bounded Enum)

| Value | Meaning |
|---|---|
| `vocabulary` | Student doesn't know a key term |
| `missing_prerequisite` | Missing foundational knowledge |
| `too_abstract` | Needs a concrete example |
| `procedure` | Doesn't understand the steps/process |
| `attention` | Skimmed or misread a key detail |
| `confidence` | Actually understands but doubts themselves |
| `unknown` | Cannot determine from input |

## Input Requirements

Lesson Rescue requires at least ONE of:
- `selectedText` with 20+ characters
- `message` with 15+ characters
- `studentAttempt` with 10+ characters

If none are provided, a safe refusal asks the student to provide more detail.

## Output Contract

Every successful Lesson Rescue response includes:
- `confusionType` — bounded enum (required)
- `gapDiagnosis` — what the student is likely missing (required)
- `rescueExplanation` — plain language explanation (required)
- `microExample` — worked example using a DIFFERENT scenario (optional)
- `checkQuestion` — verification question (required)
- `teachBackPrompt` — ask student to explain in their own words (required)
- `nextStep` — concrete next action (required)

## Integrity Rules

1. Direct answer requests → refused with rescue support message
2. Homework outsourcing → refused with concept explanation redirect
3. Assessment answer requests → refused
4. Unsafe personal information → refused
5. Insufficient input → asks for confusing sentence
6. Micro-examples must NOT solve the student's exact problem

## What Is Stored

- `fingerprint_signals.signal_type = 'rescue_used'` with value `module_N` or `true`
- `fingerprint_signals.signal_type = 'rescue_confusion_type'` with bounded enum value

## What Is NOT Stored

- Raw selectedText
- Raw student message
- Raw AI response
- Raw prompts
- Conversation history

## Known Limitations

- No event_type_enum extension (pending migration)
- No rate limiting (pending infrastructure)
- Confusion type detection relies on Gemini's judgment
- No persistence of rescue sessions across page reloads

## Future Improvements

- Extend event_type_enum with `lesson_rescue_used`
- Add rescue analytics dashboard for teachers
- Integrate with mastery framework for adaptive rescue
- Add browser text-selection support for easier excerpt pasting
