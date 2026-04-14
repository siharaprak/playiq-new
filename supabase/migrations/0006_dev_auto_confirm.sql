-- 0006_dev_auto_confirm.sql
-- Development helper: Auto-confirm newly created users so we don't get blocked by email loops

CREATE OR REPLACE FUNCTION public.dev_auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set email_confirmed_at to now() to instantly verify the user
  NEW.email_confirmed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to avoid conflicts
DROP TRIGGER IF EXISTS dev_auto_confirm_user_trigger ON auth.users;

-- Create the trigger
CREATE TRIGGER dev_auto_confirm_user_trigger
BEFORE INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.dev_auto_confirm_user();
