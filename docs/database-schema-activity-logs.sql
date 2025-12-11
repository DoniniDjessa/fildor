-- Database Schema for Fil d'Or
-- Table: ct-activity-logs (Logs d'activité atelier)

CREATE TABLE IF NOT EXISTS "ct-activity-logs" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES "ct-orders"(id) ON DELETE SET NULL,
  stock_item_id UUID REFERENCES "ct-stock-items"(id) ON DELETE SET NULL,
  employee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  material_name TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit TEXT NOT NULL,
  motif TEXT,
  stock_change NUMERIC(10,2) NOT NULL, -- Negative value for deduction
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_ct_activity_logs_order_id ON "ct-activity-logs"(order_id);
CREATE INDEX IF NOT EXISTS idx_ct_activity_logs_stock_item_id ON "ct-activity-logs"(stock_item_id);
CREATE INDEX IF NOT EXISTS idx_ct_activity_logs_employee_id ON "ct-activity-logs"(employee_id);
CREATE INDEX IF NOT EXISTS idx_ct_activity_logs_created_at ON "ct-activity-logs"(created_at DESC);

-- RLS Policies
ALTER TABLE "ct-activity-logs" ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view activity logs
CREATE POLICY "authenticated_users_select_activity_logs" ON "ct-activity-logs"
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can create activity logs
CREATE POLICY "authenticated_users_insert_activity_logs" ON "ct-activity-logs"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

