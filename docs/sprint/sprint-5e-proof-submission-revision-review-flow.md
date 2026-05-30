# Sprint 5E — Proof Artifact Submission, Revision, and Review Flow Design

## Overview
This sprint defines the official UI/UX flows and enforcement policies for the supplemental proof artifact system. It introduces `flow-policy.ts` to centralize behavior, fixes UI omissions regarding revisions, and tightens review note requirements.

## Audit Results
Before this sprint, the system had the following gaps:
- **Resubmissions:** Students could not natively resubmit a `revise` artifact into the *same* DB row. They had to upload a new artifact, causing clutter.
- **Review Notes:** Review notes were completely optional for all statuses.
- **Rejected Finality:** The state machine allowed `rejected -> submitted` natively, but no UI supported it, making the policy ambiguous.

## Official Student Submission Flow
1. **Upload:** Student selects media kind and file, adds title/description, and submits.
2. **Draft:** Server creates a draft row and signs an upload URL.
3. **Storage:** Client uploads directly to Supabase storage.
4. **Finalize:** Client calls `/finalize` to set status to `submitted`.
5. **Review:** Artifact is listed with "Waiting for review" messaging.

## Official Revision Request Flow
1. **Reviewer Action:** Reviewer changes status to `revise`. Review notes are strictly **required**.
2. **Student View:** Student sees a "Needs Revision" badge, the reviewer's notes, and a "Resubmit Proof" CTA.
3. **Resubmission:** Clicking Resubmit opens the uploader with `resubmitArtifactId` passed.
4. **Upload Slot:** The server checks that the artifact belongs to the user and is in `revise` state. It generates a new signed URL but does not create a new draft row.
5. **Finalize:** The server merges metadata (tracking `revision_count` and `last_resubmitted_at`), clears `review_notes` and `reviewed_at`, and returns the artifact to `submitted`.

## Official Admin Review Flow
1. **Queue:** Reviewers view artifacts in the Review Queue, which now filters across all valid statuses.
2. **Claim:** Reviewer can mark an artifact "Under Review".
3. **Review:** Reviewer evaluates the file preview.
4. **Approve:** Reviewer can approve (notes optional).
5. **Revise/Reject:** Reviewer can request revisions or reject. **Notes are required.** The UI blocks submission until notes are provided.
6. **Rejected Finality:** Rejected artifacts are final for the beta. Students cannot resubmit them and are told to upload a new artifact if requested by their teacher.

## State Machine Policy Enforcement
- `rejected -> submitted` is explicitly blocked for students.
- `ProofArtifactReviewInputSchema` uses `.superRefine` to enforce the review note requirement for `revise` and `rejected`.

## What Was Intentionally Left Untouched
- Existing Text Proof flow (`study_rules`, `error_review`).
- Legacy `proof_artifacts` table.
- Guided AI and Gemini grading.
- Parent Dashboard (except via existing `getParentProofSummary` count boundaries).
- Auth schemas and module logic.

## QA Checklist
- [x] Student submission flow defined
- [x] Revision request flow defined
- [x] Admin review flow defined
- [x] Student sees correct status copy
- [x] Revise requires reviewer notes
- [x] Reject requires reviewer notes
- [x] Student can resubmit from revise
- [x] Rejected artifact is final
- [x] Reviewer buttons obey state machine
- [x] Student cannot review
- [x] Parent cannot review
- [x] No email shown
- [x] No storage path shown
- [x] No signed URL shown as text
- [x] `proof_reviewed` metadata safe
- [x] No writes to legacy `proof_artifacts`
- [x] Existing text proof flow still works
- [x] Build/typecheck pass

## Cross-References
- [Sprint 5F — Proof Visibility, Access, SLA, Escalation](./sprint-5f-proof-visibility-access-sla-escalation.md)
