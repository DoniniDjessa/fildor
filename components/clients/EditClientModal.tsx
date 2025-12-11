'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { updateClient } from '@/lib/actions/clients.actions';

const updateClientSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  phone: z.string().min(1, 'Le téléphone est requis'),
  whatsapp: z.string().optional(),
  notes: z.string().optional(),
});

type UpdateClientFormData = z.infer<typeof updateClientSchema>;

interface Client {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  notes?: string;
}

interface EditClientModalProps {
  client: Client;
  onClose: () => void;
  onUpdate: (client: Client) => void;
}

export default function EditClientModal({ client, onClose, onUpdate }: EditClientModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateClientFormData>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      name: client.name,
      phone: client.phone,
      whatsapp: client.whatsapp || '',
      notes: client.notes || '',
    },
  });

  const onSubmit = async (data: UpdateClientFormData) => {
    setError(null);
    setLoading(true);

    try {
      const updatedClient = await updateClient(client.id, data);
      onUpdate(updatedClient as Client);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md p-4 border border-gray-200 dark:border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-title text-base font-bold text-gray-900 dark:text-gray-100">
            Modifier le client
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
              Nom complet *
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
              Téléphone *
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
              WhatsApp
            </label>
            <input
              type="tel"
              {...register('whatsapp')}
              className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500 resize-none"
            />
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

