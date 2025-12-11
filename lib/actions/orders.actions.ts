'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { deleteImage, extractStoragePath } from '@/lib/storage/images';

export type OrderStatus = 'pending' | 'cutting' | 'sewing' | 'fitting' | 'completed';

/**
 * Helper function to enrich orders with client and model data
 */
async function enrichOrdersWithRelations(orders: any[]) {
  console.log('[enrichOrdersWithRelations] Called with', orders?.length || 0, 'orders');
  
  if (!orders || orders.length === 0) {
    console.log('[enrichOrdersWithRelations] No orders to enrich, returning empty array');
    return [];
  }

  const supabase = await createServerClient();

  // Get unique client and model IDs
  const clientIds = [...new Set(orders.map((o) => o.client_id).filter(Boolean))];
  const modelIds = [...new Set(orders.map((o) => o.model_id).filter(Boolean))];

  console.log('[enrichOrdersWithRelations] Client IDs:', clientIds.length, 'Model IDs:', modelIds.length);

  // Fetch clients and models separately
  console.log('[enrichOrdersWithRelations] Fetching clients and models...');
  const [clientsResult, modelsResult] = await Promise.all([
    clientIds.length > 0
      ? supabase
          .from('ct-clients')
          .select('id, noms, surnom')
          .in('id', clientIds)
      : { data: [], error: null },
    modelIds.length > 0
      ? supabase
          .from('ct-models')
          .select('id, name, category, base_price, image_url')
          .in('id', modelIds)
      : { data: [], error: null },
  ]);

  if (clientsResult.error) {
    console.error('[enrichOrdersWithRelations] Error fetching clients:', clientsResult.error);
  } else {
    console.log('[enrichOrdersWithRelations] Fetched', clientsResult.data?.length || 0, 'clients');
  }

  if (modelsResult.error) {
    console.error('[enrichOrdersWithRelations] Error fetching models:', modelsResult.error);
  } else {
    console.log('[enrichOrdersWithRelations] Fetched', modelsResult.data?.length || 0, 'models');
  }

  // Create maps for quick lookup
  const clientsMap = new Map(
    (clientsResult.data || []).map((c: any) => [c.id, { id: c.id, noms: c.noms, surnom: c.surnom }])
  );
  const modelsMap = new Map(
    (modelsResult.data || []).map((m: any) => [
      m.id,
      { id: m.id, name: m.name, category: m.category, base_price: m.base_price, image_url: m.image_url },
    ])
  );

  console.log('[enrichOrdersWithRelations] Maps created - Clients:', clientsMap.size, 'Models:', modelsMap.size);

  // Combine orders with client and model data
  const enriched = orders.map((order: any) => ({
    ...order,
    client: order.client_id ? clientsMap.get(order.client_id) || null : null,
    model: order.model_id ? modelsMap.get(order.model_id) || null : null,
  }));

  console.log('[enrichOrdersWithRelations] Enrichment complete. Orders with client:', enriched.filter(o => o.client).length, 'Orders with model:', enriched.filter(o => o.model).length);
  console.log('[enrichOrdersWithRelations] Sample enriched order:', enriched[0] ? {
    id: enriched[0].id,
    status: enriched[0].status,
    hasClient: !!enriched[0].client,
    hasModel: !!enriched[0].model,
  } : 'none');

  return enriched;
}

export interface OrderFormData {
  client_id: string;
  model_id: string;
  status?: OrderStatus;
  fabric_image_url?: string;
  fabric_meters?: string;
  client_reference_image_url?: string;
  sketch_url?: string;
  supplies_from_stock?: string[];
  total_price: number;
  advance?: number;
  payment_method?: 'cash' | 'wave';
  delivery_date: string; // ISO date string
}

export interface Order {
  id: string;
  client_id: string;
  model_id: string;
  status: OrderStatus;
  fabric_image_url?: string | null;
  fabric_meters?: string | null;
  client_reference_image_url?: string | null;
  sketch_url?: string | null;
  supplies_from_stock?: string[] | null;
  total_price: number;
  advance: number;
  payment_method: 'cash' | 'wave';
  delivery_date: string;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  client?: {
    id: string;
    noms?: string;
    surnom?: string;
  };
  model?: {
    id: string;
    name: string;
    category: string;
    base_price: number;
    image_url?: string;
  };
}

export async function getOrders() {
  const supabase = await createServerClient();

  // Fetch orders without relations (like the SQL query that works)
  const { data: ordersData, error: ordersError } = await supabase
    .from('ct-orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Error fetching orders:', ordersError);
    throw new Error(ordersError.message);
  }

  if (!ordersData || ordersData.length === 0) {
    return [];
  }

  // Enrich orders with client and model data
  const enrichedOrders = await enrichOrdersWithRelations(ordersData);

  console.log('Commandes:', enrichedOrders);
  return enrichedOrders as unknown as Order[];
}

