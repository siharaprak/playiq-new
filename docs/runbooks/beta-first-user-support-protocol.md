# Runbook: Beta First-User Support Protocol

This runbook outlines the quick-start and first-week support guidelines for early beta users. 

For the complete support procedures, escalation chains, and specific onboarding, login, or hardware workflows, refer to the master [Beta Support Runbook](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/docs/runbooks/beta-support-runbook.md).

---

## 1. Support Triage Tiers (Beta Response Targets)

*   **Tier 1 (Auth & Sign-in)**: Basic login issues, verification email failures, page navigation issues.
    *   *Internal Response Target*: Within a best-effort 24-hour beta response window.
*   **Tier 2 (Tutor/Assistant Builder)**: Errors during chat sessions, assistant profile creation limits reached, model errors.
    *   *Internal Response Target*: Routed to developer queue within a best-effort 12-hour response window.
*   **Tier 3 (Database & Infrastructure)**: Server errors (500s), data synchronization lags, database outages.
    *   *Internal Response Target*: Immediately escalated to DevOps queue on a best-effort, high-priority basis.

---

## 2. Safe Debugging Policy

To protect user privacy and project security:
*   **Never** request passwords, session tokens, magic links, OTP codes, recovery keys, or API keys from users.
*   **Never** ask users to disable browser security shields or browser-level cookie/security blocks.
*   **Never** request raw screenshots that expose other users' data, unredacted email addresses, or raw tokens.
*   Guide users to clear cookies or use incognito windows if they experience caching or session loop issues.

---

## 3. Reference Runbooks

*   Master support policies: [Beta Support Runbook](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/docs/runbooks/beta-support-runbook.md)
*   Onboarding support: [Onboarding Support Workflow](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/docs/runbooks/support-workflow-onboarding-issues.md)
*   Login/Auth support: [Login Support Workflow](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/docs/runbooks/support-workflow-login-issues.md)
*   Device/Browser support: [Hardware/Device Support Workflow](file:///c:/Users/Auviore/Documents/Sienvi/Projects/playiq-new/docs/runbooks/support-workflow-hardware-device-issues.md)
