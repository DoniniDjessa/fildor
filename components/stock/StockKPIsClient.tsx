'use client';

interface StockKPIsClientProps {
  kpis: {
    totalValue: number;
    totalFabricMeters: number;
    lowStockCount: number;
  };
}

export default function StockKPIsClient({ kpis }: StockKPIsClientProps) {
  const kpiData = [
    {
      id: 1,
      label: 'Valeur Stock',
      value: `${kpis.totalValue.toLocaleString('fr-FR')} F`,
      icon: '🟣',
      color: 'purple',
    },
    {
      id: 2,
      label: 'Total Tissus',
      value: `${kpis.totalFabricMeters} mètres`,
      icon: '🔵',
      color: 'blue',
    },
    {
      id: 3,
      label: 'Alerte Rupture',
      value: `${kpis.lowStockCount} article${kpis.lowStockCount !== 1 ? 's' : ''}`,
      icon: '🔴',
      color: 'red',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kpiData.map((kpi) => (
        <div
          key={kpi.id}
          className="bg-white/80 dark:bg-[#1A1D29]/80 backdrop-blur-lg rounded-[30px] p-4 shadow-lg border border-white/20 dark:border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl">{kpi.icon}</div>
            <div className="flex-1">
              <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400 mb-1">{kpi.label}</p>
              <p className="font-poppins text-lg font-bold text-[#11142D] dark:text-gray-100">
                {kpi.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

