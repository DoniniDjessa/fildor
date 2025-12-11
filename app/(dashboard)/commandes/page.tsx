import CommandesPageContent from '@/components/commandes/CommandesPageContent';
import { getCurrentUser } from '@/lib/auth/actions';
import { checkCurrentUserRole, checkUserRoles } from '@/lib/actions/debug.actions';

export default async function CommandesPage() {
  // Debug: Check all user roles in the table
  await checkUserRoles();
  
  // Debug: Check current user's role
  const currentUserDebug = await checkCurrentUserRole();
  
  const currentUser = await getCurrentUser();
  
  // Debug logs
  console.log('CommandesPage - currentUser:', JSON.stringify(currentUser, null, 2));
  console.log('CommandesPage - profile:', JSON.stringify(currentUser?.profile, null, 2));
  console.log('CommandesPage - role:', currentUser?.profile?.role);
  console.log('CommandesPage - role type:', typeof currentUser?.profile?.role);
  console.log('CommandesPage - profile keys:', currentUser?.profile ? Object.keys(currentUser.profile) : 'no profile');
  
  // Check role more explicitly
  const role = currentUser?.profile?.role as string | undefined;
  const isAdmin = !!role && (role === 'superAdmin' || role === 'admin');
  
  console.log('CommandesPage - isAdmin:', isAdmin, 'role:', role);
  console.log('CommandesPage - Debug check result:', currentUserDebug);

  return <CommandesPageContent isAdmin={isAdmin} />;
}
