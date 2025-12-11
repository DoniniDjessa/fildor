-- Fix RLS Policies for ct-users table
-- Execute this in Supabase SQL Editor

-- ============================================
-- 1. Drop existing policies if they exist
-- ============================================
DROP POLICY IF EXISTS "allow_all_select_users" ON "ct-users";
DROP POLICY IF EXISTS "allow_all_insert_users" ON "ct-users";
DROP POLICY IF EXISTS "allow_all_update_users" ON "ct-users";
DROP POLICY IF EXISTS "allow_all_delete_users" ON "ct-users";

-- ============================================
-- 2. Enable RLS on ct-users
-- ============================================
ALTER TABLE "ct-users" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Create policies for ct-users
-- ============================================
-- Policy: All authenticated users can view users (for activity logs, etc.)
CREATE POLICY "allow_all_select_users" ON "ct-users"
    FOR SELECT
    TO authenticated
    USING (true);

-- Policy: Only admins can create users (handled by requireAdmin in code)
CREATE POLICY "allow_all_insert_users" ON "ct-users"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Policy: Only admins can update users (handled by requireAdmin in code)
CREATE POLICY "allow_all_update_users" ON "ct-users"
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy: Only admins can delete users (handled by requireAdmin in code)
CREATE POLICY "allow_all_delete_users" ON "ct-users"
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- 4. Verify policies were created
-- ============================================
SELECT 
    tablename,
    policyname,
    cmd as command,
    roles
FROM pg_policies
WHERE tablename = 'ct-users'
ORDER BY policyname;

