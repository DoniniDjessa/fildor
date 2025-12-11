-- Database Schema for Fil d'Or
-- Table: ct-appointments (Rendez-vous)

CREATE TABLE IF NOT EXISTS "ct-appointments" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES "ct-orders"(id) ON DELETE SET NULL,
  client_id UUID REFERENCES "ct-clients"(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('fitting', 'delivery', 'measure', 'discussion', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'completed', 'cancelled')),
  client_name TEXT NOT NULL,
  order_desc TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_ct_appointments_client_id ON "ct-appointments"(client_id);
CREATE INDEX IF NOT EXISTS idx_ct_appointments_order_id ON "ct-appointments"(order_id);
CREATE INDEX IF NOT EXISTS idx_ct_appointments_status ON "ct-appointments"(status);
CREATE INDEX IF NOT EXISTS idx_ct_appointments_scheduled_date ON "ct-appointments"(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_ct_appointments_scheduled_time ON "ct-appointments"(scheduled_time);

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_ct_appointments_updated_at ON "ct-appointments";
CREATE TRIGGER update_ct_appointments_updated_at
  BEFORE UPDATE ON "ct-appointments"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE "ct-appointments" ENABLE ROW LEVEL SECURITY;

-- Policy: All authenticated users can view appointments
CREATE POLICY "authenticated_users_select_appointments" ON "ct-appointments"
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: All authenticated users can create appointments
CREATE POLICY "authenticated_users_insert_appointments" ON "ct-appointments"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: All authenticated users can update appointments
CREATE POLICY "authenticated_users_update_appointments" ON "ct-appointments"
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: All authenticated users can delete appointments
CREATE POLICY "authenticated_users_delete_appointments" ON "ct-appointments"
  FOR DELETE
  TO authenticated
  USING (true);

