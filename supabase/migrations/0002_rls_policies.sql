-- 0002_rls_policies.sql

-- Note on Admin Access
-- Supabase service role actions occur server-side bypassing RLS.
-- Therefore, true administrative operations that bypass these rules utilize `SUPABASE_SERVICE_ROLE_KEY` after verifying the JWT.

-- ENABLE RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_child_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE mastery_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE proof_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_issues ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES
-- Users can view their own profile. (Admins bypass via service role mapping server-side or by explicit rule).
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Parents can view their child profiles"
  ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND student_id = profiles.id));

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- 2. PARENT CHILD LINKS
-- Parents can view mapping where they are the parent. Students can view mapping where they are the student.
CREATE POLICY "Parents view own children links" 
  ON parent_child_links FOR SELECT 
  USING (auth.uid() = parent_id OR auth.uid() = student_id);
-- Insert/Update handled securely server-side.

-- 3. COURSES, MODULES, SKILL NODES (Public Read or Authenticated Read)
CREATE POLICY "Users can view active courses" 
  ON courses FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Users can view modules" 
  ON modules FOR SELECT 
  USING (true);

CREATE POLICY "Users can view skill nodes" 
  ON skill_nodes FOR SELECT 
  USING (true);

-- 4. ATTEMPTS
-- Students view their own, Parents view linked child's.
CREATE POLICY "Users can view own or childs attempts" 
  ON attempts FOR SELECT 
  USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND student_id = attempts.student_id)
  );

CREATE POLICY "Students can insert own attempts" 
  ON attempts FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

-- 5. MASTERY CHECKPOINTS
CREATE POLICY "Users can view own or childs mastery" 
  ON mastery_checkpoints FOR SELECT 
  USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND student_id = mastery_checkpoints.student_id)
  );

-- 6. PROOF ARTIFACTS
CREATE POLICY "Users can view own or childs artifacts" 
  ON proof_artifacts FOR SELECT 
  USING (
    auth.uid() = student_id OR 
    EXISTS (SELECT 1 FROM parent_child_links WHERE parent_id = auth.uid() AND student_id = proof_artifacts.student_id)
  );

CREATE POLICY "Students can insert own artifacts" 
  ON proof_artifacts FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

-- 7. REPORTS
CREATE POLICY "Parents can view reports" 
  ON reports FOR SELECT 
  USING (auth.uid() = parent_id);

-- 8. SHIPMENTS
CREATE POLICY "Students can view own shipments" 
  ON shipments FOR SELECT 
  USING (auth.uid() = student_id);

-- 9. SUPPORT ISSUES
CREATE POLICY "Users view own issues" 
  ON support_issues FOR SELECT 
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can insert issues" 
  ON support_issues FOR INSERT 
  WITH CHECK (auth.uid() = reporter_id);
