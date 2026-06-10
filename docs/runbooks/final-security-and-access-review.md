# Runbook: Final Security and Access Review

This document contains the final security and access review guidelines for the PlayIQ platform. It serves as an operational reference for verifying boundary gates, storage policies, logging safety, and invite-only beta constraints.

> [!NOTE]
> **Verification Depth**: This is a static security/access review and access boundary evidence check based on codebase scanning and config verification. Manual/live verification is still required where applicable to fully prove absolute runtime access safety.

---

## 1. Access Boundary Evidence Check

To ensure correct role segregation:
1. **Unauthenticated Access**: Guests attempting to access protected dashboards (`/student/*`, `/parent/*`, `/admin/*`, `/settings/*`, `/login/mfa`) must be intercepted by the middleware and routed to their respective login paths:
   * Standard paths route to `/login`.
   * Administrative paths (`/admin/*`) route to `/admin/login`.
2. **Student Access Boundaries**: Students must be blocked from parent summaries and admin features.
3. **Parent Access Boundaries**: Parents are strictly blocked from student-private raw tutor/assistant configuration parameters, raw LLM prompt/response logs, and signed storage URLs for files.
4. **Admin Route Separation**: All routes under `/admin/*` and the admin support ticket triage console must require an `admin` role verify check on the server side.
5. **API Endpoint Security**: Protected endpoints must preserve owner-only validation rules or admin roles for reviews.

---

## 2. Logging and Data Safety

1. **Compromised Data Audit**: Logs must never write sensitive parameters. Under no circumstances should the following be printed in stdout, telemetry events, or error monitoring alerts:
   * API Keys, client tokens, or `SUPABASE_SERVICE_ROLE_KEY`.
   * User JWTs, magic links, passwords, OTPs, or cookies.
   * Supabase pre-signed URLs or absolute storage paths.
   * Raw AI tutor/assistant prompts or raw Gemini completion messages.
   * Personal child-sensitive data (e.g. email, phone numbers, payment details).
2. **Support Action Notes**: Support notes created during resolution must never record user credentials, session tokens, or unnecessary sensitive parent/child records.

---

## 3. Storage Privacy

1. **Storage Buckets**: Both the `proof-artifacts` and `knowledge-files` storage buckets must be configured as private.
2. **Pre-signed Access**: Pre-signed download/upload URLs must be server-generated and short-lived (e.g. max 10 minutes).
3. **Parent Proof Access Prevention**: Parents must not receive signed URLs to download child proof files. The system only provides summary statistics and status values to parents, block-gating direct storage file retrieval.

---

## 4. Stripe/Payment Disabled/Deferred Policy

1. **Invite-only Beta Status**: Stripe/payment disabled/deferred for free invite-only beta.
2. **Zero Paid Checkout**: paid checkout not required for beta access, and registration flows bypass billing checkouts.
3. **Webhook Security**: Stripe webhook security documented but Stripe remains disabled/deferred for launch.
