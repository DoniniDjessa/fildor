-- Database Schema for Fil d'Or
-- Table: ct-users

CREATE TABLE IF NOT EXISTS "ct-users" (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('superAdmin', 'admin', 'manager', 'couturier', 'livreur')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_ct_users_email ON "ct-users"(email);
CREATE INDEX IF NOT EXISTS idx_ct_users_role ON "ct-users"(role);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ct_users_updated_at BEFORE UPDATE
    ON "ct-users" FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

