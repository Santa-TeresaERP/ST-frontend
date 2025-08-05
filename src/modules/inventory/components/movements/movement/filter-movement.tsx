import { X, Filter } from 'lucide-react';
import React from 'react';

interface FilterMovementProps {
  selectedType: 'producto' | 'recurso';
  onFilter: (filters: any) => void;
  onSearchChange: (term: string) => void;
  filters: any;
  searchTerm: string;
  products: any[];
  stores: any[];
  resources: any[];
}

const FilterMovement: React.FC<FilterMovementProps> = ({
  selectedType,
  onFilter,
  onSearchChange,
  filters,
  searchTerm,
  products,
  stores,
  resources = [],
}) => {
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    onFilter({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearAllFilters = () => {
    onFilter({
      product_id: '',
      resource_id: '',
      store_id: '',
      movement_type: '',
      start_date: '',
      end_date: '',
    });
    onSearchChange('');
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md overflow-x-auto">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Filter className="text-gray-600" size={20} />
          <h3 className="text-lg font-medium text-gray-800">Filtros</h3>
        </div>
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-100"
        >
          <X size={16} /> Limpiar Filtros
        </button>
      </div>

      {/* Grid de filtros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Search — ahora más ancho */}
        <input
          type="text"
          name="search"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="col-span-1 sm:col-span-2 md:col-span-2 w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Producto */}
        {selectedType === 'producto' && (
          <select
            name="product_id"
            value={filters.product_id || ''}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Todos Productos</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {/* Recurso */}
        {selectedType === 'recurso' && (
        <select
          name="resource_id"
          value={filters.resource_id || ''}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="">Todos Recursos</option>
          {Array.isArray(resources) &&
            resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name ?? `Recurso ${r.id}`}
              </option>
            ))}
        </select>
      )}


        {/* Tipo de movimiento */}
        <select
          name="movement_type"
          value={filters.movement_type || ''}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Todos Tipos</option>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>

        {/* Tienda */}
        <select
          name="store_id"
          value={filters.store_id || ''}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="">Todas Tiendas</option>
          {stores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.store_name ?? s.name ?? `Tienda ${s.id}`}
            </option>
          ))}
        </select>

        {/* Desde */}
        <input
          type="date"
          name="start_date"
          value={filters.start_date || ''}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />

        {/* Hasta */}
        <input
          type="date"
          name="end_date"
          value={filters.end_date || ''}
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </div>
  );
};

export default FilterMovement;
