-- 20260527000000_sprint5_proof_artifacts.sql
-- Enables the full state-machine and secure storage bucket for Sprint 5.

-- 1. Evolve status in proof_artifact_submissions
-- Convert strict enum type to text with a check constraint to allow draft, submitted, under_review, approved, revise.
ALTER TABLE proof_artifact_submissions ALTER COLUMN status DROP DEFAULT;
ALTER TABLE proof_artifact_submissions ALTER COLUMN status TYPE TEXT USING status::TEXT;
ALTER TABLE proof_artifact_submissions DROP CONSTRAINT IF EXISTS chk_proof_artifact_status;
ALTER TABLE proof_artifact_submissions ADD CONSTRAINT chk_proof_artifact_status CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'revise'));
ALTER TABLE proof_artifact_submissions ALTER COLUMN status SET DEFAULT 'draft';

-- 2. Add File Metadata Columns
ALTER TABLE proof_artifact_submissions 
  ADD COLUMN IF NOT EXISTS file_path TEXT,
  ADD COLUMN IF NOT EXISTS file_size INTEGER,
  ADD COLUMN IF NOT EXISTS mime_type TEXT,
  ADD COLUMN IF NOT EXISTS original_name TEXT,
  ADD COLUMN IF NOT EXISTS review_notes TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

-- 3. Create Private Storage Bucket
-- Registers the 'proof-artifacts' bucket inside Supabase storage schema.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'proof-artifacts', 
  'proof-artifacts', 
  false, 
  10485760, -- 10MB file limit
  ARRAY['image/png', 'image/jpeg', 'image/gif', 'application/pdf', 'audio/mpeg', 'audio/wav', 'audio/webm', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET 
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 4. Enable Row Level Security on storage.objects (Managed by Supabase Storage natively)
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Define Storage RLS Policies for proof-artifacts
DROP POLICY IF EXISTS "Allow read access to owner student, parent, or admin" ON storage.objects;
CREATE POLICY "Allow read access to owner student, parent, or admin" ON storage.objects FOR SELECT TO authenticated USING (
  bucket_id = 'proof-artifacts' AND (
    -- Owner student (the first folder segment in path matches auth.uid)
    (storage.foldername(name))[1] = auth.uid()::text
    OR
    -- Linked parent
    EXISTS (
      SELECT 1 FROM parent_child_links 
      WHERE parent_id = auth.uid() 
        AND student_id::text = (storage.foldername(name))[1]
    )
    OR
    -- Admin role check
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
        AND role = 'admin'::user_role
      )
    )
  );

DROP POLICY IF EXISTS "Allow upload to owner student folder" ON storage.objects;
CREATE POLICY "Allow upload to owner student folder" ON storage.objects FOR INSERT TO authenticated WITH CHECK (
  bucket_id = 'proof-artifacts' AND 
  (storage.foldername(name))[1] = auth.uid()::text AND
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
      AND role = 'student'::user_role
  )
);

DROP POLICY IF EXISTS "Allow student delete if draft" ON storage.objects;
CREATE POLICY "Allow student delete if draft" ON storage.objects FOR DELETE TO authenticated USING (
  bucket_id = 'proof-artifacts' AND 
  (storage.foldername(name))[1] = auth.uid()::text AND (
    NOT EXISTS (
      SELECT 1 FROM proof_artifact_submissions 
      WHERE file_path = name
    )
    OR
    EXISTS (
      SELECT 1 FROM proof_artifact_submissions 
      WHERE file_path = name 
        AND student_id = auth.uid() 
        AND status = 'draft'
    )
  )
);
