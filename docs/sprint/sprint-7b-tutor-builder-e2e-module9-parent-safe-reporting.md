# Sprint 7B: Tutor Builder End-to-End, Rate Limiting, and Parent Safety

## Overview
Sprint 7B completes the student tutor builder gaps by introducing robust server-side rate limits, policy bypass validation, version-aware file detaching, read-only course milestone integration, and parent-safe status reporting.

## Key Deliverables

### 1. Hardening & Custom Instructions Limits
* Enforces `max(3000)` length validation on `instruction_set` in both the database/Zod schemas and the UI editor.
* Includes a visual character counter in the React editor component.
* Implements server-side policy bypass validation to block obvious evasion phrases case-insensitively:
  * `do my homework`
  * `give me answers`
  * `ignore PlayIQ rules`
  * `reveal quiz answers`
  * `bypass effort`

### 2. Server-Side Rate Limiting
Uses `events_log` table counts to rate-limit testing before any AI/Gemini calls are initiated (failing closed if database state cannot be checked):
* **Limits**:
  * 10 tutor tests per hour.
  * 5 tutor tests per 10 minutes (burst protection).
  * 5 refused/unsafe attempts per hour.
* **Logging**:
  * Logs attempts under the existing `tutor_profile_updated` event type using specific metadata: `{ action: 'tutor_test_attempt' }` and `{ action: 'tutor_test_refused' }`.
  * Guarantees zero storage of prompts, responses, or instruction text.

### 3. Safe Knowledge File Detaching
Harden `deleteKnowledgeFile` storage action:
* Physically deletes files if they are not referenced in any tutor versions.
* If a previous `tutor_version` snapshot depends on the file ID, the file is **detached** (setting `tutor_profile_id = null`) to maintain historic version integrity while removing it from the student's active builder file list.

### 4. Read-Only Course Milestone Linkage (`tutor-course-link.ts`)
* Connects student tutor builder progress to Course 1 Module 9.
* Read-only evaluation of whether a student has completed their tutor profile, version, knowledge file attachment, testing sandbox, and activation.
* Explicitly guarantees no mutations to `student_node_progress` or changes to grading gates.

### 5. Parent-Safe Reporting (`tutor-reporting.ts`)
* Provides a parent-safe progress summary.
* Access control is strictly enforced via `parent_child_links`.
* Whitelists parent-visible fields (`status`, `completionPercent`, `hasProfile`, `hasVersion`, `hasKnowledgeFile`, `hasTestedTutor`, `betaComplete`, `lastUpdatedAt`, `milestoneLabel`).
* Strictly blocks parents from accessing raw instructions, version history, file names, paths, signed URLs, test prompts, or tutor responses.
* Leaves parent dashboard cards unchanged.
