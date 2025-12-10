export default function DashboardPage() {
  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-4 border border-rose-100 dark:border-purple-800">
      <div className="mb-4">
        <h1 className="font-title text-lg font-bold text-gray-900 dark:text-gray-100 mb-1">
          Tableau de bord
        </h1>
        <p className="text-[10px] text-gray-500 dark:text-gray-400">
          Vue d&apos;ensemble de l&apos;atelier
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="text-xs text-gray-600 dark:text-gray-400">
          <p>Le tableau de bord sera affiché ici.</p>
        </div>
      </div>
    </div>
  );
}
