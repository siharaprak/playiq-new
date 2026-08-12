-- Sprint 8: Assistant Build — Database Schema & RLS Setup
-- Documents the assistant schemas and extends knowledge_files for assistants.
-- IF NOT EXISTS guards make this migration idempotent and safe for live run.

-- 1. Extend Knowledge Files Table to support Assistant profiles
ALTER TABLE knowledge_files ADD COLUMN IF NOT EXISTS assistant_profile_id UUID REFERENCES assistant_profiles(id) ON DELETE CASCADE;

-- 2. Indexes for fast joins
CREATE INDEX IF NOT EXISTS idx_knowledge_files_assistant_id ON knowledge_files(assistant_profile_id);
CREATE INDEX IF NOT EXISTS idx_assistant_profiles_student_id ON assistant_profiles(student_id);
CREATE INDEX IF NOT EXISTS idx_assistant_versions_profile_id ON assistant_versions(assistant_profile_id);

-- 3. Ensure RLS is enabled on assistant tables
ALTER TABLE assistant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_feedback_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE assistant_usage_logs ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for assistant_profiles
-- Students can CRUD their own assistant profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'assistant_profiles_student_crud') THEN
    CREATE POLICY assistant_profiles_student_crud ON assistant_profiles
      FOR ALL USING (auth.uid() = student_id)
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

-- Admins can read all assistant profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'assistant_profiles_admin_read') THEN
    CREATE POLICY assistant_profiles_admin_read ON assistant_profiles
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- 5. RLS Policies for assistant_versions
-- Students can CRUD versions of their own assistant profiles
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'assistant_versions_student_crud') THEN
    CREATE POLICY assistant_versions_student_crud ON assistant_versions
      FOR ALL USING (
        assistant_profile_id IN (SELECT id FROM assistant_profiles WHERE student_id = auth.uid())
      )
      WITH CHECK (
        assistant_profile_id IN (SELECT id FROM assistant_profiles WHERE student_id = auth.uid())
      );
  END IF;
END $$;

-- Admins can read all assistant versions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'assistant_versions_admin_read') THEN
    CREATE POLICY assistant_versions_admin_read ON assistant_versions
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- 6. RLS Policies for assistant_feedback_signals
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'assistant_feedback_student_crud') THEN
    CREATE POLICY assistant_feedback_student_crud ON assistant_feedback_signals
      FOR ALL USING (auth.uid() = student_id)
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'assistant_feedback_admin_read') THEN
    CREATE POLICY assistant_feedback_admin_read ON assistant_feedback_signals
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- 7. RLS Policies for assistant_usage_logs
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'assistant_usage_student_crud') THEN
    CREATE POLICY assistant_usage_student_crud ON assistant_usage_logs
      FOR ALL USING (auth.uid() = student_id)
      WITH CHECK (auth.uid() = student_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'assistant_usage_admin_read') THEN
    CREATE POLICY assistant_usage_admin_read ON assistant_usage_logs
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;
