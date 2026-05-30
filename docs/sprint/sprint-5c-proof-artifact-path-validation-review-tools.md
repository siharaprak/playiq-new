# Sprint 5C — Proof Artifact Path Policy, Upload Validation, and Reviewer/Admin Tools

## Overview
This sprint focused on creating a secure, centralized storage path system for proof artifacts, robust file validation checks (size limits, double extension detection, MIME enforcement), and a comprehensive reviewer UI component suite for admins and teachers.

## 1. Storage Path Generation
The canonical logic for constructing artifact storage paths has been centralized in `src/lib/proof-artifacts/storage-paths.ts`.

- **Format:** `student/{studentId}/module/{moduleIdOrModuleNumber}/artifact/{artifactId}/{safeFileName}`
- **Security Check:** Blocks path traversal (`/`, `\`, `..`) via `sanitizeProofFileName`.
- **Backward Compatibility:** Only newly uploaded artifacts generated after this sprint will use this path builder implicitly. Pre-existing artifact metadata in the DB remains valid and is left untouched.

## 2. File Validation and Size Limits
Validation hooks are centralized in `src/lib/proof-artifacts/file-validation.ts` and called during the `upload-slot` route generation.

- **File Types Allowed:**
  - `photo`: 10MB limit (jpeg, png, webp)
  - `document`: 20MB limit (pdf, doc, docx)
  - `audio`: 50MB limit (mp3, mp4, wav, webm, m4a)
  - `video`: 100MB limit (mp4, webm, mov, quicktime)
- **Disguised Threat Detection:** Specifically catches nested forbidden extensions to prevent evasion (e.g., `proof.pdf.exe` or `recording.mp4.js`). Multi-dot safe formats (like `study.notes.pdf`) remain allowed.
- **Route Guarding:** The `finalize` route utilizes the generated draft properties in the DB, implicitly blocking clients from altering the metadata (e.g., MIME, size, media_kind) during finalization.

## 3. Reviewer & Admin Tools
The admin artifact queue (`/admin/proof-artifacts`) was overhauled without redesigning the broader dashboard.

- **Component Split:** Refactored into `ProofArtifactReviewQueue`, `ProofArtifactReviewPanel`, and `ProofArtifactPreviewLink`.
- **Filtering:** Reviewers can now dynamically filter the queue by Status, Media Kind, and Module.
- **Actions:** Reviewers can claim an artifact ("Under Review") and transition it to "Approved", "Revise", or "Rejected" (Final) while adding review notes.
- **Storage Protection:** The raw storage path and any public URLs are strictly hidden from the client. Previews use temporary signed URLs scoped via `download-url`.

## 4. Authorization Enforcement
- **Download Route (`download-url`)**: Protects file access by validating that the user is the owner, a teacher/admin, or a parent explicitly linked via `parent_child_links`.
- **Review Route (`review`)**: Strictly enforces server-side role validation (`admin` or `teacher`), preventing students or parents from triggering state transitions.

## 5. What Was Untouched
- Student progress records and gating logic (`student_node_progress`).
- The Guided AI feature, Gemini grading hooks, and associated prompt infrastructure.
- The community Discussion Board.
- Legacy `proof_artifacts` table (which is deprecated).
- The Parent Dashboard UI.
- All existing textual study rules / error review submission logic.
