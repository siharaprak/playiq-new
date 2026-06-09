# Production Configuration and Secrets Handling

This document establishes standard procedures for configuring production environments and protecting secrets.

---

## 1. Hosting Target & Configuration Source
- **Primary Standard Target**: Vercel. All environment variables and secrets are managed via the Vercel Project Settings panel.
- **Firebase App Hosting**: The `apphosting.yaml` file exists only as a legacy/configuration reference. Deployment operations do not target Firebase App Hosting, and no App Hosting assumptions are made during active releases.

---

## 2. Secrets & Environment Variables Isolation
- **Client Bundle Isolation**: Only public-safe variables (prefixed with `NEXT_PUBLIC_`) may be referenced in client-side Next.js code.
- **Server Role Isolation**: `SUPABASE_SERVICE_ROLE_KEY` and `GEMINI_API_KEY` are server-only. They are restricted to server routes, API endpoints, and utility modules tagged with `server-only`.
- **Logs Exposure Safety**: No raw secrets, credential values, prefixes, suffixes, key lengths, or tokens are logged or written in trace logs. All logging uses `safe-logger.ts` to prevent exposure.
- **Local Environment Files**: Local `.env` files must never be committed. The `.gitignore` file must restrict all env files from version control.
- **Hardcoding Restrictions**: No raw credentials or secret tokens may be hardcoded inside pages, assets, docs, or testing scripts.
- **Bypass/Banning Resets**: Staging reset environment variables (`RESET_SECURITY_BYPASS_TOKEN`) are strictly banned from production environment configs and cannot be run in the production execution path.

---

## 3. Required Environment Variables
The following environment variables are verified at release:
- `NEXT_PUBLIC_SUPABASE_URL`: PRESENT (Public-safe URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: PRESENT (Public-safe key)
- `SUPABASE_SERVICE_ROLE_KEY`: PRESENT (Server-only key)
- `GEMINI_API_KEY`: PRESENT (Server-only key)
- `PROOF_CLEANUP_CRON_SECRET`: PRESENT (Server-only key)
- `STRIPE_SECRET_KEY`: OPTIONAL_DEFERRED (Bypassed in free beta)
- `STRIPE_WEBHOOK_SECRET`: OPTIONAL_DEFERRED (Bypassed in free beta)
- `NEXT_PUBLIC_GA_ID`: OPTIONAL_DEFERRED (Analytics tracking)

---

## 4. Production Environment Verification Record
- **Verification Status**: PASS
- **Verification Date**: 2026-06-09
- **Verified By**: Project Owner
- **Verified Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: PRESENT
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: PRESENT
  - `SUPABASE_SERVICE_ROLE_KEY`: PRESENT
  - `GEMINI_API_KEY`: PRESENT
  - `PROOF_CLEANUP_CRON_SECRET`: PRESENT
  - `STRIPE_SECRET_KEY`: OPTIONAL_DEFERRED (Disabled/deferred for free beta)
  - `STRIPE_WEBHOOK_SECRET`: OPTIONAL_DEFERRED (Disabled/deferred for free beta)
  - `NEXT_PUBLIC_GA_ID`: OPTIONAL_DEFERRED
