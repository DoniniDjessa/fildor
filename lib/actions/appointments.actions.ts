'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type AppointmentType = 'fitting' | 'delivery' | 'measure' | 'discussion' | 'other';
export type AppointmentStatus = 'pending' | 'scheduled' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  order_id?: string | null;
  client_id: string;
  type: AppointmentType;
  status: AppointmentStatus;
  client_name: string;
  order_desc?: string | null;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  location?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}

export interface CreateAppointmentData {
  order_id?: string;
  client_id: string;
  type: AppointmentType;
  client_name: string;
  order_desc?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  location?: string;
  notes?: string;
}

export interface UpdateAppointmentData {
  scheduled_date?: string;
  scheduled_time?: string;
  status?: AppointmentStatus;
  location?: string;
  notes?: string;
}

export async function createAppointment(data: CreateAppointmentData) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const appointmentData: any = {
    order_id: data.order_id || null,
    client_id: data.client_id,
    type: data.type,
    status: data.scheduled_date && data.scheduled_time ? 'scheduled' : 'pending',
    client_name: data.client_name,
    order_desc: data.order_desc || null,
    scheduled_date: data.scheduled_date || null,
    scheduled_time: data.scheduled_time || null,
    location: data.location || null,
    notes: data.notes || null,
    created_by: user?.id || null,
    updated_by: user?.id || null,
  };

  const { data: appointment, error } = await supabase
    .from('ct-appointments')
    .insert(appointmentData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/appointments');
  return appointment as Appointment;
}

export async function getAppointments(status?: AppointmentStatus) {
  const supabase = await createServerClient();

  let query = supabase
    .from('ct-appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Appointment[];
}

export async function getPendingAppointments() {
  return getAppointments('pending');
}

export async function getScheduledAppointments() {
  return getAppointments('scheduled');
}

export async function updateAppointment(id: string, data: UpdateAppointmentData) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const updateData: any = {
    ...data,
    updated_by: user?.id || null,
  };

  // If date and time are provided, set status to scheduled
  if (data.scheduled_date && data.scheduled_time) {
    updateData.status = 'scheduled';
  }

  const { data: appointment, error } = await supabase
    .from('ct-appointments')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/appointments');
  return appointment as Appointment;
}

export async function deleteAppointment(id: string) {
  const supabase = await createServerClient();

  const { error } = await supabase.from('ct-appointments').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/appointments');
}

export async function completeAppointment(id: string) {
  return updateAppointment(id, { status: 'completed' });
}

