import React from 'react';
import { useStoreState } from '@/core/store/store';
import { FiShoppingBag } from 'react-icons/fi';

const SelectedStoreIndicator: React.FC = () => {
  const { selectedStore, clearSelectedStore } = useStoreState();

  if (!selectedStore) {
    return null; // No mostrar nada si no hay tienda seleccionada
  }

  return (
    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
      <div className="flex items-center gap-2">
        <FiShoppingBag className="h-4 w-4" />
        <span>Tienda activa: <strong className="text-gray-800">{selectedStore.store_name}</strong></span>
      </div>
      <button
        onClick={clearSelectedStore}
        className="text-blue-600 hover:text-blue-800 text-xs underline"
      >
        Cambiar
      </button>
    </div>
  );
};

export default SelectedStoreIndicator;
