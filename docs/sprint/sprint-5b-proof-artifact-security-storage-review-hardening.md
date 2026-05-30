# Sprint 5B — Proof Artifact Security, Storage, Review, and Cleanup Hardening

## Overview
This sprint hardens the Proof Artifact System introduced in Sprint 5A. The focus is strictly on the boundaries: storage privacy, endpoint rate limits, file validation, state machine integrity, and draft cleanup. We adhered to the strict rules of avoiding legacy table usage and skipping any changes to Guided AI or core module mechanics.

## Pre-Flight Audit Results
- **Storage Bucket Privacy**: Private by default (via migration).
- **Signed URL Flows**: Complete. Public read is disabled.
- **Service Role Leakage**: Safe. Restricted to server-side data fetches.
- **Rate Limiting**: Added in this sprint.
- **MIME/File Validation**: Extended to block executables and double extensions.
- **Cleanup**: Implemented a dry-run default draft cleanup system.

## Rate Limiting Policy
- `upload-slot`: 10 per hour
- `finalize`: 20 per hour
- `download-url`: 30 per hour
- `review`: 60 per hour

> **Note**: For `upload-slot` and `download-url`, rate limiting is currently performed via an **in-memory LRU cache**. This is a temporary beta guard to prevent `events_log` database bloat. It is **not production-grade**, resets on deployments, and must be replaced with Redis/Upstash/Edge rate limiting at scale.

## File Validation & MIME Policy
We strictly block:
- Executable extensions (`.exe`, `.bat`, `.cmd`, `.js`, `.scr`, `.vbs`, `.jar`, `.ps1`, `.msi`, `.sh`, `.php`, `.py`)
- Double extensions (e.g., `file.pdf.exe`)
- Empty filenames
- Basic path traversal characters (`/`, `\`)

Supported Document MIMEs:
- `application/pdf`
- `application/msword`
- `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

## Orphan Draft Cleanup Policy
- Script: `cleanup:proof-drafts`
- Defaults to a **dry-run** to prevent accidental data loss.
- Only targets `status = 'draft'` older than 24 hours.
- Requires `--execute` flag for live deletion of DB rows and storage objects.
- Submitted, under_review, approved, revise, and rejected artifacts are strictly ignored.

## Event Metadata Hardening
The `logProofEvent` helper is hardened to actively strip the following keys if passed:
- `signedUrl`
- `publicUrl`
- `storagePath`
- `fileUrl`
- `fileContent`
- `email`
- `fullName`
- `reviewNotes`

## State Machine Hardening
- Students are confined to `draft` -> `submitted` transitions. They cannot authorize review status modifications.
- Reviewers (Admins/Teachers) are the only roles capable of applying `under_review`, `approved`, `rejected`, or `revise`.

## Parent Visibility
- Asserts strict reliance on `parent_child_links`. Unlinked parents cannot access signed URLs or metadata.

## What Was Intentionally Left Untouched
- `auth` and login flow
- `Guided AI` (`run-guided-mode.ts`, etc.)
- Existing Gemini grading API
- Existing gating and module unlocking behavior
- Student module progress metrics
- Discussion board features
- Skill nodes and static data sources
- Legacy `proof_artifacts` table (which is deprecated)
- Admin user listings

## Known Limitations & Future Work
- In-memory rate limiting requires migration to Redis.
- Malware scanning (e.g., ClamAV) on uploaded objects is planned for a future sprint before full public launch.

## Follow-up QA
- [x] After next real proof upload and review, verify `proof_submitted` and `proof_reviewed` events contain safe metadata only.
