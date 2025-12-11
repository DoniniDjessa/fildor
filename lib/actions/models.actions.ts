'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface ModelFormData {
  name: string;
  category: 'Homme' | 'Femme' | 'Enfant';
  base_price: number;
  make_time: number;
  fabric_req: string;
  difficulty?: 'Facile' | 'Moyen' | 'Expert';
  image_url?: string;
}

export async function getModels() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-models')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getModelById(id: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-models')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createModel(modelData: ModelFormData) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-models')
    .insert({
      ...modelData,
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/catalogue');
  return data;
}

export async function updateModel(id: string, modelData: Partial<ModelFormData>) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-models')
    .update({
      ...modelData,
      updated_by: user?.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/catalogue');
  return data;
}

export async function deleteModel(id: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.from('ct-models').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/catalogue');
}

