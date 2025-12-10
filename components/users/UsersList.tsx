'use client';

import { useState, useEffect } from 'react';
import { Pencil, Trash2, User as UserIcon } from 'lucide-react';
import { deleteUser } from '@/lib/actions/users.actions';
import EditUserForm from './EditUserForm';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import type { UserRole } from '@/types/auth';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

interface UsersListProps {
  initialUsers: User[];
}

export default function UsersList({ initialUsers }: UsersListProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingUser) return;

    setLoading(true);
    try {
      await deleteUser(deletingUser.id);
      setUsers(users.filter((u) => u.id !== deletingUser.id));
      setDeletingUser(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setEditingUser(null);
  };

  const getRoleLabel = (role: UserRole) => {
    const labels: Record<UserRole, string> = {
      superAdmin: 'Super Admin',
      admin: 'Admin',
      manager: 'Manager',
      couturier: 'Couturier',
      livreur: 'Livreur',
    };
    return labels[role];
  };

  if (users.length === 0) {
    return (
      <div className="text-center py-8">
        <UserIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Aucun utilisateur trouvé
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.name}
                </h3>
                <span className="text-[10px] px-2 py-0.5 bg-rose-100 dark:bg-purple-900/30 text-rose-600 dark:text-purple-400 rounded-full">
                  {getRoleLabel(user.role)}
                </span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {user.phone}
              </p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => setEditingUser(user)}
                className="p-1.5 text-rose-500 hover:bg-rose-100 dark:hover:bg-purple-900/30 rounded transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeletingUser(user)}
                className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <EditUserForm
        user={editingUser!}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        onUpdate={handleUpdate}
      />

      {deletingUser && (
        <DeleteConfirmModal
          title="Supprimer l'utilisateur"
          message={`Êtes-vous sûr de vouloir supprimer ${deletingUser.name} ?`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingUser(null)}
          loading={loading}
        />
      )}
    </>
  );
}

