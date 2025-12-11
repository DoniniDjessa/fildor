-- Database Schema for Fil d'Or
-- Table: ct-measurements

CREATE TABLE IF NOT EXISTS "ct-measurements" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES "ct-clients"(id) ON DELETE CASCADE,
  measurement_type TEXT NOT NULL CHECK (measurement_type IN ('Robe', 'Pantalon', 'Chemise')),
  
  -- Measurements for Robe
  epaule NUMERIC(5,2),
  poitrine NUMERIC(5,2),
  taille NUMERIC(5,2),
  bassin NUMERIC(5,2),
  bras NUMERIC(5,2),
  longueur NUMERIC(5,2),
  
  -- Measurements for Pantalon
  tour_hanches NUMERIC(5,2),
  longueur_jambe NUMERIC(5,2),
  tour_cuisse NUMERIC(5,2),
  
  -- Measurements for Chemise
  manche NUMERIC(5,2),
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_ct_measurements_client_id ON "ct-measurements"(client_id);
CREATE INDEX IF NOT EXISTS idx_ct_measurements_type ON "ct-measurements"(measurement_type);
CREATE INDEX IF NOT EXISTS idx_ct_measurements_created_at ON "ct-measurements"(created_at DESC);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE TRIGGER update_ct_measurements_updated_at BEFORE UPDATE
    ON "ct-measurements" FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

