'use client';

import { useState } from 'react';
import StockFabricsTabClient from './StockFabricsTabClient';
import StockMercerieTabClient from './StockMercerieTabClient';
import MaterialTypesList from './MaterialTypesList';

const TABS = [
  { id: 'fabrics', label: 'Tissus & Pagnes' },
  { id: 'mercerie', label: 'Mercerie' },
  { id: 'config', label: 'Configuration Matières' },
] as const;

type TabId = typeof TABS[number]['id'];

interface StockTabsClientProps {
  fabricsItems: any[];
  mercerieItems: any[];
  materialTypes: any[];
  isAdmin: boolean;
}

// Create wrapper components that pass materialTypes to StockItemForm
const StockFabricsTabWithForm = ({ initialStockItems, materialTypes, isAdmin }: { initialStockItems: any[]; materialTypes: any[]; isAdmin: boolean }) => {
  return <StockFabricsTabClient initialStockItems={initialStockItems} materialTypes={materialTypes} isAdmin={isAdmin} />;
};

const StockMercerieTabWithForm = ({ initialStockItems, materialTypes, isAdmin }: { initialStockItems: any[]; materialTypes: any[]; isAdmin: boolean }) => {
  return <StockMercerieTabClient initialStockItems={initialStockItems} materialTypes={materialTypes} isAdmin={isAdmin} />;
};

export default function StockTabsClient({ fabricsItems, mercerieItems, materialTypes, isAdmin }: StockTabsClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>('fabrics');

  return (
    <div className="flex-1 flex flex-col bg-white/80 dark:bg-[#1A1D29]/80 backdrop-blur-lg rounded-[30px] shadow-lg border border-white/20 dark:border-white/10 overflow-hidden">
      {/* Tab Headers */}
      <div className="flex border-b border-white/20 dark:border-white/10">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-3 text-xs font-semibold transition-colors ${
              activeTab === tab.id
                ? 'bg-[#6C5DD3] text-white'
                : 'text-[#808191] dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'fabrics' && (
          <StockFabricsTabWithForm initialStockItems={fabricsItems} materialTypes={materialTypes} isAdmin={isAdmin} />
        )}
        {activeTab === 'mercerie' && (
          <StockMercerieTabWithForm initialStockItems={mercerieItems} materialTypes={materialTypes} isAdmin={isAdmin} />
        )}
        {activeTab === 'config' && (
          <MaterialTypesList initialMaterialTypes={materialTypes} />
        )}
      </div>
    </div>
  );
}

