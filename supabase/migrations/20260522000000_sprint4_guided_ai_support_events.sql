-- Sprint 4D — Guided AI Support Events + Unsafe Assistance Routing
--
-- Adds 9 new enum values to event_type_enum for Guided AI event logging.
-- Uses safe DO blocks checking pg_enum before ALTER TYPE ADD VALUE.
--
-- Does NOT create new tables, columns, or modify existing rows.

-- 1. guided_ai_used
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guided_ai_used' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'guided_ai_used';
  END IF;
END
$$;

-- 2. guided_ai_refused
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guided_ai_refused' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'guided_ai_refused';
  END IF;
END
$$;

-- 3. guided_ai_effort_required
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guided_ai_effort_required' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'guided_ai_effort_required';
  END IF;
END
$$;

-- 4. guided_ai_hint_ladder_step
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guided_ai_hint_ladder_step' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'guided_ai_hint_ladder_step';
  END IF;
END
$$;

-- 5. guided_ai_quiz_practice_generated
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guided_ai_quiz_practice_generated' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'guided_ai_quiz_practice_generated';
  END IF;
END
$$;

-- 6. guided_ai_teachback_required
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'guided_ai_teachback_required' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'guided_ai_teachback_required';
  END IF;
END
$$;

-- 7. lesson_rescue_used
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'lesson_rescue_used' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'lesson_rescue_used';
  END IF;
END
$$;

-- 8. learn_your_way_updated
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'learn_your_way_updated' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'learn_your_way_updated';
  END IF;
END
$$;

-- 9. unsafe_assistance_routed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'unsafe_assistance_routed' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'unsafe_assistance_routed';
  END IF;
END
$$;

-- Post-migration verification:
-- SELECT enumlabel
-- FROM pg_enum
-- WHERE enumtypid = 'event_type_enum'::regtype
-- ORDER BY enumsortorder;
