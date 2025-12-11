import StockKPIs from './StockKPIs';
import StockTabs from './StockTabs';

export default function StockPageContent() {
  return (
    <div className="h-full flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-0.5">
          Tableau de Bord Stock
        </h1>
        <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
          Gestion des matières et inventaire
        </p>
      </div>

      {/* KPIs */}
      <StockKPIs />

      {/* Tabs */}
      <StockTabs />
    </div>
  );
}

