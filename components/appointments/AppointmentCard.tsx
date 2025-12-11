'use client';

import { CheckCircle, MapPin } from 'lucide-react';
import { Appointment } from '@/lib/actions/appointments.actions';

interface AppointmentCardProps {
  appointment: Appointment;
  onToggleComplete: () => void;
}

const typeLabels: Record<string, string> = {
  fitting: 'Essayage',
  delivery: 'Livraison',
  measure: 'Mesures',
  discussion: 'Discussion',
  other: 'Autre',
};

export default function AppointmentCard({ appointment, onToggleComplete }: AppointmentCardProps) {
  const borderColors: Record<string, string> = {
    fitting: 'border-l-[#6C5DD3]',
    delivery: 'border-l-[#25D366]',
    measure: 'border-l-blue-400',
    discussion: 'border-l-purple-400',
    other: 'border-l-gray-400',
  };

  const isCompleted = appointment.status === 'completed';
  const time = appointment.scheduled_time || '00:00';

  return (
    <div
      className={`bg-white dark:bg-[#1A1D29] rounded-2xl p-4 mb-3 border-l-[6px] shadow-sm flex items-center gap-4 transition-all ${
        isCompleted ? 'opacity-60' : ''
      } ${borderColors[appointment.type] || 'border-l-gray-400'}`}
    >
      {/* HEURE */}
      <div className="flex flex-col items-center min-w-[50px]">
        <span className="text-xl font-bold text-slate-700 dark:text-slate-300 font-mono">
          {time.substring(0, 5)}
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-medium">
          {typeLabels[appointment.type] || appointment.type}
        </span>
      </div>

      {/* DÉTAILS */}
      <div className="flex-1 border-l border-slate-100 dark:border-slate-800 pl-4">
        <h4 className="text-sm font-bold text-[#11142D] dark:text-gray-100 mb-1">
          {appointment.client_name}
        </h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 italic mb-1">
          {appointment.order_desc || 'Commande'}
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
          isCompleted
            ? 'text-green-500 hover:text-green-600'
            : 'text-slate-300 dark:text-slate-600 hover:text-green-500'
        }`}
      >
        <CheckCircle size={28} className={isCompleted ? 'fill-current' : ''} />
      </button>
    </div>
  );
}

