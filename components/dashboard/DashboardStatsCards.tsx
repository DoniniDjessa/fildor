'use client';

import { TrendingUp, DollarSign, Users, Award } from 'lucide-react';
import { DashboardStats } from '@/lib/actions/dashboard.actions';

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

export default function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  return (
    <div className="mt-4">
      <h2 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-sm mb-3">
        Statistiques détaillées
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Revenus Card - Disabled */}
        <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10 opacity-60 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-full bg-[#6C5DD3]/10">
              <TrendingUp size={18} className="text-[#6C5DD3]" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-title font-medium border border-gray-300 dark:border-gray-600 text-gray-400">
              Non disponible
            </span>
          </div>
          <h3 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-[11px] mb-1">
            Revenus
          </h3>
          <p className="font-poppins text-[#808191] dark:text-gray-400 text-[10px] mb-2">
            Total des revenus
          </p>
          <p className="text-xl font-bold font-title blur-sm select-none text-[#11142D] dark:text-gray-100">
            •••••• F
          </p>
        </div>

        {/* Bénéfices Card - Disabled */}
        <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10 opacity-60 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-full bg-green-500/10">
              <DollarSign size={18} className="text-green-500" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-title font-medium border border-gray-300 dark:border-gray-600 text-gray-400">
              Non disponible
            </span>
          </div>
          <h3 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-[11px] mb-1">
            Bénéfices
          </h3>
          <p className="font-poppins text-[#808191] dark:text-gray-400 text-[10px] mb-2">
            Revenus - Dépenses
          </p>
          <p className="text-xl font-bold font-title blur-sm select-none text-[#11142D] dark:text-gray-100">
            •••••• F
          </p>
        </div>

        {/* Meilleurs Clients Card - Disabled */}
        <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10 opacity-60 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-full bg-yellow-500/10">
              <Award size={18} className="text-yellow-500" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-title font-medium border border-gray-300 dark:border-gray-600 text-gray-400">
              Non disponible
            </span>
          </div>
          <h3 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-[11px] mb-1">
            Meilleurs Clients
          </h3>
          <p className="font-poppins text-[#808191] dark:text-gray-400 text-[10px] mb-2">
            Top 5 clients
          </p>
          <div className="space-y-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 blur-sm" />
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded blur-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dépenses Card - Disabled */}
        <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10 opacity-60 relative">
          <div className="flex items-start justify-between mb-3">
            <div className="p-2 rounded-full bg-red-500/10">
              <DollarSign size={18} className="text-red-500" />
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-title font-medium border border-gray-300 dark:border-gray-600 text-gray-400">
              Non disponible
            </span>
          </div>
          <h3 className="font-title text-[#11142D] dark:text-gray-100 font-semibold text-[11px] mb-1">
            Dépenses
          </h3>
          <p className="font-poppins text-[#808191] dark:text-gray-400 text-[10px] mb-2">
            Total des dépenses
          </p>
          <p className="text-xl font-bold font-title blur-sm select-none text-[#11142D] dark:text-gray-100">
            •••••• F
          </p>
        </div>
      </div>
    </div>
  );
}

