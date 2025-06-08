import React, { useState } from 'react';
import { useCreateWarehouseResource } from '@/modules/inventory/hook/useWarehouseResources';
import { useFetchWarehouses } from '@/modules/inventory/hook/useWarehouses';
import { useFetchResources } from '@/modules/inventory/hook/useResources';
import { CreateWarehouseResourcePayload } from '@/modules/inventory/types/warehouseResource';

type ModalCreateWarehousesProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (newResource: CreateWarehouseResourcePayload) => Promise<void>;
  onSuccess: () => void;
  resourceType: 'producto' | 'recurso';
};

const ModalCreateWarehouses: React.FC<ModalCreateWarehousesProps> = ({ onClose, onSuccess }) => {
  const [warehouse_id, setWarehouseId] = useState('');
  const [resource_id, setResourceId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [entry_date, setEntryDate] = useState('');

  const createResource = useCreateWarehouseResource();
  const { data: warehouses, isLoading: isLoadingWarehouses } = useFetchWarehouses();
  const { data: resources, isLoading: isLoadingResources } = useFetchResources();

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
        onSuccess();
        onClose();
      },
      onError: (error) => {
        console.error('Error al crear el recurso:', error);
        alert('Hubo un error al crear el recurso.');
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <h2 className="text-2xl font-bold text-white">Agregar Recurso a Almacén</h2>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Almacén</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={warehouse_id}
              onChange={(e) => setWarehouseId(e.target.value)}
              disabled={isLoadingWarehouses}
            >
              <option value="">Seleccione un almacén</option>
              {warehouses?.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Recurso</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={resource_id}
              onChange={(e) => setResourceId(e.target.value)}
              disabled={isLoadingResources}
            >
              <option value="">Seleccione un recurso</option>
              {resources?.map((resource) => (
                <option key={resource.id} value={resource.id}>
                  {resource.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Cantidad</label>
            <input
              type="number"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : '')}
              placeholder="Ingrese la cantidad"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Fecha de Entrada</label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={entry_date}
              onChange={(e) => setEntryDate(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {createResource.status === 'pending' ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando...
              </span>
            ) : (
              'Crear Recurso'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateWarehouses;