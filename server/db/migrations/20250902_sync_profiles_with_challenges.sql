-- Migration: Sync profiles with user_challenges and users
-- Adds columns to profiles, creates trigger functions to update profile aggregates
-- and backfills existing data.

BEGIN;

-- 1) Add missing columns to profiles (if they don't exist)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS total_winnings numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_bets numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_challenges integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_bet_at timestamptz,
  ADD COLUMN IF NOT EXISTS completed_plans jsonb DEFAULT '[]'::jsonb;

-- 2) Function: sync_profile_on_challenge_change
--    Fired AFTER INSERT or UPDATE on user_challenges. When a challenge becomes
--    completed the function increments totals and refreshes completed_plans.
CREATE OR REPLACE FUNCTION public.sync_profile_on_challenge_change()
RETURNS trigger AS $$
DECLARE
  v_profit numeric := COALESCE(NEW.profit_earned, NEW.profit, 0);
  v_fee numeric := COALESCE(NEW.fee, 0);
  v_completed jsonb;
  v_last timestamptz := COALESCE(NEW.completed_at, NEW.activated_at);
BEGIN
  -- Handle new completed challenge on INSERT
  IF TG_OP = 'INSERT' AND NEW.status = 'completed' THEN
    UPDATE public.profiles p
    SET
      total_winnings = COALESCE(p.total_winnings, 0) + v_profit,
      total_bets = COALESCE(p.total_bets, 0) + v_fee,
      total_challenges = COALESCE(p.total_challenges, 0) + 1,
      last_bet_at = GREATEST(COALESCE(p.last_bet_at, v_last), v_last)
    WHERE p.id = NEW.user_id;

  -- Handle updates that change status to completed
  ELSIF TG_OP = 'UPDATE' THEN
    IF (OLD.status IS DISTINCT FROM NEW.status) AND NEW.status = 'completed' THEN
      UPDATE public.profiles p
      SET
        total_winnings = COALESCE(p.total_winnings, 0) + v_profit,
        total_bets = COALESCE(p.total_bets, 0) + v_fee,
        total_challenges = COALESCE(p.total_challenges, 0) + 1,
        last_bet_at = GREATEST(COALESCE(p.last_bet_at, v_last), v_last)
      WHERE p.id = NEW.user_id;
    END IF;
  END IF;

  -- Recompute completed_plans JSON array for the user (fresh snapshot)
  SELECT jsonb_agg(to_jsonb(uc) ORDER BY COALESCE(uc.completed_at, uc.activated_at) DESC)
    INTO v_completed
    FROM public.user_challenges uc
    WHERE uc.user_id = NEW.user_id AND uc.status = 'completed';

  -- Also sync basic profile fields from users (email, full_name, phone, avatar)
  UPDATE public.profiles p
  SET
    completed_plans = COALESCE(v_completed, '[]'::jsonb),
    email = u.email,
    full_name = u.full_name,
    phone = u.phone,
    avatar_url = u.profile_picture
  FROM public.users u
  WHERE p.id = NEW.user_id AND u.id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3) Trigger: After insert or update on user_challenges
DROP TRIGGER IF EXISTS trg_sync_profile_on_challenge_change ON public.user_challenges;
CREATE TRIGGER trg_sync_profile_on_challenge_change
AFTER INSERT OR UPDATE ON public.user_challenges
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_on_challenge_change();

-- 4) Function + trigger to keep profiles synced when users table changes
CREATE OR REPLACE FUNCTION public.sync_profile_on_user_change()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles p
  SET
    email = NEW.email,
    full_name = NEW.full_name,
    phone = NEW.phone,
    avatar_url = NEW.profile_picture
  WHERE p.id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_profile_on_user_change ON public.users;
CREATE TRIGGER trg_sync_profile_on_user_change
AFTER INSERT OR UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_on_user_change();

-- 5) Backfill: populate profiles from existing user_challenges and users
-- Backfill basic user info
UPDATE public.profiles p
SET
  email = u.email,
  full_name = u.full_name,
  phone = u.phone,
  avatar_url = u.profile_picture
FROM public.users u
WHERE p.id = u.id;

-- Backfill aggregate columns from user_challenges
WITH agg AS (
  SELECT
    uc.user_id AS user_id,
    COALESCE(SUM(COALESCE(uc.profit_earned, uc.profit, 0)), 0) AS total_winnings_sum,
    COALESCE(SUM(COALESCE(uc.fee, 0)), 0) AS total_bets_sum,
    COALESCE(COUNT(*) FILTER (WHERE uc.status = 'completed'), 0) AS total_challenges_cnt,
    MAX(COALESCE(uc.completed_at, uc.activated_at)) AS last_bet
  FROM public.user_challenges uc
  GROUP BY uc.user_id
)
UPDATE public.profiles p
SET
  total_winnings = COALESCE(agg.total_winnings_sum, 0),
  total_bets = COALESCE(agg.total_bets_sum, 0),
  total_challenges = COALESCE(agg.total_challenges_cnt, 0),
  last_bet_at = agg.last_bet
FROM agg
WHERE p.id = agg.user_id;

-- Backfill completed_plans JSONB
WITH completed AS (
  SELECT
    uc.user_id,
    jsonb_agg(to_jsonb(uc) ORDER BY COALESCE(uc.completed_at, uc.activated_at) DESC) AS completed
  FROM public.user_challenges uc
  WHERE uc.status = 'completed'
  GROUP BY uc.user_id
)
UPDATE public.profiles p
SET completed_plans = completed.completed
FROM completed
WHERE p.id = completed.user_id;

COMMIT;
