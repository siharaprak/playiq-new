-- 0007_rls_module1_policies.sql
-- Enables RLS and adds row-level security policies for the 5 tables
-- introduced in 0005_module_1_schema.sql that were never covered in 0002_rls_policies.sql.

-- ENABLE RLS
ALTER TABLE events_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_node_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fingerprint_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_artifact_submissions ENABLE ROW LEVEL SECURITY;

-- 1. EVENTS LOG
-- Students can insert their own events; parents can read their linked child's events.
CREATE POLICY "Students can insert own events"
  ON events_log FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can view own or child events"
  ON events_log FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND student_id = events_log.student_id)
  );

-- 2. STUDENT NODE PROGRESS
-- Students can read and write their own progress rows.
-- Parents can read their linked child's progress.
CREATE POLICY "Students can insert own node progress"
  ON student_node_progress FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own node progress"
  ON student_node_progress FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Users can view own or child node progress"
  ON student_node_progress FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND student_id = student_node_progress.student_id)
  );

-- 3. ASSESSMENT SUBMISSIONS
-- Students can insert their own submissions; parents can read their linked child's.
CREATE POLICY "Students can insert own assessment submissions"
  ON assessment_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can view own or child assessment submissions"
  ON assessment_submissions FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND student_id = assessment_submissions.student_id)
  );

-- 4. FINGERPRINT SIGNALS
-- Students can insert their own signals; parents can read their linked child's.
CREATE POLICY "Students can insert own fingerprint signals"
  ON fingerprint_signals FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can view own or child fingerprint signals"
  ON fingerprint_signals FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND student_id = fingerprint_signals.student_id)
  );

-- 5. PROOF ARTIFACT SUBMISSIONS
-- Students can insert their own artifacts; parents can read their linked child's.
CREATE POLICY "Students can insert own proof artifacts"
  ON proof_artifact_submissions FOR INSERT
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Users can view own or child proof artifacts"
  ON proof_artifact_submissions FOR SELECT
  USING (
    auth.uid() = student_id OR
    EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND student_id = proof_artifact_submissions.student_id)
  );
