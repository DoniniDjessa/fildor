'use client';

import { Calendar, MapPin, User } from 'lucide-react';

interface Appointment {
  id: string;
  clientName: string;
  time: string;
  type: string;
  avatar?: string;
}

interface RecentClient {
  id: string;
  clientName: string;
}

interface RightPanelProps {
  appointments: Appointment[];
  recentClients: RecentClient[];
}

export default function RightPanel({ appointments, recentClients }: RightPanelProps) {
  return (
    <div className="w-full max-w-[300px] space-y-4">
      {/* Essayages & Rendez-vous */}
      <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-[#6C5DD3]" />
          <h3 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-[11px]">
            Essayages & Rendez-vous
          </h3>
        </div>

        <div className="space-y-2">
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-[15px] hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center text-white text-[10px] font-semibold flex-shrink-0">
                {appointment.clientName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-title text-[#11142D] dark:text-gray-100 font-medium text-[10px] truncate">
                  {appointment.clientName}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-poppins text-[#808191] dark:text-gray-400 text-[10px]">
                    {appointment.time}
                  </span>
                  <span className="font-poppins text-[#808191] dark:text-gray-400 text-[10px]">•</span>
                  <span className="font-poppins text-[#808191] dark:text-gray-400 text-[10px] truncate">
                    {appointment.type}
                  </span>
                </div>
              </div>
            </div>
          ))
          ) : (
            <p className="font-poppins text-[#808191] dark:text-gray-400 text-[10px] text-center py-2">
              Aucun essayage prévu
            </p>
          )}
        </div>
      </div>

      {/* Clients Récents */}
      <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-[#6C5DD3]" />
          <h3 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-[11px]">
            Clients Récents
          </h3>
        </div>

        <div className="space-y-1.5">
          {recentClients.length > 0 ? (
            recentClients.map((client) => (
              <div
                key={client.id}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-[12px] transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center text-white text-[9px] font-semibold flex-shrink-0">
                  {client.clientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <p className="font-title text-[#11142D] dark:text-gray-100 text-[10px] truncate">
                  {client.clientName}
                </p>
              </div>
            ))
          ) : (
            <p className="font-poppins text-[#808191] dark:text-gray-400 text-[10px] text-center py-2">
              Aucun client récent
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

