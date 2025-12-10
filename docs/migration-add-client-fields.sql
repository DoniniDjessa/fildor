-- Migration: Add new fields to ct-clients table
-- This migration adds the new client fields while preserving existing data
-- Run this in Supabase SQL Editor

-- Step 1: Add new columns (if they don't exist)
ALTER TABLE "ct-clients"
  ADD COLUMN IF NOT EXISTS noms TEXT,
  ADD COLUMN IF NOT EXISTS surnom TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS height NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS weight NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS dob_day INTEGER CHECK (dob_day >= 1 AND dob_day <= 31),
  ADD COLUMN IF NOT EXISTS dob_month INTEGER CHECK (dob_month >= 1 AND dob_month <= 12);

-- Step 2: Migrate existing data from 'name' to 'noms' if 'name' column exists
-- This checks if the 'name' column exists before trying to migrate
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'ct-clients' 
    AND column_name = 'name'
  ) THEN
    -- Copy 'name' to 'noms' where 'noms' is NULL
    UPDATE "ct-clients"
    SET noms = name
    WHERE noms IS NULL AND name IS NOT NULL;
  END IF;
END $$;

-- Step 3: Create indexes for new columns (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_ct_clients_noms ON "ct-clients"(noms);
CREATE INDEX IF NOT EXISTS idx_ct_clients_surnom ON "ct-clients"(surnom);
CREATE INDEX IF NOT EXISTS idx_ct_clients_email ON "ct-clients"(email);

-- Note: The 'name' column can be kept for backward compatibility or dropped later:
-- To drop it (after verifying everything works):
-- ALTER TABLE "ct-clients" DROP COLUMN IF EXISTS name;
