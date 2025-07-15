import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { useDeleteWarehouse } from '../../../hook/useWarehouses';
import { toast } from 'react-toastify';

interface ModalDeleteWarehouseProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  warehouseId?: string; // ID del almacén a eliminar
  warehouseName?: string; // opcional, para mostrar el nombre del almacén a eliminar
}

const ModalDeleteWarehouse: React.FC<ModalDeleteWarehouseProps> = ({
  isOpen,
  onClose,
  onConfirm,
  warehouseId,
  warehouseName,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteWarehouse = useDeleteWarehouse();

  if (!isOpen) return null;

const handleDelete = async () => {
  console.log('warehouseId:', warehouseId); // ✅ Debug
  console.log('selectedWarehouse:', warehouseId); // ✅ Debug
  
  if (!warehouseId) {
    toast.error('No se pudo identificar el almacén a eliminar');
    return;
  }

  setIsDeleting(true);
  try {
    console.log('Intentando eliminar warehouse:', warehouseId); // ✅ Debug
    await deleteWarehouse.mutateAsync(warehouseId);
    toast.success('Almacén eliminado correctamente');
    onConfirm();
    onClose();
  } catch (error) {
    console.error('Error al eliminar almacén:', error);
    toast.error('Error al eliminar el almacén');
  } finally {
    setIsDeleting(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 md:px-8 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6 flex flex-col items-center">
          <div className="bg-red-200 rounded-full p-4 mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          Eliminar Almacén
        </h2>
        <p className="text-center text-gray-600 mb-8">
          ¿Estás seguro de que deseas eliminar <strong>{warehouseName || 'este almacén'}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-center space-x-8">
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-800 text-white px-8 py-3 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <Trash2 size={20} />
            <span>{isDeleting ? 'Eliminando...' : 'Eliminar'}</span>
          </button>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg shadow-md hover:bg-gray-400 hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <X size={20} />
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteWarehouse;