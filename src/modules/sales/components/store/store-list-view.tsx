import React, { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { FiPlus } from 'react-icons/fi';
import { useFetchStores, useDeleteStore } from '../../hooks/useStore';
import { StoreAttributes } from '../../types/store.d';
import ModalCreateStore from './modal-create-store';
import ModalEditStore from './modal-edit-store';

interface StoreListViewProps {
  onStoreSelect?: (store: StoreAttributes | null) => void;
  selectedStore?: StoreAttributes | null;
}

const StoreListView: React.FC<StoreListViewProps> = ({ 
  onStoreSelect, 
  selectedStore 
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<StoreAttributes | null>(null);

  const { data: storesData, isLoading, error } = useFetchStores(1, 10);
  const deleteStoreMutation = useDeleteStore();

  const handleDeleteStore = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tienda?')) {
      try {
        await deleteStoreMutation.mutateAsync(id);
        // Si la tienda eliminada era la seleccionada, limpiar la selección
        if (selectedStore?.id === id) {
          onStoreSelect?.(null);
        }
      } catch (error) {
        console.error('Error al eliminar tienda:', error);
      }
    }
  };

  const handleEditStore = (store: StoreAttributes) => {
    setEditingStore(store);
    setIsEditModalOpen(true);
  };

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const storeId = e.target.value;
    if (storeId === '') {
      onStoreSelect?.(null);
    } else {
      const store = allStores.find(s => s.id === storeId);
      if (store) {
        onStoreSelect?.(store);
      }
    }
  };

  const allStores = storesData?.stores || [];

  if (isLoading) return <div className="p-4">Cargando tiendas...</div>;
  if (error) return <div className="p-4 text-red-500">Error al cargar las tiendas</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Seleccionar Tienda</h2>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus size={16} /> Nueva Tienda
        </Button>
      </div>
      
      <div>
        <select
          id="store-select"
          value={selectedStore?.id || ''}
          onChange={handleStoreChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
        >
          <option value="">-- Seleccione una tienda --</option>
          {allStores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.store_name}
            </option>
          ))}
        </select>
      </div>

      {allStores.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No hay tiendas registradas
        </div>
      )}

      {/* Modales */}
      <ModalCreateStore
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      <ModalEditStore
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStore(null);
        }}
        store={editingStore}
      />
    </div>
  );
};

export default StoreListView;
