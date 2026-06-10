# Runbook: Beta Monitoring Cadence and Expansion Gates

This document defines the daily monitoring cadence, cost checkpoints, incident escalations, and invite expansion gates for the PlayIQ beta phase. This runbook is an extension of the support operations system, aligning directly with the `support_issues` database table schema.

---

## 1. Scope & Category

*   **`monitoring_beta`**: Category for support issues and reviews related to system telemetries, cost limits, database read-audit logs, and user invite expansion gates.

---

## 2. Roles, Escalation, & SLA Alignment

To maintain operational consistency with the [Beta Support Master Runbook](beta-support-runbook.md), this workflow adheres to the following:

*   **Monitoring Owner**: Project Owner
*   **Escalation Owner**: Project Owner
*   **Triage Targets**:
    *   **P0 (System outage)**: Best-effort response within 4 hours. Escalated directly to the Project Owner.
    *   **P1 (Core path blocked)**: Best-effort response within 8 hours. Escalated directly to the Project Owner.

---

## 3. Important Release State Disclaimers

> [!IMPORTANT]
> The verification launch state is **READY_FOR_PRODUCTION_APPROVAL_SUPPORT_READY_MONITORING_READY**.
> This status strictly reflects the following operational state:
> *   **production deploy remains on HOLD**
> *   **this does not mean production is deployed**
> *   **this does not mean production smoke passed**
> *   **this does not mean beta invites were sent**
> *   **monitoring cadence is ready, not actively proven under production traffic**

---

## 4. Daily Monitoring Rhythms

The Project Owner will conduct a daily triage review at 9:30 AM to inspect the following components:
1.  **Ticket Queue Audit**: Review open items in the `support_issues` table. Check for tickets with backlog status.
2.  **Cost Controls Audit**: Audit overall tokens consumption and storage utilization. Ensure compliance with signed URL lifetimes (600 seconds) and file upload sizes (10MB max).
3.  **Safe Logs Review**: Review events logs for anomalous patterns. Ensure no console logs leak secrets (passwords, tokens, Stripe credentials).
4.  **AI Sandboxing and Safety Review**: Review rate limits and blocked terms matches in the chat system.

---

## 5. Beta Invite Expansion Gates

Beta invite expansion is subject to strict quality and stability gates. Invite expansion must not proceed under the following conditions:

*   **no invite expansion while any P0 or P1** is open in `support_issues`.
*   **no invite expansion before production smoke tests pass**.
*   **no invite expansion if the support queue backlog is unmanaged** (average resolution target exceeded).
*   **no invite expansion if any parent privacy, proof upload, auth/login, or AI safety issues appear**.
*   **pause beta immediately if the rollback target becomes invalid** or if telemetry indicates data leakages.

---

## 6. Integration and Cross-Links

This workflow is integrated with the wider support runbooks:
*   For onboarding or invite issues, see [Onboarding Support Workflow](support-workflow-onboarding-issues.md).
*   For auth and sign-in lockouts, see [Login Support Workflow](support-workflow-login-issues.md).
*   For device compatibility, see [Hardware/Device Support Workflow](support-workflow-hardware-device-issues.md).
*   For first-day user protocols, see [Beta First User Support Protocol](beta-first-user-support-protocol.md).
*   For static security reviews, see [Final Security and Access Review](final-security-and-access-review.md).
