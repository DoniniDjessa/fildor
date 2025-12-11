-- Database Schema for Fil d'Or
-- Table: ct-material-types (La Matièrethèque)

CREATE TABLE IF NOT EXISTS "ct-material-types" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  unit TEXT NOT NULL CHECK (unit IN ('mètres', 'yards', 'rouleaux', 'pièces', 'bobines', 'm')),
  category TEXT NOT NULL CHECK (category IN ('Tissu', 'Doublure', 'Mercerie', 'Pagne')),
  default_threshold NUMERIC(10,2) DEFAULT 0,
  average_price_per_unit NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Table: ct-stock-items (L'Inventaire - Stock Réel)

CREATE TABLE IF NOT EXISTS "ct-stock-items" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_type_id UUID NOT NULL REFERENCES "ct-material-types"(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT,
  image_url TEXT,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 0,
  threshold NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_capacity NUMERIC(10,2),
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Index pour les recherches fréquentes
CREATE INDEX IF NOT EXISTS idx_ct_material_types_name ON "ct-material-types"(name);
CREATE INDEX IF NOT EXISTS idx_ct_material_types_category ON "ct-material-types"(category);
CREATE INDEX IF NOT EXISTS idx_ct_stock_items_material_type ON "ct-stock-items"(material_type_id);
CREATE INDEX IF NOT EXISTS idx_ct_stock_items_name ON "ct-stock-items"(name);

-- Trigger pour mettre à jour updated_at automatiquement
-- Supprimer les triggers s'ils existent déjà
DROP TRIGGER IF EXISTS update_ct_material_types_updated_at ON "ct-material-types";
DROP TRIGGER IF EXISTS update_ct_stock_items_updated_at ON "ct-stock-items";

-- Créer les triggers
CREATE TRIGGER update_ct_material_types_updated_at BEFORE UPDATE
    ON "ct-material-types" FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ct_stock_items_updated_at BEFORE UPDATE
    ON "ct-stock-items" FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

