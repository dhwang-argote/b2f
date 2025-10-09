-- Migration: make activity triggers skip entries when user_id IS NULL
-- Run this against your Postgres/Supabase database (psql or supabase.sql)

-- Replace activity_from_transactions trigger function with a safe version
CREATE OR REPLACE FUNCTION public.activity_from_transactions()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- If transaction has no associated user, skip activity log to avoid NOT NULL failures
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Minimal safe logging behavior: ensure activity_log exists and insert a basic record
  INSERT INTO public.activity_log (user_id, action, metadata, created_at)
  VALUES (NEW.user_id, 'transaction', to_jsonb(NEW), now());

  RETURN NEW;
END;
$$;

-- Replace activity_from_user_challenges trigger function with a safe version
CREATE OR REPLACE FUNCTION public.activity_from_user_challenges()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Skip logging for unclaimed challenges
  IF NEW.user_id IS NULL THEN
    RETURN NEW;
  END IF;

  INSERT INTO public.activity_log (user_id, action, metadata, created_at)
  VALUES (NEW.user_id, 'challenge', to_jsonb(NEW), now());

  RETURN NEW;
END;
$$;

-- Notes:
-- 1) This migration assumes there is an `activity_log` table with columns (user_id, action, metadata, created_at).
-- 2) If your existing trigger functions contain more complex logic, merge this null-check early-return into them instead of replacing entirely.
-- 3) After running this migration, guest transactions and unclaimed challenges (user_id IS NULL) will no longer cause NOT NULL trigger errors.
