# Sprint 4E — Guided AI UX Rules, Answer Release Policy, AI Usage Patterns, Parent Integrity Trends

This sprint defines the static policies and usage taxonomies for Guided AI, converting implicit behaviors into formal, readable policies. 
It also introduces the parent-safe "Integrity Trends" reporting mechanism without touching the database schema or the existing UI.

## What Was Built

### 1. UX Policy (`src/lib/guided-ai/ux-policy.ts`)
Formalized the UX differences between the 7 Guided AI modes.
Provides helpers for parent-safe and student-safe descriptions.
- **Explain**: Full conceptual depth, check question required.
- **Hint**: L1-L3 depth gating, never reveals final answer.
- **Coach**: Strategy and planning, no direct task solving.
- **Quiz**: Answer withheld until attempt.
- **Lesson Rescue**: Needs confusion input, diagnoses gap.

### 2. Answer Release Policy (`src/lib/guided-ai/answer-release-policy.ts`)
Centralizes the decision of when answers/explanations can be given.
- **Blocked**: Direct homework answers, assessment answers, solving the exact problem, unsafe content.
- **Allowed**: Feedback after student attempt, conceptual explanation, micro-example in a different scenario.
No circular dependencies with `integrity.ts`.

### 3. Event Taxonomy (`src/lib/events/guided-ai-event-policy.ts`)
Classifies the raw `events_log` enum into 12 behavioral usage patterns:
`healthy_learning_use`, `hint_seeking`, `repeated_deeper_help`, `direct_answer_seeking`, `homework_outsourcing`, `assessment_answer_seeking`, `lesson_rescue_use`, `quiz_practice_use`, `learn_your_way_personalization`, `low_effort_loop`, `teachback_followthrough`, `unsafe_request`.

Implements `getSafeGuidedAiEventMetadata` which enforces a strict whitelist of fields to ensure NO raw prompts, outputs, or PII ever reach the database metadata.

### 4. Integrity Trends (`src/lib/data/integrity-trends.ts`)
A server-only module that produces a parent-friendly summary of a student's recent AI use.
- **Bounded queries**: Scans the last 14 days by default.
- **Parent Access**: Uses `parent_child_links` securely.
- **Thresholds**: Classifies into `strong`, `stable`, `needs_support`, `watch`.
- **Messaging**: Provides supportive parent language, never punitive.

## What Was Intentionally Left Untouched
- Auth layer
- `/api/chat`
- Existing Gemini grading (`src/lib/gemini.ts`)
- Existing gating behavior (`src/lib/gating.ts`)
- Student progress records
- Module action flows
- Discussion board
- Parent dashboard UI
- Admin users page
- Skill nodes / data alignment issues
- Legacy tables (`attempts`, `reports`, `proof_artifacts`)
- The `event_type_enum` database schema
- Live Guided AI runtime behaviors

## Audit Results Checklist
- [x] UX Policy returns definitions for all guided AI modes
- [x] Answer release blocks direct homework/assessment answer requests
- [x] Event policy maps all 9 Guided AI event types
- [x] Integrity trend helper uses only events_log
- [x] Parent trend helper filters through parent_child_links
- [x] No raw prompt/response/selectedText/studentAttempt exposed
- [x] Existing Guided AI modes still work
- [x] Existing event logging still works
- [x] Existing formal grading still works
- [x] Existing gating still works
- [x] Build and typecheck pass without errors
