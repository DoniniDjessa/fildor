'use client';

import { CheckCircle, MapPin } from 'lucide-react';

interface Appointment {
  id: string;
  type: 'fitting' | 'delivery' | 'measure';
  time: string;
  client_name: string;
  outfit_desc: string;
  location?: string;
  completed: boolean;
}

interface AppointmentCardProps {
  appointment: Appointment;
  onToggleComplete: () => void;
}

export default function AppointmentCard({ appointment, onToggleComplete }: AppointmentCardProps) {
  const borderColors = {
    fitting: 'border-l-[#6C5DD3]',
    delivery: 'border-l-[#25D366]',
    measure: 'border-l-blue-400',
  };

  const labels = {
    fitting: 'Essayage',
    delivery: 'Livraison',
    measure: 'Mesures',
  };

  return (
    <div
      className={`bg-white dark:bg-[#1A1D29] rounded-2xl p-4 mb-3 border-l-[6px] shadow-sm flex items-center gap-4 transition-all ${
        appointment.completed ? 'opacity-60' : ''
      } ${borderColors[appointment.type]}`}
    >
      {/* HEURE */}
      <div className="flex flex-col items-center min-w-[50px]">
        <span className="text-xl font-bold text-slate-700 dark:text-slate-300 font-mono">
          {appointment.time}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">
          {labels[appointment.type]}
        </span>
      </div>

      {/* DÉTAILS */}
      <div className="flex-1 border-l border-slate-100 dark:border-slate-800 pl-4">
        <h4 className="text-sm font-bold text-[#11142D] dark:text-gray-100 mb-1">
          {appointment.client_name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-1">
          {appointment.outfit_desc}
        </p>

        {/* Localisation (si livraison) */}
        {appointment.location && (
          <div className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-gray-500">
            <MapPin size={10} /> {appointment.location}
          </div>
        )}
      </div>

      {/* ACTION */}
      <button
        onClick={onToggleComplete}
        className={`transition-colors ${
          appointment.completed
            ? 'text-green-500 hover:text-green-600'
            : 'text-slate-300 dark:text-slate-600 hover:text-green-500'
        }`}
      >
        <CheckCircle size={28} className={appointment.completed ? 'fill-current' : ''} />
      </button>
    </div>
  );
}

