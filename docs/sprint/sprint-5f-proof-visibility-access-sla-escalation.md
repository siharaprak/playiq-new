# Sprint 5F — Proof Visibility, Access Verification, Signed Access Policy, Review SLA, and Upload Escalation

**Sprint Status:** Complete  
**Date:** 2026-05-27  
**Depends On:** Sprint 5A–5E (proof artifact upload, review, revision, validation, and alignment readiness)

---

## Summary

Sprint 5F defines the official policies and enforces access controls for proof artifact visibility, signed URL access, review SLA expectations, and upload error escalation during beta. It does NOT rebuild the proof artifact system — it audits, locks down, and fills gaps.

## What Changed

### 1. Parent Proof Visibility Policy
- **File:** `src/lib/proof-artifacts/visibility-policy.ts`
- Parents can see counts only (approved, pending, needs action).
- Parents can see approved artifact metadata (title only, if safely supported).
- Parents cannot download files, receive signed URLs, or see raw file metadata.
- Draft artifacts are hidden from parents.
- Review notes are hidden from parents during beta.
- UI uses supportive language, not punitive labels ("Needs Action" not "Revise").

### 2. Signed URL Access Policy (Critical Fix)
- **File:** `src/lib/proof-artifacts/signed-access-policy.ts`
- **File:** `src/app/api/proof-artifacts/[id]/download-url/route.ts`
- **CRITICAL:** Fixed API route that previously allowed linked parents to receive signed download URLs.
- Parents now receive 403 with clear beta message.
- Signed URL access controlled by `canActorRequestProofSignedUrl()`.
- Allowed: student owner, admin, teacher (for review).
- Blocked: parents (beta), unrelated students, unrelated parents.
- Signed URLs never stored, never logged, never shown as text.
- Expiry: 10 minutes (600 seconds).

### 3. Parent Data Query Lockdown
- **File:** `src/lib/data/proof-artifacts.ts`
- `getParentVisibleProofArtifacts()` locked down to safe fields only.
- No longer returns `SELECT *`.
- Returns only: `id, status, artifact_type, media_kind, module_id, created_at, submitted_at, reviewed_at`.
- JSDoc security warning added.

### 4. Beta Review SLA Policy
- **File:** `src/lib/proof-artifacts/review-sla-policy.ts`
- Target review: 2 business days.
- Warning: 3 calendar days.
- Overdue: 5 calendar days.
- Urgent: 7 calendar days.
- Uses calendar-day approximation (not business-day calculation).
- SLA is an expectation, NOT a guarantee.
- Color-coded SLA badges added to reviewer queue.

### 5. Upload Escalation Policy
- **File:** `src/lib/proof-artifacts/escalation-policy.ts`
- Classifies 11 issue types into 5 escalation paths.
- Student self-fix: unsupported type, too large, unsafe name.
- Retry: upload failed, preview failed.
- Teacher/admin review: corrupt file, repeated failure.
- Technical support: finalize failed, storage error, permission error.
- Future security: suspected malware (deferred).
- No new statuses created — uses existing revise/rejected flow.

### 6. UI Updates
- **ParentProofSummaryCard:** "Revise" → "Needs Action", added beta notice.
- **ProofArtifactReviewPanel:** Added broken upload guidance near review notes.
- **ProofArtifactReviewQueue:** Added SLA badges (Review Soon / Overdue / Urgent).

### 7. Verification
- **New script:** `scripts/verify-proof-access-matrix.ts`
- 25+ assertions covering role access, visibility, SLA, and escalation.
- **New script:** `npm run verify:proof-access-matrix`

## What Was NOT Changed
- Auth system
- Guided AI
- Gemini grading
- Gating behavior
- Student progress records
- Module action flows
- Discussion board
- Admin users page
- Skill nodes / data alignment
- Legacy tables (attempts/reports/proof_artifacts)
- Existing text proof flow
- Enforcement mode
- Runtime curriculum source

## Cross-References
- [Sprint 5 — Core System](./sprint-5-proof-artifact-system-storage-review-flow.md)
- [Sprint 5B — Security Hardening](./sprint-5b-proof-artifact-security-storage-review-hardening.md)
- [Sprint 5C — Path Validation & Review Tools](./sprint-5c-proof-artifact-path-validation-review-tools.md)
- [Sprint 5D — Lifecycle, Preview, Parent Summary](./sprint-5d-proof-lifecycle-preview-parent-summary.md)
- [Sprint 5E — Submission, Revision, Review Flow](./sprint-5e-proof-submission-revision-review-flow.md)
- [Runbook: Review SLA & Escalation](../runbooks/proof-artifact-review-sla-and-escalation.md)
