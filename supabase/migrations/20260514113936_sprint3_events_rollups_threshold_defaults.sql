-- Sprint 3 Continued: Events, Rollups, Threshold Defaults
--
-- This migration:
--   1. Adds new enum values to event_type_enum for event capture coverage.
--   2. Sets courses.metadata.threshold_framework with configurable defaults.
--   3. Sets modules.metadata.threshold_overrides as empty for extensibility.
--
-- SAFETY:
--   - No new tables created.
--   - No student progress, attempts, submissions, or reports touched.
--   - All enum additions use safe DO blocks to avoid duplicates.
--   - All metadata updates use JSONB merge to preserve existing keys.
--   - Idempotent: safe to re-run.
--

-- ============================================================
-- 1. Extend event_type_enum with new event types
-- ============================================================
-- Using DO blocks since ALTER TYPE ADD VALUE IF NOT EXISTS
-- may not be available on all Postgres versions.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'attempt_started' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'attempt_started';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'revision_submitted' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'revision_submitted';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'unlock_granted' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'unlock_granted';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'proof_submitted' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'proof_submitted';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'proof_reviewed' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'proof_reviewed';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'tutor_profile_created' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'tutor_profile_created';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'tutor_profile_updated' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'tutor_profile_updated';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'tutor_version_created' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'tutor_version_created';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'assistant_profile_created' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'assistant_profile_created';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'assistant_profile_updated' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'assistant_profile_updated';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'assistant_version_created' AND enumtypid = 'event_type_enum'::regtype) THEN
    ALTER TYPE event_type_enum ADD VALUE 'assistant_version_created';
  END IF;
END $$;

-- ============================================================
-- 2. Course-level threshold framework defaults
-- ============================================================
UPDATE courses
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{
  "threshold_framework": {
    "version": "sprint3_threshold_v1",
    "enforcement_mode": "not_enforced",
    "defaults": {
      "quiz_pass_percent": 80,
      "mini_check_pass_percent": 80,
      "boss_battle_pass_percent": 80,
      "teach_back_required_status": "pass",
      "proof_required_status": "approved",
      "proof_review_roles": ["teacher", "admin"],
      "tutor_build_min_status": "draft",
      "tutor_version_required": true,
      "assistant_build_min_status": "draft",
      "assistant_version_required": true,
      "dependency_decay_mode": "placeholder",
      "pdi_formula_status": "placeholder_pending_final_formula"
    },
    "notes": "Configurable defaults only. Not enforced yet. Sprint 3 config foundation."
  }
}'::jsonb
WHERE title ILIKE '%PlayIQ%'
  AND (metadata -> 'threshold_framework' IS NULL);

-- ============================================================
-- 3. Module-level threshold_overrides placeholder
-- ============================================================
UPDATE modules
SET metadata = COALESCE(metadata, '{}'::jsonb) || '{
  "threshold_overrides": {}
}'::jsonb
WHERE metadata -> 'threshold_overrides' IS NULL;

-- ============================================================
-- 4. SQL comments for documentation
-- ============================================================
COMMENT ON COLUMN courses.metadata IS 'JSONB metadata. Sprint 3 added mastery_placeholders + threshold_framework.';
COMMENT ON COLUMN modules.metadata IS 'JSONB metadata. Sprint 3 added mastery_defaults + threshold_overrides.';
