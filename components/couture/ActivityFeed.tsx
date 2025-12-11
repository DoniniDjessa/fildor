'use client';

import { useState, useEffect } from 'react';
import { Scissors, User } from 'lucide-react';
import { getActivityLogs, ActivityLog } from '@/lib/actions/activity-logs.actions';
import { formatDistanceToNow } from 'date-fns';

export default function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
    // Refresh every 30 seconds
    const interval = setInterval(loadActivities, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadActivities = async () => {
    try {
      const logs = await getActivityLogs(50);
      setActivities(logs);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <h2 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-0.5">
          Activité Atelier
        </h2>
        <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
          Aujourd&apos;hui
        </p>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-0">
          {loading ? (
            <div className="text-center py-8">
              <p className="font-poppins text-xs text-[#808191] dark:text-gray-400">Chargement...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="text-center py-8">
              <p className="font-poppins text-xs text-[#808191] dark:text-gray-400">
                Aucune activité récente
              </p>
            </div>
          ) : (
            activities.map((log, index) => (
              <ActivityLogItem key={log.id} log={log} isLast={index === activities.length - 1} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

interface ActivityLogItemProps {
  log: ActivityLog;
  isLast: boolean;
}

function ActivityLogItem({ log, isLast }: ActivityLogItemProps) {
  // Parse motif to extract admin and couturier names if present
  const motif = log.motif || '';
  const hasAdminCouturier = motif.includes('(Admin:') && motif.includes('Couturier:');
  
  let employeeName = log.employee?.name || 'Utilisateur inconnu';
  let displayText = employeeName;
  
  if (hasAdminCouturier) {
    const adminMatch = motif.match(/Admin:\s*([^,]+)/);
    const couturierMatch = motif.match(/Couturier:\s*([^)]+)/);
    const adminName = adminMatch ? adminMatch[1].trim() : '';
    const couturierName = couturierMatch ? couturierMatch[1].trim() : '';
    
    if (adminName && couturierName) {
      displayText = `${adminName} / Couturier: ${couturierName}`;
    } else if (adminName) {
      displayText = adminName;
    }
  }
  
  const orderRef = log.order?.client
    ? `Commande ${log.order.client.noms || log.order.client.surnom || 'Client'}`
    : 'Commande inconnue';
  
  const timeAgo = log.created_at
    ? formatDistanceToNow(new Date(log.created_at), { addSuffix: true })
    : 'Récemment';

  return (
    <div className={`relative pl-6 pb-8 ${!isLast ? 'border-l-2 border-slate-100 dark:border-slate-800' : ''}`}>
      {/* Point sur la timeline */}
      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#FF754C] ring-4 ring-white dark:ring-[#1A1D29] flex items-center justify-center">
        <Scissors size={8} className="text-white" />
      </div>

      <div className="flex flex-col gap-1">
        {/* Header : Qui et Quand */}
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <User size={10} /> {displayText}
          </span>
          <span className="text-[9px] text-slate-400 dark:text-slate-500">{timeAgo}</span>
        </div>

        {/* Corps : Quoi */}
        <div className="bg-slate-50 dark:bg-slate-800 p-2 rounded-lg mt-1 border border-slate-100 dark:border-slate-700">
          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-tight">
            A utilisé <span className="font-bold text-[#6C5DD3]">{log.quantity}{log.unit}</span> de{' '}
            <span className="font-medium">{log.material_name}</span>
          </p>
          <div className="mt-1 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
            <p className="text-[10px] text-slate-400 dark:text-slate-500">📂 {orderRef}</p>
          </div>
        </div>

        {/* Stock Indicator */}
        <div className="mt-1">
          <span className="inline-flex items-center px-2 py-0.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-[9px] font-semibold">
            Stock {log.stock_change > 0 ? '+' : ''}{log.stock_change}
          </span>
        </div>
      </div>
    </div>
  );
}

