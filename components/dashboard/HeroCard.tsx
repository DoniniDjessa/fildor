'use client';

import { TrendingUp, Calendar } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getDashboardStats, DashboardStats } from '@/lib/actions/dashboard.actions';

export default function HeroCard() {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [selectedPeriod]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const dashboardStats = await getDashboardStats(selectedPeriod);
      setStats(dashboardStats);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#6C5DD3] to-[#8B7AE8] rounded-[30px] p-6 shadow-xl relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div>
          <h2 className="font-title text-white text-sm font-semibold mb-0.5">Revenus Mensuels</h2>
          <p className="font-poppins text-white/80 text-[10px]">Vue d&apos;ensemble des revenus</p>
        </div>
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'month' | 'quarter' | 'year')}
            className="appearance-none bg-white/20 backdrop-blur-sm text-white text-[10px] px-3 py-1.5 pr-7 rounded-[15px] border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
          >
            <option value="month" className="text-[#11142D]">Ce mois-ci</option>
            <option value="quarter" className="text-[#11142D]">Ce trimestre</option>
            <option value="year" className="text-[#11142D]">Cette année</option>
          </select>
          <Calendar className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white pointer-events-none" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
        <div className="bg-white/20 backdrop-blur-sm rounded-[15px] p-3 border border-white/30">
          <p className="font-poppins text-white/80 text-[10px] mb-0.5">Total Commandes</p>
          {loading ? (
            <p className="text-white text-lg font-bold font-title">...</p>
          ) : (
            <p className="text-white text-lg font-bold font-title">
              {stats?.ordersThisMonth || 0}
            </p>
          )}
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-[15px] p-3 border border-white/30">
          <p className="font-poppins text-white/80 text-[10px] mb-0.5">Chiffre d&apos;Affaires</p>
          <p className="text-white text-lg font-bold font-title blur-sm select-none">
            {loading ? '...' : '••••••'}
          </p>
          <p className="font-poppins text-white/60 text-[10px]">FCFA</p>
        </div>
      </div>

      {/* Wave Chart Placeholder */}
      <div className="relative z-10 h-24 bg-white/10 backdrop-blur-sm rounded-[15px] p-3 border border-white/20 flex items-end justify-between gap-1">
        {[...Array(12)].map((_, i) => {
          const height = Math.random() * 60 + 20;
          return (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-white/40 to-white/20 rounded-t-[4px] transition-all hover:opacity-80"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>

      {/* Trend indicator */}
      {stats && stats.ordersLastMonth > 0 && (
        <div className="flex items-center gap-1.5 mt-3 relative z-10">
          <TrendingUp className="w-3 h-3 text-white/80" />
          <span className="font-poppins text-white/80 text-[10px]">
            {stats.ordersThisMonth > stats.ordersLastMonth ? '+' : ''}
            {stats.ordersLastMonth > 0
              ? Math.round(((stats.ordersThisMonth - stats.ordersLastMonth) / stats.ordersLastMonth) * 100)
              : 0}% par rapport au mois dernier
          </span>
        </div>
      )}
    </div>
  );
}

