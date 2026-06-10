# Runbook: Onboarding Support Workflow

This runbook outlines the troubleshooting steps and templates for onboarding-related issues encountered during the PlayIQ beta launch.

*   **Owner**: Support Team Triage Lead
*   **Workflow Category**: `onboarding`
*   **Target Database Table**: `support_issues` (category column: `'onboarding'`)

---

## 1. Supported Scenarios

*   **Scenario A**: Invite link does not work / signup blocked.
*   **Scenario B**: Beta invite code rejected or invalid.
*   **Scenario C**: Mismatched role selection (user selected parent instead of student or vice-versa).
*   **Scenario D**: Verification email is delayed or not received.
*   **Scenario E**: Account created but dashboard returns unauthorized.
*   **Scenario F**: Student/Parent linking link fails.
*   **Scenario G**: Onboarding progress stuck.
*   **Scenario H**: User is confused about free/invite beta versus paid checkouts.

---

## 2. Intake Guidelines

### Safe Data to Request
*   The email address used for registration.
*   The invite code or link URL used.
*   The exact text or screenshot of any error messages (fully redacted of tokens/credentials).
*   Whether the user is trying to register as a student or a parent.

### Unsafe Data to Request (NEVER ASK FOR)
*   User account passwords, OTP codes, or magic links.
*   Stripe payment details or billing credit card tokens.
*   Unredacted cookies or session identifiers.

---

## 3. Administrative Checks to Perform

1.  **Check Profile Role**: Access the Admin Users roster and lookup the email:
    *   Verify the row exists in `profiles` and has the correct `role` (`student` or `parent`).
    *   Verify the user's `status` is `'active'`.
2.  **Verify Linking**: If a parent cannot see their child:
    *   Query `parent_child_links` in the database to verify `parent_id` and `student_id` are mapped.
3.  **Invite Code Verification**: Check `link_invites` table to see if the invite code has expired or was already claimed by another ID.
4.  **Billing Status Check**: Confirm that no billing requirement blocks the student (invite beta bypasses Stripe checkouts).

---

## 4. Triage and Escalation

*   **Severity Triage**:
    *   *P0*: Signup completely down for all new users.
    *   *P1*: Link invites table corrupted (all codes failing).
    *   *P2*: Individual user selected the wrong role or link failed.
    *   *P3*: User confused about billing or minor formatting query.
*   **Escalation Path**:
    *   Escalate code registration bugs or database link constraints to the Deploy Owner.
    *   Billing questions must be closed by support reiterating the free beta launch protocols.
*   **Closure Criteria**: Issue is resolved when the user registers successfully, role mismatch is updated in the database, or link verification completes.

---

## 5. Support Response Templates

### Template A: Invite Code Failure
```text
Subject: PlayIQ Support — Invite Code Assistance

Hello,

Thank you for contacting PlayIQ Support. We have verified your invite code configuration. Please try registering again using the code below:

Invite Code: [Redacted-Code]

Ensure you are selecting the correct role (Parent or Student) during the signup phase. Please let us know if you experience any further issues.

Best regards,
PlayIQ Support Team
```

### Template B: Role Mismatch Fix
```text
Subject: PlayIQ Support — Account Role Updated

Hello,

We have updated your profile role from Parent to Student in our system. You should now be able to access the student curriculum map. Please clear your browser cookies and log in again at:

URL: https://playiq-new.vercel.app/login

Best regards,
PlayIQ Support Team
```

### Template C: Free Beta / Stripe Confusion
```text
Subject: PlayIQ Support — Free Beta Billing Policy

Hello,

Thank you for joining the PlayIQ Beta! Please note that the current phase is a free, invite-only pilot. Under our current beta policies, no payment or credit card registration is required. You can bypass any checkout loops by clicking the invite link sent to your email.

Best regards,
PlayIQ Support Team
```

---

## 6. Internal Triage Notes Format
Record details using this exact layout in `support_issues.metadata`:
```json
{
  "category": "onboarding",
  "assigned_to": "[Triage Lead UUID]",
  "action_taken": "Updated profiles role from parent to student for user",
  "resolution_code": "role_mismatch_resolved",
  "notes": "Verified invite code claim state in link_invites table."
}
```
