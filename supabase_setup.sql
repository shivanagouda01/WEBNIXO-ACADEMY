-- Supabase Setup Script for Webnixo Academy
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create course_settings table
CREATE TABLE IF NOT EXISTS course_settings (
  course_id TEXT PRIMARY KEY,
  price NUMERIC NOT NULL,
  is_live BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  code TEXT PRIMARY KEY,
  discount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create registrations table (for students) with unique 6-char Certificate ID
CREATE OR REPLACE FUNCTION generate_cert_id() RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars))::integer + 1, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_unique_cert_id() RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  done BOOLEAN := FALSE;
BEGIN
  WHILE NOT done LOOP
    new_id := generate_cert_id();
    IF NOT EXISTS (SELECT 1 FROM registrations WHERE certificate_id = new_id) THEN
      done := TRUE;
    END IF;
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS registrations (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  university TEXT,
  login_id TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  course_id TEXT NOT NULL,
  payment_status TEXT DEFAULT 'SUCCESS',
  certificate_id TEXT UNIQUE DEFAULT generate_unique_cert_id(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_cert_id_length CHECK (char_length(certificate_id) = 6)
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE course_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- 5. Create Policies
-- Use DROP POLICY IF EXISTS to avoid errors if the script is run multiple times

-- Policies for course_settings
DROP POLICY IF EXISTS "Allow public read access on course_settings" ON course_settings;
CREATE POLICY "Allow public read access on course_settings" ON course_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on course_settings" ON course_settings;
CREATE POLICY "Allow public insert on course_settings" ON course_settings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on course_settings" ON course_settings;
CREATE POLICY "Allow public update on course_settings" ON course_settings FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete on course_settings" ON course_settings;
CREATE POLICY "Allow public delete on course_settings" ON course_settings FOR DELETE USING (true);

-- Policies for coupons
DROP POLICY IF EXISTS "Allow public read access on coupons" ON coupons;
CREATE POLICY "Allow public read access on coupons" ON coupons FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on coupons" ON coupons;
CREATE POLICY "Allow public insert on coupons" ON coupons FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on coupons" ON coupons;
CREATE POLICY "Allow public delete on coupons" ON coupons FOR DELETE USING (true);

-- Policies for registrations
DROP POLICY IF EXISTS "Allow public read access on registrations" ON registrations;
CREATE POLICY "Allow public read access on registrations" ON registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on registrations" ON registrations;
CREATE POLICY "Allow public insert on registrations" ON registrations FOR INSERT WITH CHECK (true);

-- Helpful tip: Disable RLS entirely for testing if you are still getting errors
-- ALTER TABLE course_settings DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE coupons DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
