-- Diagnostic script to identify why orders are not being fetched
-- Execute this in Supabase SQL Editor

-- 1. Check if orders exist in the table
SELECT COUNT(*) as total_orders FROM "ct-orders";

-- 2. Check orders by status
SELECT status, COUNT(*) as count 
FROM "ct-orders" 
GROUP BY status 
ORDER BY status;

-- 3. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'ct-orders';

-- 4. List all RLS policies on ct-orders
SELECT 
  policyname,
  permissive,
  roles,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'ct-orders';

-- 5. Test a simple SELECT query (this should work if RLS policies are correct)
SELECT id, status, created_at, client_id, model_id
FROM "ct-orders"
ORDER BY created_at DESC
LIMIT 5;

-- 6. Check if the authenticated user can see orders
-- Note: This will show the current user's context
SELECT current_user, session_user;

-- 7. Check if there are any constraints or issues
SELECT 
  conname as constraint_name,
  contype as constraint_type,
  pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint
WHERE conrelid = 'ct-orders'::regclass;

-- 8. Check table permissions
SELECT 
  grantee,
  privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'ct-orders';

-- 9. Test if we can insert a test order (if you have permission)
-- Uncomment this only if you want to test insert permissions
-- INSERT INTO "ct-orders" (client_id, model_id, status, total_price, delivery_date)
-- VALUES (
--   (SELECT id FROM "ct-clients" LIMIT 1),
--   (SELECT id FROM "ct-models" LIMIT 1),
--   'pending',
--   10000,
--   CURRENT_DATE + INTERVAL '7 days'
-- )
-- RETURNING id, status;

-- 10. Check if foreign keys are causing issues
SELECT 
  tc.constraint_name,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name = 'ct-orders';

