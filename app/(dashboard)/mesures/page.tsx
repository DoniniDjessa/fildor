export default function MesuresPage() {
  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-[30px] shadow-lg p-6 border border-white/20 dark:border-white/10">
      <div className="mb-4">
        <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-1">
          Mesures
        </h1>
        <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
          Gérer les mesures des clients
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="text-center py-12">
          <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
            La gestion des mesures sera affichée ici.
          </p>
        </div>
      </div>
    </div>
  );
}

