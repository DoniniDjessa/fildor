'use client';

import { useState } from 'react';
import { Pencil, Trash2, User as UserIcon, Phone, MessageCircle } from 'lucide-react';
import { deleteClient } from '@/lib/actions/clients.actions';
import EditClientForm from './EditClientForm';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

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
  created_at: string;
  updated_at: string;
}

interface ClientsListProps {
  initialClients: Client[];
}

export default function ClientsList({ initialClients }: ClientsListProps) {
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);

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
    setEditingClient(null);
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <UserIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Aucun client trouvé
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2">
        {clients.map((client) => (
          <div
            key={client.id}
            className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {client.noms || client.surnom || 'Sans nom'}
                </h3>
                {client.surnom && client.noms && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
                    {client.surnom}
                  </p>
                )}
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <p className="text-[10px] text-gray-500 dark:text-gray-400">
                      {client.phone}
                    </p>
                  </div>
                  {client.whatsapp && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3 text-green-500" />
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        {client.whatsapp}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <button
                  onClick={() => setEditingClient(client)}
                  className="p-1.5 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeletingClient(client)}
                  className="p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {client.notes && (
              <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {client.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      <EditClientForm
        client={editingClient!}
        isOpen={!!editingClient}
        onClose={() => setEditingClient(null)}
        onUpdate={handleUpdate}
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

