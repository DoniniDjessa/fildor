'use server';

import { createServerClient } from '@/lib/supabase/server';

/**
 * Debug action to check roles in ct-users table
 */
export async function checkUserRoles() {
  const supabase = await createServerClient();

  const { data: users, error } = await supabase
    .from('ct-users')
    .select('id, email, name, role')
    .order('email');

  if (error) {
    console.error('Error fetching users:', error);
    return { error: error.message, users: null };
  }

  console.log('=== User Roles in ct-users table ===');
  users?.forEach((user) => {
    console.log(`User: ${user.email} (${user.name}) - Role: "${user.role}" (type: ${typeof user.role})`);
  });
  console.log('===================================');

  return { error: null, users };
}

/**
 * Debug action to check current user's role
 */
export async function checkCurrentUserRole() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: 'No authenticated user', user: null, profile: null };
  }

  const { data: profile, error: profileError } = await supabase
    .from('ct-users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return { error: profileError.message, user, profile: null };
  }

  console.log('=== Current User Role Check ===');
  console.log('User ID:', user.id);
  console.log('User Email:', user.email);
  console.log('Profile:', profile);
  console.log('Role:', profile?.role);
  console.log('Role Type:', typeof profile?.role);
  console.log('Is Admin Check:', profile?.role === 'superAdmin' || profile?.role === 'admin');
  console.log('==============================');

  return {
    error: null,
    user: {
      id: user.id,
      email: user.email,
    },
    profile: profile ? {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: profile.role,
      roleType: typeof profile.role,
    } : null,
  };
}

