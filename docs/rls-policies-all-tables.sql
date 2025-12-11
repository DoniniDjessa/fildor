-- RLS Policies for Fil d'Or - Store/Workshop Application
-- All authenticated users should be able to see all data (not user-specific)
-- Execute this in Supabase SQL Editor

-- ============================================
-- Table: ct-orders
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view orders" ON "ct-orders";
DROP POLICY IF EXISTS "Users can create orders" ON "ct-orders";
DROP POLICY IF EXISTS "Users can update orders" ON "ct-orders";
DROP POLICY IF EXISTS "Users can delete orders" ON "ct-orders";

-- Enable RLS
ALTER TABLE "ct-orders" ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view all orders
CREATE POLICY "Users can view orders" ON "ct-orders"
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can create orders
CREATE POLICY "Users can create orders" ON "ct-orders"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: All authenticated users can update orders
CREATE POLICY "Users can update orders" ON "ct-orders"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: All authenticated users can delete orders
CREATE POLICY "Users can delete orders" ON "ct-orders"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Table: ct-clients
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view clients" ON "ct-clients";
DROP POLICY IF EXISTS "Users can create clients" ON "ct-clients";
DROP POLICY IF EXISTS "Users can update clients" ON "ct-clients";
DROP POLICY IF EXISTS "Users can delete clients" ON "ct-clients";

-- Enable RLS
ALTER TABLE "ct-clients" ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view all clients
CREATE POLICY "Users can view clients" ON "ct-clients"
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can create clients
CREATE POLICY "Users can create clients" ON "ct-clients"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: All authenticated users can update clients
CREATE POLICY "Users can update clients" ON "ct-clients"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: All authenticated users can delete clients
CREATE POLICY "Users can delete clients" ON "ct-clients"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Table: ct-models
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view models" ON "ct-models";
DROP POLICY IF EXISTS "Users can create models" ON "ct-models";
DROP POLICY IF EXISTS "Users can update models" ON "ct-models";
DROP POLICY IF EXISTS "Users can delete models" ON "ct-models";

-- Enable RLS
ALTER TABLE "ct-models" ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view all models
CREATE POLICY "Users can view models" ON "ct-models"
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can create models
CREATE POLICY "Users can create models" ON "ct-models"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: All authenticated users can update models
CREATE POLICY "Users can update models" ON "ct-models"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: All authenticated users can delete models
CREATE POLICY "Users can delete models" ON "ct-models"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Table: ct-measurements
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view measurements" ON "ct-measurements";
DROP POLICY IF EXISTS "Users can create measurements" ON "ct-measurements";
DROP POLICY IF EXISTS "Users can update measurements" ON "ct-measurements";
DROP POLICY IF EXISTS "Users can delete measurements" ON "ct-measurements";

-- Enable RLS
ALTER TABLE "ct-measurements" ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view all measurements
CREATE POLICY "Users can view measurements" ON "ct-measurements"
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can create measurements
CREATE POLICY "Users can create measurements" ON "ct-measurements"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: All authenticated users can update measurements
CREATE POLICY "Users can update measurements" ON "ct-measurements"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: All authenticated users can delete measurements
CREATE POLICY "Users can delete measurements" ON "ct-measurements"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Table: ct-material-types
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view material types" ON "ct-material-types";
DROP POLICY IF EXISTS "Users can create material types" ON "ct-material-types";
DROP POLICY IF EXISTS "Users can update material types" ON "ct-material-types";
DROP POLICY IF EXISTS "Users can delete material types" ON "ct-material-types";

-- Enable RLS
ALTER TABLE "ct-material-types" ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view all material types
CREATE POLICY "Users can view material types" ON "ct-material-types"
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can create material types
CREATE POLICY "Users can create material types" ON "ct-material-types"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: All authenticated users can update material types
CREATE POLICY "Users can update material types" ON "ct-material-types"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: All authenticated users can delete material types
CREATE POLICY "Users can delete material types" ON "ct-material-types"
  FOR DELETE
  TO authenticated
  USING (true);

-- ============================================
-- Table: ct-stock-items
-- ============================================
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view stock items" ON "ct-stock-items";
DROP POLICY IF EXISTS "Users can create stock items" ON "ct-stock-items";
DROP POLICY IF EXISTS "Users can update stock items" ON "ct-stock-items";
DROP POLICY IF EXISTS "Users can delete stock items" ON "ct-stock-items";

-- Enable RLS
ALTER TABLE "ct-stock-items" ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view all stock items
CREATE POLICY "Users can view stock items" ON "ct-stock-items"
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can create stock items
CREATE POLICY "Users can create stock items" ON "ct-stock-items"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: All authenticated users can update stock items
CREATE POLICY "Users can update stock items" ON "ct-stock-items"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: All authenticated users can delete stock items
CREATE POLICY "Users can delete stock items" ON "ct-stock-items"
  FOR DELETE
  TO authenticated
  USING (true);

