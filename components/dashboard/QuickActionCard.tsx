'use client';

import { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  icon: LucideIcon;
  color: 'purple' | 'pink';
  onClick: () => void;
}

export default function QuickActionCard({ title, icon: Icon, color, onClick }: QuickActionCardProps) {
  const bgClass = color === 'purple' 
    ? 'bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] shadow-indigo-200' 
    : 'bg-gradient-to-br from-[#FF754C] to-[#FF8C6C] shadow-orange-200';

  return (
    <button 
      onClick={onClick}
      className={`${bgClass} w-full h-28 rounded-[30px] p-4 flex flex-col justify-between items-start text-white shadow-xl transition-transform hover:scale-105 active:scale-95 relative overflow-hidden`}
    >
      {/* Decorative circles */}
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/20 rounded-full blur-xl" />
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-white/10 rounded-full blur-lg" />
      
      <div className="p-1.5 bg-white/20 rounded-full backdrop-blur-sm relative z-10">
        <Icon size={18} color="white" />
      </div>
      
      <span className="font-title font-semibold text-xs tracking-wide relative z-10">
        {title}
      </span>
    </button>
  );
}

