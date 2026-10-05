-- PlayIQ Early Access leads (parent/guardian email captured by the site-wide popup)
-- See: "PlayIQ Early Access — Lead Generation & Recruitment Handoff", Section 5.
CREATE TABLE IF NOT EXISTS public.early_access_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'interested', -- interested, applied, unsubscribed
    source TEXT NOT NULL DEFAULT 'popup',      -- capture mechanism (popup)
    source_path TEXT,                          -- page the lead signed up on
    trigger TEXT,                              -- timer, scroll, exit_intent
    consent_text TEXT NOT NULL,                -- exact wording shown at signup (audit trail)
    consented_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
    unsubscribed_at TIMESTAMPTZ,
    confirmation_sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE UNIQUE INDEX IF NOT EXISTS early_access_leads_email_key
    ON public.early_access_leads (lower(email));
CREATE UNIQUE INDEX IF NOT EXISTS early_access_leads_unsubscribe_token_key
    ON public.early_access_leads (unsubscribe_token);
CREATE INDEX IF NOT EXISTS early_access_leads_status_idx
    ON public.early_access_leads (status);

ALTER TABLE public.early_access_leads ENABLE ROW LEVEL SECURITY;

-- Writes come exclusively from Next.js server code using the Service Role Key
-- (which bypasses RLS). Clients never write directly to this table.

CREATE POLICY "Admins can view early access leads"
ON public.early_access_leads
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);
