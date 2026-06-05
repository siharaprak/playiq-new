-- Idempotently add missing columns to support_issues
ALTER TABLE support_issues ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;
ALTER TABLE support_issues ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
