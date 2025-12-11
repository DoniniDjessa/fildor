'use client';

import { MessageCircle, Ruler, Plus, MapPin, Crown } from 'lucide-react';
import { useState } from 'react';
import EditClientForm from './EditClientForm';
import ClientDetailsSidebar from './ClientDetailsSidebar';

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

interface ClientCardProps {
  client: Client;
  onUpdate: (client: Client) => void;
  ordersCount?: number;
  lastMeasureDate?: string;
}

export default function ClientCard({ client, onUpdate, ordersCount = 0, lastMeasureDate }: ClientCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  
  const getInitials = () => {
    const name = client.noms || client.surnom || '';
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const displayName = client.noms || client.surnom || 'Sans nom';
  const isVIP = ordersCount > 5;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open sidebar if clicking on buttons or interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    setIsDetailsOpen(true);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phone = client.whatsapp || client.phone;
    if (phone) {
      window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
    }
  };

  const handleViewMeasures = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDetailsOpen(true);
  };

  const handleNewOrder = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Navigate to create order page for this client
    console.log('Create order for client:', client.id);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="group bg-white dark:bg-[#1A1D29] p-4 rounded-[30px] shadow-sm hover:shadow-xl hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 transition-all duration-300 relative border border-transparent hover:border-indigo-50 dark:hover:border-indigo-900/30 cursor-pointer"
      >
        
        {/* 1. HEADER */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex gap-3 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center text-white font-title font-bold text-lg shadow-lg shadow-indigo-200 overflow-hidden">
                {client.photo_url ? (
                  <img src={client.photo_url} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  getInitials()
                )}
              </div>
              {isVIP && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Crown className="w-3 h-3 text-yellow-800" />
                </div>
              )}
            </div>
            
            {/* Infos */}
            <div className="flex-1 min-w-0">
              <h3 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 truncate">
                {displayName}
              </h3>
              {client.location && (
                <div className="flex items-center gap-1 text-[#808191] dark:text-gray-400 text-[10px] mt-0.5">
                  <MapPin size={10} />
                  <span className="truncate">{client.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Action */}
          {(client.whatsapp || client.phone) && (
            <button
              onClick={handleWhatsApp}
              className="w-9 h-9 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-500 hover:text-white dark:hover:bg-green-500 transition-colors flex-shrink-0 ml-2 z-10"
            >
              <MessageCircle size={16} />
            </button>
          )}
        </div>

        {/* 2. STATS */}
        <div className="flex gap-2 mb-4">
          <span className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-medium flex items-center gap-1">
            🛍️ {ordersCount} commande{ordersCount !== 1 ? 's' : ''}
          </span>
          {lastMeasureDate && (
            <span className="px-2.5 py-1 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[10px] font-medium flex items-center gap-1">
              📏 {lastMeasureDate}
            </span>
          )}
        </div>

        {/* 3. FOOTER ACTIONS */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleViewMeasures}
            className="py-2 rounded-2xl bg-[#6C5DD3]/10 dark:bg-[#6C5DD3]/20 text-[#6C5DD3] dark:text-[#8B7AE8] font-title font-semibold text-[11px] hover:bg-[#6C5DD3] hover:text-white dark:hover:bg-[#6C5DD3] transition-colors flex items-center justify-center gap-1.5"
          >
            <Ruler size={14} />
            Mesures
          </button>
          <button
            onClick={handleNewOrder}
            className="py-2 rounded-2xl bg-[#FF754C]/10 dark:bg-[#FF754C]/20 text-[#FF754C] dark:text-[#FF8C6C] font-title font-semibold text-[11px] hover:bg-[#FF754C] hover:text-white dark:hover:bg-[#FF754C] transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            Commande
          </button>
        </div>
      </div>

      {isEditing && (
        <EditClientForm
          client={client}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onUpdate={(updatedClient) => {
            onUpdate(updatedClient);
            setIsEditing(false);
          }}
        />
      )}

      <ClientDetailsSidebar
        client={client}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        onUpdate={onUpdate}
      />
    </>
  );
}

