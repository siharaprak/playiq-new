-- Module 0 — The Assessment: Cognitive Fingerprint & Baseline Storage
-- Creates student_assessment_profiles table and associated RLS policies.

CREATE TABLE IF NOT EXISTS student_assessment_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,

  -- Phase 1: Basic context
  display_name TEXT,
  grade_level TEXT,           -- e.g. '9th', '10th', 'college', 'adult'
  learner_type TEXT,          -- 'student' | 'adult'

  -- Phase 2: Cognitive Fingerprint (5 diagnostic signals)
  explanation_style TEXT,     -- 'verbal' | 'analytical' | 'visual'
  pacing_preference TEXT,     -- 'sequential' | 'top_down'
  challenge_response TEXT,    -- 'push_through' | 'ask_help' | 'take_break'
  ai_literacy_level TEXT,     -- 'answer_seeking' | 'explanation_seeking' | 'not_using' | 'power_user'
  motivation_driver TEXT,     -- 'mastery' | 'competitive' | 'purpose' | 'identity'

  -- Phase 3: Baseline PDI snapshot
  baseline_task1_answer TEXT,     -- Which AI answer they chose ('A' or 'B')
  baseline_task1_correct BOOLEAN, -- Did they pick the correct one?
  baseline_task2_response TEXT,   -- Their concept explanation text
  baseline_task2_score INTEGER,   -- Internal rubric 1-5
  baseline_task3_response TEXT,   -- Problem approach / logic response
  baseline_task3_score INTEGER,   -- Internal rubric 1-5
  baseline_pdi_snapshot JSONB,    -- Aggregated baseline: { task1: bool, task2: int, task3: int, composite: float }

  -- Phase 4: School Reality Check
  rescue_target_subject TEXT,     -- Subject where they feel lost
  advance_target_subject TEXT,    -- Subject they want to excel at
  personal_goal TEXT,             -- Open-ended goal statement

  -- Phase 5: Reveal
  reveal_summary TEXT,            -- AI-generated personalized Orion summary
  learning_blueprint JSONB,       -- Structured blueprint: { explanationStyle, pacingPref, ... }

  -- Flow metadata
  assessment_completed BOOLEAN NOT NULL DEFAULT false,
  assessment_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assessment_completed_at TIMESTAMPTZ,
  current_phase INTEGER NOT NULL DEFAULT 1,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One assessment profile per student
  CONSTRAINT student_assessment_profiles_student_id_key UNIQUE (student_id)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_sap_student_id ON student_assessment_profiles (student_id);

-- ── RLS ──────────────────────────────────────────────────────────────────────

ALTER TABLE student_assessment_profiles ENABLE ROW LEVEL SECURITY;

-- Students can read their own assessment profile
CREATE POLICY "Students can read own assessment"
  ON student_assessment_profiles FOR SELECT
  USING (auth.uid() = student_id);

-- Students can insert their own assessment profile
CREATE POLICY "Students can create own assessment"
  ON student_assessment_profiles FOR INSERT
  WITH CHECK (auth.uid() = student_id);

-- Students can update their own assessment profile
CREATE POLICY "Students can update own assessment"
  ON student_assessment_profiles FOR UPDATE
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

-- Parents can read assessment profiles of their linked children
CREATE POLICY "Parents can read linked child assessment"
  ON student_assessment_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM parent_child_links
      WHERE parent_child_links.parent_id = auth.uid()
        AND parent_child_links.student_id = student_assessment_profiles.student_id
    )
  );

-- Admins can read all assessment profiles
CREATE POLICY "Admins can read all assessments"
  ON student_assessment_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Service role bypass (for server actions)
CREATE POLICY "Service role full access"
  ON student_assessment_profiles FOR ALL
  USING (auth.role() = 'service_role');
