'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateUser } from '@/lib/actions/users.actions';
import type { UserRole } from '@/types/auth';
import RightSidebar from '../forms/RightSidebar';

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

interface EditUserFormProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (user: User) => void;
}

export default function EditUserForm({ user, isOpen, onClose, onUpdate }: EditUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      role: user?.role || 'couturier',
    },
  });

  // Update form when user changes
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        role: user.role || 'couturier',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateUserFormData) => {
    if (!user) {
      setError('Utilisateur introuvable');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const updatedUser = await updateUser(user.id, data);
      onUpdate(updatedUser as User);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  if (!user) {
    return (
      <RightSidebar isOpen={isOpen} onClose={handleClose} title="Modifier l'utilisateur">
        <div className="p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Utilisateur introuvable
          </p>
        </div>
      </RightSidebar>
    );
  }

  return (
    <RightSidebar isOpen={isOpen} onClose={handleClose} title="Modifier l'utilisateur">
      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <p className="text-[10px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Nom complet
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
          />
          {errors.name && (
            <p className="mt-1 text-[10px] text-red-500">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Téléphone
          </label>
          <input
            type="tel"
            {...register('phone')}
            className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
          />
          {errors.phone && (
            <p className="mt-1 text-[10px] text-red-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Rôle
          </label>
          <select
            {...register('role')}
            className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
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

        <div className="flex gap-3 pt-6 border-t border-white/20 dark:border-white/10">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] hover:from-[#5A4BC2] hover:to-[#7A6AD8] rounded-[30px] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </RightSidebar>
  );
}

