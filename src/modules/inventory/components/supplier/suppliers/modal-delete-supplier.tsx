import React from 'react';
import { Trash2, X } from 'lucide-react';

interface ModalDeleteSupplierProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  supplierName?: string; 
}

const ModalDeleteSupplier: React.FC<ModalDeleteSupplierProps> = ({
  isOpen,
  onClose,
  onConfirm,
  supplierName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6 flex flex-col items-center">
          {/* Icono dentro de un círculo rojo claro */}
          <div className="bg-red-200 rounded-full p-4 mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          Eliminar Proveedor
        </h2>
        <p className="text-center text-gray-600 mb-8">
          ¿Estás seguro de que deseas eliminar <strong>{supplierName || 'este proveedor'}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-center space-x-8">
          <button
            onClick={onConfirm}
            className="bg-red-800 text-white px-8 py-3 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <Trash2 size={20} />
            <span>Eliminar</span>
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg shadow-md hover:bg-gray-400 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <X size={20} />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteSupplier;
