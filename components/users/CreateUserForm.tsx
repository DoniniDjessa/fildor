'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createUser } from '@/lib/actions/users.actions';
import type { UserRole } from '@/types/auth';
import RightSidebar from '../forms/RightSidebar';

const createUserSchema = z.object({
  email: z.string().email('Email invalide'),
  name: z.string().min(1, 'Le nom est requis'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  role: z.enum(['superAdmin', 'admin', 'manager', 'couturier', 'livreur']),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'superAdmin', label: 'Super Administrateur' },
  { value: 'admin', label: 'Administrateur' },
  { value: 'manager', label: 'Manager' },
  { value: 'couturier', label: 'Couturier' },
  { value: 'livreur', label: 'Livreur' },
];

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserForm({ isOpen, onClose, onSuccess }: CreateUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserFormData) => {
    setError(null);
    setLoading(true);

    try {
      // Ensure email format
      const email = data.email.includes('@') ? data.email : `${data.email}@tip.local`;
      
      await createUser({
        ...data,
        email,
      });
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    onClose();
  };

  return (
    <RightSidebar isOpen={isOpen} onClose={handleClose} title="Nouvel utilisateur">
      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <p className="text-[10px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email / Pseudo
          </label>
          <input
            type="text"
            {...register('email')}
            className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500"
          />
          {errors.email && (
            <p className="mt-1 text-[10px] text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nom complet
          </label>
          <input
            type="text"
            {...register('name')}
            className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500"
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
            className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500"
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
            className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500"
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

        <div>
          <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mot de passe
          </label>
          <input
            type="password"
            {...register('password')}
            className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500"
          />
          {errors.password && (
            <p className="mt-1 text-[10px] text-red-500">{errors.password.message}</p>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t border-rose-100 dark:border-purple-800">
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
            className="flex-1 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-rose-400 to-pink-600 hover:from-rose-500 hover:to-pink-700 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </RightSidebar>
  );
}

