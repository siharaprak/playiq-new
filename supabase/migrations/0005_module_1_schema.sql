-- 0005_module_1_schema.sql

-- 1. Create Enums
CREATE TYPE pass_status_enum AS ENUM ('pass', 'fail', 'revise');
CREATE TYPE assessment_type_enum AS ENUM ('mini_check', 'teach_back', 'module_quiz', 'boss_battle');
CREATE TYPE artifact_type_enum AS ENUM ('study_rules', 'error_review');
CREATE TYPE event_type_enum AS ENUM ('lesson_started', 'activity_completed', 'assessment_submitted', 'node_mastered', 'tier_unlocked', 'module_completed');
CREATE TYPE artifact_status_enum AS ENUM ('submitted', 'approved');

-- 2. Events Log
CREATE TABLE events_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type event_type_enum NOT NULL,
  target_type VARCHAR(255) NOT NULL,
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Student Node Progress
CREATE TABLE student_node_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
  lesson_completed BOOLEAN DEFAULT false,
  activity_completed BOOLEAN DEFAULT false,
  mini_check_passed BOOLEAN DEFAULT false,
  teach_back_status pass_status_enum DEFAULT 'revise',
  node_mastered BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, node_id)
);

-- 4. Assessment Submissions
CREATE TABLE assessment_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  node_id UUID REFERENCES skill_nodes(id) ON DELETE CASCADE,
  assessment_type assessment_type_enum NOT NULL,
  submission_payload JSONB NOT NULL,
  score_numeric NUMERIC,
  pass_status pass_status_enum DEFAULT 'fail',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Fingerprint Signals
CREATE TABLE fingerprint_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  signal_type VARCHAR(255) NOT NULL,
  signal_value VARCHAR(255) NOT NULL,
  source_event_id UUID REFERENCES events_log(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Proof Artifact Submissions
CREATE TABLE proof_artifact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  artifact_type artifact_type_enum NOT NULL,
  content_payload JSONB NOT NULL,
  status artifact_status_enum DEFAULT 'submitted',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
