-- Test script to verify orders data and RLS policies
-- Execute this in Supabase SQL Editor to check if orders exist and RLS is working

-- 1. Check if table exists and count total orders (bypassing RLS as admin)
SELECT COUNT(*) as total_orders FROM "ct-orders";

-- 2. Check if there are any orders with each status
SELECT status, COUNT(*) as count 
FROM "ct-orders" 
GROUP BY status 
ORDER BY status;

-- 3. Check recent orders
SELECT id, status, created_at, client_id, model_id
FROM "ct-orders"
ORDER BY created_at DESC
LIMIT 10;

-- 4. Test RLS policies - this should work for authenticated users
-- (Run this as an authenticated user, not as admin)
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
LIMIT 10;

-- 5. Check RLS policies on ct-orders
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'ct-orders';

-- 6. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'ct-orders';

