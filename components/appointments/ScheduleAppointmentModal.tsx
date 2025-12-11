'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Appointment } from '@/lib/actions/appointments.actions';

interface ScheduleAppointmentModalProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (date: string, time: string) => void;
}

export default function ScheduleAppointmentModal({
  appointment,
  isOpen,
  onClose,
  onSchedule,
}: ScheduleAppointmentModalProps) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date && time) {
      onSchedule(date, time);
      setDate('');
      setTime('');
      onClose();
    }
  };

  // Set default date to today and time to next hour
  const today = new Date().toISOString().split('T')[0];
  const nextHour = new Date();
  nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
  const defaultTime = nextHour.toTimeString().substring(0, 5);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white dark:bg-[#1A1D29] rounded-[30px] shadow-2xl border border-white/20 dark:border-white/10 w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
            <h2 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100">
              Planifier le rendez-vous
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[#808191] hover:text-[#11142D] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 rounded-[30px] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <p className="font-poppins text-sm text-[#11142D] dark:text-gray-100 mb-2">
                <span className="font-semibold">{appointment.client_name}</span> - {appointment.order_desc || 'Commande'}
              </p>
            </div>

            <div>
              <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                Date *
              </label>
              <input
                type="date"
                value={date || today}
                onChange={(e) => setDate(e.target.value)}
                min={today}
                className="w-full h-10 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                required
              />
            </div>

            <div>
              <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
                Heure *
              </label>
              <input
                type="time"
                value={time || defaultTime}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-10 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 text-xs font-medium text-white bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] rounded-xl hover:shadow-lg transition-all"
              >
                Planifier
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

