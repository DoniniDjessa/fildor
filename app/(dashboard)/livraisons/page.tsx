export default function LivraisonsPage() {
  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-[#1A1D29]/80 backdrop-blur-lg rounded-[30px] shadow-lg p-6 border border-white/20 dark:border-white/10">
      <div className="mb-4">
        <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-1">
          Livraisons
        </h1>
        <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
          Gérer les livraisons de l&apos;atelier
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="text-center py-12">
          <p className="font-poppins text-sm text-[#808191] dark:text-gray-400">
            La gestion des livraisons sera affichée ici.
          </p>
        </div>
      </div>
    </div>
  );
}

