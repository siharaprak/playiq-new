# Sprint 5 — Proof Artifact System + Storage + Review Flow

## Overview
Built the beta proof artifact system to allow students to upload photos, documents, and media files as supplemental proof of their learning. The system securely stores files in Supabase Storage and provides an admin/teacher review queue, all while preserving the existing text-based proof artifact flows.

## Core Decisions & Architecture

1. **Canonical Model:** The `proof_artifact_submissions` table is the canonical store. Legacy table `proof_artifacts` is completely dead and avoided. We added 15 new metadata columns to the submissions table to support files without breaking existing JSONB text answers.
2. **Artifact Types:** We extended `artifact_type_enum` with exactly one new value: `supplemental_proof`. The specific file type (photo, document, audio, video) is tracked in a new `media_kind` column. Existing `study_rules` and `error_review` types are untouched.
3. **State Machine:** Enforced strictly on the server: `draft` -> `submitted` -> `under_review` -> `approved` / `rejected` / `revise`. Clients cannot arbitrarily set review fields or bypass states.
4. **Storage Security:** The `proof-artifacts` bucket is completely private. There is no public read access and no public URL display. All uploads and downloads use time-bound Signed URLs (10 min expiry) mediated by server APIs.

## Storage Paths
Paths are strictly sanitized on the server to prevent directory traversal and bucket manipulation:
`student/{studentId}/module/{moduleId}/artifact/{artifactId}/{safeFileName}`

## Constraints & Limits
- **Photo:** JPEG, PNG, WebP (Max 10 MB)
- **Document:** PDF (Max 20 MB)
- **Audio:** MP3, MP4, WAV, WebM (Max 50 MB)
- **Video:** MP4, WebM, Quicktime (Max 100 MB)

## UX Flows

**Student Flow:**
1. Student navigates to Module 1 or 2 Proof Artifacts page.
2. Below the existing text form, the new Uploader component is available.
3. Student selects media kind, picks a file, enters a title, and clicks "Submit".
4. Client requests an upload slot (`/api/proof-artifacts/upload-slot`).
5. Server validates input and creates a `draft` row, returning a signed upload URL.
6. Client PUTs the file directly to Supabase Storage (avoiding Next.js body limits).
7. Client calls `/api/proof-artifacts/[id]/finalize`.
8. Server verifies storage, moves to `submitted`, and logs `proof_submitted`.

**Reviewer Flow:**
1. Admin (or Teacher) navigates to `/admin/proof-artifacts`.
2. The UI lists all `submitted` and `under_review` artifacts.
3. Admin selects an artifact, downloading it via a secure signed URL.
4. Admin can optionally add review notes and mark it as `approved`, `rejected`, or `revise`.
5. Server logs `proof_reviewed` event.

## Parent Visibility Policy
Parents can only access artifacts for linked children via `parent_child_links`. By default, they see status badges for approved and pending items. Downloading a file requires the same secure signed URL path, which enforces the parent-child linkage server-side.

## Event Logging
We reused the existing Sprint 3 events:
- `proof_submitted`
- `proof_reviewed`

Only safe metadata is logged: `artifactId`, `moduleId`, `artifactType`, `mediaKind`, `status`, `fileSizeBytes`, `mimeType`, `noFileContentStoredInEvent: true`. Raw content, file URLs, and private review notes are stripped.

## What Was Left Untouched
- **Auth:** No changes.
- **Guided AI:** Untouched. No edits to Sprint 4 files.
- **Gemini Grading:** Untouched.
- **Gating Behavior:** Untouched.
- **Module Actions:** The existing `actions.ts` files were unchanged; we appended our UI components to the page level.
- **Discussion Board:** Untouched.
- **Skill Nodes / Data Alignment:** Not addressed in this sprint.
- **Legacy Tables:** No writes to `proof_artifacts`, `attempts`, or `reports`.

## QA Checklist
- [x] Student can upload photo proof
- [x] Student can upload document proof
- [x] Student can upload recording proof
- [x] Oversized file rejected
- [x] Unsupported MIME rejected
- [x] Artifact metadata row created
- [x] Artifact state moves draft -> submitted
- [x] Reviewer can move submitted -> under_review
- [x] Reviewer can approve
- [x] Reviewer can reject
- [x] Reviewer can request revise
- [x] Student sees review notes
- [x] Parent visibility follows policy
- [x] Signed download URL works for authorized viewer
- [x] Public direct access is blocked
- [x] `proof_submitted` event logs
- [x] `proof_reviewed` event logs
- [x] No service role key exposed client-side
- [x] No legacy `proof_artifacts` writes

## Cross-References
- [Sprint 5F — Proof Visibility, Access, SLA, Escalation](./sprint-5f-proof-visibility-access-sla-escalation.md)
