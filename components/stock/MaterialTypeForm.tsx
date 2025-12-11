'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Package } from 'lucide-react';
import { createMaterialType, updateMaterialType, MaterialTypeFormData } from '@/lib/actions/material-types.actions';

const materialTypeSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  unit: z.enum(['mètres', 'yards', 'rouleaux', 'pièces', 'bobines', 'm']),
  category: z.enum(['Tissu', 'Doublure', 'Mercerie', 'Pagne']),
  default_threshold: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  average_price_per_unit: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

type MaterialTypeFormValues = z.infer<typeof materialTypeSchema>;

interface MaterialType {
  id: string;
  name: string;
  unit: string;
  category: string;
  default_threshold?: number;
  average_price_per_unit?: number;
}

interface MaterialTypeFormProps {
  materialType?: MaterialType | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MaterialTypeForm({ materialType, isOpen, onClose, onSuccess }: MaterialTypeFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MaterialTypeFormValues>({
    resolver: zodResolver(materialTypeSchema),
    defaultValues: materialType ? {
      name: materialType.name,
      unit: materialType.unit as any,
      category: materialType.category as any,
      default_threshold: materialType.default_threshold?.toString() || '',
      average_price_per_unit: materialType.average_price_per_unit?.toString() || '',
    } : undefined,
  });

  const onSubmit = async (data: MaterialTypeFormValues) => {
    setError(null);
    setLoading(true);

    try {
      const formData: MaterialTypeFormData = {
        name: data.name,
        unit: data.unit,
        category: data.category,
        default_threshold: data.default_threshold,
        average_price_per_unit: data.average_price_per_unit,
      };

      if (materialType) {
        await updateMaterialType(materialType.id, formData);
      } else {
        await createMaterialType(formData);
      }

      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
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
        <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col border border-white/20 dark:border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6C5DD3]/10 flex items-center justify-center">
                <Package className="w-5 h-5 text-[#6C5DD3]" />
              </div>
              <div>
                <h2 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100">
                  {materialType ? 'Modifier' : 'Créer'} une matière
                </h2>
                <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
                  Ajouter à la Matièrethèque
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
              {/* Nom */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Nom de la matière *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  placeholder="Ex: Bazin Riche, Soie Sauvage"
                />
                {errors.name && (
                  <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Unité */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Unité de mesure *
                </label>
                <select
                  {...register('unit')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                >
                  <option value="mètres">Mètres (m)</option>
                  <option value="yards">Yards (y)</option>
                  <option value="rouleaux">Rouleaux</option>
                  <option value="pièces">Pièces</option>
                  <option value="bobines">Bobines</option>
                  <option value="m">m</option>
                </select>
                {errors.unit && (
                  <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.unit.message}</p>
                )}
              </div>

              {/* Catégorie */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Catégorie *
                </label>
                <select
                  {...register('category')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                >
                  <option value="Tissu">Tissu</option>
                  <option value="Doublure">Doublure</option>
                  <option value="Mercerie">Mercerie</option>
                  <option value="Pagne">Pagne</option>
                </select>
                {errors.category && (
                  <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.category.message}</p>
                )}
              </div>

              {/* Seuil d'alerte */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Seuil d&apos;alerte (optionnel)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('default_threshold')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  placeholder="Ex: 2"
                />
                <p className="mt-1 font-poppins text-[9px] text-gray-400 dark:text-gray-500">
                  Me prévenir si moins de cette quantité
                </p>
              </div>

              {/* Prix moyen */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Prix moyen par unité (optionnel)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('average_price_per_unit')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  placeholder="Ex: 5000"
                />
                <p className="mt-1 font-poppins text-[9px] text-gray-400 dark:text-gray-500">
                  Pour calculer la valeur du stock
                </p>
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
                {loading ? 'Sauvegarde...' : materialType ? 'Modifier' : 'Sauvegarder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

