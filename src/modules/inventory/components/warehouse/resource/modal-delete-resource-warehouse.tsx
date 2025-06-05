import React from 'react';
import { useDeleteWarehouseResource } from '@/modules/inventory/hook/useWarehouseResources';

type ModalDeleteWarehousesProps = {
  
  open: boolean;
  onClose: () => void;
  onSuccess: () => void; // Callback para recargar la lista después de eliminar
  resourceId: string;
  onDelete: () => void | Promise<void>;
};

const ModalDeleteWarehouses: React.FC<ModalDeleteWarehousesProps> = ({ onClose, onSuccess, resourceId }) => {
  const deleteResource = useDeleteWarehouseResource();

  const handleDelete = async () => {
    deleteResource.mutate(resourceId, {
      onSuccess: () => {
        alert('Recurso eliminado exitosamente.');
        onSuccess(); // Recargar la lista
        onClose();
      },
      onError: (error) => {
        console.error('Error al eliminar el recurso:', error);
        alert('Hubo un error al eliminar el recurso.');
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Eliminar Recurso</h2>
        <p className="text-gray-700 mb-6">¿Estás seguro de que deseas eliminar este recurso? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded">
            Cancelar
          </button>
          <button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteWarehouses;