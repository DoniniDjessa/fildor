'use client';

import { useState } from 'react';
import { Edit, Trash2, Package } from 'lucide-react';
import { deleteMaterialType } from '@/lib/actions/material-types.actions';
import MaterialTypeForm from './MaterialTypeForm';
import DeleteConfirmModal from '../common/DeleteConfirmModal';

interface MaterialType {
  id: string;
  name: string;
  unit: string;
  category: string;
  default_threshold?: number;
  average_price_per_unit?: number;
}

interface MaterialTypesListProps {
  initialMaterialTypes: MaterialType[];
}

export default function MaterialTypesList({ initialMaterialTypes }: MaterialTypesListProps) {
  const [materialTypes, setMaterialTypes] = useState<MaterialType[]>(initialMaterialTypes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMaterialType, setEditingMaterialType] = useState<MaterialType | null>(null);
  const [deletingMaterialType, setDeletingMaterialType] = useState<MaterialType | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deletingMaterialType) return;

    setLoading(true);
    try {
      await deleteMaterialType(deletingMaterialType.id);
      setMaterialTypes(materialTypes.filter((m) => m.id !== deletingMaterialType.id));
      setDeletingMaterialType(null);
    } catch (error) {
      console.error('Error deleting material type:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = () => {
    setIsFormOpen(false);
    window.location.reload();
  };

  const handleEdit = (materialType: MaterialType) => {
    setEditingMaterialType(materialType);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingMaterialType(null);
  };

  const categories = ['Tissu', 'Doublure', 'Mercerie', 'Pagne'];
  const groupedByCategory = categories.map((cat) => ({
    category: cat,
    items: materialTypes.filter((m) => m.category === cat),
  }));

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100">
          Matièrethèque
        </h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] text-white rounded-xl text-xs font-semibold hover:shadow-lg transition-all flex items-center gap-2 font-poppins"
        >
          <Package size={14} />
          Créer nouvelle matière
        </button>
      </div>

      {materialTypes.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="font-poppins text-sm text-gray-500 dark:text-gray-400 mb-4">
            Aucune matière enregistrée
          </p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-[#6C5DD3] to-[#8B7AE8] text-white font-poppins font-semibold rounded-[30px] shadow-lg hover:shadow-xl transition-all"
          >
            Créer votre première matière
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {groupedByCategory.map(({ category, items }) => (
            <div key={category}>
              <h3 className="font-title text-xs font-bold text-[#11142D] dark:text-gray-100 mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((materialType) => (
                  <div
                    key={materialType.id}
                    className="bg-white dark:bg-[#1A1D29] rounded-[20px] p-4 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-title text-sm font-bold text-[#11142D] dark:text-gray-100 mb-1">
                          {materialType.name}
                        </h4>
                        <p className="font-poppins text-[10px] text-gray-400 dark:text-gray-500">
                          Unité: {materialType.unit}
                        </p>
                        {materialType.default_threshold && (
                          <p className="font-poppins text-[10px] text-gray-400 dark:text-gray-500">
                            Seuil: {materialType.default_threshold} {materialType.unit}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleEdit(materialType)}
                          className="p-1.5 text-[#6C5DD3] hover:bg-[#6C5DD3]/10 rounded-lg transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeletingMaterialType(materialType)}
                          className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <MaterialTypeForm
        materialType={editingMaterialType}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleCreateSuccess}
      />

      {deletingMaterialType && (
        <DeleteConfirmModal
          title="Supprimer la matière"
          message={`Êtes-vous sûr de vouloir supprimer "${deletingMaterialType.name}" ?`}
          onConfirm={handleDelete}
          onCancel={() => setDeletingMaterialType(null)}
          loading={loading}
        />
      )}
    </>
  );
}

