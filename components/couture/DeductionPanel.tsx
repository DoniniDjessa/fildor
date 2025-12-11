'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Scissors } from 'lucide-react';
import { Order } from '@/lib/actions/orders.actions';
import { getStockItemsByCategory } from '@/lib/actions/stock-items.actions';
import { useStockItem } from '@/lib/actions/stock-items.actions';
import { createActivityLog } from '@/lib/actions/activity-logs.actions';
import { getCouturiers, Couturier } from '@/lib/actions/couturiers.actions';
import { getCurrentUser } from '@/lib/auth/actions';

interface DeductionPanelProps {
  order: Order;
  currentUserId?: string;
  isAdmin?: boolean;
  onBack: () => void;
  onSuccess: () => void;
}

export default function DeductionPanel({ order, currentUserId, isAdmin = false, onBack, onSuccess }: DeductionPanelProps) {
  const [materialId, setMaterialId] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [stockItems, setStockItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [couturiers, setCouturiers] = useState<Couturier[]>([]);
  const [selectedCouturierId, setSelectedCouturierId] = useState<string>('');
  const [currentUserName, setCurrentUserName] = useState<string>('');

  useEffect(() => {
    loadStockItems();
    if (isAdmin) {
      loadCouturiers();
    }
    loadCurrentUserInfo();
  }, [isAdmin]);

  useEffect(() => {
    if (materialId) {
      const selectedItem = stockItems.find((item) => item.id === materialId);
      setAvailableStock(selectedItem?.quantity || 0);
    }
  }, [materialId, stockItems]);

  const loadStockItems = async () => {
    try {
      const items = await getStockItemsByCategory('Tissu');
      setStockItems(items);
      
      // Pre-fill material if order has fabric info
      if (order.fabric_meters && items.length > 0) {
        // Try to find matching stock item
        const matchingItem = items.find((item) => 
          item.name.toLowerCase().includes(order.fabric_meters?.toLowerCase() || '')
        );
        if (matchingItem) {
          setMaterialId(matchingItem.id);
        }
      }
    } catch (error) {
      console.error('Error loading stock items:', error);
    }
  };

  const loadCouturiers = async () => {
    try {
      const couturiersList = await getCouturiers();
      setCouturiers(couturiersList);
    } catch (error) {
      console.error('Error loading couturiers:', error);
    }
  };

  const loadCurrentUserInfo = async () => {
    try {
      const user = await getCurrentUser();
      if (user?.name) {
        setCurrentUserName(user.name);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };


  const handleQuickQuantity = (value: string) => {
    setQuantity(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!materialId || !quantity || parseFloat(quantity) <= 0) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    if (parseFloat(quantity) > availableStock) {
      alert(`Stock insuffisant. Disponible : ${availableStock}`);
      return;
    }

    setLoading(true);
    try {
      const motif = `Commande ${order.client?.noms || order.client?.surnom || 'Client'} - ${order.model?.name || 'Modèle'}`;
      const quantityValue = parseFloat(quantity);
      
      // Deduct stock
      await useStockItem(materialId, {
        quantity: quantityValue,
        motif,
      });
      
      // Log activity with both admin and couturier info
      await createActivityLog({
        order_id: order.id,
        stock_item_id: materialId,
        material_name: selectedItem?.name || 'Matière inconnue',
        quantity: quantityValue,
        unit: unit,
        motif: selectedCouturierId 
          ? `${motif} (Admin: ${currentUserName}, Couturier: ${couturiers.find(c => c.id === selectedCouturierId)?.name || 'N/A'})`
          : motif,
        stock_change: -quantityValue, // Negative for deduction
      });
      
      alert('Consommation enregistrée avec succès');
      onSuccess();
    } catch (error: any) {
      console.error('Error deducting stock:', error);
      alert(error.message || 'Erreur lors de la déduction du stock');
    } finally {
      setLoading(false);
    }
  };

  const selectedItem = stockItems.find((item) => item.id === materialId);
  const unit = selectedItem?.material_type?.unit || 'm';

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#808191] dark:text-gray-400 hover:text-[#11142D] dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        <span className="font-poppins text-xs">Retour</span>
      </button>

      {/* Selected Order Info */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
        <h3 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-2">
          {order.client?.noms || order.client?.surnom || 'Client inconnu'}
        </h3>
        <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
          {order.model?.name || 'Modèle inconnu'}
        </p>
      </div>

      {/* Deduction Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Matière */}
        <div>
          <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
            Matière *
          </label>
          <select
            value={materialId}
            onChange={(e) => setMaterialId(e.target.value)}
            className="w-full h-10 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
            required
          >
            <option value="">Sélectionner une matière</option>
            {stockItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} {item.color && `- ${item.color}`} ({item.quantity} {item.material_type?.unit || 'm'})
              </option>
            ))}
          </select>
          {materialId && (
            <p className="mt-1 font-poppins text-[10px] text-[#808191] dark:text-gray-400">
              Stock disponible : <span className="font-bold">{availableStock} {unit}</span>
            </p>
          )}
        </div>

        {/* Quantité utilisée */}
        <div>
          <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
            Quantité utilisée *
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="flex-1 h-12 text-lg font-bold text-center bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#6C5DD3] transition-all font-poppins"
              required
            />
            <div className="flex items-center px-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
              <span className="font-poppins text-xs font-semibold text-[#808191] dark:text-gray-400">
                {unit}
              </span>
            </div>
          </div>
          
          {/* Quick Buttons */}
          {selectedItem && (
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickQuantity(availableStock.toString())}
                className="flex-1 h-8 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-poppins"
              >
                Tout le coupon
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuantity((availableStock / 2).toFixed(2))}
                className="flex-1 h-8 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-poppins"
              >
                1/2
              </button>
            </div>
          )}
        </div>

        {/* Qui coupe ? */}
        <div>
          <label className="block font-poppins text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1 ml-1">
            Qui coupe ?
          </label>
          {isAdmin && couturiers.length > 0 ? (
            <select
              value={selectedCouturierId}
              onChange={(e) => setSelectedCouturierId(e.target.value)}
              className="w-full h-10 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl focus:ring-1 focus:ring-[#6C5DD3] transition-all px-3 font-poppins"
            >
              <option value="">Sélectionner un couturier (optionnel)</option>
              {couturiers.map((couturier) => (
                <option key={couturier.id} value={couturier.id}>
                  {couturier.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={currentUserName || 'Utilisateur actuel'}
              disabled
              className="w-full h-10 text-xs bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-3 font-poppins opacity-60"
              placeholder="Auto-rempli avec l'utilisateur connecté"
            />
          )}
          {isAdmin && selectedCouturierId && (
            <p className="mt-1 font-poppins text-[9px] text-[#808191] dark:text-gray-400">
              Admin: {currentUserName} / Couturier: {couturiers.find(c => c.id === selectedCouturierId)?.name || 'N/A'}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !materialId || !quantity}
          className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-poppins text-sm font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Scissors size={18} />
          {loading ? 'Enregistrement...' : 'CONFIRMER COUPE'}
        </button>
      </form>
    </div>
  );
}

