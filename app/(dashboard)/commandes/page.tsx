import CommandesPageContent from '@/components/commandes/CommandesPageContent';
import { getCurrentUser } from '@/lib/auth/actions';

export default async function CommandesPage() {
  const currentUser = await getCurrentUser();
  
  // Check role more explicitly
  const role = currentUser?.profile?.role as string | undefined;
  const isAdmin = !!role && (role === 'superAdmin' || role === 'admin');

  return <CommandesPageContent isAdmin={isAdmin} />;
}
