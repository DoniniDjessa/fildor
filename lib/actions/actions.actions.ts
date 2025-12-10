'use server';

import { createServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/checkAccess';

export async function getActions() {
  await requireAdmin();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-actions')
    .select(`
      *,
      user:ct-users!ct-actions_user_id_fkey(name, email)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function getActionsByTable(tableName: string) {
  await requireAdmin();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-actions')
    .select(`
      *,
      user:ct-users!ct-actions_user_id_fkey(name, email)
    `)
    .eq('table_name', tableName)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

