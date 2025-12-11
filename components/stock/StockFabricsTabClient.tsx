'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, AlertCircle } from 'lucide-react';
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

interface StockFabricsTabClientProps {
  initialStockItems: any[];
  materialTypes: any[];
  isAdmin?: boolean;
}

export default function StockFabricsTabClient({ initialStockItems, materialTypes, isAdmin = false }: StockFabricsTabClientProps) {
  const [stockItems, setStockItems] = useState(initialStockItems);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyLowStock, setShowOnlyLowStock] = useState(false);

  // Transform database items to StockCard format
  const transformedItems = stockItems.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.material_type?.category || item.category || 'Tissu',
    quantity: Number(item.quantity),
    unit: item.material_type?.unit || item.unit || 'm',
    threshold: Number(item.threshold || item.material_type?.default_threshold || 0),
    max_capacity: item.max_capacity ? Number(item.max_capacity) : undefined,
    image: item.image_url,
    color: item.color,
  }));

  // Filter items based on search and low stock filter
  const filteredItems = useMemo(() => {
    let filtered = transformedItems;

    // Filter by low stock if enabled
    if (showOnlyLowStock) {
      filtered = filtered.filter((item) => item.quantity <= item.threshold);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query) ||
          (item.color && item.color.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [transformedItems, searchQuery, showOnlyLowStock]);

  const lowStockCount = transformedItems.filter((item) => item.quantity <= item.threshold).length;

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h2 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100">
            Mon Stock Tissus
          </h2>
          {isAdmin && (
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
          )}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex gap-2">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Rechercher un tissu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-10 pr-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-poppins focus:ring-1 focus:ring-[#6C5DD3] transition-all"
            />
          </div>

          {/* Low Stock Filter Button */}
          <button
            onClick={() => setShowOnlyLowStock(!showOnlyLowStock)}
            className={`font-poppins px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              showOnlyLowStock
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <AlertCircle size={14} />
            Rupture {lowStockCount > 0 && `(${lowStockCount})`}
          </button>
        </div>
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
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="font-poppins text-sm text-gray-500 dark:text-gray-400 mb-4">
            {showOnlyLowStock ? 'Aucun item en rupture de stock' : 'Aucun résultat trouvé'}
          </p>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowOnlyLowStock(false);
              }}
              className="font-poppins text-xs text-[#6C5DD3] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <StockCard key={item.id} item={item} isAdmin={isAdmin} onUpdate={() => window.location.reload()} />
          ))}
        </div>
      )}

      {/* Stock Item Form */}
      <StockItemForm
        stockItem={editingItem}
        category="Tissu"
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

