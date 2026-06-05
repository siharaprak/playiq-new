# Sprint 7A: Tutor Build Policy & Knowledge File Safety

## Overview
Sprint 7A establishes the security, policy, and validation foundation for custom tutor building on PlayIQ using the existing `tutor_profiles`, `tutor_versions`, and `knowledge_files` tables. 

## Key Deliverables

### 1. Centralized Tutor Build Policy (`tutor-build-policy.ts`)
Creates a centralized logic block for validating whether a tutor profile is ready for activation or publication.
* **Activation Criteria**:
  * Profile name must exist.
  * Personality config (purpose, teaching style, explanation preference, subject focus) must be present.
  * Version exists with a non-empty `instruction_set`.
* **Publication Criteria**:
  * Tutor must be active.
  * At least one knowledge file must be attached.

### 2. Bounded Testing Environment & Chat Hardening
Hardens the `chatWithTutor` server action to prevent sandbox breakout:
* Enforces `PLAYIQ_TUTOR_SYSTEM_PREFIX` containing core PlayIQ pedagogical constraints.
* Limits chat sessions to 50 messages.
* Limits user prompt inputs to 2000 characters.
* Fetches knowledge file names only (never raw file content, paths, or URLs) to construct AI context safely.

### 3. Knowledge File Security & Storage Safety
Secures student file uploads:
* Restricts files to private `knowledge-files` storage bucket.
* Uses signed URLs with 1-hour expirations for safe downloading.
* Enforces strict file validation:
  * Maximum 5 files per tutor.
  * Maximum file size of 10MB.
  * Allowed MIME types: PDF, TXT, MD, DOCX, PNG, JPEG.
  * Sanitizes filenames using `isFilenameSafe` (rejects characters like `..`, `/`, `\`, and dangerous extensions like `.exe`, `.js`).

### 4. Event Logging Safety
Ensures tutor interaction events never log PII or AI payloads:
* Log helper strips prompts, responses, custom instructions, and email/name fields.
* Forces `noPromptStored: true` and `noResponseStored: true` markers.
