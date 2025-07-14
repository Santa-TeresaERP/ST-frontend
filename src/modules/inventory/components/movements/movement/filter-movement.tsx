/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useFetchProducts } from '@/modules/inventory/hook/useProducts';
import { useFetchResources } from '@/modules/inventory/hook/useResources';

interface FilterMovementProps {
  selectedType: 'producto' | 'recurso';
  onFilter: (filters: any) => void;
  onCreate?: () => void;
}

const FilterMovement: React.FC<FilterMovementProps> = ({ selectedType, onFilter }) => {
  const { data: products = [] } = useFetchProducts();
  const { data: resources = [] } = useFetchResources();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilter((prevFilters: any) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm w-full">
      <div className="flex flex-wrap items-end gap-3">
        {/* Buscador */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Filtros específicos */}
        {selectedType === 'producto' && (
          <>
            <div className="min-w-[180px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Producto</label>
              <select
                name="product_id"
                onChange={handleFilterChange}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                <option value="">Todos</option>
                {products.map((product: any) => (
                  <option key={product.id} value={product.id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[150px]">
              <label className="block text-xs font-medium text-gray-500 mb-1">Tienda</label>
              <input
                type="text"
                name="store_id"
                onChange={handleFilterChange}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
          </>
        )}

        {selectedType === 'recurso' && (
          <div className="min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Recurso</label>
            <select
              name="resource_id"
              onChange={handleFilterChange}
              className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">Todos</option>
              {resources.map((resource: any) => (
                <option key={resource.id} value={resource.id}>{resource.name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Filtros comunes */}
        <div className="min-w-[180px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Tipo Movimiento</label>
          <select
            name="movement_type"
            onChange={handleFilterChange}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
          >
            <option value="">Todos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SALIDA">Salida</option>
          </select>
        </div>

        <div className="min-w-[150px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Desde</label>
          <input
            type="date"
            name="start_date"
            onChange={handleFilterChange}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="min-w-[150px]">
          <label className="block text-xs font-medium text-gray-500 mb-1">Hasta</label>
          <input
            type="date"
            name="end_date"
            onChange={handleFilterChange}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterMovement;