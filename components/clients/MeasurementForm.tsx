'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Ruler } from 'lucide-react';
import { createMeasurement, updateMeasurement, MeasurementFormData } from '@/lib/actions/measurements.actions';

const measurementSchema = z.object({
  client_id: z.string(),
  measurement_type: z.enum(['Robe', 'Pantalon', 'Chemise']),
  // Robe
  epaule: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  poitrine: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  taille: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  bassin: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  bras: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  longueur: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  // Pantalon
  tour_hanches: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  longueur_jambe: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  tour_cuisse: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  // Chemise
  manche: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  notes: z.string().optional(),
});

type MeasurementFormValues = z.infer<typeof measurementSchema>;

interface Measurement {
  id: string;
  client_id: string;
  measurement_type: 'Robe' | 'Pantalon' | 'Chemise';
  epaule?: number;
  poitrine?: number;
  taille?: number;
  bassin?: number;
  bras?: number;
  longueur?: number;
  tour_hanches?: number;
  longueur_jambe?: number;
  tour_cuisse?: number;
  manche?: number;
  notes?: string;
}

interface MeasurementFormProps {
  clientId: string;
  measurementType: 'Robe' | 'Pantalon' | 'Chemise';
  existingMeasurement?: Measurement | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const MEASURE_FIELDS = {
  Robe: [
    { key: 'epaule', label: 'Épaule (cm)' },
    { key: 'poitrine', label: 'Poitrine (cm)' },
    { key: 'taille', label: 'Taille (cm)' },
    { key: 'bassin', label: 'Bassin (cm)' },
    { key: 'bras', label: 'Bras (cm)' },
    { key: 'longueur', label: 'Longueur (cm)' },
  ],
  Pantalon: [
    { key: 'taille', label: 'Taille (cm)' },
    { key: 'tour_hanches', label: 'Tour de hanches (cm)' },
    { key: 'longueur_jambe', label: 'Longueur jambe (cm)' },
    { key: 'tour_cuisse', label: 'Tour de cuisse (cm)' },
  ],
  Chemise: [
    { key: 'epaule', label: 'Épaule (cm)' },
    { key: 'poitrine', label: 'Poitrine (cm)' },
    { key: 'taille', label: 'Taille (cm)' },
    { key: 'manche', label: 'Manche (cm)' },
  ],
};

export default function MeasurementForm({
  clientId,
  measurementType,
  existingMeasurement,
  isOpen,
  onClose,
  onSuccess,
}: MeasurementFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MeasurementFormValues>({
    resolver: zodResolver(measurementSchema),
    defaultValues: {
      client_id: clientId,
      measurement_type: measurementType,
      ...(existingMeasurement && {
        epaule: existingMeasurement.epaule?.toString() || '',
        poitrine: existingMeasurement.poitrine?.toString() || '',
        taille: existingMeasurement.taille?.toString() || '',
        bassin: existingMeasurement.bassin?.toString() || '',
        bras: existingMeasurement.bras?.toString() || '',
        longueur: existingMeasurement.longueur?.toString() || '',
        tour_hanches: existingMeasurement.tour_hanches?.toString() || '',
        longueur_jambe: existingMeasurement.longueur_jambe?.toString() || '',
        tour_cuisse: existingMeasurement.tour_cuisse?.toString() || '',
        manche: existingMeasurement.manche?.toString() || '',
        notes: existingMeasurement.notes || '',
      }),
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        client_id: clientId,
        measurement_type: measurementType,
        ...(existingMeasurement && {
          epaule: existingMeasurement.epaule?.toString() || '',
          poitrine: existingMeasurement.poitrine?.toString() || '',
          taille: existingMeasurement.taille?.toString() || '',
          bassin: existingMeasurement.bassin?.toString() || '',
          bras: existingMeasurement.bras?.toString() || '',
          longueur: existingMeasurement.longueur?.toString() || '',
          tour_hanches: existingMeasurement.tour_hanches?.toString() || '',
          longueur_jambe: existingMeasurement.longueur_jambe?.toString() || '',
          tour_cuisse: existingMeasurement.tour_cuisse?.toString() || '',
          manche: existingMeasurement.manche?.toString() || '',
          notes: existingMeasurement.notes || '',
        }),
      });
    }
  }, [isOpen, clientId, measurementType, existingMeasurement, reset]);

  const onSubmit = async (data: MeasurementFormValues) => {
    setError(null);
    setLoading(true);

    try {
      const formData: MeasurementFormData = {
        client_id: data.client_id,
        measurement_type: data.measurement_type,
        epaule: data.epaule,
        poitrine: data.poitrine,
        taille: data.taille,
        bassin: data.bassin,
        bras: data.bras,
        longueur: data.longueur,
        tour_hanches: data.tour_hanches,
        longueur_jambe: data.longueur_jambe,
        tour_cuisse: data.tour_cuisse,
        manche: data.manche,
        notes: data.notes,
      };

      if (existingMeasurement) {
        await updateMeasurement(existingMeasurement.id, formData);
      } else {
        await createMeasurement(formData);
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

  const fields = MEASURE_FIELDS[measurementType] || [];

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
        <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20 dark:border-white/10">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6C5DD3]/10 flex items-center justify-center">
                <Ruler className="w-5 h-5 text-[#6C5DD3]" />
              </div>
              <div>
                <h2 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100">
                  {existingMeasurement ? 'Modifier' : 'Créer'} une mesure - {measurementType}
                </h2>
                <p className="text-[10px] text-[#808191] dark:text-gray-400">
                  Saisissez les mesures en centimètres
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
                <p className="text-[10px] text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register(field.key as any)}
                    className="w-full h-9 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3"
                    placeholder="0.0"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                Notes (optionnel)
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 py-2 resize-none"
                placeholder="Ex: Client a pris du poids, ajuster la taille..."
              />
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-white/20 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 h-10 text-xs font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 h-10 text-xs font-bold text-white bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] hover:from-[#5A4BC2] hover:to-[#7A6AD8] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? 'Sauvegarde...' : existingMeasurement ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

