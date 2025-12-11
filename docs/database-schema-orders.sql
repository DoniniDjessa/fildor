-- Table for orders (commandes)
CREATE TABLE IF NOT EXISTS "ct-orders" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES "ct-clients"(id) ON DELETE CASCADE,
  model_id UUID NOT NULL REFERENCES "ct-models"(id) ON DELETE RESTRICT,
  
  -- Status tracking
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cutting', 'sewing', 'fitting', 'completed')),
  
  -- Fabric information
  fabric_image_url TEXT,
  fabric_meters VARCHAR(50),
  client_reference_image_url TEXT,
  
  -- Customization
  sketch_url TEXT,
  supplies_from_stock JSONB DEFAULT '[]'::jsonb,
  
  -- Financial information
  total_price DECIMAL(10, 2) NOT NULL,
  advance DECIMAL(10, 2) DEFAULT 0,
  payment_method VARCHAR(20) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'wave')),
  
  -- Dates
  delivery_date DATE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_client_id ON "ct-orders"(client_id);
CREATE INDEX IF NOT EXISTS idx_orders_model_id ON "ct-orders"(model_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON "ct-orders"(status);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON "ct-orders"(delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_completed_at ON "ct-orders"(completed_at);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_ct_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_ct_orders_updated_at ON "ct-orders";
CREATE TRIGGER update_ct_orders_updated_at
  BEFORE UPDATE ON "ct-orders"
  FOR EACH ROW
  EXECUTE FUNCTION update_ct_orders_updated_at();

-- RLS Policies
ALTER TABLE "ct-orders" ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all orders
CREATE POLICY "Users can view orders" ON "ct-orders"
  FOR SELECT
  USING (true);

-- Policy: Users can create orders
CREATE POLICY "Users can create orders" ON "ct-orders"
  FOR INSERT
  WITH CHECK (true);

-- Policy: Users can update orders
CREATE POLICY "Users can update orders" ON "ct-orders"
  FOR UPDATE
  USING (true);

-- Policy: Users can delete orders (admins only - handled in application)
CREATE POLICY "Users can delete orders" ON "ct-orders"
  FOR DELETE
  USING (true);

