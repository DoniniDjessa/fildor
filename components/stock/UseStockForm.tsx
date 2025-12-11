'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Scissors } from 'lucide-react';
import { useStockItem } from '@/lib/actions/stock-items.actions';

const useStockSchema = z.object({
  quantity: z.string().min(1, 'La quantité est requise').transform((val) => parseFloat(val)),
  motif: z.string().min(1, 'Le motif est requis'),
});

type UseStockFormValues = z.infer<typeof useStockSchema>;

interface UseStockFormProps {
  stockItem: {
    id: string;
    name: string;
    quantity: number;
    unit: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UseStockForm({ stockItem, isOpen, onClose, onSuccess }: UseStockFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UseStockFormValues>({
    resolver: zodResolver(useStockSchema),
  });

  const onSubmit = async (data: UseStockFormValues) => {
    if (data.quantity > stockItem.quantity) {
      setError(`La quantité disponible est de ${stockItem.quantity} ${stockItem.unit}`);
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await useStockItem(stockItem.id, {
        quantity: data.quantity,
        motif: data.motif,
      });

      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'utilisation du stock');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-white/20 dark:border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6C5DD3]/10 flex items-center justify-center">
                <Scissors className="w-5 h-5 text-[#6C5DD3]" />
              </div>
              <div>
                <h2 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100">
                  Utiliser du stock
                </h2>
                <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
                  {stockItem.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#808191] hover:text-[#11142D] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 rounded-[30px] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <p className="font-poppins text-[10px] text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Disponible */}
              <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                <p className="font-poppins text-[10px] text-gray-500 dark:text-gray-400 mb-1">
                  Quantité disponible
                </p>
                <p className="font-poppins text-lg font-bold text-[#11142D] dark:text-gray-100">
                  {stockItem.quantity} {stockItem.unit}
                </p>
              </div>

              {/* Quantité à utiliser */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Quantité à utiliser *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('quantity')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  placeholder="0"
                  max={stockItem.quantity}
                />
                {errors.quantity && (
                  <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.quantity.message}</p>
                )}
              </div>

              {/* Motif */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Motif *
                </label>
                <textarea
                  {...register('motif')}
                  rows={3}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 py-2 font-poppins resize-none"
                  placeholder="Ex: Utilisé pour la commande #123"
                />
                {errors.motif && (
                  <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.motif.message}</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-white/20 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-poppins"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-10 text-xs font-bold text-white bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] hover:from-[#5A4BC2] hover:to-[#7A6AD8] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-poppins"
              >
                {loading ? 'En cours...' : 'Utiliser'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

