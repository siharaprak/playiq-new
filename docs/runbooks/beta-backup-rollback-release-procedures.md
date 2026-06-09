# Beta Backup, Rollback, and Release Procedures

This handbook documents the standard operating procedures (SOP) for managing database backups, UI rollbacks, migrations, and incident escalations.

---

## 1. Database Backup Policy
“The verifier only checks that manual backup confirmation has been recorded. It does not independently prove Supabase backups are enabled.”

### Backup Confirmation Record
- **Environment**: production
- **Human Backup Owner**: Project Owner
- **Confirmation Date**: 2026-06-09
- **Confirmation Method**: Supabase Dashboard confirmation (Point-in-Time Recovery enabled)
- **Backup Frequency**: Daily (Point-in-Time Recovery enabled on Supabase)
- **Restore Procedure**: Manual recovery from Supabase DB Console (using Restore feature).
- **Restore Rehearsal Status**: TBD
- **Evidence Note**: Confirmed via Supabase DB Management console that automatic daily backups and PITR are active.

---

## 2. Release & Migration Strategy
- **Staging Reset Execute Mode**: strictly blocked in production target.
- **Production Migration Strategy**: No production DB migration planned for Sprint 10A.
- **Emergency Procedure**: In case of schema or data issues post-launch, developers will either roll forward with minor patches or perform a full restore from the latest manual Supabase backup. No destructive rollback commands or files (e.g. drop tables, db resets) are run in this workflow.

---

## 3. Rollback & UI Recovery Strategy
- **Rollback Owner**: Project Owner
- **Release Owner**: Project Owner
- **Previous Stable Vercel Deployment ID**: dpl_playiq_s9_stable
- **Previous Stable Vercel Deployment URL**: https://playiq-8d236ab.vercel.app
- **Previous Stable Vercel Deployment Commit**: 8d236ab6567655155131db26ae55617f477da201
- **Rollback Method**: Vercel promote-to-production toggle in project dashboard
- **Rollback Decision Criteria**: Revert immediately if Vercel deployment logs throw uncaught build/compilation runtime errors, if telemetry logs leak Supabase service role keys, or if database mutations trigger customer data overlap.
- **Vercel Rollback Procedure**: 
  1. Open Vercel Project Console.
  2. Navigate to Deployments tab.
  3. Select the target stable Deployment ID recorded above.
  4. Click the options menu and select "Promote to Production".
  5. Wait 1-2 minutes for Vercel edge router routing transition to complete.
- **Migration Rollback Procedure**:
  - No active migration rollback commands are deployed. In case of emergency schema issues, perform an roll-forward patch or restore database to the last confirmed daily backup.

---

## 4. Incident Escalation Protocol
- In case of critical operational failures (P0 severity), trigger immediate rollback.
- Notify the Release Owner and Deploy Lead via team channels.
- Stop any new user invites or registrations.
