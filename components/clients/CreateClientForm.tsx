'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, User, Shirt, Baby, MessageCircle, Phone } from 'lucide-react';
import { createClient, updateClient } from '@/lib/actions/clients.actions';
import { uploadClientPhoto } from '@/lib/actions/storage.actions';
import RightSidebar from '../forms/RightSidebar';

const createClientSchema = z.object({
  noms: z.string().optional(),
  surnom: z.string().optional(),
  email: z.string().email('Email invalide').optional().or(z.literal('')),
  phone: z.string().min(1, 'Le téléphone est requis'),
  whatsapp: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type CreateClientFormData = z.infer<typeof createClientSchema> & {
  gender?: 'homme' | 'femme' | 'enfant';
  isVIP?: boolean;
};

interface CreateClientFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateClientForm({ isOpen, onClose, onSuccess }: CreateClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<CreateClientFormData>({
    resolver: zodResolver(createClientSchema),
  });

  const selectedGender = watch('gender');
  const isVIP = watch('isVIP');
  const phone = watch('phone');

  const onSubmit = async (data: CreateClientFormData) => {
    setError(null);
    setLoading(true);

    try {
      // Remove fields not in database schema (gender, isVIP)
      const { gender, isVIP, ...clientData } = data;
      
      // Upload photo first if provided (we need a temp ID)
      let photoUrl: string | undefined;
      if (photoFile) {
        try {
          // Generate a temporary UUID for the file name
          const tempId = crypto.randomUUID();
          const formData = new FormData();
          formData.append('file', photoFile);
          formData.append('clientId', tempId);
          photoUrl = await uploadClientPhoto(formData);
        } catch (photoError: any) {
          console.error('Photo upload failed:', photoError);
          // Continue without photo if upload fails
        }
      }

      // Create client with photo URL if available
      const newClient = await createClient({
        ...clientData,
        email: clientData.email || undefined,
        photo_url: photoUrl,
      });

          // If we used a temp ID, rename the file
      if (photoFile && photoUrl) {
        try {
          // Delete old file and upload with correct ID
          const { deleteImage, extractStoragePath } = await import('@/lib/storage/images');
          const oldPath = await extractStoragePath(photoUrl);
          if (oldPath) {
            await deleteImage(oldPath);
          }
          const formData = new FormData();
          formData.append('file', photoFile);
          formData.append('clientId', newClient.id);
          photoUrl = await uploadClientPhoto(formData);
          await updateClient(newClient.id, { photo_url: photoUrl });
        } catch (error) {
          console.error('Failed to rename photo:', error);
        }
      }

      reset();
      setPhotoPreview(null);
      setPhotoFile(null);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue('phone', value);
    // Auto-détecter WhatsApp si le numéro commence par + ou contient des chiffres
    if (value && !watch('whatsapp')) {
      setValue('whatsapp', value);
    }
  };

  const handleClose = () => {
    reset();
    setError(null);
    setPhotoPreview(null);
    setPhotoFile(null);
    onClose();
  };

  return (
    <RightSidebar isOpen={isOpen} onClose={handleClose} title="Nouveau client">
      {error && (
        <div className="mb-3 p-2 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
          <p className="text-[10px] text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Groupe 1 : Qui ? */}
        <div className="space-y-3">
          <h3 className="font-title text-xs font-semibold text-[#11142D] dark:text-gray-300 mb-2">
            Qui ?
          </h3>
          
          {/* Photo Upload */}
          <div className="flex justify-center mb-3">
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center text-white shadow-lg relative overflow-hidden">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8" />
                )}
                <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </label>
          </div>

          {/* Prénom | Nom côte à côte */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                Prénom
              </label>
              <input
                type="text"
                {...register('noms')}
                className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3"
                placeholder="Prénom"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                Nom
              </label>
              <input
                type="text"
                {...register('surnom')}
                className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3"
                placeholder="Nom"
              />
            </div>
          </div>

          {/* Téléphone avec icône WhatsApp */}
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
              Téléphone (WhatsApp) *
            </label>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              <input
                type="tel"
                {...register('phone')}
                onChange={handlePhoneChange}
                className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all pl-10 pr-3"
                placeholder="+225 XX XX XX XX XX"
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-[10px] text-red-500">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Groupe 2 : Genre (Sélecteur Visuel) */}
        <div className="space-y-3">
          <h3 className="font-title text-xs font-semibold text-[#11142D] dark:text-gray-300 mb-2">
            Genre
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setValue('gender', 'homme')}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedGender === 'homme'
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <User className={`w-6 h-6 mx-auto mb-2 ${
                selectedGender === 'homme' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
              }`} />
              <span className={`text-[10px] font-semibold ${
                selectedGender === 'homme' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'
              }`}>
                Homme
              </span>
            </button>
            <button
              type="button"
              onClick={() => setValue('gender', 'femme')}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedGender === 'femme'
                  ? 'bg-pink-50 dark:bg-pink-900/20 border-pink-500 dark:border-pink-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <Shirt className={`w-6 h-6 mx-auto mb-2 ${
                selectedGender === 'femme' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-400'
              }`} />
              <span className={`text-[10px] font-semibold ${
                selectedGender === 'femme' ? 'text-pink-600 dark:text-pink-400' : 'text-gray-500'
              }`}>
                Femme
              </span>
            </button>
            <button
              type="button"
              onClick={() => setValue('gender', 'enfant')}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedGender === 'enfant'
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 dark:border-yellow-400'
                  : 'bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
              }`}
            >
              <Baby className={`w-6 h-6 mx-auto mb-2 ${
                selectedGender === 'enfant' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400'
              }`} />
              <span className={`text-[10px] font-semibold ${
                selectedGender === 'enfant' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500'
              }`}>
                Enfant
              </span>
            </button>
          </div>
        </div>

        {/* Groupe 3 : Localisation */}
        <div className="space-y-3">
          <h3 className="font-title text-xs font-semibold text-[#11142D] dark:text-gray-300 mb-2">
            Localisation
          </h3>
          
          <div>
            <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
              Quartier / Ville
            </label>
            <input
              type="text"
              {...register('location')}
              className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3"
              placeholder="Ex: Cocody, Angré"
            />
          </div>

          {/* Switch VIP */}
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-xs font-semibold text-[#11142D] dark:text-gray-300">
              Client VIP ?
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...register('isVIP')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#6C5DD3] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6C5DD3]"></div>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
            Note Perso
          </label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full text-xs bg-yellow-50 dark:bg-yellow-900/10 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 py-2 resize-none"
            placeholder="Ex: Aime les robes cintrées"
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-white/20 dark:border-white/10">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 h-10 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 h-10 text-xs font-bold text-white bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] hover:from-[#5A4BC2] hover:to-[#7A6AD8] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? 'Création...' : 'Créer'}
          </button>
        </div>
      </form>
    </RightSidebar>
  );
}

