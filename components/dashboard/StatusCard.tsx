'use client';

import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  subtitle: string;
  progress: number;
  status: 'urgent' | 'normal';
  icon: LucideIcon;
  iconColor: string;
}

export default function StatusCard({ title, subtitle, progress, status, icon: Icon, iconColor }: StatusCardProps) {
  const statusClass = status === 'urgent' 
    ? 'bg-[#FF754C]/10 text-[#FF754C] border-[#FF754C]/20' 
    : 'bg-[#3F8CFF]/10 text-[#3F8CFF] border-[#3F8CFF]/20';

  return (
    <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10 hover:shadow-xl transition-all">
      {/* Icon Circle */}
      <div className="flex items-start justify-between mb-3">
        <div 
          className="p-2 rounded-full"
          style={{ backgroundColor: `${iconColor}20` }}
        >
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-title font-medium border ${statusClass}`}>
          {status === 'urgent' ? 'Urgent' : 'Normal'}
        </span>
      </div>

      {/* Content */}
      <div className="mb-3">
        <h3 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-[11px] mb-0.5">
          {title}
        </h3>
        <p className="font-poppins text-[#808191] dark:text-gray-400 text-[10px]">
          {subtitle}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-poppins text-[#808191] dark:text-gray-400">{progress}%</span>
          <span className="font-poppins text-[#808191] dark:text-gray-400">Assemblage fini</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: status === 'urgent' 
                ? 'linear-gradient(to right, #FF754C, #FF8C6C)' 
                : 'linear-gradient(to right, #3F8CFF, #5BA3FF)'
            }}
          />
        </div>
      </div>
    </div>
  );
}

