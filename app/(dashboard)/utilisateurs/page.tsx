import { requireAdmin } from '@/lib/auth/checkAccess';
import { getUsers, deleteUser } from '@/lib/actions/users.actions';
import UsersList from '@/components/users/UsersList';
import CreateUserButton from '@/components/users/CreateUserButton';

export default async function UtilisateursPage() {
  await requireAdmin();
  const users = await getUsers();

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-rose-100 dark:border-purple-800">
      <div className="mb-4 flex justify-between items-center flex-shrink-0">
        <div>
          <h1 className="font-title text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
            Utilisateurs
          </h1>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">
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
