import React, { useState } from 'react';
import { useCreateWarehouseResource } from '@/modules/inventory/hook/useWarehouseResources';
import { CreateWarehouseResourcePayload } from '@/modules/inventory/types/warehouseResource';

type ModalCreateWarehousesProps = {
  open: boolean; 
  onClose: () => void;
  onCreate: (newResource: CreateWarehouseResourcePayload) => Promise<void>; // Callback para recargar la lista después de crear
  onSuccess: () => void; // Callback para manejar el éxito
  resourceType: 'producto' | 'recurso';
};

const ModalCreateWarehouses: React.FC<ModalCreateWarehousesProps> = ({ onClose, onSuccess }) => {
  const [warehouse_id, setWarehouseId] = useState('');
  const [resource_id, setResourceId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [entry_date, setEntryDate] = useState('');

  const createResource = useCreateWarehouseResource();

  const handleCreate = async () => {
    if (!warehouse_id || !resource_id || !quantity || !entry_date) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const payload: CreateWarehouseResourcePayload = {
      warehouse_id,
      resource_id,
      quantity: Number(quantity),
      entry_date: new Date(entry_date),
    };

    createResource.mutate(payload, {
      onSuccess: () => {
        alert('Recurso creado exitosamente.');
        onSuccess(); // Recargar la lista
        onClose();
      },
      onError: (error) => {
        console.error('Error al crear el recurso:', error);
        alert('Hubo un error al crear el recurso.');
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Crear Nuevo Recurso</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">ID Almacén</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={warehouse_id}
              onChange={(e) => setWarehouseId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">ID Recurso</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={resource_id}
              onChange={(e) => setResourceId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Cantidad</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Fecha de Entrada</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={entry_date}
              onChange={(e) => setEntryDate(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button onClick={onClose} className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded">
            Cancelar
          </button>
          <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateWarehouses;