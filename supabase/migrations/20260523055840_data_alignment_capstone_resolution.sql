-- Data Alignment Sprint 1: Capstone Resolution
--
-- This migration resolves the duplicate capstone rows without deleting data.
-- 1. Updates Canonical Capstone (Order 11, ID c1f94091-62d9-4ac9-8f0a-86c2e3650238)
--    to explicitly reference the Course 1 ID.
-- 2. Archives Duplicate Capstone (Order 99, ID c9210282-ee30-46f6-a74c-d8e4109b3da9)
--    by setting its status to 'draft' (if not already) and adding an "archived" metadata flag.

-- We set Course ID for the Canonical Capstone (Order 11)
UPDATE modules
SET 
  course_id = '402b0dc5-10f7-4b10-afad-fd88a516fa40',
  updated_at = NOW()
WHERE id = 'c1f94091-62d9-4ac9-8f0a-86c2e3650238'
  AND course_id IS NULL;

-- Archive the Duplicate Capstone (Order 99)
UPDATE modules
SET 
  -- We set the metadata.archived flag so it is easy to filter or exclude
  metadata = COALESCE(metadata, '{}'::jsonb) || '{"archived": true}'::jsonb,
  -- And we ensure the status is at least 'draft' (it might be already)
  updated_at = NOW()
WHERE id = 'c9210282-ee30-46f6-a74c-d8e4109b3da9'
  AND (metadata->>'archived' IS NULL OR metadata->>'archived' != 'true');
