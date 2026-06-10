# Runbook: Login Support Workflow

This runbook outlines the troubleshooting steps and templates for login and session-related authentication issues encountered during the PlayIQ beta launch.

*   **Owner**: Support Team Triage Lead
*   **Workflow Category**: `login_auth`
*   **Target Database Table**: `support_issues` (category column: `'login_auth'`)

---

## 1. Supported Scenarios

*   **Scenario A**: User cannot log in (invalid credentials, network timeout).
*   **Scenario B**: Mismatched dashboard or redirect loop after login.
*   **Scenario C**: MFA verification challenge failing or authenticator lost.
*   **Scenario D**: Magic link email fails or session token expires instantly.
*   **Scenario E**: Password reset confusion.
*   **Scenario F**: Suspended account tries to access dashboard.
*   **Scenario G**: Parent receives auth loops trying to view linked children.
*   **Scenario H**: Admin cannot access the admin command console.

---

## 2. Intake and Safe Troubleshooting Checklist

### Intake Questions
*   Email address used for the user account.
*   Browser and OS being used.
*   Exact error message displayed on screen.
*   Approximate time when the login failure occurred.

### Safe Troubleshooting Steps
1.  Guide the user to attempt login in an **Incognito / Private Window** to clear cache loops.
2.  Instruct the user to clear browser cookies for the domain name.
3.  If they receive a cookie-related error, guide them to enable third-party cookies if blocked by strict browser configurations.

### Unsafe Asks (NEVER ASK FOR)
*   User passwords, magic link tokens, or MFA authenticator OTP codes.
*   Session screenshots displaying authorization headers or raw cookies.
*   Stripe payment details or billing credit card tokens (the beta is free and invite-only; Stripe remains disabled/deferred).

---

## 3. Administrative Checks to Perform

1.  **Check Account Status**: Inspect the user profile in the Admin dashboard:
    *   Verify the profile `status` is `'active'`. If status is `'suspended'`, the user is gated from access.
    *   Verify the profile `role` matches the expected dashboard.
2.  **MFA Check**: Look up the user's auth status via Supabase. If MFA has locked them out due to a lost authenticator device:
    *   Initiate a mock MFA challenge reset under auth admin controls.
3.  **Auth Redirect Loops**: Check if the client is loop-redirecting. This occurs when `profiles.role` does not match the dashboard route (e.g. parent attempting to access `/student`). Confirm the role match in the database.

---

## 4. Triage and Escalation

*   **Severity Triage**:
    *   *P0*: Auth globally down (no logins succeed).
    *   *P1*: Admin logins failing globally or MFA check crashes backend.
    *   *P2*: User authenticator locked or individual redirect loop.
    *   *P3*: Minor password reset confusion or general query.
*   **Escalation Path**:
    *   technical auth routing bugs or MFA exceptions must be escalated to the Deploy Owner.
    *   For admin login lockouts, notify the Deploy Lead immediately.
*   **Closure Criteria**: Issue is resolved when the user establishes a valid session and accesses their dashboard.

---

## 5. Support Response Templates

### Template A: MFA Reset
```text
Subject: PlayIQ Support — MFA Assistance

Hello,

We have verified your account details and initiated an MFA reset request. The next time you sign in, you will be prompted to re-register your authenticator application.

Please log in using this link: https://playiq-new.vercel.app/login

Best regards,
PlayIQ Support Team
```

### Template B: Suspended Account Notice
```text
Subject: PlayIQ Account — Suspension Notification

Hello,

Your PlayIQ beta account is currently suspended due to policy violations or review guidelines. During this suspension period, you will be unable to access the parent or student dashboards.

If you believe this is an error, please respond directly to this email to request a review.

Best regards,
PlayIQ Support Team
```

### Template C: Cookie Reset Instructions
```text
Subject: PlayIQ Support — Auth Reset Guide

Hello,

Thank you for reporting this issue. If you are experiencing a repeated redirect loop, please follow these steps:

1. Close all active tabs for PlayIQ.
2. Clear your browser cookies and site cache for the playiq domain.
3. Open a new private/incognito window.
4. Try logging in again at: https://playiq-new.vercel.app/login

Let us know if the redirect persists after performing these steps.

Best regards,
PlayIQ Support Team
```

---

## 6. Internal Triage Notes Format
Record details using this exact layout in `support_issues.metadata`:
```json
{
  "category": "login_auth",
  "assigned_to": "[Triage Lead UUID]",
  "action_taken": "Guided user through cookie clear; verified profile status is active.",
  "resolution_code": "auth_redirect_resolved",
  "notes": "Verified AAL levels via Supabase Auth backend log lookup."
}
```
