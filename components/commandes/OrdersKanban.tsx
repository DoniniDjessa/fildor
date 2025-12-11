'use client';

import { useState, useEffect } from 'react';
import OrderCard from './OrderCard';
import { getOrders, getOrdersByStatus, updateOrderStatus, OrderStatus, Order as OrderType } from '@/lib/actions/orders.actions';

const COLUMNS: { id: OrderStatus; label: string; emoji: string; color: string }[] = [
  { id: 'pending', label: 'En Attente', emoji: '⚪', color: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'cutting', label: 'Coupe', emoji: '🔵', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'sewing', label: 'Couture', emoji: '🟣', color: 'bg-purple-100 dark:bg-purple-900/30' },
  { id: 'fitting', label: 'Essayage', emoji: '🟠', color: 'bg-orange-100 dark:bg-orange-900/30' },
  { id: 'completed', label: 'Terminé', emoji: '🟢', color: 'bg-green-100 dark:bg-green-900/30' },
];

interface OrdersKanbanProps {
  showLateOnly?: boolean;
  searchQuery?: string;
  onOrdersLoaded?: (orders: OrderType[]) => void;
}

export default function OrdersKanban({ showLateOnly = false, searchQuery = '', onOrdersLoaded }: OrdersKanbanProps) {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedOrder, setDraggedOrder] = useState<OrderType | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    console.log('[OrdersKanban] loadOrders called');
    setLoading(true);
    try {
      console.log('[OrdersKanban] Fetching ALL orders...');
      
      // Get all orders at once
      const allOrders = await getOrders();
      
      console.log('[OrdersKanban] All orders fetched:', allOrders.length);
      console.log('[OrdersKanban] All orders:', allOrders);
      
      // Display orders list in console
      console.log('Commandes:', allOrders);
      
      setOrders(allOrders);
      if (onOrdersLoaded) {
        onOrdersLoaded(allOrders);
      }
      console.log('[OrdersKanban] Orders state updated with', allOrders.length, 'orders');
    } catch (error) {
      console.error('[OrdersKanban] Error loading orders:', error);
      console.error('[OrdersKanban] Error details:', JSON.stringify(error, null, 2));
    } finally {
      setLoading(false);
      console.log('[OrdersKanban] Loading set to false');
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
    let filtered = orders.filter((order) => order.status === status);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((order) => {
        const clientName = (order.client?.noms || order.client?.surnom || '').toLowerCase();
        const modelName = (order.model?.name || '').toLowerCase();
        return clientName.includes(query) || modelName.includes(query);
      });
    }
    
    // Apply late filter
    if (showLateOnly) {
      filtered = filtered.filter((order) => {
        const daysUntilDelivery = getDaysUntilDelivery(order.delivery_date);
        return daysUntilDelivery <= 3 && daysUntilDelivery >= 0 && 
               (order.status === 'pending' || order.status === 'cutting' || order.status === 'sewing');
      });
    }
    
    return filtered;
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

