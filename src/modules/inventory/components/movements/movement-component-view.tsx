import React, { useState } from 'react';
import { PlusCircle, Package, Users, Filter } from 'lucide-react';
import { useFetchMovements } from '@/modules/inventory/hook/useMovementProduct';
import CreateMovementProduct from './movement/product/create-movement-product';
import EditMovementProduct from './movement/product/edit-movement-product';
import DeleteMovementProduct from './movement/product/delete-movement-product';
import { WarehouseMovementProductAttributes } from '../../types/movementProduct';
import { Repeat } from 'lucide-react';

// Importa los componentes de recurso
import CreateMovementResource from './movement/resource/create-movement-resource';
import EditMovementResource from './movement/resource/edit-movement-resource';
import DeleteMovementResource from './movement/resource/delete-movement-resource';
import { useFetchResourceMovements } from '@/modules/inventory/hook/useMovementResource';
import { WarehouseMovementResourceAttributes } from '@/modules/inventory/types/movementResource';

const MovementComponentView: React.FC = () => {
  // Productos
  const { data: movements = [], isLoading: loading, error, refetch: fetchMovements } = useFetchMovements();
  const [editing, setEditing] = useState<WarehouseMovementProductAttributes | null>(null);

  // Recursos
  const { data: resourceMovements = [], isLoading: loadingResource, error: errorResource, refetch: fetchResourceMovements } = useFetchResourceMovements();
  const [editingResource, setEditingResource] = useState<WarehouseMovementResourceAttributes | null>(null);

  // General
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedType, setSelectedType] = useState<'producto' | 'recurso'>('producto');

  // Filtrar movimientos por producto, almacén o tienda
  const filteredMovements = movements.filter(
    (mov) =>
      mov.product_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.warehouse_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.store_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar movimientos de recursos
  const filteredResourceMovements = resourceMovements.filter(
    (mov) =>
      mov.resource_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mov.warehouse_id?.toLowerCase().includes(searchTerm.toLowerCase())
      // Puedes agregar más campos si lo deseas
  );

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-gray-700">
          Movimientos de {selectedType === 'producto' ? 'Productos' : 'Recursos'}
        </h2>
        <div className="flex gap-2">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
              selectedType === 'producto'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 border border-gray-700'
            }`}
            onClick={() => setSelectedType('producto')}
          >
            <Package size={18} /> Producto
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
              selectedType === 'recurso'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-orange-500 border border-orange-500'
            }`}
            onClick={() => setSelectedType('recurso')}
          >
            <Users size={18} /> Recurso
          </button>
        </div>
      </div>

        {/* Subheader */}
      <div className="flex items-center space-x-2 text-gray-600">
        <Repeat size={24} className="text-gray-700" />
        <span className="text-lg font-medium">Gestión de movimientos del almacén</span>
      </div>

      {/* Acciones y Filtro */}
      <div className="flex justify-end items-center space-x-6">
        
        <div className="flex items-center space-x-3 select-none">
          <button
            onClick={() => setShowCreate(true)}
            className={`px-4 py-2 rounded-full font-semibold transition-colors duration-300 flex items-center gap-2 ${
              selectedType === 'producto'
                ? 'bg-gray-600 text-white hover:bg-gray-800'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            <PlusCircle size={18} /> Crear {selectedType === 'producto' ? 'Producto' : 'Recurso'}
          </button>
        </div>
        <div className="relative inline-flex items-center shadow-sm rounded-xl bg-white">
          <Filter className="absolute left-4 text-gray-700 pointer-events-none" size={20} />
          <input
            type="text"
            className="pl-11 pr-6 py-3 rounded-xl border border-gray-700 text-gray-700 text-base
                       focus:outline-none focus:ring-2 focus:ring-gray-700 focus:border-transparent
                       hover:bg-gray-200 transition duration-300 min-w-[200px]"
            placeholder={`Buscar por ${selectedType === 'producto' ? 'producto, almacén o tienda' : 'recurso, almacén o tienda'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla de movimientos */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        {/* Crear movimiento de producto */}
        {showCreate && selectedType === 'producto' && (
          <CreateMovementProduct
            onCreated={() => {
              setShowCreate(false);
              fetchMovements();
            }}
            onClose={() => setShowCreate(false)}
          />
        )}
        {/* Crear movimiento de recurso */}
        {showCreate && selectedType === 'recurso' && (
          <CreateMovementResource
            onCreated={() => {
              setShowCreate(false);
              fetchResourceMovements();
            }}
            onClose={() => setShowCreate(false)}
          />
        )}
        {/* Editar movimiento de producto */}
        {editing && selectedType === 'producto' && (
          <EditMovementProduct
            movement={editing}
            onUpdated={() => {
              setEditing(null);
              fetchMovements();
            }}
            onCancel={() => setEditing(null)}
          />
        )}
        {/* Editar movimiento de recurso */}
        {editingResource && selectedType === 'recurso' && (
          <EditMovementResource
            movement={editingResource}
            onUpdated={() => {
              setEditingResource(null);
              fetchResourceMovements();
            }}
            onCancel={() => setEditingResource(null)}
          />
        )}
        {/* Tabla de productos */}
        {selectedType === 'producto' && (
          <>
            {loading && <p>Cargando movimientos...</p>}
            {error && <p className="text-red-500">{error.message}</p>}
            <table className="min-w-full text-sm">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-center">ID</th>
                  <th className="px-4 py-2 text-center">Almacén</th>
                  <th className="px-4 py-2 text-center">Tienda</th>
                  <th className="px-4 py-2 text-center">Producto</th>
                  <th className="px-4 py-2 text-center">Tipo</th>
                  <th className="px-4 py-2 text-center">Cantidad</th>
                  <th className="px-4 py-2 text-center">Fecha</th>
                  <th className="px-4 py-2 text-center">Observaciones</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-2 text-center text-gray-500">
                      {searchTerm ? 'No se encontraron movimientos que coincidan con la búsqueda' : 'No hay movimientos registrados.'}
                    </td>
                  </tr>
                ) : (
                  filteredMovements.map((mov) => (
                    <tr key={mov.movement_id} className="hover:bg-gray-50 border-t">
                      <td className="px-4 py-2 text-center">{mov.movement_id}</td>
                      <td className="px-4 py-2 text-center">{mov.warehouse_id}</td>
                      <td className="px-4 py-2 text-center">{mov.store_id}</td>
                      <td className="px-4 py-2 text-center">{mov.product_id}</td>
                      <td className="px-4 py-2 text-center capitalize">{mov.movement_type}</td>
                      <td className="px-4 py-2 text-center">{mov.quantity}</td>
                      <td className="px-4 py-2 text-center">{new Date(mov.movement_date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-center">{mov.observations || '-'}</td>
                      <td className="px-4 py-2 flex justify-center space-x-2">
                        <button
                          onClick={() => setEditing(mov)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          title="Editar"
                        >
                          Editar
                        </button>
                        <DeleteMovementProduct id={mov.movement_id} onDeleted={fetchMovements} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
        {/* Tabla de recursos */}
        {selectedType === 'recurso' && (
          <>
            {loadingResource && <p>Cargando movimientos de recursos...</p>}
            {errorResource && <p className="text-red-500">{errorResource.message}</p>}
            <table className="min-w-full text-sm">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="px-4 py-2 text-center">ID</th>
                  <th className="px-4 py-2 text-center">Recurso</th>
                  <th className="px-4 py-2 text-center">Almacén</th>
                  <th className="px-4 py-2 text-center">Tipo</th>
                  <th className="px-4 py-2 text-center">Cantidad</th>
                  <th className="px-4 py-2 text-center">Fecha</th>
                  <th className="px-4 py-2 text-center">Observaciones</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredResourceMovements.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-2 text-center text-gray-500">
                      {searchTerm ? 'No se encontraron movimientos que coincidan con la búsqueda' : 'No hay movimientos de recursos registrados.'}
                    </td>
                  </tr>
                ) : (
                  filteredResourceMovements.map((mov) => (
                    <tr key={mov.movement_id} className="hover:bg-orange-50 border-t">
                      <td className="px-4 py-2 text-center">{mov.movement_id}</td>
                      <td className="px-4 py-2 text-center">{mov.resource_id}</td>
                      <td className="px-4 py-2 text-center">{mov.warehouse_id}</td>
                      <td className="px-4 py-2 text-center">{mov.type}</td>
                      <td className="px-4 py-2 text-center">{mov.quantity}</td>
                      <td className="px-4 py-2 text-center">{new Date(mov.movement_date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-center">{mov.observations || '-'}</td>
                      <td className="px-4 py-2 flex justify-center space-x-2">
                        <button
                          onClick={() => setEditingResource(mov)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                          title="Editar"
                        >
                          Editar
                        </button>
                        <DeleteMovementResource id={mov.movement_id} onDeleted={fetchResourceMovements} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default MovementComponentView;