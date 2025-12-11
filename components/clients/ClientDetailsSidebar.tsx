'use client';

import { Phone, MessageCircle, Edit, Archive, MapPin, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import EditClientForm from './EditClientForm';
import MeasurementGrid from './MeasurementGrid';
import OrderHistory from './OrderHistory';
import MeasurementForm from './MeasurementForm';
import { getMeasurementsByClient } from '@/lib/actions/measurements.actions';

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

interface ClientDetailsSidebarProps {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (client: Client) => void;
  measurements?: {
    Robe?: any;
    Pantalon?: any;
    Chemise?: any;
  } | null;
}

export default function ClientDetailsSidebar({
  client,
  isOpen,
  onClose,
  onUpdate,
  measurements: initialMeasurements,
}: ClientDetailsSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isMeasurementFormOpen, setIsMeasurementFormOpen] = useState(false);
  const [selectedMeasurementType, setSelectedMeasurementType] = useState<'Robe' | 'Pantalon' | 'Chemise'>('Robe');
  const [measurements, setMeasurements] = useState(initialMeasurements);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);

  useEffect(() => {
    if (isOpen && !initialMeasurements) {
      loadMeasurements();
    }
  }, [isOpen, client.id]);

  const loadMeasurements = async () => {
    setLoadingMeasurements(true);
    try {
      const allMeasurements = await getMeasurementsByClient(client.id);
      const measurementsByType = {
        Robe: allMeasurements.find((m) => m.measurement_type === 'Robe') || null,
        Pantalon: allMeasurements.find((m) => m.measurement_type === 'Pantalon') || null,
        Chemise: allMeasurements.find((m) => m.measurement_type === 'Chemise') || null,
      };
      setMeasurements(measurementsByType);
    } catch (error) {
      console.error('Error loading measurements:', error);
    } finally {
      setLoadingMeasurements(false);
    }
  };

  const handleMeasurementSuccess = () => {
    loadMeasurements();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const handleUpdate = (updatedClient: Client) => {
    if (onUpdate) {
      onUpdate(updatedClient);
    }
    setIsEditing(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:z-50"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed right-0 top-0 h-full w-full sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] max-w-5xl bg-white/95 dark:bg-[#1A1D29]/95 backdrop-blur-lg border-l border-white/20 dark:border-white/10 z-40 lg:z-50 transition-all duration-300 ease-in-out shadow-2xl ${
          isOpen
            ? 'translate-x-0 opacity-100'
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/20 dark:border-white/10">
            <h2 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100">
              Détails Client
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-[#808191] hover:text-[#11142D] dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 rounded-[30px] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-[28%_36%_36%] gap-3">
              {/* COLONNE 1 : Identité & Actions (30%) */}
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
                    disabled
                    className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 opacity-50 cursor-not-allowed flex flex-col items-center justify-center gap-1"
                    title="Fonctionnalité non disponible"
                  >
                    <Phone size={18} />
                    <span className="text-[9px] font-semibold">Appeler</span>
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    disabled
                    className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 opacity-50 cursor-not-allowed flex flex-col items-center justify-center gap-1"
                    title="Fonctionnalité non disponible"
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

              {/* COLONNE 2 : La Grille de Mesures (35%) */}
              <MeasurementGrid 
                clientId={client.id}
                measurements={measurements}
                onEditClick={() => setIsMeasurementFormOpen(true)}
              />

              {/* COLONNE 3 : Historique & Commandes (35%) */}
              <OrderHistory clientId={client.id} />
            </div>

            {/* Carte DÉPENSES ET HISTORIQUE COMPLET */}
            <div className="mt-4 col-span-1 lg:col-span-3">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-800 rounded-[30px] p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <h3 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100">
                        DÉPENSES ET HISTORIQUE COMPLET DU CLIENT
                      </h3>
                      <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400 mt-1">
                        Fonctionnalité premium - Non disponible
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl">
                    <span className="font-poppins text-xs font-bold">NON DISPONIBLE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Edit Modal */}
      {isEditing && (
        <EditClientForm
          client={client}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
          onUpdate={handleUpdate}
        />
      )}

      {/* Measurement Form */}
      {isMeasurementFormOpen && (
        <MeasurementForm
          clientId={client.id}
          measurementType={selectedMeasurementType}
          existingMeasurement={measurements?.[selectedMeasurementType] || null}
          isOpen={isMeasurementFormOpen}
          onClose={() => setIsMeasurementFormOpen(false)}
          onSuccess={() => {
            setIsMeasurementFormOpen(false);
            handleMeasurementSuccess();
          }}
        />
      )}
    </>
  );
}

