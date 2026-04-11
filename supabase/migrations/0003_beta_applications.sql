-- Create Beta Applications Table
CREATE TABLE public.beta_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    child_age_band TEXT NOT NULL,
    shipping_zip_code TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, fulfilled
    source TEXT NOT NULL DEFAULT 'web_form',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Enable RLS
ALTER TABLE public.beta_applications ENABLE ROW LEVEL SECURITY;

-- Note: The insertion comes exclusively via Next.js Server Actions using a Service Role Key.
-- Clients should never write directly to this table.
-- Admins can view/update records.

-- Allow read access only for Authenticated Admins
CREATE POLICY "Admins can view all beta applications" 
ON public.beta_applications
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Service Role (Next.js server environments) bypasses RLS inherently to INSERT the data.

-- Index for lookup by status or email
CREATE INDEX beta_app_status_idx ON public.beta_applications (status);
CREATE INDEX beta_app_email_idx ON public.beta_applications (email);
