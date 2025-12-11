'use client';

import { Calendar } from 'lucide-react';
import { Order } from './OrdersKanban';

interface OrderCardProps {
  order: Order;
  daysUntilDelivery: number;
  onDragStart: () => void;
}

export default function OrderCard({ order, daysUntilDelivery, onDragStart }: OrderCardProps) {
  const isUrgent = daysUntilDelivery <= 3;
  const isOverdue = daysUntilDelivery < 0;

  // Debug: Log image URLs
  if (order.fabricImage || order.clientReferenceImage) {
    console.log('OrderCard - Image URLs:', {
      orderId: order.id,
      fabricImage: order.fabricImage,
      clientReferenceImage: order.clientReferenceImage,
    });
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white dark:bg-[#1A1D29] rounded-[20px] p-4 shadow-sm border border-slate-100 dark:border-slate-800 cursor-move hover:shadow-md transition-all"
    >
      {/* Images Row */}
      <div className="flex gap-2 mb-3">
        {/* Fabric Image */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700">
          {order.fabricImage ? (
            <img 
              src={order.fabricImage} 
              alt="Tissu" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, show placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center"><span class="text-white text-xs font-bold">T</span></div>';
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center">
              <span className="text-white text-xs font-bold">T</span>
            </div>
          )}
        </div>

        {/* Client Reference Image */}
        <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700">
          {order.clientReferenceImage ? (
            <img
              src={order.clientReferenceImage}
              alt="Référence client"
              className="w-full h-full object-cover"
              onError={(e) => {
                // If image fails to load, show placeholder
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-[#FF754C] to-[#FF9A6C] flex items-center justify-center"><span class="text-white text-xs font-bold">M</span></div>';
                }
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#FF754C] to-[#FF9A6C] flex items-center justify-center">
              <span className="text-white text-xs font-bold">M</span>
            </div>
          )}
        </div>
      </div>

      {/* Client Name */}
      <h4 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-1">
        {order.clientName}
      </h4>

      {/* Model Name */}
      <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400 mb-3">
        {order.modelName}
      </p>

      {/* Delivery Date */}
      <div
        className={`flex items-center gap-1.5 mb-3 ${
          isOverdue
            ? 'text-red-500'
            : isUrgent
            ? 'text-orange-500'
            : 'text-[#808191] dark:text-gray-400'
        }`}
      >
        <Calendar size={12} />
        <span className="font-poppins text-[10px] font-semibold">
          {isOverdue
            ? `En retard (${Math.abs(daysUntilDelivery)}j)`
            : daysUntilDelivery === 0
            ? 'Aujourd\'hui'
            : daysUntilDelivery < 0
            ? `J${daysUntilDelivery}`
            : `J+${daysUntilDelivery}`}
        </span>
      </div>

      {/* Price Info */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
        <div className="flex justify-between items-center mb-1">
          <span className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">Total</span>
          <span className="font-poppins text-xs font-bold text-[#11142D] dark:text-gray-100">
            {order.totalPrice.toLocaleString('fr-FR')} F
          </span>
        </div>
        {order.remaining > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
              Reste
            </span>
            <span className="font-poppins text-xs font-semibold text-orange-500">
              {order.remaining.toLocaleString('fr-FR')} F
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

