# PlayIQ Deployment Runbook

## 1. Environment Variable Configuration
Ensure the following variables are strictly mapped in your production environment (Firebase App Hosting Secrets Manager or Vercel Settings):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_INSTANCE].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_KEY] // *SERVER ONLY*

# Stripe Processing
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... during staging)
STRIPE_WEBHOOK_SECRET=whsec_... (Crucial for endpoint security verification)
STRIPE_BETA_PRICE_ID=price_...

# URL Routing
NEXT_PUBLIC_APP_URL=https://www.playiq.com // Base URL for Auth/Stripe Redirects
```

## 2. Stripe Setup Sequence
1. Navigate to Stripe Dashboard.
2. Create a new Product: `PlayIQ Course 1: Apprentice Pilot Kit` (Hardware + Software Access).
3. Generate a Payment Price (e.g., $149 One-time). Grab the `price_` ID.
4. Ensure the `NEXT_PUBLIC_APP_URL` matches your staging/production domain exactly so Stripe can handoff users cleanly back to `/signup?beta=success` or `/beta?canceled=true`.
5. Set `STRIPE_BETA_PRICE_ID` in your remote hosting environment to the copied Price ID.

## 3. Stripe Webhook Linkage
To ensure the `beta_applications` natively flag `paid` status without manual checks:
1. In the Stripe Dashboard, navigate to Developers -> Webhooks.
2. Add an Endpoint pointing to `https://[YOUR_DOMAIN]/api/stripe/webhook/route`.
3. Select events to listen to: `checkout.session.completed` (Mandatory), and `checkout.session.expired` (Optional).
4. Extract the generated Webhook Signing Secret (`whsec_...`) and place it into `STRIPE_WEBHOOK_SECRET` securely in Firebase App Hosting / Vercel.
5. In local testing, use the Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook` to capture your local signing secret.

## 4. Supabase Linkage & Migrations
1. Connect via CLI: `supabase login`
2. Ensure you have run:
   - `0001_initial_schema.sql`
   - `0002_enable_rls.sql`
   - `0003_beta_applications.sql`
   - `0004_auth_profile_trigger.sql` // Critical: Ensures new signups map natively into profiles.
3. Validate trigger logic on new user adds from the Supabase Studio Logs.

## 5. Firebase App Hosting Readiness
Our Next.js 14 logic uses Native caching opt-outs by calling `cookies()` structurally across the application headers on dashboard pathways. This seamlessly instructs Firebase edge boundaries to stream dynamic route queries un-cached perfectly on demand, allowing the server actions and session parsing to execute correctly on edge-proxies without caching outdated dashboards to wrong identities. 

## 6. Rollback or "Disable Beta" Procedures
To cleanly throttle the beta intake and shutdown Stripe billing without causing crashes:
1. In `src/app/(public)/beta/actions.ts`, temporarily remove or disable the `STRIPE_BETA_PRICE_ID` environment variable mapping in your host.
2. The logic natively cascades into a safe `console.log("Stripe config missing")` fallback, logging the DB insert without generating a Stripe Session, effectively accepting Waitlist-style enrollments instantly without charging.
