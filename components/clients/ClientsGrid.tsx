'use client';

import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import ClientCard from './ClientCard';
import CreateClientForm from './CreateClientForm';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import { deleteClient } from '@/lib/actions/clients.actions';

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

interface ClientsGridProps {
  initialClients: Client[];
}

export default function ClientsGrid({ initialClients }: ClientsGridProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    const name = (client.noms || client.surnom || '').toLowerCase();
    const phone = client.phone?.toLowerCase() || '';
    const whatsapp = client.whatsapp?.toLowerCase() || '';
    const location = client.location?.toLowerCase() || '';
    
    return name.includes(query) || 
           phone.includes(query) || 
           whatsapp.includes(query) || 
           location.includes(query);
  });

  const handleDelete = async () => {
    if (!deletingClient) return;

    setLoading(true);
    try {
      await deleteClient(deletingClient.id);
      setClients(clients.filter((c) => c.id !== deletingClient.id));
      setDeletingClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (updatedClient: Client) => {
    setClients(clients.map((c) => (c.id === updatedClient.id ? updatedClient : c)));
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
    window.location.reload();
  };

  // TODO: Get orders count and last measure date from database
  // For now, using placeholder values
  const getOrdersCount = (clientId: string) => 0;
  const getLastMeasureDate = (clientId: string) => undefined;

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="font-title text-sm text-gray-500 dark:text-gray-400 mb-4">
          Aucun client trouvé
        </p>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#FF754C] to-[#FF8C6C] text-white font-title font-semibold rounded-[30px] shadow-lg hover:shadow-xl transition-all"
        >
          Ajouter votre premier client
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header Flottant */}
      <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] shadow-lg p-4 mb-6 border border-white/20 dark:border-white/10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Titre avec compteur */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100">
                Mes Clients ({clients.length})
              </h1>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#808191]" />
              <input
                type="text"
                placeholder="Rechercher un client, un numéro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all"
              />
            </div>
          </div>

          {/* Bouton FAB */}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#FF754C] to-[#FF8C6C] text-white font-title font-semibold rounded-[30px] shadow-lg hover:shadow-xl transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <span className="text-lg">+</span>
            <span>Nouveau Client</span>
          </button>
        </div>
      </div>

      {/* Grille des Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onUpdate={handleUpdate}
            ordersCount={getOrdersCount(client.id)}
            lastMeasureDate={getLastMeasureDate(client.id)}
          />
        ))}
      </div>

      {filteredClients.length === 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="font-title text-sm text-[#808191] dark:text-gray-400">
            Aucun résultat pour &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      <CreateClientForm
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {deletingClient && (
        <DeleteConfirmModal
          title="Supprimer le client"
          message={`Êtes-vous sûr de vouloir supprimer ${deletingClient.noms || deletingClient.surnom || 'ce client'} ?`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingClient(null)}
          loading={loading}
        />
      )}
    </>
  );
}

