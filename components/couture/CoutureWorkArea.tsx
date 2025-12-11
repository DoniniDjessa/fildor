'use client';

import { useState, useEffect } from 'react';
import { getOrdersByStatus, Order } from '@/lib/actions/orders.actions';
import { getCurrentUser } from '@/lib/auth/actions';
import OrderSelectionGrid from './OrderSelectionGrid';
import DeductionPanel from './DeductionPanel';
import type { UserRole } from '@/types/auth';

export default function CoutureWorkArea() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadOrders();
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      if (user?.id) {
        setCurrentUserId(user.id);
      }
      // Check if user is admin or superAdmin
      if (user?.role === 'admin' || user?.role === 'superAdmin') {
        setIsAdmin(true);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      // Load orders with status 'cutting' or 'sewing'
      const [cuttingOrders, sewingOrders] = await Promise.all([
        getOrdersByStatus('cutting'),
        getOrdersByStatus('sewing'),
      ]);
      setOrders([...cuttingOrders, ...sewingOrders]);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-1">
          Déclaration de Coupe
        </h1>
        <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
          Sélectionnez une commande et déclarez la consommation de matière
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedOrder ? (
          <DeductionPanel
            order={selectedOrder}
            currentUserId={currentUserId}
            isAdmin={isAdmin}
            onBack={() => setSelectedOrder(null)}
            onSuccess={() => {
              setSelectedOrder(null);
              loadOrders();
            }}
          />
        ) : (
          <OrderSelectionGrid
            orders={orders}
            loading={loading}
            onSelectOrder={setSelectedOrder}
          />
        )}
      </div>
    </div>
  );
}

