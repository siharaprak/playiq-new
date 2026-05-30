# Sprint 5D — Proof Artifact Lifecycle, Review Preview UX, Malware Scanning Plan, and Parent Proof Summary

## Overview
This sprint focused on rounding out the administrative and product boundaries of the proof artifact system. We implemented a secure, isolated cleanup cron route, formalized the malware scanning plan, enhanced the reviewer experience with safe inline previews, and exposed a highly-restricted summary card to parents without leaking PII or actual files.

## 1. Storage Lifecycle Cleanup Schedule
- **Internal Cron Endpoint**: Added `POST /api/internal/proof-artifacts/cleanup`.
- **Security Boundaries**: Protected strictly by `PROOF_CLEANUP_CRON_SECRET` using Bearer auth. Defaults to `dryRun=true` and `olderThanHours=24`.
- **Safety Floor**: The cleanup helper explicitly enforces a 24-hour minimum. It is impossible to delete artifacts younger than 24 hours.
- **Runbook**: Created `docs/runbooks/proof-artifact-cleanup-schedule.md` to document Cloud Scheduler configuration.

## 2. Malware/Virus Scanning Plan
- **Beta Truthfulness**: Added clear warnings to the review UI stating that files are type-checked and privately stored, but malware scanning is not active yet.
- **Plan Documented**: Created `docs/runbooks/proof-artifact-malware-scanning-plan.md` defining future Cloud Run + ClamAV integration or Third-Party API usage.
- **Statuses Formalized**: Exported strict status types (`not_scanned`, `clean`, `suspicious`, etc.) into `malware-scanning-policy.ts`.

## 3. Reviewer Preview UX
- **Safe Viewer Component**: Built `ProofArtifactPreviewViewer` which generates signed URLs under the hood but never exposes them as raw text to the reviewer.
- **Media-Specific Handling**:
  - `photo`: Inline `<img />` tag.
  - `audio`: Inline `<audio controls />`.
  - `video`: Inline `<video controls />`.
  - `application/pdf`: Inline `<object />` with a fallback link.
  - `DOC/DOCX`: Safe download button only, preventing unintended browser execution or plugin vulnerabilities.

## 4. Parent Visibility & Summary
- **Visibility Policy Defined**: Parents can only see summary counts and metadata for approved artifacts. They cannot access files or signed URLs yet.
- **Data Helper**: Implemented `getParentProofSummary` which strictly joins on `parent_child_links`.
- **Summary Card**: Integrated `ParentProofSummaryCard` into the parent dashboard showing total approved, pending, and needs revision counts, along with the latest activity timestamps.

## What Was Untouched
- Guided AI prompts and infrastructure
- Gemini grading
- Module actions and node transitions
- Student progress records
- Discussion board features
- Admin users page
- Legacy `proof_artifacts` table (which remains deprecated)
- Existing text proof flow

## Cross-References
- [Sprint 5F — Proof Visibility, Access, SLA, Escalation](./sprint-5f-proof-visibility-access-sla-escalation.md)
