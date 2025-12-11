'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getOrdersByClient, Order } from '@/lib/actions/orders.actions';

interface OrderHistoryProps {
  clientId: string;
}

const statusLabels: Record<string, string> = {
  pending: 'En attente',
  cutting: 'Coupe',
  sewing: 'Couture',
  fitting: 'Essayage',
  completed: 'Livré',
};

export default function OrderHistory({ clientId }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [clientId]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const clientOrders = await getOrdersByClient(clientId);
      setOrders(clientOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10 h-full flex flex-col">
      {/* Titre */}
      <h3 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-4">
        Historique ({orders.length})
      </h3>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-[10px] text-[#808191] dark:text-gray-400">Chargement...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-[10px] text-[#808191] dark:text-gray-400">Aucune commande</p>
          </div>
        ) : (
          orders.map((order) => {
            const modelName = order.model?.name || 'Modèle inconnu';
            const orderDate = order.created_at ? format(new Date(order.created_at), 'd MMM') : 'Date inconnue';
            const statusLabel = statusLabels[order.status] || order.status;
            const isCompleted = order.status === 'completed';

            return (
              <div
                key={order.id}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {/* Image miniature */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 overflow-hidden">
                  {order.fabric_image_url ? (
                    <img src={order.fabric_image_url} alt={modelName} className="w-full h-full object-cover rounded-full" />
                  ) : order.model?.image_url ? (
                    <img src={order.model.image_url} alt={modelName} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-xs">📦</span>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-title text-xs font-bold text-[#11142D] dark:text-gray-100 truncate">
                    {modelName}
                  </h4>
                  <p className="text-[10px] text-[#808191] dark:text-gray-400">
                    {orderDate} • {order.total_price.toLocaleString('fr-FR')} F
                  </p>
                </div>

                {/* Badge Statut */}
                <span
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                  }`}
                >
                  {statusLabel}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

