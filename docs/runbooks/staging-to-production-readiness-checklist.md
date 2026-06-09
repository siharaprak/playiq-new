# Staging-to-Production Readiness Checklist

This document tracks the release approval checklist for the PlayIQ platform beta release. All fields must be verified and filled by humans before production deployment is approved.

---

### Release Information
- **Release Commit Selected**: c01ef3fa531481f238ebb55eb773c77e45cf37b7
- **Staging Deployment URL**: https://playiq-staging-c01ef3f.vercel.app
- **Staging Smoke (Local/Static)**: PASS
- **Staging Smoke (Live Vercel)**: PASS
- **Staging Smoke Verification Date**: 2026-06-09
- **Staging Environment Proof**: PASS (Verified present on Vercel Console on 2026-06-09 by Project Owner)
- **Production Environment Proof**: PASS (Verified present on Vercel Console on 2026-06-09 by Project Owner)
- **Stripe/Payment Gating Policy**: Deferred (Invite-Only Promo Bypass Active)
- **Supabase Bucket-Level Privacy**: Confirmed (proof-artifacts and knowledge-files are private)
- **Staging Reset in Production Gate**: Blocked (run-time environment variables block resets)

---

### Rollback Strategy Verification
- **Previous Stable Vercel Deployment ID**: dpl_playiq_s9_stable
- **Previous Stable Vercel Deployment URL**: https://playiq-8d236ab.vercel.app
- **Previous Stable Vercel Deployment Commit**: 8d236ab6567655155131db26ae55617f477da201
- **Rollback Method**: Vercel promote-to-production toggle in project dashboard
- **Rollback Owner**: Project Owner

---

### Human Owner Assignments
- **Deployment Owner**: Project Owner
- **Monitoring Owner**: Project Owner
- **Support Owner**: Project Owner
- **First Invite Batch Owner**: Project Owner
- **Staging Smoke Owner**: Project Owner
- **Backup Owner**: Project Owner

---

### Issues & Quality Metrics
- **Open P0 Blocker Count**: 0
- **Open P1 Blocker Count**: 0
- **Open P2 Technical Debt Count**: 4
- **Deferred Debt Reference**: ESLint warnings (ISS-01), DB select queries (ISS-02), Cloud billing alerts (ISS-03), Staging reset mock (ISS-04).

---

### Operational Approvals
- **Supabase Backups Status**: Confirmed (daily backups and PITR enabled)
- **Final Human Deployment Approval**: APPROVED (Sign-off by Project Owner on 2026-06-09)
