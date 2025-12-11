'use client';

import { Scissors, MoreVertical, Clock } from 'lucide-react';
import { useState } from 'react';

interface Model {
  id: string;
  name: string;
  category: string;
  base_price: number;
  fabric_req: string;
  make_time: number;
  image_url?: string | null;
}

interface ModelCardProps {
  model: Model;
  onEdit: () => void;
}

export default function ModelCard({ model, onEdit }: ModelCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group bg-white dark:bg-[#1A1D29] rounded-[20px] overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg hover:shadow-indigo-100 dark:hover:shadow-indigo-900/20 transition-all cursor-pointer">
      {/* 1. IMAGE HERO */}
      <div className="relative aspect-[4/5] bg-slate-100 dark:bg-slate-800">
        {/* Always show placeholder for now */}
        <div className="w-full h-full bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] flex items-center justify-center">
          <span className="font-title text-4xl text-white/50">{model.category[0]}</span>
        </div>

        <span className="absolute top-2 left-2 bg-white/90 dark:bg-[#1A1D29]/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-[#6C5DD3] font-poppins">
          {model.category}
        </span>

        <div className="absolute top-2 right-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1.5 bg-black/20 dark:bg-white/20 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical size={14} />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 bg-white dark:bg-[#1A1D29] rounded-xl shadow-lg border border-white/20 dark:border-white/10 overflow-hidden z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                  setShowMenu(false);
                }}
                className="w-full px-4 py-2 text-left text-[10px] font-poppins text-[#11142D] dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Modifier
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. INFOS */}
      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 line-clamp-1">
            {model.name}
          </h3>
        </div>

        <div className="text-[#6C5DD3] font-poppins font-black text-xs mb-3">
          {model.base_price.toLocaleString('fr-FR')} F{' '}
          <span className="text-gray-400 font-normal">/ façon</span>
        </div>

        {/* 3. FOOTER TECHNIQUE */}
        <div className="bg-[#F0F3F8] dark:bg-slate-800 rounded-xl p-2 flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-poppins">
            <Scissors size={10} className="text-[#FF754C]" />
            <span>
              Tissu: <strong>{model.fabric_req}</strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 dark:text-gray-400 font-poppins">
            <Clock size={10} className="text-blue-400" />
            <span>
              Délai: <strong>{model.make_time}j</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

