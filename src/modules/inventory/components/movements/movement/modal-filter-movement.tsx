/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useFetchProducts } from '@/modules/inventory/hook/useProducts';
import { useFetchResources } from '@/modules/inventory/hook/useResources';

interface ModalFilterMovementProps {
  selectedType: 'producto' | 'recurso';
  onClose: () => void;
  onFilter: (filters: any) => void;
}

const ModalFilterMovement: React.FC<ModalFilterMovementProps> = ({ selectedType, onClose, onFilter }) => {
  const { data: products = [] } = useFetchProducts();
  const { data: resources = [] } = useFetchResources();

  const handleFilter = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const filters = Object.fromEntries(formData.entries());
    onFilter(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Filtrar Movimientos de {selectedType === 'producto' ? 'Productos' : 'Recursos'}</h2>
        <form onSubmit={handleFilter}>
          {selectedType === 'producto' && (
            <>
              <div className="mb-4">
                <label htmlFor="product_id" className="block text-sm font-medium text-gray-700">Producto</label>
                <select
                  id="product_id"
                  name="product_id"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                >
                  <option value="">Todos</option>
                  {products.map((product: any) => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="store_id" className="block text-sm font-medium text-gray-700">Tienda</label>
                <input
                  type="text"
                  id="store_id"
                  name="store_id"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                />
              </div>
            </>
          )}
          {selectedType === 'recurso' && (
            <div className="mb-4">
              <label htmlFor="resource_id" className="block text-sm font-medium text-gray-700">Recurso</label>
              <select
                id="resource_id"
                name="resource_id"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              >
                <option value="">Todos</option>
                {resources.map((resource: any) => (
                  <option key={resource.id} value={resource.id}>{resource.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="mb-4">
            <label htmlFor="movement_type" className="block text-sm font-medium text-gray-700">Tipo de Movimiento</label>
            <select
              id="movement_type"
              name="movement_type"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            >
              <option value="">Todos</option>
              <option value="purchase">Compra</option>
              <option value="sale">Venta</option>
              <option value="transfer">Transferencia</option>
              <option value="adjustment">Ajuste</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="movement_date" className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              id="movement_date"
              name="movement_date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800">Filtrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFilterMovement;