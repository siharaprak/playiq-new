-- 20261008120000_privacy_drop_auto_confirm_trigger.sql
-- Phase 3A: Drop dev_auto_confirm_user trigger and function
-- Ensures parent self-signups require real email verification.
-- Student accounts provisioned by parents/admins via auth.admin.createUser({ email_confirm: true })
-- remain automatically confirmed at creation time.

DROP TRIGGER IF EXISTS dev_auto_confirm_user_trigger ON auth.users;
DROP FUNCTION IF EXISTS public.dev_auto_confirm_user();
