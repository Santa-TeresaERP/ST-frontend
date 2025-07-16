import React from 'react';
import { Trash2, X } from 'lucide-react';
import { useDeleteWarehouseProduct } from '../../../hook/useWarehouseProducts';

interface ModalDeleteProductWarehouseProps {
  isOpen: boolean;
  onClose: () => void;
  warehouseProductId: string;
  productName?: string;
}

const ModalDeleteProductWarehouse: React.FC<ModalDeleteProductWarehouseProps> = ({
  isOpen,
  onClose,
  warehouseProductId,
  productName,
}) => {
  const { mutate, status } = useDeleteWarehouseProduct();

  const handleDelete = () => {
    mutate(warehouseProductId, {
      onSuccess: onClose,
      onError: () => alert('Error al eliminar el producto del almacén.'),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 md:px-8 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6 flex flex-col items-center">
          <div className="bg-red-200 rounded-full p-4 mb-4">
            <Trash2 size={24} className="text-red-600" />
          </div>
          Eliminar Producto
        </h2>
        <p className="text-center text-gray-600 mb-8">
          ¿Estás seguro de que deseas eliminar <strong>{productName || 'este producto'}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-center space-x-8">
          <button
            onClick={handleDelete}
            disabled={status === 'pending'}
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

export default ModalDeleteProductWarehouse;