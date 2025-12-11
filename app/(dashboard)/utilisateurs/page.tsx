import { requireAdmin } from '@/lib/auth/checkAccess';
import { getUsers } from '@/lib/actions/users.actions';
import UsersList from '@/components/users/UsersList';
import CreateUserButton from '@/components/users/CreateUserButton';

export default async function UtilisateursPage() {
  // requireAdmin() will redirect if user is not admin - don't catch that redirect
  await requireAdmin();
  
  // If we reach here, user is admin
  const users = await getUsers() || [];

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-[30px] shadow-lg p-6 border border-white/20 dark:border-white/10">
      <div className="mb-4 flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-1">
            Utilisateurs
          </h1>
          <p className="text-sm text-[#808191] dark:text-gray-400">
            Gérer les utilisateurs de l&apos;application
          </p>
        </div>
        <CreateUserButton />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <UsersList initialUsers={users} />
      </div>
    </div>
  );
}
