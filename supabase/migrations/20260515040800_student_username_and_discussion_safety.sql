-- Migration: Student Username & Discussion Safety
-- Sprint: Student Username Ownership + Community Discussion Safety Moderation
--
-- Adds username fields to profiles for public display identity.
-- Username is NOT used for login or auth.
-- No changes to discussion table schemas.

-- Step 1: Add username columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS username text,
  ADD COLUMN IF NOT EXISTS username_updated_at timestamptz,
  ADD COLUMN IF NOT EXISTS username_change_count integer NOT NULL DEFAULT 0;

-- Step 2: Unique case-insensitive index (partial — only non-null usernames)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_username_lower
  ON profiles (lower(username))
  WHERE username IS NOT NULL;
