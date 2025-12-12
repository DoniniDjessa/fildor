'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Ruler, Plus, Shirt, Scissors } from 'lucide-react';
import HeroCard from './HeroCard';
import QuickActionCard from './QuickActionCard';
import StatusCard from './StatusCard';
import RightPanel from './RightPanel';
import DashboardStatsCards from './DashboardStatsCards';
import { Order } from '@/lib/actions/orders.actions';
import { DashboardStats } from '@/lib/actions/dashboard.actions';
import { format } from 'date-fns';

interface Client {
  id: string;
  noms?: string;
  surnom?: string;
  created_at: string;
  updated_at: string;
}

interface DashboardPageClientProps {
  initialOrders: Order[];
  initialStats: DashboardStats;
  initialClients: Client[];
}

export default function DashboardPageClient({
  initialOrders,
  initialStats,
  initialClients,
}: DashboardPageClientProps) {
  const router = useRouter();

  const handleNewMeasure = () => {
    router.push('/mesures');
  };

  const handleNewOrder = () => {
    router.push('/commandes');
  };

  // Get active orders (not completed)
  const activeOrders = initialOrders.filter(
    (order) => order.status !== 'completed'
  ).slice(0, 3);

  // Extract fittings/appointments from orders (status='fitting' with delivery_date)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day
  
  const fittings = initialOrders
    .filter((order) => {
      if (order.status !== 'fitting' || !order.delivery_date || !order.client) {
        return false;
      }
      // Only show upcoming fittings (today or future)
      const deliveryDate = new Date(order.delivery_date);
      deliveryDate.setHours(0, 0, 0, 0);
      return deliveryDate >= today;
    })
    .map((order) => {
      const clientName = order.client?.noms || order.client?.surnom || 'Client inconnu';
      const deliveryDate = new Date(order.delivery_date);
      const modelName = order.model?.name || 'Modèle';
      
      return {
        id: order.id,
        clientName,
        time: format(deliveryDate, 'HH:mm'),
        type: `Essayage ${modelName}`,
        deliveryDate: deliveryDate.getTime(), // Store for sorting
      };
    })
    .sort((a, b) => {
      // Sort by date first, then by time
      if (a.deliveryDate !== b.deliveryDate) {
        return a.deliveryDate - b.deliveryDate;
      }
      // Same date, sort by time
      const timeA = a.time.split(':').map(Number);
      const timeB = b.time.split(':').map(Number);
      const minutesA = timeA[0] * 60 + timeA[1];
      const minutesB = timeB[0] * 60 + timeB[1];
      return minutesA - minutesB;
    })
    .map(({ deliveryDate, ...appointment }) => appointment) // Remove deliveryDate from final object
    .slice(0, 5); // Limit to 5 appointments

  // Get recent clients (first 3)
  const recentClients = initialClients.slice(0, 3).map((client) => ({
    id: client.id,
    clientName: client.noms || client.surnom || 'Client sans nom',
  }));

  // Calculate progress based on status
  const getProgress = (status: string) => {
    const statusProgress: Record<string, number> = {
      pending: 10,
      cutting: 30,
      sewing: 60,
      fitting: 85,
      completed: 100,
    };
    return statusProgress[status] || 0;
  };

  // Check if order is urgent (close to delivery date)
  const isUrgent = (order: Order) => {
    if (!order.delivery_date) return false;
    const delivery = new Date(order.delivery_date);
    const today = new Date();
    const diffTime = delivery.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays >= 0;
  };

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-0.5">
          Tableau de bord
        </h1>
        <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
          Vue d&apos;ensemble de l&apos;atelier
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 min-h-0 overflow-y-auto">
        {/* Left Section - Hero Card and Quick Actions */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Hero Card and Quick Actions Row */}
          <div className="grid grid-cols-3 gap-4">
            {/* Hero Card - Takes 2 columns */}
            <div className="col-span-2">
              <HeroCard />
            </div>

            {/* Quick Actions - Takes 1 column */}
            <div className="flex flex-col gap-3">
              <QuickActionCard
                title="Nouvelle Mesure"
                icon={Ruler}
                color="purple"
                onClick={handleNewMeasure}
              />
              <QuickActionCard
                title="Nouvelle Commande"
                icon={Plus}
                color="pink"
                onClick={handleNewOrder}
              />
            </div>
          </div>

          {/* Status Cards - Commandes en cours */}
          {activeOrders.length > 0 && (
            <div>
              <h2 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-sm mb-3">
                Commandes en cours
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeOrders.map((order) => {
                  const clientName = order.client
                    ? order.client.noms || order.client.surnom || 'Client inconnu'
                    : 'Client inconnu';
                  const modelName = order.model?.name || 'Modèle inconnu';
                  const title = `${modelName} - ${clientName}`;
                  const deliveryDate = order.delivery_date
                    ? format(new Date(order.delivery_date), 'd MMM')
                    : 'Date non définie';
                  const subtitle =
                    order.status === 'fitting'
                      ? `Essayage : ${deliveryDate}`
                      : order.status === 'sewing'
                      ? `Couture en cours`
                      : order.status === 'cutting'
                      ? `Coupe en cours`
                      : `Livraison : ${deliveryDate}`;

                  return (
                    <StatusCard
                      key={order.id}
                      title={title}
                      subtitle={subtitle}
                      progress={getProgress(order.status)}
                      status={isUrgent(order) ? 'urgent' : 'normal'}
                      icon={order.status === 'fitting' ? Shirt : Scissors}
                      iconColor={isUrgent(order) ? '#FF754C' : '#6C5DD3'}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Stats Cards - Disabled/Blurred */}
          <DashboardStatsCards stats={initialStats} />
        </div>

        {/* Right Panel */}
        <div className="flex-shrink-0">
          <RightPanel appointments={fittings} recentClients={recentClients} />
        </div>
      </div>
    </div>
  );
}

