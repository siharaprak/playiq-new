# Sprint 4F — Guided AI Security, Cost, and Abuse Hardening

## Overview
This sprint hardens the Guided AI system implemented in Sprints 4A-4E. The primary goals were to retire legacy AI routes, enforce rate limits before expensive Gemini API calls, establish strict token boundaries, ensure PII and raw prompts are never stored, and verify parent integrity trends.

## Pre-Flight Audit Summary
- **`/api/chat`**: Found unauthenticated and fully exposed. Retired and returned `410 Gone`. `<ChatBot />` removed from global layout.
- **`/api/guided-ai`**: Required rate limiting, strict output token limits, and a timeout mechanism.
- **Metadata Logging**: Found ad-hoc logging which risked leaking raw prompts. Addressed via strict allowlist verifier.

## Rate Limiting Policy
Rate limits are enforced **before** invoking Gemini. We use the existing `events_log` table to count recent Guided AI events.
- **Global**: 20 requests per student per hour
- **Burst**: 8 requests per 10 minutes
- **Lesson Rescue**: 5 requests per hour
- **Quiz Practice**: 10 requests per hour
- **Refusals/Off-Topic**: AI pauses after 10 refused or unsafe requests per hour.

*Fail-safe:* If the database query for rate-limiting fails, the system safely blocks requests to prevent uncontrolled API costs.

## Guardrails
- `maxOutputTokens: 1000` applied to all Gemini calls.
- **Timeout Wrapper:** A 15-second `Promise.race` timeout ensures the API doesn't hang indefinitely.

## Metadata Safety (Allowlist)
The `sanitizeAiEventMetadata` utility strictly enforces an allowlist.
**Allowed fields:** `mode, moduleNumber, nodeId, pageType, hintLevel, retryCount, refusalReason, routingTarget, effortRequired, teachBackRequired, confusionType, noPromptStored, noResponseStored, source, noFileContentStoredInEvent`.

All other fields (e.g., `message`, `selectedText`, `aiResponse`) are stripped before logging.

## QA & Adversarial Testing
Three automated QA scripts were added:
- `npm run verify:ai-events`: Scans `events_log` to confirm no forbidden keys exist.
- `npm run verify:integrity-trends`: Verifies parent access control is strictly bounded by `parent_child_links`.
- `npm run qa:guided-ai`: Smoke-tests effort gating and safety classification logic.
