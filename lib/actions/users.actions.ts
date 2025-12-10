'use server';

import { createServerClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/checkAccess';
import { revalidatePath } from 'next/cache';
import type { UserRole } from '@/types/auth';

export interface UserFormData {
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  password: string;
}

export interface UserUpdateData {
  name?: string;
  phone?: string;
  role?: UserRole;
}

export async function getUsers() {
  await requireAdmin();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getUserById(id: string) {
  await requireAdmin();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createUser(userData: UserFormData) {
  await requireAdmin();
  const supabase = await createServerClient();

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: userData.email,
    password: userData.password,
    email_confirm: true,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  if (!authData.user) {
    throw new Error('Failed to create user');
  }

  // Create user profile in ct-users table
  const { data: profileData, error: profileError } = await supabase
    .from('ct-users')
    .insert({
      id: authData.user.id,
      email: userData.email,
      name: userData.name,
      phone: userData.phone,
      role: userData.role,
    })
    .select()
    .single();

  if (profileError) {
    // Rollback: delete auth user if profile creation fails
    await supabase.auth.admin.deleteUser(authData.user.id);
    throw new Error(profileError.message);
  }

  revalidatePath('/utilisateurs');
  return profileData;
}

export async function updateUser(id: string, userData: UserUpdateData) {
  await requireAdmin();
  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from('ct-users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/utilisateurs');
  return data;
}

export async function deleteUser(id: string) {
  await requireAdmin();
  const supabase = await createServerClient();

  // Get user data before deletion for action log
  const { data: userData } = await supabase
    .from('ct-users')
    .select('*')
    .eq('id', id)
    .single();

  // Get current user for action log
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Log the action
  if (userData && user) {
    await supabase.from('ct-actions').insert({
      action_type: 'delete',
      table_name: 'ct-users',
      record_id: id,
      record_data: userData as any,
      user_id: user.id,
    });
  }

  // Delete from ct-users (this will cascade delete auth user if foreign key is set up)
  const { error } = await supabase.from('ct-users').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  // Also delete from auth.users
  await supabase.auth.admin.deleteUser(id);

  revalidatePath('/utilisateurs');
}

