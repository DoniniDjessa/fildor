'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function signOut() {
  const supabase = await createServerClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function getCurrentUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  // Fetch user profile from ct-users table
  const { data: profile, error: profileError } = await supabase
    .from('ct-users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { ...user, profile: null };
  }

  return {
    ...user,
    profile,
  };
}

