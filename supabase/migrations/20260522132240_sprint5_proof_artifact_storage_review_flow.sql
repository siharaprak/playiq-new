-- 20260522132240_sprint5_proof_artifact_storage_review_flow.sql

-- 1. Extend artifact_status_enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'artifact_status_enum' AND e.enumlabel = 'draft') THEN
    ALTER TYPE artifact_status_enum ADD VALUE 'draft';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'artifact_status_enum' AND e.enumlabel = 'under_review') THEN
    ALTER TYPE artifact_status_enum ADD VALUE 'under_review';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'artifact_status_enum' AND e.enumlabel = 'rejected') THEN
    ALTER TYPE artifact_status_enum ADD VALUE 'rejected';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'artifact_status_enum' AND e.enumlabel = 'revise') THEN
    ALTER TYPE artifact_status_enum ADD VALUE 'revise';
  END IF;
END $$;

-- 2. Extend artifact_type_enum for supplemental beta uploads
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'artifact_type_enum' AND e.enumlabel = 'supplemental_proof') THEN
    ALTER TYPE artifact_type_enum ADD VALUE 'supplemental_proof';
  END IF;
END $$;

-- 3. Add file metadata & review columns to proof_artifact_submissions
-- (Existing columns: id, student_id, module_id, artifact_type, content_payload, status, created_at)
ALTER TABLE public.proof_artifact_submissions
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS file_name TEXT,
  ADD COLUMN IF NOT EXISTS file_size_bytes BIGINT,
  ADD COLUMN IF NOT EXISTS mime_type TEXT,
  ADD COLUMN IF NOT EXISTS media_kind TEXT CHECK (media_kind IN ('photo', 'document', 'audio', 'video', 'text')),
  ADD COLUMN IF NOT EXISTS storage_bucket TEXT,
  ADD COLUMN IF NOT EXISTS storage_path TEXT,
  ADD COLUMN IF NOT EXISTS external_url TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_proof_artifact_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_proof_artifact_updated_at ON public.proof_artifact_submissions;
CREATE TRIGGER trg_proof_artifact_updated_at
BEFORE UPDATE ON public.proof_artifact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_proof_artifact_updated_at();

-- RLS Posture Note:
-- RLS was already enabled on this table in 0007_rls_module1_policies.sql.
-- "Students can insert own proof artifacts" AND "Users can view own or child proof artifacts"
-- The new columns are covered by these policies.
-- Review fields are protected from client mutation via the state machine server-side API logic.
-- Direct client UPDATE is NOT granted to students (only SELECT/INSERT), thus review fields are safe.
-- Admin/Teacher modifications happen via Service Role Key bypassing RLS.

/*
  MANUAL STEP REQUIRED: Storage Bucket Creation
  
  Since migrations run in the Postgres database and Storage buckets require API calls
  to the Supabase Storage microservice, you must run this either in the dashboard or via SQL:
  
  -- Create bucket via SQL (if pg_net / storage APIs are enabled internally)
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'proof-artifacts', 
    'proof-artifacts', 
    false, 
    104857600, -- 100MB
    '{"image/jpeg","image/png","image/webp","application/pdf","audio/mpeg","audio/mp4","audio/wav","audio/webm","video/mp4","video/webm","video/quicktime"}'
  ) ON CONFLICT (id) DO NOTHING;
*/
