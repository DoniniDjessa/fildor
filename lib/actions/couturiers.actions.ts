'use server';

import { createServerClient } from '@/lib/supabase/server';

export interface Couturier {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export async function getCouturiers() {
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-users')
    .select('id, name, email, phone')
    .eq('role', 'couturier')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching couturiers:', error);
    return [];
  }

  return (data || []) as Couturier[];
}

