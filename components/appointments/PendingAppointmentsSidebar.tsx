'use client';

import { MessageCircle, GripVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Appointment } from '@/lib/actions/appointments.actions';
import { getClientById } from '@/lib/actions/clients.actions';

interface PendingAppointmentsSidebarProps {
  items: Appointment[];
  onSchedule: (appointment: Appointment) => void;
  onWhatsApp?: (appointment: Appointment) => void;
}

const typeLabels: Record<string, string> = {
  fitting: 'Essayage',
  delivery: 'Livraison',
  measure: 'Mesures',
  discussion: 'Discussion',
  other: 'Autre',
};

export default function PendingAppointmentsSidebar({
  items,
  onSchedule,
  onWhatsApp,
}: PendingAppointmentsSidebarProps) {
  const getTimeAgo = (createdAt: string) => {
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    } catch {
      return 'Récemment';
    }
  };

  const handleWhatsApp = async (appointment: Appointment) => {
    try {
      // Get client phone number
      const client = await getClientById(appointment.client_id);
      const phone = client?.whatsapp || client?.phone;
      
      if (phone) {
        const message = encodeURIComponent(
          appointment.type === 'fitting'
            ? `Bonjour ${appointment.client_name}, votre ${appointment.order_desc || 'commande'} est prête pour essayage ! Quand pouvez-vous passer ?`
            : `Bonjour ${appointment.client_name}, votre ${appointment.order_desc || 'commande'} est prête pour livraison ! Quand pouvez-vous passer ?`
        );
        window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank');
      } else {
        alert('Numéro de téléphone non disponible pour ce client');
      }
    } catch (error) {
      console.error('Error getting client info:', error);
      alert('Erreur lors de la récupération des informations du client');
    }
  };

  return (
    <div className="w-80 bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 h-full flex flex-col">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
          À Planifier
          <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {items.length}
          </span>
        </h3>
        <p className="text-[10px] text-slate-500 dark:text-slate-400">
          Glissez pour planifier
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="text-center text-xs text-slate-400 dark:text-slate-500 mt-10">
              Aucun RDV en attente.<br />Bon travail ! 🧵
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('appointment-id', item.id);
                  e.dataTransfer.setData('appointment-type', item.type);
                }}
                className="bg-white dark:bg-[#1A1D29] p-3 rounded-xl shadow-sm border-2 border-dashed border-[#6C5DD3] dark:border-[#8B7AE8] cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group relative"
              >
                {/* Poignée de Drag */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical size={14} />
                </div>

                <div className="pl-6">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-[#6C5DD3] dark:text-[#8B7AE8] uppercase bg-[#6C5DD3]/10 dark:bg-[#6C5DD3]/20 px-1.5 py-0.5 rounded">
                      {typeLabels[item.type] || item.type}
                    </span>
                    <button
                      onClick={() => handleWhatsApp(item)}
                      className="text-green-500 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-full p-1 transition-colors"
                      title="Contacter via WhatsApp"
                    >
                      <MessageCircle size={14} />
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {item.client_name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">
                    {item.order_desc || 'Commande'}
                  </p>
                  
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">
                    Prêt depuis {getTimeAgo(item.created_at)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

