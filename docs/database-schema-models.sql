-- Database Schema for Fil d'Or
-- Table: ct-models (Catalogue de Modèles)

CREATE TABLE IF NOT EXISTS "ct-models" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Homme', 'Femme', 'Enfant')),
  base_price NUMERIC(10,2) NOT NULL,
  make_time INTEGER NOT NULL,
  fabric_req TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Facile', 'Moyen', 'Expert')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_ct_models_name ON "ct-models"(name);
CREATE INDEX IF NOT EXISTS idx_ct_models_category ON "ct-models"(category);

-- Trigger pour mettre à jour updated_at automatiquement
DROP TRIGGER IF EXISTS update_ct_models_updated_at ON "ct-models";

CREATE TRIGGER update_ct_models_updated_at BEFORE UPDATE
    ON "ct-models" FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

