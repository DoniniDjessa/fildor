'use client';

import { Scissors, AlertCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import UseStockForm from './UseStockForm';
import DeleteConfirmModal from '../common/DeleteConfirmModal';
import { deleteStockItem } from '@/lib/actions/stock-items.actions';

interface StockItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  threshold: number;
  max_capacity: number;
  image: string | null;
  color?: string;
}

interface StockCardProps {
  item: StockItem;
  isAdmin?: boolean;
  onUpdate?: () => void;
}

export default function StockCard({ item, isAdmin = false, onUpdate }: StockCardProps) {
  const [isUseFormOpen, setIsUseFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const isLow = item.quantity <= item.threshold;
  const percentage = (item.quantity / item.max_capacity) * 100;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteStockItem(item.id);
      setIsDeleteModalOpen(false);
      if (onUpdate) {
        onUpdate();
      } else {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error deleting stock item:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1A1D29] rounded-[24px] p-4 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
      {/* Indicateur Alerte */}
      {isLow && (
        <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] px-2 py-1 rounded-bl-xl font-bold flex items-center gap-1 z-10">
          <AlertCircle size={10} />
          Rupture
        </div>
      )}

      <div className="flex gap-4 items-center">
        {/* Photo Tissu */}
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 relative overflow-hidden border-2 border-white dark:border-slate-700 shadow-md flex-shrink-0">
          {item.image ? (
            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div
              className="w-full h-full"
              style={{ backgroundColor: item.color || '#E5E7EB' }}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 truncate">
            {item.name}
          </h4>
          <p className="font-poppins text-[10px] text-gray-400 dark:text-gray-500 mb-2">{item.category}</p>

          <div className="flex items-baseline gap-1">
            <span
              className={`font-poppins text-xl font-bold ${
                isLow ? 'text-red-500' : 'text-[#6C5DD3]'
              }`}
            >
              {item.quantity}
            </span>
            <span className="font-poppins text-xs font-medium text-gray-400 dark:text-gray-500">
              {item.unit}
            </span>
          </div>
        </div>
      </div>

      {/* Barre de Jauge */}
      <div className="mt-3 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isLow ? 'bg-red-400' : 'bg-[#6C5DD3]'
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button className="font-poppins flex-1 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          Historique
        </button>
        {isAdmin && (
          <>
            <button
              onClick={() => setIsUseFormOpen(true)}
              className="font-poppins flex-1 h-8 rounded-xl bg-[#6C5DD3]/10 dark:bg-[#6C5DD3]/20 text-[#6C5DD3] dark:text-[#8B7AE8] text-[10px] font-bold hover:bg-[#6C5DD3] hover:text-white dark:hover:bg-[#6C5DD3] transition-colors flex items-center justify-center gap-1"
            >
              <Scissors size={12} />
              Utiliser
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="font-poppins h-8 w-8 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center"
            >
              <Trash2 size={12} />
            </button>
          </>
        )}
      </div>

      {/* Use Stock Form */}
      <UseStockForm
        stockItem={{
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          unit: item.unit,
        }}
        isOpen={isUseFormOpen}
        onClose={() => setIsUseFormOpen(false)}
        onSuccess={() => {
          setIsUseFormOpen(false);
          if (onUpdate) {
            onUpdate();
          } else {
            window.location.reload();
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          title="Supprimer l'item de stock"
          message={`Êtes-vous sûr de vouloir supprimer "${item.name}" ?`}
          onConfirm={handleDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          loading={loading}
        />
      )}
    </div>
  );
}

