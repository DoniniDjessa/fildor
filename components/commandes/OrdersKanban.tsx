'use client';

import { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import { getOrdersByStatus, updateOrderStatus, OrderStatus, Order as OrderType } from '@/lib/actions/orders.actions';

const COLUMNS: { id: OrderStatus; label: string; emoji: string; color: string }[] = [
  { id: 'pending', label: 'En Attente', emoji: '⚪', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'cutting', label: 'Coupe', emoji: '🔵', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'sewing', label: 'Couture', emoji: '🟣', color: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'fitting', label: 'Essayage', emoji: '🟠', color: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'completed', label: 'Terminé', emoji: '🟢', color: 'bg-green-100 dark:bg-green-900/30' },
];

export default function OrdersKanban() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedOrder, setDraggedOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Load orders for each status
      const [pending, cutting, sewing, fitting, completed] = await Promise.all([
        getOrdersByStatus('pending'),
        getOrdersByStatus('cutting'),
        getOrdersByStatus('sewing'),
        getOrdersByStatus('fitting'),
        getOrdersByStatus('completed'), // This will automatically filter to last 4 days
      ]);

      // Debug: Log loaded orders
      console.log('Loaded orders:', {
        pending: pending.length,
        cutting: cutting.length,
        sewing: sewing.length,
        fitting: fitting.length,
        completed: completed.length,
        total: pending.length + cutting.length + sewing.length + fitting.length + completed.length,
      });

      // Combine all orders
      const allOrders = [...pending, ...cutting, ...sewing, ...fitting, ...completed];
      console.log('All orders combined:', allOrders);
      setOrders(allOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (order: OrderType) => {
    setDraggedOrder(order);
  };

  const handleDragOver = (e: React.DragEvent, status: OrderStatus) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: OrderStatus) => {
    e.preventDefault();
    if (draggedOrder && draggedOrder.status !== targetStatus) {
      try {
        // Update in database
        await updateOrderStatus(draggedOrder.id, targetStatus);
        // Update local state
        setOrders((prev) =>
          prev.map((order) =>
            order.id === draggedOrder.id ? { ...order, status: targetStatus } : order
          )
        );
        // Reload to ensure we have the latest data (especially for completed filter)
        await loadOrders();
      } catch (error) {
        console.error('Error updating order status:', error);
        alert('Erreur lors de la mise à jour du statut');
      }
    }
    setDraggedOrder(null);
  };

  const getOrdersByStatus = (status: OrderStatus) => {
    return orders.filter((order) => order.status === status);
  };

  const getDaysUntilDelivery = (dateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const delivery = new Date(dateString);
    delivery.setHours(0, 0, 0, 0);
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-4 h-full min-w-max pb-4">
        {COLUMNS.map((column) => {
          const columnOrders = getOrdersByStatus(column.id);

          return (
            <div
              key={column.id}
              className="flex flex-col w-72 flex-shrink-0"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`${column.color} rounded-[20px] p-3 mb-3 sticky top-0 z-10`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{column.emoji}</span>
                  <h3 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100">
                    {column.label}
                  </h3>
                  <span className="font-poppins text-xs font-semibold text-[#808191] dark:text-gray-400 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full">
                    {columnOrders.length}
                  </span>
                </div>
              </div>

              {/* Column Content */}
              <div className="flex-1 overflow-y-auto space-y-3">
                {columnOrders.length === 0 ? (
                  <div className="text-center py-8 text-[#808191] dark:text-gray-500">
                    <p className="font-poppins text-xs">Aucune commande</p>
                  </div>
                ) : (
                  columnOrders.map((order) => {
                    const clientName = order.client
                      ? order.client.noms || order.client.surnom || 'Sans nom'
                      : 'Client inconnu';
                    const modelName = order.model?.name || 'Modèle inconnu';
                    const remaining = order.total_price - (order.advance || 0);

                    // Debug: Log image URLs
                    if (order.fabric_image_url || order.client_reference_image_url) {
                      console.log('Order images:', {
                        orderId: order.id,
                        fabricImage: order.fabric_image_url,
                        clientReferenceImage: order.client_reference_image_url,
                      });
                    }

                    return (
                      <OrderCard
                        key={order.id}
                        order={{
                          id: order.id,
                          clientName,
                          clientId: order.client_id,
                          modelName,
                          modelId: order.model_id,
                          fabricImage: order.fabric_image_url || undefined,
                          clientReferenceImage: order.client_reference_image_url || undefined,
                          deliveryDate: order.delivery_date,
                          status: order.status,
                          totalPrice: order.total_price,
                          advance: order.advance || 0,
                          remaining,
                        }}
                        daysUntilDelivery={getDaysUntilDelivery(order.delivery_date)}
                        onDragStart={() => handleDragStart(order)}
                      />
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

