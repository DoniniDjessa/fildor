'use server';

import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  try {
    const supabase = await createServerClient();
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('Auth error in requireAdmin:', authError.message);
      redirect('/login');
    }

    if (!user) {
      console.error('No user found in requireAdmin - user is null');
      redirect('/login');
    }

    // Fetch user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('ct-users')
      .select('role, name, email')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('Profile error in requireAdmin:', profileError.message);
      console.error('User ID:', user.id);
      redirect('/login');
    }

    if (!profile) {
      console.error('No profile found in requireAdmin - profile is null');
      console.error('User ID:', user.id);
      redirect('/login');
    }

    const role = profile.role as string;
    const isAdmin = role === 'superAdmin' || role === 'admin';

    if (!isAdmin) {
      console.log(`User ${user.id} is not admin (role: ${role}), redirecting to home`);
      redirect('/');
    }

    return { user, profile };
  } catch (error: any) {
    console.error('Unexpected error in requireAdmin:', error);
    redirect('/login');
  }
}

