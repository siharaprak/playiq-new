-- Weekend course release: owner-only, version/shell-isolated student evidence.
-- Apply only to the approved preview/staging database. No provider/runtime activation.
BEGIN;

-- No automatic enrollment or profile-status backfill. A staging administrator
-- grants this release only to the approved existing student test accounts.
CREATE TABLE public.course_release_enrollments (
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  release_id text NOT NULL CHECK (release_id = 'playiq-2026-10-30'),
  shell text NOT NULL CHECK (shell IN ('beta','final')),
  enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id,release_id,shell)
);
ALTER TABLE public.course_release_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_release_enrollments FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.course_release_enrollments FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.course_release_enrollments TO authenticated;
GRANT ALL ON public.course_release_enrollments TO service_role;
CREATE POLICY course_release_enrollment_read ON public.course_release_enrollments
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = student_id AND enabled = true);
CREATE FUNCTION public.course_release_can_access(requested_shell text)
RETURNS boolean LANGUAGE sql STABLE SET search_path = pg_catalog AS $$
  SELECT EXISTS (SELECT 1 FROM public.course_release_enrollments e
    WHERE e.student_id = (SELECT auth.uid()) AND e.release_id = 'playiq-2026-10-30'
      AND e.shell = requested_shell AND e.enabled = true);
$$;

CREATE FUNCTION public.course_release_text_valid(value text, max_chars integer)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = pg_catalog AS $$
  SELECT value IS NOT NULL AND char_length(value) <= max_chars
    AND translate(value, E'\n\r\t', '') !~ '[[:cntrl:]]'
    AND value !~ U&'[\007f-\009f\200b-\200f\202a-\202e\2060-\206f\feff]';
$$;

-- Stable IDs mirror src/lib/course-release/activities.ts; tested in PostgreSQL.
CREATE FUNCTION public.course_release_choices_valid(module_no integer, value text)
RETURNS boolean LANGUAGE plpgsql IMMUTABLE SET search_path = pg_catalog AS $$
DECLARE
  choices jsonb;
  allowed jsonb := $options${
    "0": {"m0-explanation":["A","B","C"],"m0-pace":["A","B"],"m0-stuck":["A","B","C"],"m0-experience":["A","B","C","D"],"m0-motivation":["A","B","C","D"],"m0-accuracy":["A","B"]},
    "1": {"m1-power":["A","B","C"],"m1-use-1":["A","B","C"],"m1-use-2":["A","B","C"],"m1-use-3":["A","B","C"],"m1-use-4":["A","B","C"],"m1-use-5":["A","B","C"],"m1-use-6":["A","B","C"],"m1-mode-1":["A","B","C","D","E","F"],"m1-mode-2":["A","B","C","D","E","F"],"m1-mode-3":["A","B","C","D","E","F"],"m1-mode-4":["A","B","C","D","E","F"],"m1-mode-5":["A","B","C","D","E","F"],"m1-verify-1":["A","B","C"],"m1-verify-2":["A","B","C"],"m1-verify-3":["A","B","C"],"m1-verify-4":["A","B","C"],"m1-verify-5":["A","B","C"]},
    "2": {"m2-boundary-1":["A","B","C"],"m2-boundary-2":["A","B","C"],"m2-boundary-3":["A","B","C"],"m2-boundary-4":["A","B","C"],"m2-boundary-5":["A","B","C"],"m2-focus":["A","B","C","D","E"]},
    "3": {"m3-arrival":["A","B","C"]},
    "4": {"m4-gap-1":["A","B","C","D","E","F"],"m4-gap-2":["A","B","C","D","E","F"],"m4-gap-3":["A","B","C","D","E","F"],"m4-gap-4":["A","B","C","D","E","F"]},
    "5": {"m5-purpose":["A","B","C","D","E"]},
    "6": {"m6-mistake-1":["A","B","C","D","E","F"],"m6-mistake-2":["A","B","C","D","E","F"],"m6-mistake-3":["A","B","C","D","E","F"],"m6-mistake-4":["A","B","C","D","E","F"],"m6-quiz-format":["A","B","C","D"]},
    "7": {"m7-clean-file":["A","B"]},
    "8": {"m8-support":["A","B","C","D","E"],"m8-feedback":["A","B","C","D"]},
    "9": {"m9-quiz-1":["A","B"],"m9-quiz-2":["A","B"],"m9-quiz-3":["A","B"]},
    "10": {"m10-opening":["A","B"],"m10-quiz-1":["A","B"],"m10-quiz-2":["A","B"],"m10-quiz-3":["A","B"]},
    "11": {"m11-brief":["A","B"],"m11-quiz-1":["A","B"],"m11-quiz-2":["A","B"],"m11-quiz-3":["A","B"]},
    "12": {"m12-reminder":["A","B"],"m12-quiz-1":["A","B"],"m12-quiz-2":["A","B"],"m12-quiz-3":["A","B"]},
    "14": {"m14-dashboard-cue":["A","B","C","D"],"m14-quiz-1":["A","B"],"m14-quiz-2":["A","B"],"m14-quiz-3":["A","B"]}
  }$options$::jsonb;
