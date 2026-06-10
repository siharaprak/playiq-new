# Runbook: Assistant Build Issues Support Workflow

This document details the support workflows for resolving assistant build issues during the PlayIQ beta phase. This runbook is an extension of the support operations system, aligning directly with the `support_issues` database table schema.

---

## 1. Scope & Category

*   **`assistant_build`**: Category for support issues related to creating, configuring, building, testing, or completing a custom Guided AI assistant (Module 10 curriculum).

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

## 3. Privacy Boundaries & Safety Regulations

All support actions must strictly follow child privacy and AI safety parameters:

*   **Unsafe Asks**:
    *   Never ask any user (student, parent, or admin) for passwords, magic links, or session tokens.
*   **AI Code and Instruction Privacy Rules**:
    *   **never expose raw assistant instructions** in tickets, responses, or support notes.
    *   **never expose raw prompts or raw responses** of the assistant to parents or unauthorized users.
    *   **never expose knowledge file contents** uploaded by the student.
    *   **never expose storage paths** of raw uploads or configuration elements.
    *   **parents receive safe summaries only** (e.g., node completion counts, build milestones achieved) and never raw instructions.
*   **Manual Mutations**:
    *   **do not manually mutate activation/progress** unless existing admin tooling supports it and explicit approval is given.

---

## 4. Triage and Diagnosis Procedures

### Case A: Assistant Creation Errors
1.  **Validate Config Constraints**: Check if the assistant setup violates configuration constraints (e.g., empty prompt template, name containing disallowed words).
2.  **Verify Rate Limits**: If the student cannot save or compile, check if their sandbox limits have been exceeded. Instruct them to wait as per sandbox policies in [Hardware/Device Support Workflow](support-workflow-hardware-device-issues.md).

### Case B: Knowledge File Upload Rejection
1.  **Check Formatting**: Verify the knowledge file type is approved (e.g., text, markdown, pdf).
2.  **Check Size limits**: Ensure the knowledge file does not exceed the size limits.

### Case C: Completion and Progression Issues
1.  **Milestone Evaluation**: Inspect the student progress logs to verify if the prerequisite skills were marked completed.
2.  **Lock State Triage**: Refer to progress rules. If progress is stuck, escalate to the Project Owner. Do not force db changes.

---

## 5. Integration and Cross-Links

This workflow is integrated with the wider support runbooks:
*   For onboarding or invite issues, see [Onboarding Support Workflow](support-workflow-onboarding-issues.md).
*   For auth and sign-in lockouts, see [Login Support Workflow](support-workflow-login-issues.md).
*   For device compatibility, see [Hardware/Device Support Workflow](support-workflow-hardware-device-issues.md).
*   For first-day user protocols, see [Beta First User Support Protocol](beta-first-user-support-protocol.md).
*   For static security reviews, see [Final Security and Access Review](final-security-and-access-review.md).
