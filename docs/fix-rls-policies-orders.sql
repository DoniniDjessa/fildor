-- Fix RLS Policies for ct-orders and related tables
-- Execute this in Supabase SQL Editor

-- ============================================
-- Step 1: Check current RLS status
-- ============================================
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename IN ('ct-orders', 'ct-clients', 'ct-models')
ORDER BY tablename;

-- ============================================
-- Step 2: Check existing policies
-- ============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename IN ('ct-orders', 'ct-clients', 'ct-models')
ORDER BY tablename, policyname;

-- ============================================
-- Step 3: Drop ALL existing policies (if any)
-- ============================================
-- ct-orders
DROP POLICY IF EXISTS "Users can view orders" ON "ct-orders";
DROP POLICY IF EXISTS "Users can create orders" ON "ct-orders";
DROP POLICY IF EXISTS "Users can update orders" ON "ct-orders";
DROP POLICY IF EXISTS "Users can delete orders" ON "ct-orders";

-- ct-clients
DROP POLICY IF EXISTS "Users can view clients" ON "ct-clients";
DROP POLICY IF EXISTS "Users can create clients" ON "ct-clients";
DROP POLICY IF EXISTS "Users can update clients" ON "ct-clients";
DROP POLICY IF EXISTS "Users can delete clients" ON "ct-clients";

-- ct-models
DROP POLICY IF EXISTS "Users can view models" ON "ct-models";
DROP POLICY IF EXISTS "Users can create models" ON "ct-models";
DROP POLICY IF EXISTS "Users can update models" ON "ct-models";
DROP POLICY IF EXISTS "Users can delete models" ON "ct-models";

-- ============================================
-- Step 4: Ensure RLS is enabled
-- ============================================
ALTER TABLE "ct-orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ct-clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ct-models" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Step 5: Create new policies for ct-orders
-- ============================================
-- SELECT policy - All authenticated users can view all orders
CREATE POLICY "authenticated_users_select_orders" ON "ct-orders"
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT policy - All authenticated users can create orders
CREATE POLICY "authenticated_users_insert_orders" ON "ct-orders"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE policy - All authenticated users can update orders
CREATE POLICY "authenticated_users_update_orders" ON "ct-orders"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE policy - All authenticated users can delete orders
CREATE POLICY "authenticated_users_delete_orders" ON "ct-orders"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Step 6: Create new policies for ct-clients
-- ============================================
-- SELECT policy
CREATE POLICY "authenticated_users_select_clients" ON "ct-clients"
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT policy
CREATE POLICY "authenticated_users_insert_clients" ON "ct-clients"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE policy
CREATE POLICY "authenticated_users_update_clients" ON "ct-clients"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE policy
CREATE POLICY "authenticated_users_delete_clients" ON "ct-clients"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Step 7: Create new policies for ct-models
-- ============================================
-- SELECT policy
CREATE POLICY "authenticated_users_select_models" ON "ct-models"
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT policy
CREATE POLICY "authenticated_users_insert_models" ON "ct-models"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- UPDATE policy
CREATE POLICY "authenticated_users_update_models" ON "ct-models"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- DELETE policy
CREATE POLICY "authenticated_users_delete_models" ON "ct-models"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Step 8: Verify policies were created
-- ============================================
SELECT 
  tablename,
  policyname,
  cmd as command
FROM pg_policies
WHERE tablename IN ('ct-orders', 'ct-clients', 'ct-models')
ORDER BY tablename, policyname;

-- ============================================
-- Step 9: Test query (should work now)
-- ============================================
-- This query should return data if policies are correct
SELECT 
  o.id,
  o.status,
  o.created_at,
  c.noms as client_name,
  m.name as model_name
FROM "ct-orders" o
LEFT JOIN "ct-clients" c ON o.client_id = c.id
LEFT JOIN "ct-models" m ON o.model_id = m.id
ORDER BY o.created_at DESC
LIMIT 5;