BEGIN
  IF module_no NOT BETWEEN 0 AND 14 OR module_no = 13
    OR NOT public.course_release_text_valid(value, 6000) THEN RETURN false; END IF;
  BEGIN
    choices := value::jsonb;
  EXCEPTION WHEN invalid_text_representation THEN RETURN false;
  END;
  IF jsonb_typeof(choices) IS DISTINCT FROM 'object' THEN RETURN false; END IF;
  RETURN NOT EXISTS (
    SELECT 1 FROM jsonb_each(choices) entry
    WHERE jsonb_typeof(entry.value) <> 'string'
      OR NOT COALESCE((allowed -> module_no::text -> entry.key) ? (entry.value #>> '{}'), false)
  );
END;
$$;

CREATE FUNCTION public.course_release_answers_valid(module_no integer, answers jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = pg_catalog AS $$
  SELECT COALESCE(CASE WHEN jsonb_typeof(answers) <> 'object' OR module_no NOT BETWEEN 0 AND 14 THEN false
  ELSE octet_length(answers::text) <= 65536 AND NOT EXISTS (
    SELECT 1 FROM jsonb_each(answers) entry
    WHERE jsonb_typeof(entry.value) <> 'string'
      OR NOT public.course_release_text_valid(entry.value #>> '{}', 6000)
      OR (entry.key = 'lessonChoices' AND NOT public.course_release_choices_valid(module_no, entry.value #>> '{}'))
      OR NOT (entry.key = ANY(CASE module_no
        WHEN 0 THEN ARRAY['learningContext','imaginationGoal','explanationSignal','pacingSignal','challengeResponse','aiExperience','motivation','accuracyCheck','ownWordsExplanation','explanationReflection','planningChallenge','rescueSubject','advanceSubject','personalGoal','workspaceCheck','evidenceStatus','tutorRule','retest']
        WHEN 1 THEN ARRAY['characterWin','aiUseReflection','modeAndPrompts','verification','topic','analogyResult','stepsResult','bigPictureResult','explanationStart','explainModeResult','hintModeResult','studyBoundaries','evidenceStatus','tutorRule','retest']
        WHEN 2 THEN ARRAY['responsibility','schoolPolicy','voiceComparison','truthFilter','focus5','focus10','focus15','focusBlock','reset','distraction','voiceBoundary','evidenceStatus','tutorRule','retest']
        WHEN 3 THEN ARRAY['topic','prelearnMap','mapResult','exampleResult','questionResult','entryComparison','boundaryExample','prelearnBrief','recallResult','classDebrief','evidenceStatus','tutorRule','retest']
        WHEN 4 THEN ARRAY['topicAndSource','confusionPoint','gapHypothesis','analogyResult','stepsResult','questionsResult','rescueComparison','rescueStart','teachBack','remainingGap','evidenceStatus','tutorRule','retest']
        WHEN 5 THEN ARRAY['topicAndSource','compression','audioResult','visualResult','teachBackResult','reviewComparison','reviewStart','uncertainty','evidenceStatus','tutorRule','retest']
        WHEN 6 THEN ARRAY['topicAndSource','singleQuizResult','fullQuizResult','quizStart','mistake','correction','matchedQuestion','afterWrongAnswer','reviewPlan','reminderMethod','evidenceStatus','tutorRule','retest']
        WHEN 7 THEN ARRAY['topicAndSources','studyPack','messyResult','organizedResult','fileComparison','knowledgeUse','fileCorrections','privacyDecision','evidenceStatus','tutorRule','retest']
        WHEN 8 THEN ARRAY['taskAndPermission','answerMap','originalDraft','coachingChoices','revisedDraft','voiceComparison','writingSupport','authorshipBoundary','samplePrivacy','evidenceStatus','tutorRule','retest']
        WHEN 9 THEN ARRAY['discovery','integration','buildCheck']
        WHEN 10 THEN ARRAY['tutorTests','revision','learningMission']
        WHEN 11 THEN ARRAY['assistantBrief','assistantBuild']
        WHEN 12 THEN ARRAY['assistantTests','assistantRevision']
        WHEN 13 THEN ARRAY['futureIdea']
        WHEN 14 THEN ARRAY['capstone','dashboard','skillsDemonstration','nextStep']
        ELSE ARRAY[]::text[] END) OR (entry.key = 'lessonChoices' AND module_no <> 13))
  ) END, false);
$$;

CREATE FUNCTION public.course_release_assessment_valid(context jsonb)
RETURNS boolean LANGUAGE sql IMMUTABLE SET search_path = pg_catalog AS $$
  SELECT CASE WHEN context IS NULL THEN true WHEN jsonb_typeof(context) <> 'object' THEN false
    ELSE octet_length(context::text) <= 300000 AND NOT EXISTS (
      SELECT 1 FROM jsonb_each(context) entry
      WHERE jsonb_typeof(entry.value) <> 'string'
        OR NOT public.course_release_text_valid(entry.value #>> '{}', 6000)
        OR entry.key NOT IN ('grade_level','explanation_style','pacing_preference','challenge_response','ai_literacy_level','motivation_driver','baseline_task1_answer','baseline_task2_response','baseline_task3_response','rescue_target_subject','advance_target_subject','personal_goal')
    ) END;
$$;

CREATE TABLE public.course_release_learning_records (
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  release_id text NOT NULL CHECK (release_id = 'playiq-2026-10-30'),
  shell text NOT NULL CHECK (shell IN ('beta', 'final')),
  module_number smallint NOT NULL CHECK (module_number BETWEEN 0 AND 14),
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  include_in_tutor boolean NOT NULL DEFAULT false,
  completed boolean NOT NULL DEFAULT false,
  -- Snapshot of only allowlisted legacy answers, captured on Module 00 approval.
  assessment_context jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, release_id, shell, module_number),
  CONSTRAINT course_release_valid_answers CHECK (public.course_release_answers_valid(module_number, answers)),
  CONSTRAINT course_release_valid_assessment CHECK (public.course_release_assessment_valid(assessment_context)),
  CONSTRAINT course_release_approved_assessment_only CHECK (
    assessment_context IS NULL OR (module_number = 0 AND include_in_tutor = true)
  )
);

CREATE TABLE public.course_release_beta_feedback (
  student_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  release_id text NOT NULL CHECK (release_id = 'playiq-2026-10-30'),
  shell text NOT NULL DEFAULT 'beta' CHECK (shell = 'beta'),
  module_number smallint NOT NULL CHECK (module_number BETWEEN 0 AND 14),
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback text NOT NULL CHECK (public.course_release_text_valid(feedback, 4000)),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, release_id, shell, module_number),
  FOREIGN KEY (student_id, release_id, shell, module_number)
    REFERENCES public.course_release_learning_records(student_id, release_id, shell, module_number) ON DELETE CASCADE
);

CREATE FUNCTION public.course_release_stamp_update()
RETURNS trigger LANGUAGE plpgsql SET search_path = pg_catalog AS $$
BEGIN
  NEW.created_at := OLD.created_at;
  NEW.updated_at := clock_timestamp();
  RETURN NEW;
END;
$$;
CREATE TRIGGER course_release_record_stamp BEFORE UPDATE ON public.course_release_learning_records
  FOR EACH ROW EXECUTE FUNCTION public.course_release_stamp_update();
CREATE TRIGGER course_release_feedback_stamp BEFORE UPDATE ON public.course_release_beta_feedback
  FOR EACH ROW EXECUTE FUNCTION public.course_release_stamp_update();

ALTER TABLE public.course_release_learning_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_release_learning_records FORCE ROW LEVEL SECURITY;
ALTER TABLE public.course_release_beta_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_release_beta_feedback FORCE ROW LEVEL SECURITY;
REVOKE ALL ON public.course_release_learning_records, public.course_release_beta_feedback FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_release_learning_records, public.course_release_beta_feedback TO authenticated;

-- Deliberately no admin, linked-parent, or public policy. Actions never use service_role.
-- Release eligibility comes from administrator-managed enrollment, not mutable
-- profile role/status columns or an undocumented status-schema assumption.
CREATE POLICY course_release_record_read ON public.course_release_learning_records
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = student_id AND public.course_release_can_access(shell));
CREATE POLICY course_release_record_insert ON public.course_release_learning_records
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = student_id AND public.course_release_can_access(shell));
CREATE POLICY course_release_record_update ON public.course_release_learning_records
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = student_id AND public.course_release_can_access(shell))
  WITH CHECK ((SELECT auth.uid()) = student_id AND public.course_release_can_access(shell));
CREATE POLICY course_release_record_delete ON public.course_release_learning_records
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = student_id AND public.course_release_can_access(shell));
CREATE POLICY course_release_feedback_read ON public.course_release_beta_feedback
  FOR SELECT TO authenticated USING ((SELECT auth.uid()) = student_id AND public.course_release_can_access('beta'));
CREATE POLICY course_release_feedback_insert ON public.course_release_beta_feedback
  FOR INSERT TO authenticated WITH CHECK ((SELECT auth.uid()) = student_id AND public.course_release_can_access('beta') AND EXISTS (
    SELECT 1 FROM public.course_release_learning_records r WHERE r.student_id = course_release_beta_feedback.student_id
      AND r.release_id = course_release_beta_feedback.release_id AND r.shell = 'beta'
      AND r.module_number = course_release_beta_feedback.module_number AND r.completed = true
  ));
CREATE POLICY course_release_feedback_update ON public.course_release_beta_feedback
  FOR UPDATE TO authenticated USING ((SELECT auth.uid()) = student_id AND public.course_release_can_access('beta'))
  WITH CHECK ((SELECT auth.uid()) = student_id AND public.course_release_can_access('beta') AND EXISTS (
    SELECT 1 FROM public.course_release_learning_records r WHERE r.student_id = course_release_beta_feedback.student_id
      AND r.release_id = course_release_beta_feedback.release_id AND r.shell = 'beta'
      AND r.module_number = course_release_beta_feedback.module_number AND r.completed = true
  ));
CREATE POLICY course_release_feedback_delete ON public.course_release_beta_feedback
  FOR DELETE TO authenticated USING ((SELECT auth.uid()) = student_id AND public.course_release_can_access('beta'));

COMMENT ON TABLE public.course_release_learning_records IS 'Student-owned raw lesson evidence, isolated per release and beta/final shell. Completion never implies Tutor export approval.';
COMMENT ON TABLE public.course_release_beta_feedback IS 'Beta-only end-of-lesson feedback, deliberately excluded from Tutor downloads.';
NOTIFY pgrst, 'reload schema';
COMMIT;
