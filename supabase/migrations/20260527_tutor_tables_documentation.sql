-- Sprint 7: Tutor Build — Table Documentation Migration
-- These tables already exist in the live Supabase DB (created via SQL Editor).
-- This migration documents their schema for version control.
-- IF NOT EXISTS guards make it safe to run against the live DB.

-- Tutor Profiles (one per student per course)
CREATE TABLE IF NOT EXISTS tutor_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid,
  name text NOT NULL DEFAULT 'My PlayIQ Tutor',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'published')),
  current_version_id uuid,
  fingerprint_snapshot jsonb NOT NULL DEFAULT '{}',
  doctrine_config jsonb NOT NULL DEFAULT '{}',
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Tutor Versions (immutable snapshots)
CREATE TABLE IF NOT EXISTS tutor_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_profile_id uuid NOT NULL REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  version_number int4 NOT NULL,
  instructions jsonb NOT NULL DEFAULT '{}',
  knowledge_file_ids uuid[] NOT NULL DEFAULT '{}',
  change_summary text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Knowledge Files (linked to tutor profiles)
CREATE TABLE IF NOT EXISTS knowledge_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  tutor_profile_id uuid REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text,
  file_size int4,
  mime_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tutor_profiles_student_id ON tutor_profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_tutor_versions_profile_id ON tutor_versions(tutor_profile_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_files_profile_id ON knowledge_files(tutor_profile_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_files_student_id ON knowledge_files(student_id);

-- RLS Policies
ALTER TABLE tutor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_files ENABLE ROW LEVEL SECURITY;

-- Students can CRUD their own tutor profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tutor_profiles_student_crud') THEN
    CREATE POLICY tutor_profiles_student_crud ON tutor_profiles
      FOR ALL USING (auth.uid() = student_id)
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

-- Students can CRUD versions of their own tutor profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tutor_versions_student_crud') THEN
    CREATE POLICY tutor_versions_student_crud ON tutor_versions
      FOR ALL USING (
        tutor_profile_id IN (SELECT id FROM tutor_profiles WHERE student_id = auth.uid())
      )
      WITH CHECK (
        tutor_profile_id IN (SELECT id FROM tutor_profiles WHERE student_id = auth.uid())
      );
  END IF;
END $$;

-- Students can CRUD their own knowledge files
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'knowledge_files_student_crud') THEN
    CREATE POLICY knowledge_files_student_crud ON knowledge_files
      FOR ALL USING (auth.uid() = student_id)
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

-- Admins can read all tutor data
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tutor_profiles_admin_read') THEN
    CREATE POLICY tutor_profiles_admin_read ON tutor_profiles
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'tutor_versions_admin_read') THEN
    CREATE POLICY tutor_versions_admin_read ON tutor_versions
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'knowledge_files_admin_read') THEN
    CREATE POLICY knowledge_files_admin_read ON knowledge_files
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;
