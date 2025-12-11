'use client';

import { useState } from 'react';
import { Ruler, Plus } from 'lucide-react';

interface MeasurementGridProps {
  clientId: string;
  measurements?: {
    Robe?: any;
    Pantalon?: any;
    Chemise?: any;
  } | null;
  onEditClick?: () => void;
}

const MEASURE_TYPES = ['Robe', 'Pantalon', 'Chemise'] as const;

type MeasurementType = typeof MEASURE_TYPES[number];

interface Measurement {
  id?: string;
  measurement_type: MeasurementType;
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
  created_at?: string;
}

const MEASURE_FIELDS = {
  Robe: [
    { key: 'epaule', label: 'Épaule' },
    { key: 'poitrine', label: 'Poitrine' },
    { key: 'taille', label: 'Taille' },
    { key: 'bassin', label: 'Bassin' },
    { key: 'bras', label: 'Bras' },
    { key: 'longueur', label: 'Longueur' },
  ],
  Pantalon: [
    { key: 'taille', label: 'Taille' },
    { key: 'tour_hanches', label: 'Tour de hanches' },
    { key: 'longueur_jambe', label: 'Longueur jambe' },
    { key: 'tour_cuisse', label: 'Tour de cuisse' },
  ],
  Chemise: [
    { key: 'epaule', label: 'Épaule' },
    { key: 'poitrine', label: 'Poitrine' },
    { key: 'taille', label: 'Taille' },
    { key: 'manche', label: 'Manche' },
  ],
};

export default function MeasurementGrid({ clientId, measurements, onEditClick }: MeasurementGridProps) {
  const [selectedType, setSelectedType] = useState<MeasurementType>('Robe');
  
  const measurement = measurements?.[selectedType] || null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });
  };

  const getMeasureValue = (key: string): number | undefined => {
    return measurement?.[key as keyof Measurement] as number | undefined;
  };

  const fields = MEASURE_FIELDS[selectedType] || [];

  return (
    <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100">
          Mensurations
        </h3>
        <div className="flex items-center gap-2">
          {measurement?.created_at && (
            <span className="text-[10px] text-[#808191] dark:text-gray-400">
              {formatDate(measurement.created_at)}
            </span>
          )}
          <button
            onClick={onEditClick}
            className="text-[10px] text-[#6C5DD3] bg-[#6C5DD3]/10 px-2 py-1 rounded-lg font-semibold hover:bg-[#6C5DD3] hover:text-white transition-colors flex items-center gap-1"
          >
            {measurement ? (
              <>
                <Ruler size={12} />
                Modifier
              </>
            ) : (
              <>
                <Plus size={12} />
                Créer
              </>
            )}
          </button>
        </div>
      </div>

      {/* Switch : Onglets */}
      <div className="flex gap-2 mb-4">
        {MEASURE_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-semibold transition-colors ${
              selectedType === type
                ? 'bg-[#6C5DD3] text-white'
                : 'bg-slate-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* La Grille */}
      {measurement ? (
        <div className="grid grid-cols-3 gap-2 flex-1">
          {fields.map((field) => {
            const value = getMeasureValue(field.key);
            return (
              <div
                key={field.key}
                className="bg-[#F7F7F9] dark:bg-slate-800 rounded-xl p-2 flex flex-col items-center justify-center border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-colors"
              >
                <span className="text-[9px] text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-0.5">
                  {field.label}
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="text-lg font-black text-[#11142D] dark:text-gray-100">
                    {value || '-'}
                  </span>
                  {value && <span className="text-[9px] text-gray-400 dark:text-gray-500">cm</span>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <p className="text-[10px] text-gray-400 text-center">
            Aucune mesure enregistrée pour {selectedType}
          </p>
          <button
            onClick={onEditClick}
            className="px-4 py-2 bg-[#6C5DD3] text-white rounded-xl text-xs font-semibold hover:bg-[#5A4BC2] transition-colors flex items-center gap-2"
          >
            <Plus size={14} />
            Créer une mesure
          </button>
        </div>
      )}
    </div>
  );
}

