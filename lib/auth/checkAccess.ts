'use server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const supabase = await createServerClient();
  
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error('Auth error in requireAdmin:', authError?.message || 'No user');
    redirect('/login');
  }

  // Fetch user profile to check role
  // Use .maybeSingle() instead of .single() to avoid error when no profile exists
  const { data: profile, error: profileError } = await supabase
    .from('ct-users')
    .select('role, name, email')
    .eq('id', user.id)
    .maybeSingle();

  // PGRST116 means no rows found - this is expected for users without profiles
  if (profileError && profileError.code !== 'PGRST116') {
    // Only log non-expected errors
    console.error('Profile error in requireAdmin:', profileError.message);
    console.error('User ID:', user.id);
    redirect('/login');
  }

  if (!profile) {
    // User exists in auth but not in ct-users table
    // Redirect to login (user needs to complete registration)
    redirect('/login');
  }

  const role = profile.role as string;
  const isAdmin = role === 'superAdmin' || role === 'admin';

  if (!isAdmin) {
    console.log(`User ${user.id} is not admin (role: ${role}), redirecting to home`);
    redirect('/');
  }

  return { user, profile };
}

