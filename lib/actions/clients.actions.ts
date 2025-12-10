'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ClientFormData {
  noms?: string;
  surnom?: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  height?: number;
  weight?: number;
  location?: string;
  dob_day?: number;
  dob_month?: number;
  notes?: string;
}

export async function getClients() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-clients')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getClientById(id: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createClient(clientData: ClientFormData) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-clients')
    .insert({
      ...clientData,
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/clients');
  return data;
}

export async function updateClient(id: string, clientData: Partial<ClientFormData>) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-clients')
    .update({
      ...clientData,
      updated_by: user?.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/clients');
  return data;
}

export async function deleteClient(id: string) {
  const supabase = await createServerClient();

  // Get client data before deletion for action log
  const { data: clientData } = await supabase
    .from('ct-clients')
    .select('*')
    .eq('id', id)
    .single();

  // Get current user for action log
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Log the action before deletion
  if (clientData && user) {
    await supabase.from('ct-actions').insert({
      action_type: 'delete',
      table_name: 'ct-clients',
      record_id: id,
      record_data: clientData as any,
      user_id: user.id,
    });
  }

  // Delete the client
  const { error } = await supabase.from('ct-clients').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/clients');
  revalidatePath('/actions');
}
