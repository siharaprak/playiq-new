# Runbook: Hardware and Device Support Workflow

This runbook outlines the troubleshooting steps and templates for browser, device, network, file upload, school restriction, and accessibility issues encountered during the PlayIQ beta launch.

*   **Owner**: Support Team Triage Lead
*   **Workflow Category**: `device_hardware`
*   **Target Database Table**: `support_issues` (category column: `'device_hardware'`)

---

## 1. Supported Scenarios

*   **Scenario A**: User device too old or browser unsupported.
*   **Scenario B**: File upload blocked by device or browser settings.
*   **Scenario C**: Network/firewall blocks (e.g. school web filters blocking Gemini or Supabase).
*   **Scenario D**: Mobile/tablet layout formatting issues.
*   **Scenario E**: Multi-student shared device session conflicts.
*   **Scenario F**: Accessibility needs (e.g. screen-reader bugs, keyboard access).
*   **Scenario G**: Hardware kit/physical package shipment inquiries.

---

## 2. Intake Guidelines

### Required Intake Fields
*   **Operating System**: (e.g. Windows 11, macOS 14, ChromeOS, iOS 17)
*   **Browser**: (e.g. Chrome 122, Safari 17, Edge 120, Firefox 123)
*   **Network Type**: (e.g. Home Wi-Fi, School Network, Cellular Data)
*   **Institution Constraints**: Is this a school-issued device or restricted network?

### Safe Screenshot Guidance
Instruct users to supply screenshots only of the UI error. Before submitting:
*   Hide the browser address bar if it contains session codes or magic link tokens.
*   Crop or redact any personal email addresses, browser bookmarks, or visible personal files.

### Unsafe Data to Request (NEVER ASK FOR)
*   User passwords, magic link tokens, or MFA OTP codes.
*   Stripe payment details or billing credit card tokens (the beta is free and invite-only; Stripe remains disabled/deferred).

---

## 3. Troubleshooting Protocols

### Browser Support Baseline
PlayIQ beta supports:
*   **Google Chrome**: v115 or higher (Recommended)
*   **Safari**: v16 or higher
*   **Microsoft Edge**: v115 or higher
*   **Mozilla Firefox**: v115 or higher
*   *Note*: Internet Explorer and legacy Edge (non-Chromium) are explicitly unsupported.

### Network & Firewall Rules
If the Guided AI fails or pages load indefinitely, the local school network may block necessary APIs. Instruct school IT administrators to whitelist these domains:
*   `playiq-new.vercel.app` (Application host)
*   `*.supabase.co` (Database and storage APIs)
*   `*.googleapis.com` (Google Gemini LLM provider)

### File Upload Troubleshooting
If proof artifact uploads fail:
*   **File Size**: Verify the file is under **5MB**.
*   **File Format**: Check the extension. Allowed formats are: `.pdf`, `.png`, `.jpg`, `.jpeg`, and `.txt`.
*   **Draft Cleanup**: If storage errors persist, drafts can be cleared by the developer using `npm run cleanup:proof-drafts`.

---

## 4. Triage and Escalation

*   **Severity Triage**:
    *   *P0*: CDN or hosting provider outage (global access failure).
    *   *P1*: Storage uploads failing for all users.
    *   *P2*: Individual user blocked by school firewall policy or upload format.
    *   *P3*: Minor mobile layout sizing bug.
*   **Physical Kit / Shipping Policy**: PlayIQ does not distribute physical kits or ship hardware during this beta pilot phase. The platform is entirely software-based. All shipping inquiries must be resolved immediately by clarifying the software-only policy.
*   **Escalation Path**:
    *   Escalate layout bugs and upload server failures to the Front-End Engineer / Deploy Owner.
    *   Escalate accessibility barriers directly to the Support Lead.

---

## 5. Support Response Templates

### Template A: Unsupported Browser
```text
Subject: PlayIQ Support — Browser Compatibility

Hello,

Thank you for reaching out. Based on your report, it appears you are accessing PlayIQ using an unsupported browser version. For optimal stability, we recommend using one of the following baseline browsers:

- Google Chrome v115+ (Download: https://www.google.com/chrome)
- Apple Safari v16+
- Microsoft Edge v115+
- Mozilla Firefox v115+

Please try accessing your dashboard using one of these browsers and let us know if you continue to experience issues.

Best regards,
PlayIQ Support Team
```

### Template B: School Firewall Whitelisting
```text
Subject: PlayIQ Support — School Network Requirements

Hello,

Thank you for reporting this issue. It appears your school network's firewall is blocking connections to our backend and AI APIs. 

To resolve this, please ask your school's IT administrator to whitelist the following domains on the school network:

- playiq-new.vercel.app
- *.supabase.co
- *.googleapis.com

Once whitelisted, you should be able to access the Guided AI features and dashboards successfully.

Best regards,
PlayIQ Support Team
```

### Template C: Physical Shipment Query
```text
Subject: PlayIQ Support — Hardware Kit Inquiry

Hello,

Thank you for checking in. Please note that the current PlayIQ Beta is a software-only learning platform. We do not distribute physical kits, devices, or hardware packages during this pilot phase. All learning modules, lessons, and AI tutors are fully accessible directly via your web browser.

Best regards,
PlayIQ Support Team
```

---

## 6. Internal Triage Notes Format
Record details using this exact layout in `support_issues.metadata`:
```json
{
  "category": "device_hardware",
  "assigned_to": "[Triage Lead UUID]",
  "action_taken": "Sent firewall whitelisting template to parent for school IT",
  "resolution_code": "firewall_blockage",
  "notes": "Verified client OS is ChromeOS; network is filtered school Wi-Fi."
}
```
