'use client';
import React from 'react';
import { Trash2, X } from 'lucide-react';
import { FiPackage } from 'react-icons/fi';

// [CORREGIDO] Añadimos las propiedades que faltan a la interfaz
interface ModalDeleteInventoryProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;    // Para mostrar el nombre del producto a eliminar
  isPending: boolean;  // Para deshabilitar los botones mientras se elimina
}

// [CORREGIDO] Actualizamos el nombre del componente y las props
const ModalDeleteInventory: React.FC<ModalDeleteInventoryProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName, // Ahora recibimos el nombre
  isPending // Y el estado de carga
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6 flex flex-col items-center">
          <div className="bg-red-200 rounded-full p-4 mb-4">
            <FiPackage size={24} className="text-red-600" />
          </div>
          Eliminar Producto
        </h2>
        
        {/* [CORREGIDO] Hacemos el mensaje dinámico usando 'itemName' */}
        <p className="text-center text-gray-600 mb-8">
          ¿Estás seguro de que deseas eliminar el registro de <strong>{itemName}</strong> del inventario? Esta acción no se puede deshacer.
        </p>
        
        <div className="flex justify-center space-x-8">
          {/* [CORREGIDO] Usamos 'isPending' para deshabilitar los botones */}
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="bg-red-800 text-white px-8 py-3 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:hover:scale-100"
          >
            <Trash2 size={20} />
            {/* [CORREGIDO] Cambiamos el texto del botón cuando está cargando */}
            <span>{isPending ? 'Eliminando...' : 'Eliminar'}</span>
          </button>
          <button
            onClick={onClose}
            disabled={isPending}
            className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg shadow-md hover:bg-gray-400 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <X size={20} />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteInventory;