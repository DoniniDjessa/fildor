'use client';

import { MoveDown } from 'lucide-react';

export default function Loader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="relative h-16 w-16">
          {/* Le Cercle de fond (Tissu) */}
          <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
          
          {/* L'anneau de chargement (Fil) */}
          <div className="absolute inset-0 rounded-full border-4 border-[#6C5DD3] border-t-transparent animate-spin"></div>
          
          {/* L'Aiguille au centre (Animation de pique) */}
          <div className="absolute inset-0 flex items-center justify-center animate-bounce">
            <MoveDown className="text-[#FF754C]" size={24} />
          </div>
        </div>
        
        {/* Texte Pulsant */}
        <span className="font-poppins text-xs font-bold text-[#6C5DD3] tracking-widest animate-pulse">
          ATELIER...
        </span>
      </div>
    </div>
  );
}

