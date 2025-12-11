'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface MeasurementFormData {
  client_id: string;
  measurement_type: 'Robe' | 'Pantalon' | 'Chemise';
  // Robe measurements
  epaule?: number;
  poitrine?: number;
  taille?: number;
  bassin?: number;
  bras?: number;
  longueur?: number;
  // Pantalon measurements
  tour_hanches?: number;
  longueur_jambe?: number;
  tour_cuisse?: number;
  // Chemise measurements
  manche?: number;
  notes?: string;
}

export async function getMeasurementsByClient(clientId: string) {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-measurements')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getLatestMeasurementByClient(clientId: string, type: 'Robe' | 'Pantalon' | 'Chemise') {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-measurements')
    .select('*')
    .eq('client_id', clientId)
    .eq('measurement_type', type)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(error.message);
  }

  return data || null;
}

export async function createMeasurement(measurementData: MeasurementFormData) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-measurements')
    .insert({
      ...measurementData,
      created_by: user?.id,
      updated_by: user?.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/clients/${measurementData.client_id}`);
  return data;
}

export async function updateMeasurement(id: string, measurementData: Partial<MeasurementFormData>) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('ct-measurements')
    .update({
      ...measurementData,
      updated_by: user?.id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath(`/clients/${measurementData.client_id || data.client_id}`);
  return data;
}

export async function deleteMeasurement(id: string) {
  const supabase = await createServerClient();

  // Get measurement data before deletion to get client_id for revalidation
  const { data: measurementData } = await supabase
    .from('ct-measurements')
    .select('client_id')
    .eq('id', id)
    .single();

  const { error } = await supabase.from('ct-measurements').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  if (measurementData) {
    revalidatePath(`/clients/${measurementData.client_id}`);
  }
}

