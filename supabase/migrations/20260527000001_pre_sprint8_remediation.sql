-- Migration: Pre-Sprint 8 Remediation Schemas
-- Documents and defines missing user_roles, discussion, and assistant builder tables.
-- Uses CREATE TABLE IF NOT EXISTS and ALTER TABLE ADD COLUMN IF NOT EXISTS for idempotency.

-- 1. USER ROLES TABLE
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_roles_read_own') THEN
    CREATE POLICY user_roles_read_own ON user_roles
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'user_roles_admin_all') THEN
    CREATE POLICY user_roles_admin_all ON user_roles
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;


-- 2. DISCUSSION BOARD TABLES
CREATE TABLE IF NOT EXISTS discussion_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS discussion_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES discussion_categories(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'edited', 'locked', 'deleted', 'removed')),
  is_pinned BOOLEAN DEFAULT false,
  is_locked BOOLEAN DEFAULT false,
  reply_count INTEGER DEFAULT 0,
  last_reply_at TIMESTAMPTZ DEFAULT NOW(),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  removed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  removed_at TIMESTAMPTZ,
  removal_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS discussion_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES discussion_topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'edited', 'deleted', 'removed')),
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  removed_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  removed_at TIMESTAMPTZ,
  removal_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS discussion_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES discussion_topics(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES discussion_replies(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'ignored')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_discussion_categories_slug ON discussion_categories(slug);
CREATE INDEX IF NOT EXISTS idx_discussion_topics_category_id ON discussion_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_discussion_topics_author_id ON discussion_topics(author_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_topic_id ON discussion_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_discussion_replies_author_id ON discussion_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_discussion_reports_topic_id ON discussion_reports(topic_id);
CREATE INDEX IF NOT EXISTS idx_discussion_reports_reply_id ON discussion_reports(reply_id);

-- Enable RLS
ALTER TABLE discussion_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_reports ENABLE ROW LEVEL SECURITY;

-- Categories RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_categories_read_all') THEN
    CREATE POLICY discussion_categories_read_all ON discussion_categories
      FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_categories_admin_all') THEN
    CREATE POLICY discussion_categories_admin_all ON discussion_categories
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- Topics RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_topics_read_active') THEN
    CREATE POLICY discussion_topics_read_active ON discussion_topics
      FOR SELECT USING (status IN ('active', 'edited', 'locked'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_topics_student_insert') THEN
    CREATE POLICY discussion_topics_student_insert ON discussion_topics
      FOR INSERT WITH CHECK (auth.uid() = author_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_topics_author_update') THEN
    CREATE POLICY discussion_topics_author_update ON discussion_topics
      FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_topics_admin_all') THEN
    CREATE POLICY discussion_topics_admin_all ON discussion_topics
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- Replies RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_replies_read_active') THEN
    CREATE POLICY discussion_replies_read_active ON discussion_replies
      FOR SELECT USING (status IN ('active', 'edited'));
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_replies_student_insert') THEN
    CREATE POLICY discussion_replies_student_insert ON discussion_replies
      FOR INSERT WITH CHECK (auth.uid() = author_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_replies_author_update') THEN
    CREATE POLICY discussion_replies_author_update ON discussion_replies
      FOR UPDATE USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_replies_admin_all') THEN
    CREATE POLICY discussion_replies_admin_all ON discussion_replies
      FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;

-- Reports RLS Policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_reports_insert') THEN
    CREATE POLICY discussion_reports_insert ON discussion_reports
      FOR INSERT WITH CHECK (auth.uid() = reporter_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'discussion_reports_admin_read') THEN
    CREATE POLICY discussion_reports_admin_read ON discussion_reports
      FOR SELECT USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      );
  END IF;
END $$;


-- 3. ASSISTANT BUILDER TABLES
CREATE TABLE IF NOT EXISTS assistant_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  purpose TEXT,
  audience TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'published')),
  current_version_id UUID,
  doctrine_config JSONB DEFAULT '{}'::jsonb,
  boundaries JSONB DEFAULT '{}'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync columns with codebase model
ALTER TABLE assistant_profiles ADD COLUMN IF NOT EXISTS persona_config JSONB DEFAULT '{}'::jsonb;

CREATE TABLE IF NOT EXISTS assistant_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_profile_id UUID NOT NULL REFERENCES assistant_profiles(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  custom_instructions JSONB DEFAULT '{}'::jsonb,
  knowledge_file_ids UUID[] DEFAULT '{}'::uuid[],
  change_summary TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sync columns with codebase model
ALTER TABLE assistant_versions ADD COLUMN IF NOT EXISTS system_prompt TEXT DEFAULT '';
ALTER TABLE assistant_versions ADD COLUMN IF NOT EXISTS tools_config JSONB DEFAULT '{"knowledge_file_ids": []}'::jsonb;

-- Link FK back to assistant_profiles
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_assistant_profiles_current_version'
  ) THEN
    ALTER TABLE assistant_profiles
      ADD CONSTRAINT fk_assistant_profiles_current_version
      FOREIGN KEY (current_version_id) REFERENCES assistant_versions(id) ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS assistant_feedback_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_profile_id UUID REFERENCES assistant_profiles(id) ON DELETE CASCADE,
  tutor_profile_id UUID REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  signal_type TEXT NOT NULL,
  rating INTEGER,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS assistant_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assistant_profile_id UUID REFERENCES assistant_profiles(id) ON DELETE CASCADE,
  tutor_profile_id UUID REFERENCES tutor_profiles(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  prompt_classification TEXT,
  integrity_result TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
