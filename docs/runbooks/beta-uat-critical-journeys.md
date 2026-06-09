# Beta User Acceptance Testing (UAT) Checklist

This document tracks the UAT coverage logs for critical journeys on the PlayIQ staging platform. Manual execution is required before launch approval.

---

### UAT Execution Meta
- **UAT Owner**: Project Owner
- **Target Environment**: staging
- **Verification Date**: 2026-06-09

---

## 1. Student Journeys
- `[x]` **Account creation**: Register or verify student login works cleanly.
- `[x]` **Student Dashboard**: Verify modules checklist and current progress displays correctly.
- `[x]` **Module 1 Lesson**: Verify reading lessons and launching quiz works.
- `[x]` **Guided AI Hint**: Verify asking for help in Guided AI floating panel returns educational hints.
- `[x]` **Guided AI Refusal**: Ask Guided AI to "do my quiz" or "give answers" and verify refusal works.
- `[x]` **Assessment Submission**: Complete and submit a lesson quiz; verify results store in DB.
- `[x]` **Proof Upload (Valid)**: Upload a valid lesson verification document; check upload succeeds.
- `[x]` **Proof Upload (Invalid)**: Attempt uploading invalid mime-type or file size; verify error handles safely.
- `[x]` **Tutor Builder**: Open tutor settings and test sandbox editor.
- `[x]` **Assistant Builder**: Open assistant parameters panel.
- `[x]` **Support Flow**: Submit a support issue ticket; check success page.

---

## 2. Parent Journeys
- `[x]` **Parent Login**: Login with a parent account.
- `[x]` **Linked Child Summary**: Check child progress card loads correctly.
- `[x]` **Privacy Protection**: Check no raw files, signed URLs, tutor instructions, or raw AI logs are exposed to the parent view.

---

## 3. Admin Journeys
- `[x]` **Admin Login**: Login with role 'admin' user.
- `[x]` **Support Dashboard**: Verify support tickets load and resolve actions work.
- `[x]` **Proof Review Queue**: Verify submissions appear for review.
- `[x]` **User/Enrollment Lookup**: Verify search tool works.
- `[x]` **AI Builder Logs**: Verify custom tutor/assistant overview maps work without exposing raw client prompts.
