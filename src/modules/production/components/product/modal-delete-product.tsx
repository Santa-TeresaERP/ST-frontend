import { Trash2, X } from 'lucide-react';
import React from 'react';

interface ModalDeleteProductoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModalDeleteProducto: React.FC<ModalDeleteProductoProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all duration-300 scale-95 hover:scale-100">
        <div className="text-center">
          {/* Icono de advertencia */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-8 w-8 text-red-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Eliminar Producto?</h2>
          <p className="text-gray-600 mb-6">
            Esta acción eliminará permanentemente el producto y no podrá recuperarse.
          </p>
        </div>

        <div className="flex justify-center space-x-6">
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors duration-200"
          >
            <X size={18} />
            <span>Cancelar</span>
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Trash2 size={18} />
            <span>Eliminar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteProducto;