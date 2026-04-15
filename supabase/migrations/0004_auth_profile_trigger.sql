-- Trigger to create a profile automatically when a new auth.users row is created.
-- This ensures total atomic reliability over profile generation without relying on Next.js edge insertions resolving cleanly.

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- PlayIQ Default: New sign-ups assume 'parent' role unless otherwise specified.
  -- Advanced configurations can map metadata, but parent is standard for pilot entry.
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'parent'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Bind the trigger exclusively
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
