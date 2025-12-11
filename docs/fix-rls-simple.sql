-- Simple RLS Fix - Execute this in Supabase SQL Editor
-- This ensures all authenticated users can access all data

-- ============================================
-- 1. Drop all existing policies first
-- ============================================
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop policies for ct-orders
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'ct-orders') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON "ct-orders"';
    END LOOP;
    
    -- Drop policies for ct-clients
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'ct-clients') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON "ct-clients"';
    END LOOP;
    
    -- Drop policies for ct-models
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'ct-models') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON "ct-models"';
    END LOOP;
END $$;

-- ============================================
-- 2. Enable RLS on all tables
-- ============================================
ALTER TABLE "ct-orders" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ct-clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ct-models" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. Create simple policies for ct-orders
-- ============================================
CREATE POLICY "allow_all_select_orders" ON "ct-orders"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "allow_all_insert_orders" ON "ct-orders"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "allow_all_update_orders" ON "ct-orders"
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "allow_all_delete_orders" ON "ct-orders"
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- 4. Create simple policies for ct-clients
-- ============================================
CREATE POLICY "allow_all_select_clients" ON "ct-clients"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "allow_all_insert_clients" ON "ct-clients"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "allow_all_update_clients" ON "ct-clients"
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "allow_all_delete_clients" ON "ct-clients"
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- 5. Create simple policies for ct-models
-- ============================================
CREATE POLICY "allow_all_select_models" ON "ct-models"
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "allow_all_insert_models" ON "ct-models"
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "allow_all_update_models" ON "ct-models"
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "allow_all_delete_models" ON "ct-models"
    FOR DELETE
    TO authenticated
    USING (true);

-- ============================================
-- 6. Verify policies were created
-- ============================================
SELECT 
    tablename,
    policyname,
    cmd as command,
    roles
FROM pg_policies
WHERE tablename IN ('ct-orders', 'ct-clients', 'ct-models')
ORDER BY tablename, policyname;

-- ============================================
-- 7. Test query (should work now)
-- ============================================
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

