'use client';

import { Phone, MessageCircle, Edit, Archive, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import EditClientForm from './EditClientForm';
import MeasurementGrid from './MeasurementGrid';
import OrderHistory from './OrderHistory';

interface Client {
  id: string;
  noms?: string;
  surnom?: string;
  email?: string;
  phone: string;
  whatsapp?: string;
  height?: number;
  weight?: number;
  location?: string;
  dob_day?: number;
  dob_month?: number;
  notes?: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

interface ClientDetailsViewProps {
  client: Client;
}

export default function ClientDetailsView({ client }: ClientDetailsViewProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const displayName = client.noms || client.surnom || 'Sans nom';
  const getInitials = () => {
    const name = client.noms || client.surnom || '';
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleCall = () => {
    window.location.href = `tel:${client.phone}`;
  };

  const handleWhatsApp = () => {
    const phone = client.whatsapp || client.phone;
    if (phone) {
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[25%_40%_35%] gap-4 h-full">
      {/* COLONNE 1 : Identité & Actions (25%) */}
      <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full border-4 border-[#6C5DD3] overflow-hidden bg-gradient-to-tr from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center text-white font-title font-bold text-2xl shadow-lg">
            {client.photo_url ? (
              <img src={client.photo_url} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              getInitials()
            )}
          </div>
        </div>

        {/* Infos */}
        <div className="text-center mb-4">
          <h2 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-1">
            {displayName}
          </h2>
          {client.location && (
            <div className="flex items-center justify-center gap-1 text-[#808191] dark:text-gray-400 text-[10px] mb-1">
              <MapPin size={10} />
              <span>{client.location}</span>
            </div>
          )}
          <p className="text-[10px] text-[#808191] dark:text-gray-400">{client.phone}</p>
        </div>

        {/* Actions Rapides (Grille 2x2) */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={handleCall}
            className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex flex-col items-center justify-center gap-1"
          >
            <Phone size={18} />
            <span className="text-[9px] font-semibold">Appeler</span>
          </button>
          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors flex flex-col items-center justify-center gap-1"
          >
            <MessageCircle size={18} />
            <span className="text-[9px] font-semibold">WhatsApp</span>
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors flex flex-col items-center justify-center gap-1"
          >
            <Edit size={18} />
            <span className="text-[9px] font-semibold">Modifier</span>
          </button>
          <button
            onClick={() => {
              // TODO: Implement archive functionality
              console.log('Archive client:', client.id);
            }}
            className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex flex-col items-center justify-center gap-1"
          >
            <Archive size={18} />
            <span className="text-[9px] font-semibold">Archiver</span>
          </button>
        </div>

        {/* Note Perso */}
        {client.notes && (
          <div className="bg-yellow-50 dark:bg-yellow-900/10 rounded-xl p-3">
            <p className="text-[10px] text-gray-700 dark:text-gray-300">{client.notes}</p>
          </div>
        )}
      </div>

      {/* COLONNE 2 : La Grille de Mesures (40%) */}
      <MeasurementGrid clientId={client.id} />

      {/* COLONNE 3 : Historique & Commandes (35%) */}
      <OrderHistory clientId={client.id} />

      {/* Edit Modal */}
      {isEditing && (
        <EditClientForm
          client={client}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onUpdate={() => {
            setIsEditing(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

