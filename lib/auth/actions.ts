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
  // Use .maybeSingle() instead of .single() to avoid error when no profile exists
  const { data: profile, error: profileError } = await supabase
    .from('ct-users')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // PGRST116 means no rows found - this is expected for users without profiles
  if (profileError && profileError.code !== 'PGRST116') {
    // Only log non-expected errors
    console.error('getCurrentUser - Profile error:', profileError);
    console.error('getCurrentUser - User ID:', user.id);
    return { ...user, profile: null };
  }

  if (!profile) {
    // User exists in auth but not in ct-users table
    // This is not an error, just return user without profile
    return { ...user, profile: null };
  }

  // Debug log to verify role is retrieved (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('getCurrentUser - Profile retrieved:', {
      id: profile.id,
      email: profile.email,
      role: profile.role,
      roleType: typeof profile.role,
    });
  }

  return {
    ...user,
    profile,
  };
}

