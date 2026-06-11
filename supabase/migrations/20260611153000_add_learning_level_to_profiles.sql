-- Create learning_audience_tier enum if not exists
DO $$ BEGIN
    CREATE TYPE learning_audience_tier AS ENUM ('elementary', 'middle', 'high', 'adult');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add learning_level column to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS learning_level learning_audience_tier NOT NULL DEFAULT 'high';
