# Sprint 8 Beta Blocker Walkthrough

This document registers and verifies the status of all sprint 8 beta blockers.

| ID | Category | Title | Severity | Status | Description |
|---|---|---|---|---|---|
| **SEC-01** | critical_security | Admin RBAC Routing Enforcement | blocker | verified | Ensure student/parent roles are strictly blocked from /admin pages and server actions. |
| **SEC-02** | critical_security | Service Role Key Protection | blocker | verified | Service role key must not be imported in client components. |
| **BLD-01** | build_release | Strict Type Compilation | blocker | verified | Next.js build and TypeScript type-check must compile cleanly. |
| **STU-01** | student_journey | 14-step Student Journey Map | blocker | verified | Map and verify the E2E user steps from account creation to assistant launch. |
| **ADM-01** | admin_ops | Admin Support Resolved Schema Drift | blocker | verified | Avoid crashes during ticket resolution when resolved_at or metadata columns are missing. |
| **ADM-02** | admin_ops | Support Issues Migration Reproducibility | blocker | verified | Ensure database migrations align with DB column schema and resolved_at/metadata exist. |
| **DAT-01** | data_integrity | Curriculum Constants and DB Module Parity | blocker | verified | Verify static constants matches runtime curriculum module and DB IDs. |
| **PAR-01** | parent_visibility | Parent Content Redaction | blocker | verified | Enforce parent count-only views (no raw instructions or signed URLs exposed). |
| **SAF-01** | ai_safety | Assistant Sandbox Rate Limiting | blocker | verified | Enforce hourly and 10-minute rate limits before Gemini inference. Fail closed. |
| **SAF-02** | ai_safety | Discussion Moderation Filters | blocker | verified | Verify automated filtering, reporting, and moderation of offensive content in discussion board. |
| **STR-01** | storage_access | Proof Upload Storage Boundaries | blocker | verified | Verify private bucket permissions and storage path validation rules. |
| **ENR-01** | payment_enrollment | Duplicate Enrollment Prevention | blocker | verified | Enforce database-level unique constraints and manual check flow to prevent duplicate student course enrollments. |
