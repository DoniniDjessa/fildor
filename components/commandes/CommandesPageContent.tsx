'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, AlertCircle } from 'lucide-react';
import OrdersKanban from './OrdersKanban';
import CreateOrderWizard from './CreateOrderWizard';
import { Order } from '@/lib/actions/orders.actions';

interface CommandesPageContentProps {
  isAdmin?: boolean;
}

export default function CommandesPageContent({ isAdmin = false }: CommandesPageContentProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [showLateOnly, setShowLateOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allOrders, setAllOrders] = useState<Order[]>([]);

  // Calculate late orders count
  const lateCount = useMemo(() => {
    return allOrders.filter((order) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const delivery = new Date(order.delivery_date);
      delivery.setHours(0, 0, 0, 0);
      const diffTime = delivery.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0 && 
             (order.status === 'pending' || order.status === 'cutting' || order.status === 'sewing');
    }).length;
  }, [allOrders]);

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-[#1A1D29]/80 backdrop-blur-lg rounded-[30px] shadow-lg p-6 border border-white/20 dark:border-white/10">
      {/* Header */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-1">
            Commandes
          </h1>
          <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
            Gérer les commandes de l&apos;atelier
          </p>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="font-poppins px-6 py-3 bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Nouvelle Commande
        </button>
      </div>

      {/* Filters and Search */}
      <div className="mb-4 flex gap-3 items-center">
        {/* Search Bar */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher une commande (client, modèle)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-poppins focus:ring-1 focus:ring-[#6C5DD3] transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        </div>
        
        {/* Late Filter Button */}
        <button
          onClick={() => setShowLateOnly(!showLateOnly)}
          className={`font-poppins px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            showLateOnly
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <AlertCircle size={14} />
          Retards {lateCount > 0 && `(${lateCount})`}
        </button>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <OrdersKanban 
          showLateOnly={showLateOnly} 
          searchQuery={searchQuery}
          onOrdersLoaded={setAllOrders}
        />
      </div>

      {/* Create Order Wizard */}
      <CreateOrderWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSuccess={() => {
          setIsWizardOpen(false);
        }}
        isAdmin={isAdmin}
      />
    </div>
  );
}