export async function getOrdersByStatus(status: OrderStatus) {
  console.log(`[getOrdersByStatus] Called with status: ${status}`);
  const supabase = await createServerClient();

  // Build query without relations first
  console.log(`[getOrdersByStatus(${status})] Building query...`);
  let query = supabase.from('ct-orders').select('*').eq('status', status);

  // For completed orders, only show those completed less than 4 days ago
  if (status === 'completed') {
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    query = query.gte('completed_at', fourDaysAgo.toISOString());
    console.log(`[getOrdersByStatus(${status})] Filtering completed orders after:`, fourDaysAgo.toISOString());
  }

  console.log(`[getOrdersByStatus(${status})] Executing query...`);
  const { data: ordersData, error: ordersError } = await query.order('created_at', { ascending: false });

  if (ordersError) {
    console.error(`[getOrdersByStatus(${status})] Error:`, {
      code: ordersError.code,
      message: ordersError.message,
      details: ordersError.details,
      hint: ordersError.hint,
    });
    throw new Error(ordersError.message);
  }

  console.log(`[getOrdersByStatus(${status})] Raw orders fetched:`, ordersData?.length || 0);
  if (ordersData && ordersData.length > 0) {
    console.log(`[getOrdersByStatus(${status})] Sample order:`, {
      id: ordersData[0].id,
      status: ordersData[0].status,
      client_id: ordersData[0].client_id,
      model_id: ordersData[0].model_id,
    });
  }

  if (!ordersData || ordersData.length === 0) {
    console.log(`[getOrdersByStatus(${status})] No orders found, returning empty array`);
    return [];
  }

  // Enrich orders with client and model data
  console.log(`[getOrdersByStatus(${status})] Enriching orders...`);
  const enrichedOrders = await enrichOrdersWithRelations(ordersData);
  console.log(`[getOrdersByStatus(${status})] Returning ${enrichedOrders.length} enriched orders`);

  return enrichedOrders as unknown as Order[];
}

export async function createOrder(data: OrderFormData & { id?: string; fabric_image_url?: string; client_reference_image_url?: string }) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If id is provided, it means we're updating an existing order
  if (data.id) {
    const { data: order, error } = await supabase
      .from('ct-orders')
      .update({
        fabric_image_url: data.fabric_image_url,
        client_reference_image_url: data.client_reference_image_url,
        updated_by: user?.id,
      })
      .eq('id', data.id)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Enrich with relations
    const enrichedOrders = await enrichOrdersWithRelations([order]);
    const enrichedOrder = enrichedOrders[0];

    revalidatePath('/commandes');
    return enrichedOrder as unknown as Order;
  }

  // Otherwise, create a new order
  const { data: order, error } = await supabase
    .from('ct-orders')
    .insert({
      client_id: data.client_id,
      model_id: data.model_id,
      status: data.status || 'pending',
      fabric_image_url: data.fabric_image_url,
      fabric_meters: data.fabric_meters,
      client_reference_image_url: data.client_reference_image_url,
      sketch_url: data.sketch_url,
      supplies_from_stock: data.supplies_from_stock || [],
      total_price: data.total_price,
      advance: data.advance || 0,
      payment_method: data.payment_method || 'cash',
      delivery_date: data.delivery_date,
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Enrich with relations
  const enrichedOrders = await enrichOrdersWithRelations([order]);
  const enrichedOrder = enrichedOrders[0];

  revalidatePath('/commandes');
  return enrichedOrder as unknown as Order;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const updateData: any = {
    status,
    updated_by: user?.id,
  };

  // Set completed_at when status is 'completed'
  if (status === 'completed' && !updateData.completed_at) {
    updateData.completed_at = new Date().toISOString();
  }

  const { data: orderData, error } = await supabase
    .from('ct-orders')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Enrich with relations
  const enrichedOrders = await enrichOrdersWithRelations([orderData]);
  const enrichedOrder = enrichedOrders[0];

  revalidatePath('/commandes');
  return enrichedOrder as unknown as Order;
}

export async function updateOrder(id: string, data: Partial<OrderFormData>) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orderData, error } = await supabase
    .from('ct-orders')
    .update({
      ...data,
      updated_by: user?.id,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // Enrich with relations
  const enrichedOrders = await enrichOrdersWithRelations([orderData]);
  const enrichedOrder = enrichedOrders[0];

  revalidatePath('/commandes');
  return enrichedOrder as unknown as Order;
}

export async function deleteOrder(id: string) {
  const supabase = await createServerClient();

  // Get order data before deletion to get image URLs
  const { data: orderData } = await supabase
    .from('ct-orders')
    .select('fabric_image_url, client_reference_image_url, sketch_url')
    .eq('id', id)
    .single();

  // Delete associated images if they exist
  if (orderData) {
    const images = [
      orderData.fabric_image_url,
      orderData.client_reference_image_url,
      orderData.sketch_url,
    ].filter(Boolean);

    for (const imageUrl of images) {
      if (imageUrl) {
        try {
          const storagePath = await extractStoragePath(imageUrl);
          if (storagePath) {
            await deleteImage(storagePath);
          }
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }
  }

  const { error } = await supabase.from('ct-orders').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/commandes');
}

