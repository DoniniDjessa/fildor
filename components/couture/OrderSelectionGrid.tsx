'use client';

import { Order } from '@/lib/actions/orders.actions';

interface OrderSelectionGridProps {
  orders: Order[];
  loading: boolean;
  onSelectOrder: (order: Order) => void;
}

export default function OrderSelectionGrid({ orders, loading, onSelectOrder }: OrderSelectionGridProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
          Aucune commande en cours de coupe ou couture
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => {
        const clientName = order.client
          ? order.client.noms || order.client.surnom || 'Sans nom'
          : 'Client inconnu';
        const modelName = order.model?.name || 'Modèle inconnu';

        return (
          <div
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className="bg-white dark:bg-[#1A1D29] rounded-[20px] p-4 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-md hover:border-[#6C5DD3] transition-all"
          >
            {/* Image */}
            <div className="w-full h-32 rounded-xl bg-slate-100 dark:bg-slate-800 mb-3 overflow-hidden">
              {order.fabric_image_url ? (
                <img
                  src={order.fabric_image_url}
                  alt="Tissu"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">{modelName[0]}</span>
                </div>
              )}
            </div>

            {/* Client Name */}
            <h4 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-1">
              {clientName}
            </h4>

            {/* Model Name */}
            <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400 mb-2">
              {modelName}
            </p>

            {/* Badge */}
            {order.fabric_meters && (
              <div className="inline-flex items-center px-2 py-1 bg-[#6C5DD3]/10 dark:bg-[#6C5DD3]/20 rounded-lg">
                <span className="font-poppins text-[10px] font-semibold text-[#6C5DD3]">
                  Prévu : {order.fabric_meters}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

