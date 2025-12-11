'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateClient } from '@/lib/actions/clients.actions';
import RightSidebar from '../forms/RightSidebar';

const updateClientSchema = z.object({
  noms: z.string().optional(),
  surnom: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().min(1, 'Le téléphone est requis'),
  whatsapp: z.string().optional(),
  height: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  weight: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  location: z.string().optional(),
  dob_day: z.string().optional(),
  dob_month: z.string().optional(),
  notes: z.string().optional(),
}).refine((data) => {
  // Si dob_day ou dob_month est rempli, les deux sont requis
  const hasDay = data.dob_day && data.dob_day !== '';
  const hasMonth = data.dob_month && data.dob_month !== '';
  if (hasDay || hasMonth) {
    return hasDay && hasMonth;
  }
  return true;
}, {
  message: 'Le jour et le mois sont requis si la date de naissance est renseignée',
  path: ['dob_month'],
});

type UpdateClientFormData = z.infer<typeof updateClientSchema>;

interface Client {
  id: string;
  noms?: string;
  surnom?: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  height?: number;
  weight?: number;
  location?: string;
  dob_day?: number;
  dob_month?: number;
  notes?: string;
}

interface EditClientFormProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (client: Client) => void;
}

export default function EditClientForm({ client, isOpen, onClose, onUpdate }: EditClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<UpdateClientFormData>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: {
      noms: client.noms || '',
      surnom: client.surnom || '',
      email: client.email || '',
      phone: client.phone || '',
      whatsapp: client.whatsapp || '',
      height: client.height?.toString() || '',
      weight: client.weight?.toString() || '',
      location: client.location || '',
      dob_day: client.dob_day?.toString() || '',
      dob_month: client.dob_month?.toString() || '',
      notes: client.notes || '',
    },
  });

  const dobDay = watch('dob_day');
  const dobMonth = watch('dob_month');

  const onSubmit = async (data: UpdateClientFormData) => {
    setError(null);
    setLoading(true);

    try {
      const updatedClient = await updateClient(client.id, {
        ...data,
        dob_day: data.dob_day ? parseInt(data.dob_day) : undefined,
        dob_month: data.dob_month ? parseInt(data.dob_month) : undefined,
        email: data.email || undefined,
      });
      onUpdate(updatedClient as Client);
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

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '1', label: 'Janvier' },
    { value: '2', label: 'Février' },
    { value: '3', label: 'Mars' },
    { value: '4', label: 'Avril' },
    { value: '5', label: 'Mai' },
    { value: '6', label: 'Juin' },
    { value: '7', label: 'Juillet' },
    { value: '8', label: 'Août' },
    { value: '9', label: 'Septembre' },
    { value: '10', label: 'Octobre' },
    { value: '11', label: 'Novembre' },
    { value: '12', label: 'Décembre' },
  ];

  return (
    <RightSidebar isOpen={isOpen} onClose={handleClose} title="Modifier le client">
      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <p className="text-[10px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Noms
          </label>
          <input
            type="text"
            {...register('noms')}
            className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Surnom
          </label>
          <input
            type="text"
            {...register('surnom')}
            className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
          />
          <p className="mt-1 text-[10px] text-gray-400 dark:text-gray-500">
            Si le client ne veut pas donner son nom
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
          />
          {errors.email && (
            <p className="mt-1 text-[10px] text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Téléphone *
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
            WhatsApp
          </label>
          <input
            type="tel"
            {...register('whatsapp')}
            className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
              Taille (cm)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('height')}
              className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
              Poids (kg)
            </label>
            <input
              type="number"
              step="0.1"
              {...register('weight')}
              className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Localisation
          </label>
          <input
            type="text"
            {...register('location')}
            className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Date de naissance (Jour / Mois)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select
              {...register('dob_day')}
              className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
            >
              <option value="">Jour</option>
              {days.map((day) => (
                <option key={day} value={day.toString()}>
                  {day}
                </option>
              ))}
            </select>
            <select
              {...register('dob_month')}
              className="w-full px-4 py-3 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
            >
              <option value="">Mois</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          {(errors.dob_day || errors.dob_month) && (
            <p className="mt-1 text-[10px] text-red-500">
              {errors.dob_day?.message || errors.dob_month?.message}
            </p>
          )}
          {(dobDay || dobMonth) && (!dobDay || !dobMonth) && (
            <p className="mt-1 text-[10px] text-amber-500">
              Le jour et le mois sont requis
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#11142D] dark:text-gray-300 mb-2">
            Notes
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full px-3 py-2 text-xs rounded-lg border border-rose-200 dark:border-purple-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-rose-400 dark:focus:ring-pink-500 resize-none"
          />
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

