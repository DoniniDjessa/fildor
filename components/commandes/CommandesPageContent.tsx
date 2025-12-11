'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import OrdersKanban from './OrdersKanban';
import CreateOrderWizard from './CreateOrderWizard';

interface CommandesPageContentProps {
  isAdmin?: boolean;
}

export default function CommandesPageContent({ isAdmin = false }: CommandesPageContentProps) {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

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

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        <OrdersKanban />
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

