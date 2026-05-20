-- Subscription plan tiers
CREATE TABLE IF NOT EXISTS subscription_plans (
  tier                       VARCHAR PRIMARY KEY,
  display_name               VARCHAR        NOT NULL,
  applications_visible_limit INTEGER,               -- NULL = unlimited
  price_usd_monthly          NUMERIC(10,2)  NOT NULL
);

INSERT INTO subscription_plans (tier, display_name, applications_visible_limit, price_usd_monthly) VALUES
  ('scout', 'Scout',  10,   29.00),
  ('pro',   'Pro',    50,   79.00),
  ('elite', 'Elite',  NULL, 199.00)
ON CONFLICT (tier) DO NOTHING;

-- Add subscription_tier to profiles (defaults everyone to scout)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR NOT NULL DEFAULT 'scout';
