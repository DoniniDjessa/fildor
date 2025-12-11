'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Image as ImageIcon } from 'lucide-react';
import { createStockItem, updateStockItem, StockItemFormData } from '@/lib/actions/stock-items.actions';
import { uploadStockItemPhoto } from '@/lib/actions/stock-storage.actions';
import RightSidebar from '../forms/RightSidebar';

const stockItemSchema = z.object({
  material_type_id: z.string().min(1, 'Le type de matière est requis'),
  name: z.string().min(1, 'Le nom est requis'),
  color: z.string().optional(),
  quantity: z.string().min(1, 'La quantité est requise').transform((val) => parseFloat(val)),
  threshold: z.string().min(1, 'Le seuil est requis').transform((val) => parseFloat(val)),
  max_capacity: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

type StockItemFormValues = z.infer<typeof stockItemSchema>;

interface StockItem {
  id: string;
  material_type_id: string;
  name: string;
  color?: string;
  quantity: number;
  threshold: number;
  max_capacity?: number;
  material_type?: {
    id: string;
    name: string;
    category: string;
  };
}

interface StockItemFormProps {
  stockItem?: StockItem | null;
  category: 'Tissu' | 'Mercerie';
  materialTypes: any[];
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StockItemForm({ stockItem, category, materialTypes, isOpen, onClose, onSuccess }: StockItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(stockItem?.image_url || null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<StockItemFormValues>({
    resolver: zodResolver(stockItemSchema),
    defaultValues: stockItem ? {
      material_type_id: stockItem.material_type_id,
      name: stockItem.name,
      color: stockItem.color || '',
      quantity: stockItem.quantity.toString(),
      threshold: stockItem.threshold.toString(),
      max_capacity: stockItem.max_capacity?.toString() || '',
    } : undefined,
  });

  const filteredMaterialTypes = materialTypes.filter((t: any) => t.category === category);

  useEffect(() => {
    if (stockItem) {
      reset({
        material_type_id: stockItem.material_type_id,
        name: stockItem.name,
        color: stockItem.color || '',
        quantity: stockItem.quantity.toString(),
        threshold: stockItem.threshold.toString(),
        max_capacity: stockItem.max_capacity?.toString() || '',
      });
    } else {
      reset({
        material_type_id: '',
        name: '',
        color: '',
        quantity: '',
        threshold: '',
        max_capacity: '',
      });
    }
  }, [stockItem, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: StockItemFormValues) => {
    setError(null);
    setLoading(true);

    try {
      let imageUrl: string | undefined;

      // Upload image if provided (for existing items)
      if (imageFile && stockItem) {
        try {
          const formData = new FormData();
          formData.append('file', imageFile);
          formData.append('stockItemId', stockItem.id);
          imageUrl = await uploadStockItemPhoto(formData);
        } catch (photoError: any) {
          console.error('Photo upload failed:', photoError);
          // Continue without photo if upload fails
        }
      } else if (stockItem?.image_url && !imageFile) {
        // Keep existing image if no new one is uploaded
        imageUrl = stockItem.image_url;
      }

      const formData: StockItemFormData = {
        material_type_id: data.material_type_id,
        name: data.name,
        color: data.color || undefined,
        image_url: imageUrl,
        quantity: data.quantity,
        threshold: data.threshold,
        max_capacity: data.max_capacity,
      };

      if (stockItem) {
        await updateStockItem(stockItem.id, formData);
      } else {
        const newItem = await createStockItem(formData);
        
        // Upload image after creating the item if it's new
        if (imageFile && newItem) {
          try {
            const uploadFormData = new FormData();
            uploadFormData.append('file', imageFile);
            uploadFormData.append('stockItemId', newItem.id);
            const uploadedImageUrl = await uploadStockItemPhoto(uploadFormData);
            await updateStockItem(newItem.id, { image_url: uploadedImageUrl });
          } catch (photoError: any) {
            console.error('Photo upload failed:', photoError);
            // Continue without photo if upload fails
          }
        }
      }

      reset();
      setImagePreview(null);
      setImageFile(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RightSidebar
      isOpen={isOpen}
      onClose={onClose}
      title={stockItem ? 'Modifier un item de stock' : 'Ajouter un item de stock'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <p className="font-poppins text-[10px] text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
              {/* Photo */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Photo (optionnel)
                </label>
                <div className="flex justify-center">
                  <label className="relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center hover:border-[#6C5DD3] transition-colors">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                          <p className="font-poppins text-[9px] text-gray-400">Ajouter photo</p>
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {/* Type de matière */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Type de matière *
                </label>
                <select
                  {...register('material_type_id')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  disabled={!!stockItem}
                >
                  <option value="">Sélectionner un type</option>
                  {filteredMaterialTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.unit})
                    </option>
                  ))}
                </select>
                {errors.material_type_id && (
                  <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.material_type_id.message}</p>
                )}
              </div>

              {/* Nom */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Nom de l&apos;item *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  placeholder="Ex: Bazin Getzner - Bleu Nuit"
                />
                {errors.name && (
                  <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Couleur */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Couleur (optionnel)
                </label>
                <input
                  type="text"
                  {...register('color')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  placeholder="Ex: Bleu Nuit"
                />
              </div>

              {/* Quantité */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Quantité *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('quantity')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  placeholder="0"
                />
                {errors.quantity && (
                  <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.quantity.message}</p>
                )}
              </div>

              {/* Seuil */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Seuil d&apos;alerte *
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('threshold')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  placeholder="0"
                />
                {errors.threshold && (
                  <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.threshold.message}</p>
                )}
              </div>

              {/* Capacité max */}
              <div>
                <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                  Capacité maximale (optionnel)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('max_capacity')}
                  className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                  placeholder="0"
                />
              </div>

        <div className="flex gap-3 pt-4 border-t border-white/20 dark:border-white/10">
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
            {loading ? 'Sauvegarde...' : stockItem ? 'Modifier' : 'Ajouter'}
          </button>
        </div>
      </form>
    </RightSidebar>
  );
}

