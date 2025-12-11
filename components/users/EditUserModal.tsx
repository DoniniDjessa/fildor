'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { updateUser } from '@/lib/actions/users.actions';
import type { UserRole } from '@/types/auth';

const updateUserSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  role: z.enum(['superAdmin', 'admin', 'manager', 'couturier', 'livreur']),
});

type UpdateUserFormData = z.infer<typeof updateUserSchema>;

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'superAdmin', label: 'Super Administrateur' },
  { value: 'admin', label: 'Administrateur' },
  { value: 'manager', label: 'Manager' },
  { value: 'couturier', label: 'Couturier' },
  { value: 'livreur', label: 'Livreur' },
];

interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
}

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

export default function EditUserModal({ user, onClose, onUpdate }: EditUserModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      role: user.role,
    },
  });

  const onSubmit = async (data: UpdateUserFormData) => {
    setError(null);
    setLoading(true);

    try {
      const updatedUser = await updateUser(user.id, data);
      onUpdate(updatedUser as User);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-4 border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-title text-base font-bold text-gray-900 dark:text-gray-100">
            Modifier l&apos;utilisateur
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p className="text-[10px] text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nom complet
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            />
            {errors.name && (
              <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
              Téléphone
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            />
            {errors.phone && (
              <p className="mt-1 text-[10px] text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rôle
            </label>
            <select
              {...register('role')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            >
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="mt-1 text-[10px] text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

