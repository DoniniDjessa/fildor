'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface StockItemFormData {
  material_type_id: string;
  name: string;
  color?: string;
  image_url?: string;
  quantity: number;
  threshold: number;
  max_capacity?: number;
}

export async function getStockItems() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-stock-items')
    .select(`
      *,
      material_type:ct-material-types(*)
    `)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getStockItemsByCategory(category: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-stock-items')
    .select(`
      *,
      material_type:ct-material-types(*)
    `)
    .eq('material_type.category', category)
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function createStockItem(stockItemData: StockItemFormData) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-stock-items')
    .insert({
      ...stockItemData,
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select(`
      *,
      material_type:ct-material-types(*)
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/stock');
  return data;
}

export async function updateStockItem(id: string, stockItemData: Partial<StockItemFormData>) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-stock-items')
    .update({
      ...stockItemData,
      updated_by: user?.id,
    })
    .eq('id', id)
    .select(`
      *,
      material_type:ct-material-types(*)
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/stock');
  return data;
}

export async function deleteStockItem(id: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.from('ct-stock-items').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/stock');
}

export async function useStockItem(id: string, data: { quantity: number; motif: string }) {
  const supabase = await createServerClient();

  // Get current stock item
  const { data: stockItem, error: fetchError } = await supabase
    .from('ct-stock-items')
    .select('quantity')
    .eq('id', id)
    .single();

  if (fetchError || !stockItem) {
    throw new Error('Item de stock introuvable');
  }

  if (data.quantity > stockItem.quantity) {
    throw new Error(`Quantité insuffisante. Disponible: ${stockItem.quantity}`);
  }

  const newQuantity = stockItem.quantity - data.quantity;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Update quantity
  const { error: updateError } = await supabase
    .from('ct-stock-items')
    .update({
      quantity: newQuantity,
      updated_by: user?.id,
    })
    .eq('id', id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  // TODO: Log the usage in a stock usage history table
  // For now, we just update the quantity

  revalidatePath('/stock');
  return { success: true };
}

export async function getStockKPIs() {
  const supabase = await createServerClient();

  // Get all stock items with their material types
  const { data: stockItems, error } = await supabase
    .from('ct-stock-items')
    .select(`
      *,
      material_type:ct-material-types(*)
    `);

  if (error) {
    throw new Error(error.message);
  }

  if (!stockItems || stockItems.length === 0) {
    return {
      totalValue: 0,
      totalFabricMeters: 0,
      lowStockCount: 0,
    };
  }

  // Calculate total value (sum of quantity * average_price_per_unit)
  let totalValue = 0;
  let totalFabricMeters = 0;
  let lowStockCount = 0;

  stockItems.forEach((item: any) => {
    const quantity = Number(item.quantity || 0);
    const materialType = item.material_type;
    const avgPrice = Number(materialType?.average_price_per_unit || 0);
    
    // Calculate value
    if (avgPrice > 0) {
      totalValue += quantity * avgPrice;
    }

    // Calculate total fabric meters (only for Tissu category)
    if (materialType?.category === 'Tissu') {
      // Convert to meters if needed
      if (materialType.unit === 'yards') {
        totalFabricMeters += quantity * 0.9144; // 1 yard = 0.9144 meters
      } else if (materialType.unit === 'mètres' || materialType.unit === 'm') {
        totalFabricMeters += quantity;
      }
    }

    // Count low stock items
    const threshold = Number(item.threshold || 0);
    if (quantity <= threshold) {
      lowStockCount++;
    }
  });

  return {
    totalValue: Math.round(totalValue),
    totalFabricMeters: Math.round(totalFabricMeters * 10) / 10, // Round to 1 decimal
    lowStockCount,
  };
}

