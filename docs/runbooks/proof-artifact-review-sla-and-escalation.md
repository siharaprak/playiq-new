# Runbook: Proof Artifact Review SLA & Escalation

**Version:** 1.0 (Beta)  
**Last Updated:** 2026-05-27

---

## Parent Visibility Policy

### What Parents Can See
| Status | Visible | Count | Metadata | Download |
|--------|---------|-------|----------|----------|
| Approved | ✅ | ✅ | Title only (if safe) | ❌ |
| Submitted | ✅ | ✅ | ❌ | ❌ |
| Under Review | ✅ | ✅ | ❌ | ❌ |
| Revise | ✅ | ✅ "Needs Action" | ❌ | ❌ |
| Rejected | ✅ | ✅ "Not Accepted" | ❌ | ❌ |
| Draft | ❌ | ❌ | ❌ | ❌ |

### What Parents Cannot See
- File names
- File download links
- Signed URLs
- Storage paths
- Review notes
- Raw metadata

### Beta Note
File downloads for parents are intentionally disabled during beta. This is a product decision, not a bug.

---

## Role Access Matrix

| Action | Student Owner | Linked Parent | Admin | Teacher | Unrelated User |
|--------|:---:|:---:|:---:|:---:|:---:|
| See own artifact metadata | ✅ | ❌ (counts only) | ✅ | ✅ | ❌ |
| Request signed URL | ✅ | ❌ | ✅ | ✅ | ❌ |
| Submit/revise artifact | ✅ | ❌ | ❌ | ❌ | ❌ |
| Review artifact | ❌ | ❌ | ✅ | ✅ | ❌ |
| View review queue | ❌ | ❌ | ✅ | ✅ | ❌ |
| See proof summary | ❌ | ✅ (linked) | ✅ | ✅ | ❌ |

### Teacher Scope (Beta)
Teacher access is equivalent to admin ONLY for proof artifact review:
- Review queue access
- Signed preview for review
- Review status transitions
- Review notes

Teachers do NOT receive broader admin powers from this sprint.

---

## Signed URL Access Policy

- **Expiry:** 10 minutes (600 seconds)
- **Generation:** Server-side only
- **Storage:** Never persisted in DB
- **Logging:** Never logged in events_log
- **Display:** Never shown as raw text — used only as media `src` attribute
- **Caching:** No client-side caching beyond component memory
- **Public fallback:** None

### Who Can Request
- ✅ Student owner (own artifacts)
- ✅ Admin (for review)
- ✅ Teacher (for review, beta-scoped)
- ❌ Parent (blocked during beta)
- ❌ Unrelated student
- ❌ Unauthenticated user

---

## Beta Review SLA

### Thresholds
| Status | Calendar Days | Label | Color |
|--------|:---:|-------|-------|
| On Track | < 3 | — | — |
| Approaching Delay | ≥ 3 | Review Soon | Amber |
| Overdue | ≥ 5 | Overdue | Orange |
| Urgent | ≥ 7 | Urgent | Red |

### Important Notes
- This SLA is an **expectation**, not a contractual guarantee.
- Uses calendar-day approximation, not business-day calculation.
- Student/parent messaging says: "usually reviewed within 2 business days during beta."
- SLA badges appear in the reviewer queue for artifacts that are not on-track.

---

## Broken/Invalid Upload Escalation

### Student Self-Fix Issues
| Issue | Student Message |
|-------|----------------|
| Unsupported file type | "This file type is not supported. Please upload JPEG, PNG, WebP, PDF, DOC, DOCX, MP3, MP4, WAV, WebM, or MOV." |
| File too large | "This file is too large. Photos < 10MB, documents < 20MB, audio < 50MB, video < 100MB." |
| Unsafe file name | "Please rename the file using only letters, numbers, hyphens, and underscores." |

### Retry Issues
| Issue | Action |
|-------|--------|
| Upload failed | Student retries. If persistent, escalate. |
| Preview failed | Student retries. If persistent, escalate. |

### Teacher/Admin Review Issues
| Issue | Reviewer Action |
|-------|----------------|
| Corrupt or unreadable file | Use **Revise** with note: "File cannot be opened. Please re-export in a supported format." |
| Repeated student failure | Check if student needs help with file formatting. |

### Technical Support Issues
| Issue | Action |
|-------|--------|
| Finalize failed | Check Supabase Storage and service status. |
| Storage error | Check bucket configuration and RLS policies. |
| Permission error | Verify bucket access rules. |

### Future Security Review
| Issue | Action |
|-------|--------|
| Suspected malware | Deferred until scanning is implemented. Do not open suspicious files. |

### Key Rule
No new artifact statuses are created for escalation. Reviewers use the existing **Revise** (fixable) or **Rejected** (final) flow with required notes.

---

## QA Checklist

- [ ] Parent sees proof summary counts only
- [ ] Parent cannot download files
- [ ] Parent cannot request signed URLs (API returns 403)
- [ ] Linked parent can see summary for linked child
- [ ] Unlinked parent cannot see child proof summary
- [ ] Student owner can access own signed URL
- [ ] Student cannot access another student's proof
- [ ] Admin can access signed URL for review
- [ ] Teacher can access signed URL for review
- [ ] Signed URL not displayed as raw text
- [ ] Storage path not exposed in UI
- [ ] SLA badge appears in review queue
- [ ] Broken upload guidance appears for reviewers
- [ ] Validation errors show student-safe messages
- [ ] Proof event metadata remains safe
- [ ] No writes to legacy proof_artifacts
- [ ] Existing upload/review/revision flows still work
- [ ] Build and typecheck pass
