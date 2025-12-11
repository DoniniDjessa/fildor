'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface MaterialTypeFormData {
  name: string;
  unit: 'mètres' | 'yards' | 'rouleaux' | 'pièces' | 'bobines' | 'm';
  category: 'Tissu' | 'Doublure' | 'Mercerie' | 'Pagne';
  default_threshold?: number;
  average_price_per_unit?: number;
}

export async function getMaterialTypes() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-material-types')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getMaterialTypeById(id: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-material-types')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createMaterialType(materialTypeData: MaterialTypeFormData) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-material-types')
    .insert({
      ...materialTypeData,
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/stock');
  return data;
}

export async function updateMaterialType(id: string, materialTypeData: Partial<MaterialTypeFormData>) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-material-types')
    .update({
      ...materialTypeData,
      updated_by: user?.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/stock');
  return data;
}

export async function deleteMaterialType(id: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.from('ct-material-types').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/stock');
}

