'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Image as ImageIcon, User, Shirt, Baby } from 'lucide-react';
import RightSidebar from '../forms/RightSidebar';
import { createModel, updateModel, ModelFormData } from '@/lib/actions/models.actions';

const modelSchema = z.object({
  name: z.string().min(1, 'Le nom est requis'),
  category: z.enum(['Homme', 'Femme', 'Enfant']),
  base_price: z.string().min(1, 'Le prix est requis').transform((val) => parseFloat(val)),
  make_time: z.string().min(1, 'Le délai est requis').transform((val) => parseInt(val)),
  fabric_req: z.string().min(1, 'La quantité de tissu est requise'),
  difficulty: z.enum(['Facile', 'Moyen', 'Expert']).optional(),
});

type ModelFormValues = z.infer<typeof modelSchema>;

interface Model {
  id: string;
  name: string;
  category: string;
  base_price: number;
  fabric_req: string;
  make_time: number;
  difficulty?: string;
}

interface ModelFormProps {
  model?: Model | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModelForm({ model, isOpen, onClose, onSuccess }: ModelFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(model?.image || null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues: model
      ? {
          name: model.name,
          category: model.category as any,
          base_price: model.base_price.toString(),
          make_time: model.make_time.toString(),
          fabric_req: model.fabric_req,
          difficulty: (model.difficulty as any) || 'Moyen',
        }
      : undefined,
  });

  const selectedCategory = watch('category');

  const onSubmit = async (data: ModelFormValues) => {
    setError(null);
    setLoading(true);

    try {
      const formData: ModelFormData = {
        name: data.name,
        category: data.category,
        base_price: data.base_price,
        make_time: data.make_time,
        fabric_req: data.fabric_req,
        difficulty: data.difficulty || 'Moyen',
      };

      if (model) {
        await updateModel(model.id, formData);
      } else {
        await createModel(formData);
      }

      reset();
      setImagePreview(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <RightSidebar
      isOpen={isOpen}
      onClose={onClose}
      title={model ? 'Modifier le modèle' : 'Créer un modèle'}
    >
      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <p className="font-poppins text-[10px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* BLOC 1 : Identité Visuelle */}
        <div className="space-y-3">
          <h3 className="font-title text-xs font-semibold text-[#11142D] dark:text-gray-300 mb-2">
            Identité Visuelle
          </h3>

          {/* Upload Photo */}
          <div className="flex justify-center">
            <label className="relative cursor-not-allowed opacity-50">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled
              />
              <div className="w-32 h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="font-poppins text-[10px] text-gray-400">Glisser une photo</p>
                    <p className="font-poppins text-[9px] text-gray-500 mt-1">(Désactivé temporairement)</p>
                  </div>
                )}
              </div>
            </label>
          </div>

          {/* Nom du Modèle */}
          <div>
            <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
              Nom du Modèle *
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
              placeholder="Ex: Boubou 3 pièces Brodée"
            />
            {errors.name && (
              <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Catégorie */}
          <div>
            <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
              Catégorie *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Homme', 'Femme', 'Enfant'] as const).map((cat) => {
                const isSelected = selectedCategory === cat;
                const icons = { Homme: User, Femme: Shirt, Enfant: Baby };
                const Icon = icons[cat];
                const colors = {
                  Homme: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-500 dark:border-blue-400', text: 'text-blue-600 dark:text-blue-400' },
                  Femme: { bg: 'bg-pink-50 dark:bg-pink-900/20', border: 'border-pink-500 dark:border-pink-400', text: 'text-pink-600 dark:text-pink-400' },
                  Enfant: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-500 dark:border-yellow-400', text: 'text-yellow-600 dark:text-yellow-400' },
                };
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setValue('category', cat)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `${colors[cat].bg} ${colors[cat].border}`
                        : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mx-auto mb-2 ${
                      isSelected ? colors[cat].text : 'text-gray-400'
                    }`} />
                    <span className={`font-poppins text-[10px] font-semibold ${
                      isSelected ? colors[cat].text : 'text-gray-500'
                    }`}>
                      {cat}
                    </span>
                  </button>
                );
              })}
            </div>
            <select {...register('category')} className="hidden">
              <option value="Homme">Homme</option>
              <option value="Femme">Femme</option>
              <option value="Enfant">Enfant</option>
            </select>
            {errors.category && (
              <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.category.message}</p>
            )}
          </div>
        </div>

        {/* BLOC 2 : Données Techniques */}
        <div className="space-y-3">
          <h3 className="font-title text-xs font-semibold text-[#11142D] dark:text-gray-300 mb-2">
            Données Techniques
          </h3>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                Temps (jours) *
              </label>
              <input
                type="number"
                {...register('make_time')}
                className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                placeholder="3"
              />
              {errors.make_time && (
                <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.make_time.message}</p>
              )}
            </div>
            <div>
              <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                Prix base (FCFA) *
              </label>
              <input
                type="number"
                {...register('base_price')}
                className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                placeholder="35000"
              />
              {errors.base_price && (
                <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.base_price.message}</p>
              )}
            </div>
          </div>

          {/* Difficulté */}
          <div>
            <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
              Difficulté
            </label>
            <div className="flex gap-2">
              {(['Facile', 'Moyen', 'Expert'] as const).map((diff) => {
                const isSelected = watch('difficulty') === diff;
                return (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setValue('difficulty', diff)}
                    className={`flex-1 py-2 rounded-xl text-[10px] font-semibold transition-colors font-poppins ${
                      isSelected
                        ? diff === 'Facile'
                          ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : diff === 'Moyen'
                          ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'bg-slate-50 dark:bg-slate-800 text-gray-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {diff === 'Facile' && '🟢 '}
                    {diff === 'Moyen' && '🟡 '}
                    {diff === 'Expert' && '🔴 '}
                    {diff}
                  </button>
                );
              })}
            </div>
            <input type="hidden" {...register('difficulty')} />
          </div>
        </div>

        {/* BLOC 3 : Consommation Matière */}
        <div className="space-y-3">
          <h3 className="font-title text-xs font-semibold text-[#11142D] dark:text-gray-300 mb-2">
            Consommation Matière
          </h3>

          <div>
            <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
              Tissu requis *
            </label>
            <input
              type="text"
              {...register('fabric_req')}
              className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
              placeholder="Ex: 6 yards, 3 pagnes"
            />
            {errors.fabric_req && (
              <p className="mt-1 font-poppins text-[10px] text-red-500">{errors.fabric_req.message}</p>
            )}
          </div>
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
            {loading ? 'Sauvegarde...' : model ? 'Modifier' : 'Créer'}
          </button>
        </div>
      </form>
    </RightSidebar>
  );
}

