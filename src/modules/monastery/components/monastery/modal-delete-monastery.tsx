'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  monasteryExpenseName: string;
}

const ModalDeleteMonastery: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  monasteryExpenseName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
            Confirmar Eliminación
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600"
            disabled={isPending}
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4">
          <p className="text-gray-700 mb-4">
            ¿Estás seguro de que deseas eliminar el gasto del monasterio <strong>&quot;{monasteryExpenseName}&quot;</strong>?
          </p>
          <p className="text-sm text-red-600 mb-4">
            Esta acción no se puede deshacer.
          </p>
        </div>
        
        <div className="flex justify-end items-center p-4 border-t space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Eliminando...' : 'Eliminar Gasto del Monasterio'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteMonastery;