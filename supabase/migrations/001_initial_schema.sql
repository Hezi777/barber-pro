BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customers_phone_e164_chk CHECK (phone ~ '^\+[1-9][0-9]{7,14}$')
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL UNIQUE,
  state text NOT NULL,
  context jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT conversations_state_chk CHECK (
    state IN ('NEW', 'WAIT_SERVICE', 'WAIT_DAY', 'WAIT_TIME', 'WAIT_NAME', 'CONFIRMED')
  )
);

CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  customer_name text NOT NULL,
  service text NOT NULL,
  start_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'PENDING',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT appointments_status_chk CHECK (status IN ('PENDING', 'CONFIRMED', 'CANCELED'))
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  direction text NOT NULL,
  body text,
  raw_payload jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT messages_direction_chk CHECK (direction IN ('IN', 'OUT'))
);

CREATE INDEX IF NOT EXISTS idx_messages_phone_created_at
  ON messages (phone, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_appointments_phone_start_time
  ON appointments (phone, start_time);

CREATE INDEX IF NOT EXISTS idx_appointments_start_time_status
  ON appointments (start_time, status);

CREATE INDEX IF NOT EXISTS idx_appointments_status_created_at
  ON appointments (status, created_at DESC);

CREATE OR REPLACE FUNCTION set_conversations_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_conversations_set_updated_at ON conversations;

CREATE TRIGGER trg_conversations_set_updated_at
BEFORE UPDATE ON conversations
FOR EACH ROW
EXECUTE FUNCTION set_conversations_updated_at();

COMMIT;
