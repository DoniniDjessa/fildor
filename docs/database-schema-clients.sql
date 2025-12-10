-- Database Schema for Fil d'Or
-- Table: ct-clients

CREATE TABLE IF NOT EXISTS "ct-clients" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  noms TEXT,
  surnom TEXT,
  email TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  height NUMERIC(5,2),
  weight NUMERIC(5,2),
  location TEXT,
  dob_day INTEGER CHECK (dob_day >= 1 AND dob_day <= 31),
  dob_month INTEGER CHECK (dob_month >= 1 AND dob_month <= 12),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_ct_clients_noms ON "ct-clients"(noms);
CREATE INDEX IF NOT EXISTS idx_ct_clients_surnom ON "ct-clients"(surnom);
CREATE INDEX IF NOT EXISTS idx_ct_clients_email ON "ct-clients"(email);
CREATE INDEX IF NOT EXISTS idx_ct_clients_phone ON "ct-clients"(phone);
CREATE INDEX IF NOT EXISTS idx_ct_clients_created_at ON "ct-clients"(created_at DESC);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_ct_clients_updated_at BEFORE UPDATE
    ON "ct-clients" FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Table: ct-actions (pour l'historique des suppressions)
CREATE TABLE IF NOT EXISTS "ct-actions" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL CHECK (action_type IN ('delete', 'update', 'create')),
  table_name TEXT NOT NULL,
  record_id UUID NOT NULL,
  record_data JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_ct_actions_type ON "ct-actions"(action_type);
CREATE INDEX IF NOT EXISTS idx_ct_actions_table ON "ct-actions"(table_name);
CREATE INDEX IF NOT EXISTS idx_ct_actions_created_at ON "ct-actions"(created_at DESC);
