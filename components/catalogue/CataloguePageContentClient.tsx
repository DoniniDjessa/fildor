'use client';

import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import ModelCard from './ModelCard';
import ModelForm from './ModelForm';

const FILTER_CHIPS = [
  { id: 'all', label: 'Tous', emoji: '📋' },
  { id: 'femme', label: 'Femme', emoji: '👩' },
  { id: 'homme', label: 'Homme', emoji: '👨' },
  { id: 'enfant', label: 'Enfant', emoji: '👶' },
  { id: 'mariage', label: 'Mariage', emoji: '💍' },
  { id: 'corporate', label: 'Corporate', emoji: '👔' },
];

interface Model {
  id: string;
  name: string;
  category: string;
  base_price: number;
  fabric_req: string;
  make_time: number;
  image_url?: string | null;
}

interface CataloguePageContentClientProps {
  initialModels: Model[];
}

export default function CataloguePageContentClient({ initialModels }: CataloguePageContentClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [models, setModels] = useState<Model[]>(initialModels);

  const filteredModels = models.filter((model) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = model.name.toLowerCase().includes(query);
    const matchesFilter = activeFilter === 'all' || model.category.toLowerCase() === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSuccess = () => {
    setIsFormOpen(false);
    setEditingModel(null);
    window.location.reload();
  };

  return (
    <>
      <div className="h-full flex flex-col gap-4">
        {/* Header */}
        <div>
          <h1 className="font-title text-lg font-bold text-[#11142D] dark:text-gray-100 mb-0.5">
            Catalogue Modèles
          </h1>
          <p className="font-poppins text-[10px] text-[#808191] dark:text-gray-400">
            Gérer votre bibliothèque de modèles
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-[#1A1D29] rounded-[30px] shadow-lg p-4 border border-white/20 dark:border-white/10">
          {/* Search Bar */}
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#808191]" />
              <input
                type="text"
                placeholder="Chercher 'Robe bustier'..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-[30px] border border-white/20 dark:border-white/10 bg-white/50 dark:bg-[#1A1D29]/50 text-[#11142D] dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#6C5DD3]/20 dark:focus:ring-[#6C5DD3]/30 transition-all font-poppins"
              />
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {FILTER_CHIPS.map((chip) => (
              <button
                key={chip.id}
                onClick={() => setActiveFilter(chip.id)}
                className={`px-4 py-2 rounded-xl text-[10px] font-semibold transition-colors whitespace-nowrap font-poppins ${
                  activeFilter === chip.id
                    ? 'bg-[#6C5DD3] text-white'
                    : 'bg-slate-50 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {chip.emoji} {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Models Grid */}
        <div className="flex-1 overflow-y-auto">
          {filteredModels.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-poppins text-sm text-gray-500 dark:text-gray-400 mb-4">
                {searchQuery ? 'Aucun modèle trouvé' : 'Aucun modèle enregistré'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setIsFormOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] text-white font-poppins font-semibold rounded-[30px] shadow-lg hover:shadow-xl transition-all"
                >
                  Créer votre premier modèle
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModels.map((model) => (
                <ModelCard
                  key={model.id}
                  model={model}
                  onEdit={() => {
                    setEditingModel(model);
                    setIsFormOpen(true);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* FAB Button */}
        <button
          onClick={() => {
            setEditingModel(null);
            setIsFormOpen(true);
          }}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] text-white rounded-full shadow-2xl hover:shadow-3xl transition-all flex items-center justify-center hover:scale-110 active:scale-95 z-40"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Model Form */}
      {isFormOpen && (
        <ModelForm
          model={editingModel}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingModel(null);
          }}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}

