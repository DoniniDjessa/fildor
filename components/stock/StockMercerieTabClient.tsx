'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import StockCard from './StockCard';
import StockItemForm from './StockItemForm';

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  threshold: number;
  max_capacity?: number;
  image_url?: string | null;
  color?: string;
  material_type?: {
    name: string;
    unit: string;
    category: string;
  };
}

interface StockMercerieTabClientProps {
  initialStockItems: any[];
  materialTypes: any[];
  isAdmin?: boolean;
}

export default function StockMercerieTabClient({ initialStockItems, materialTypes, isAdmin = false }: StockMercerieTabClientProps) {
  const [stockItems, setStockItems] = useState(initialStockItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Transform database items to StockCard format
  const transformedItems = stockItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.material_type?.category || item.category || 'Mercerie',
    quantity: Number(item.quantity),
    unit: item.material_type?.unit || item.unit || 'pièces',
    threshold: Number(item.threshold || item.material_type?.default_threshold || 0),
    max_capacity: item.max_capacity ? Number(item.max_capacity) : undefined,
    image: item.image_url,
    color: item.color,
  }));

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100">
          Mon Stock Mercerie
        </h2>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="font-poppins px-4 py-2 bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] text-white rounded-xl text-xs font-semibold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={14} />
          Mettre à jour le stock
        </button>
      </div>

      {transformedItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-poppins text-sm text-gray-500 dark:text-gray-400 mb-4">
            Aucun stock enregistré
          </p>
          <p className="font-poppins text-[10px] text-gray-400 dark:text-gray-500">
            Configurez d&apos;abord vos matières dans l&apos;onglet &quot;Configuration Matières&quot;
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transformedItems.map((item) => (
            <StockCard key={item.id} item={item} isAdmin={isAdmin} onUpdate={() => window.location.reload()} />
          ))}
        </div>
      )}

      {/* Stock Item Form */}
      <StockItemForm
        stockItem={editingItem}
        category="Mercerie"
        materialTypes={materialTypes}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSuccess={() => {
          setIsFormOpen(false);
          setEditingItem(null);
          window.location.reload();
        }}
      />
    </div>
  );
}

