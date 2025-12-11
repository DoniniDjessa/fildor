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
  
  // Check if order is late (max 3 days to delivery and status is pending, cutting, or sewing)
  const isLate = daysUntilDelivery <= 3 && daysUntilDelivery >= 0 && 
                 (order.status === 'pending' || order.status === 'cutting' || order.status === 'sewing');

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`bg-white dark:bg-[#1A1D29] rounded-[20px] p-4 shadow-sm border cursor-move hover:shadow-md transition-all relative ${
        isLate 
          ? 'border-red-400 dark:border-red-600 bg-red-50/30 dark:bg-red-900/10' 
          : 'border-slate-100 dark:border-slate-800'
      }`}
    >
      {/* Late Indicator Badge */}
      {isLate && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-[9px] px-2 py-1 rounded-full font-bold flex items-center gap-1 z-10">
          <span>⚠️</span>
          <span>RETARD</span>
        </div>
      )}
      
      {/* Layout: Image on left, Info on right */}
      <div className="flex gap-3">
        {/* Picture */}
        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 flex-shrink-0">
          {order.fabricImage ? (
            <img 
              src={order.fabricImage} 
              alt="Tissu" 
              className="w-full h-full object-cover"
              onError={(e) => {
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

        {/* Info Column */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top: Client Name */}
          <h4 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-1 truncate">
            {order.clientName}
          </h4>

          {/* Middle: Model Name */}
          <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400 mb-2 truncate">
            {order.modelName}
          </p>

          {/* Bottom: Date (left) and Price (right) */}
          <div className="flex items-center justify-between">
            {/* Date on left */}
            <div
              className={`flex items-center gap-1 ${
                isOverdue
                  ? 'text-red-500'
                  : isUrgent
                  ? 'text-orange-500'
                  : 'text-[#808191] dark:text-gray-400'
              }`}
            >
              <Calendar size={10} />
              <span className="font-poppins text-[9px] font-semibold">
                {isOverdue
                  ? `Retard ${Math.abs(daysUntilDelivery)}j`
                  : daysUntilDelivery === 0
                  ? 'Aujourd\'hui'
                  : daysUntilDelivery < 0
                  ? `J${daysUntilDelivery}`
                  : `J+${daysUntilDelivery}`}
              </span>
            </div>

            {/* Total Price on right */}
            <span className="font-poppins text-xs font-bold text-[#11142D] dark:text-gray-100">
              {order.totalPrice.toLocaleString('fr-FR')} F
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

