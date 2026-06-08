# Beta User Acceptance Testing (UAT) Checklist

This document tracks the UAT coverage logs for critical journeys on the PlayIQ staging platform. Manual execution is required before launch approval.

---

### UAT Execution Meta
- **UAT Owner**: TODO
- **Target Environment**: staging
- **Verification Date**: TBD

---

## 1. Student Journeys
- `[ ]` **Account creation**: Register or verify student login works cleanly.
- `[ ]` **Student Dashboard**: Verify modules checklist and current progress displays correctly.
- `[ ]` **Module 1 Lesson**: Verify reading lessons and launching quiz works.
- `[ ]` **Guided AI Hint**: Verify asking for help in Guided AI floating panel returns educational hints.
- `[ ]` **Guided AI Refusal**: Ask Guided AI to "do my quiz" or "give answers" and verify refusal works.
- `[ ]` **Assessment Submission**: Complete and submit a lesson quiz; verify results store in DB.
- `[ ]` **Proof Upload (Valid)**: Upload a valid lesson verification document; check upload succeeds.
- `[ ]` **Proof Upload (Invalid)**: Attempt uploading invalid mime-type or file size; verify error handles safely.
- `[ ]` **Tutor Builder**: Open tutor settings and test sandbox editor.
- `[ ]` **Assistant Builder**: Open assistant parameters panel.
- `[ ]` **Support Flow**: Submit a support issue ticket; check success page.

---

## 2. Parent Journeys
- `[ ]` **Parent Login**: Login with a parent account.
- `[ ]` **Linked Child Summary**: Check child progress card loads correctly.
- `[ ]` **Privacy Protection**: Check no raw files, signed URLs, tutor instructions, or raw AI logs are exposed to the parent view.

---

## 3. Admin Journeys
- `[ ]` **Admin Login**: Login with role 'admin' user.
- `[ ]` **Support Dashboard**: Verify support tickets load and resolve actions work.
- `[ ]` **Proof Review Queue**: Verify submissions appear for review.
- `[ ]` **User/Enrollment Lookup**: Verify search tool works.
- `[ ]` **AI Builder Logs**: Verify custom tutor/assistant overview maps work without exposing raw client prompts.
