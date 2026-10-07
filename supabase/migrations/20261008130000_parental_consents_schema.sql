-- 20261008130000_parental_consents_schema.sql
-- Phase 3B: Verifiable Parental Consent Records & Profiles Schema

-- 1. Add age_band and consent_status to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS age_band text CHECK (age_band IN ('under_13', '13_14', '15_17', 'over_17')),
ADD COLUMN IF NOT EXISTS consent_status text NOT NULL DEFAULT 'verified' CHECK (consent_status IN ('verified', 'pending_consent', 'recorded_unverified', 'legacy_unknown', 'withdrawn'));

-- 2. Create parental_consents table
CREATE TABLE IF NOT EXISTS public.parental_consents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    policy_version text NOT NULL DEFAULT '2026-10-06',
    consent_text text NOT NULL,
    consented_at timestamptz NOT NULL DEFAULT now(),
    verification_method text NOT NULL DEFAULT 'parent_verified_email',
    verification_status text NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected', 'withdrawn')),
    verified_at timestamptz DEFAULT now(),
    collection_consent boolean NOT NULL DEFAULT true,
    ai_processing_consent boolean NOT NULL DEFAULT true,
    third_party_disclosure_consent boolean NOT NULL DEFAULT true,
    withdrawn_at timestamptz,
    withdrawal_reason text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for efficient lookups
CREATE INDEX IF NOT EXISTS idx_parental_consents_parent_id ON public.parental_consents(parent_id);
CREATE INDEX IF NOT EXISTS idx_parental_consents_student_id ON public.parental_consents(student_id);

-- 3. Enable RLS
ALTER TABLE public.parental_consents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Admins have full access to parental consents" ON public.parental_consents;
DROP POLICY IF EXISTS "Parents can view their own consents" ON public.parental_consents;
DROP POLICY IF EXISTS "Students can view their own consent" ON public.parental_consents;

-- Admins full access
CREATE POLICY "Admins have full access to parental consents"
ON public.parental_consents
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  ) OR (
    auth.jwt() ->> 'email' = 'teamsienvi@gmail.com'
  )
);

-- Parents can view consents they granted
CREATE POLICY "Parents can view their own consents"
ON public.parental_consents
FOR SELECT
TO authenticated
USING (auth.uid() = parent_id);

-- Students can view consent granted for them
CREATE POLICY "Students can view their own consent"
ON public.parental_consents
FOR SELECT
TO authenticated
USING (auth.uid() = student_id);
