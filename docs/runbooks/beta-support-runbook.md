# Runbook: Beta Support Master Runbook

This document defines the master support runbook for the PlayIQ beta phase. All tickets are tracked in the `support_issues` database table without modifying the schema or creating new tables. It details triage severities, support windows, communication rules, data boundaries, and incident escalation paths.

---

## 1. Roles and Contacts

*   **Beta Support Owner**: Project Support Lead
*   **Deploy & Infrastructure Lead**: Project Deploy Owner
*   **Security & Privacy Lead**: Security Escalation Owner
*   **Support Hours**: Monday - Friday, 9:00 AM - 5:00 PM local time
*   **Support Cadence**: Daily triage review at 9:30 AM to inspect open issues in the admin support queue.

---

## 2. Severity Levels & Best-Effort Triage Targets

These definitions represent internal support targets and best-effort beta response windows. They do not constitute contractual or legal SLAs.

| Severity | Definition | Target Resolution Target | Escalation Target |
| :--- | :--- | :--- | :--- |
| **P0** | System-wide outage (e.g. database down, sign-in failing globally, Vercel build crash). | Best-effort 4 hours | Deploy & Infrastructure Lead |
| **P1** | Core path blocked for multiple users (e.g. MFA loop, proof uploads failing, rate-limit locks). | Best-effort 8 hours | Deploy & Infrastructure Lead |
| **P2** | Core feature issue for a single user (e.g. child link failing, specific node not mastering). | Best-effort 12 hours | Support Developer Queue |
| **P3** | Minor cosmetic layout errors, general questions, or curriculum feedback. | Best-effort 24 hours | Support Queue Triage |

---

## 3. Safe Communication & Child Privacy Rules

### Unsafe Asks Policy
Support staff must **NEVER** ask users for:
*   Passwords, OTP verification codes, magic links, or session tokens.
*   Stripe payment details (beta is free, paid checkout is not required).
*   Browser security shield disabling or system-level security overrides.
*   Unredacted screenshots showing authorization cookies, credentials, or other users' profiles.

### Screenshot Redaction Rules
If a screenshot is required for debugging:
*   Instruct the user to redact all passwords, session headers, full email addresses, and payment keys.
*   Redact child-sensitive data (e.g., student full name, residential address) before uploading to support archives.

### Child Privacy Rules
*   Do not record unredacted child emails or full names in support tickets or resolve notes.
*   Refer to student profiles by their first name/initials or `profiles.id` (UUID).

---

## 4. Specific Workflows Integration

For step-by-step resolution scripts, refer to the following workflows:
*   **Onboarding Issues**: Refer to [Onboarding Support Workflow](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/docs/runbooks/support-workflow-onboarding-issues.md) (covers invite codes, role errors, email verification, payment confusion).
*   **Login & Session Issues**: Refer to [Login Support Workflow](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/docs/runbooks/support-workflow-login-issues.md) (covers MFA loops, session timeouts, magic link expiration, account suspension).
*   **Device & Browser Issues**: Refer to [Hardware/Device Support Workflow](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/docs/runbooks/support-workflow-hardware-device-issues.md) (covers uploads blocked, browser baseline checks, accessibility needs, school firewalls).

---

## 5. Escalation & Incident Handoff

1.  **Technical Outage Escalation**: If logs indicate database outage or global API crash (`[ERROR:ai_provider_error]` quota limits or server `500` codes), support immediately notifies the Deploy & Infrastructure Lead.
2.  **Privacy/Security Escalation**: If an RLS policy bypass is reported (e.g., a student can access another student's tutor configuration or parent summary data), immediately contact the Security & Privacy Lead.
3.  **Billing Inquiries**: If users raise concerns about checkout paths, support must reiterate the free invite-only beta policy. No paid checkout is required.
4.  **Launch Readiness Gate**: The master launch readiness state remains **HOLD** until explicit human deploy owner approval, regardless of support queue status.
