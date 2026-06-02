-- Migration: push_subscriptions table for Web Push delivery
-- Created: 2026-06-02

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint     text        NOT NULL,
  subscription jsonb       NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),

  -- Enforce one subscription record per endpoint (device/browser combination)
  CONSTRAINT push_subscriptions_endpoint_key UNIQUE (endpoint)
);

-- Index for fast lookup by user
CREATE INDEX IF NOT EXISTS push_subscriptions_user_id_idx
  ON push_subscriptions(user_id);

-- Enable Row Level Security
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can fully manage their own subscriptions (subscribe / unsubscribe)
CREATE POLICY "Users manage own push subscriptions"
  ON push_subscriptions
  FOR ALL
  USING  (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role (used by Edge Function + API routes) can read all subscriptions
-- for delivery. This policy is intentionally permissive for the service role.
CREATE POLICY "Service role can read all push subscriptions"
  ON push_subscriptions
  FOR SELECT
  USING (true);
