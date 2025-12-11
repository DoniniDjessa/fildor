'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { deleteImage, extractStoragePath } from '@/lib/storage/images';

export type OrderStatus = 'pending' | 'cutting' | 'sewing' | 'fitting' | 'completed';

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

  const { data, error } = await supabase
    .from('ct-orders')
    .select(`
      *,
      client:ct-clients(id, noms, surnom),
      model:ct-models(id, name, category, base_price, image_url)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as unknown as Order[];
}

export async function getOrdersByStatus(status: OrderStatus) {
  const supabase = await createServerClient();

  let query = supabase
    .from('ct-orders')
    .select(`
      *,
      client:ct-clients(id, noms, surnom),
      model:ct-models(id, name, category, base_price, image_url)
    `)
    .eq('status', status);

  // For completed orders, only show those completed less than 4 days ago
  if (status === 'completed') {
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    query = query.gte('completed_at', fourDaysAgo.toISOString());
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as unknown as Order[];
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
      .select(`
        *,
        client:ct-clients(id, noms, surnom),
        model:ct-models(id, name, category, base_price, image_url)
      `)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    revalidatePath('/commandes');
    return order as unknown as Order;
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
    .select(`
      *,
      client:ct-clients(id, noms, surnom),
      model:ct-models(id, name, category, base_price, image_url)
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/commandes');
  return order as unknown as Order;
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

  const { data, error } = await supabase
    .from('ct-orders')
    .update(updateData)
    .eq('id', id)
    .select(`
      *,
      client:ct-clients(id, noms, surnom),
      model:ct-models(id, name, category, base_price, image_url)
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/commandes');
  return data as unknown as Order;
}

export async function updateOrder(id: string, data: Partial<OrderFormData>) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: order, error } = await supabase
    .from('ct-orders')
    .update({
      ...data,
      updated_by: user?.id,
    })
    .eq('id', id)
    .select(`
      *,
      client:ct-clients(id, noms, surnom),
      model:ct-models(id, name, category, base_price, image_url)
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/commandes');
  return order as unknown as Order;
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

