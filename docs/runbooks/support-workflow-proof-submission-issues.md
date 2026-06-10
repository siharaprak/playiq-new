# Runbook: Proof Submission and Review Issues Support Workflow

This document details the support workflows for resolving proof submission issues during the PlayIQ beta phase. This runbook is an extension of the support operations system, aligning directly with the `support_issues` database table schema.

---

## 1. Scope & Categories

We distinguish between two distinct phases of the proof process:
*   **`proof_upload`**: Issues related to uploading proof files (e.g., file size validation errors, unsupported formats, upload timeouts, network drops during upload).
*   **`proof_review`**: Issues related to the status, grading, admin approval queue, or review flow of submitted proofs.

---

## 2. Roles, Escalation, & SLA Alignment

To maintain operational consistency with the [Beta Support Master Runbook](beta-support-runbook.md), this workflow adheres to the following:

*   **Support Owner**: Project Owner
*   **Escalation Owner**: Project Owner
*   **Triage Targets**:
    *   **P1 (Core path blocked)**: Best-effort response within 8 hours. Escalated directly to the Project Owner.
    *   **P2 (Single user feature block)**: Best-effort response within 12 hours.
    *   **P3 (General query)**: Best-effort response within 24 hours.

---

## 3. Privacy Boundaries & Unsafe Asks

All support interactions must respect child privacy and security boundaries:

*   **Unsafe Asks**:
    *   Never ask any user (student, parent, or admin) for passwords, magic links, or session tokens.
    *   Never send pre-signed storage URLs to parents or unauthorized parties.
    *   Never ask parents to upload files directly via unauthenticated channels.
*   **Parent Proof Boundaries**:
    *   **parents cannot access proof files** under any circumstance.
    *   **parents cannot receive proof signed URLs** to download student uploads.
    *   Parents can only view proof state summaries (e.g., "Submitted", "Approved", "Requires Resubmission") as defined in [Parent Dashboard Visibility](verify-parent-dashboard-visibility.ts).
*   **Screenshot Redaction**:
    *   If troubleshooting requires screenshots, users must redact session headers, emails, and any personal information.

---

## 4. Triage and Diagnosis Procedures

### Case A: Upload Failure (`proof_upload`)
1.  **Check File Type & Size**: Verify that the uploaded file complies with rules (maximum 10MB, formats: PDF, PNG, JPG).
2.  **Verify Storage Quota**: Confirm that the student has not exceeded the maximum limit of proof artifacts.
3.  **Inspect Network Errors**: Check if the client encountered a timeout. Instruct the user to try a baseline browser check as detailed in [Hardware/Device Support Workflow](support-workflow-hardware-device-issues.md).

### Case B: Review / Status Stuck (`proof_review`)
1.  **Locate Submission ID**: Look up the issue in the admin support view using the student's uuid.
2.  **Check Status State Machine**: Verify if the status is in `draft`, `submitted`, `approved`, or `rejected`.
3.  **Admin Re-evaluation**: If a review fails to reflect in the UI, verify the database `proof_artifact_submissions` status matches. Do not perform direct database mutations without admin tooling and explicit Project Owner approval.

---

## 5. Integration and Cross-Links

This workflow is integrated with the wider support runbooks:
*   For onboarding or invite issues, see [Onboarding Support Workflow](support-workflow-onboarding-issues.md).
*   For auth and sign-in lockouts, see [Login Support Workflow](support-workflow-login-issues.md).
*   For device compatibility, see [Hardware/Device Support Workflow](support-workflow-hardware-device-issues.md).
*   For first-day user protocols, see [Beta First User Support Protocol](beta-first-user-support-protocol.md).
*   For static security reviews, see [Final Security and Access Review](final-security-and-access-review.md).
