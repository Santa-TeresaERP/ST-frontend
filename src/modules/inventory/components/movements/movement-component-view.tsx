/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { PlusCircle, Package, Users, Edit } from 'lucide-react';
import { useFetchMovements } from '@/modules/inventory/hook/useMovementProduct';
import CreateMovementProduct from './movement/product/create-movement-product';
import EditMovementProduct from './movement/product/edit-movement-product';
import { WarehouseMovementProductAttributes } from '../../types/movementProduct';

import CreateMovementResource from './movement/resource/create-movement-resource';
import EditMovementResource from './movement/resource/edit-movement-resource';
import { useFetchWarehouseMovementResources } from '@/modules/inventory/hook/useMovementResource';
import { WarehouseMovementResource } from '@/modules/inventory/types/movementResource';

import { useFetchWarehouses } from '@/modules/inventory/hook/useWarehouses';
import { useFetchResources } from '@/modules/inventory/hook/useResources';
import { useFetchProducts } from '@/modules/inventory/hook/useProducts';
import { useFetchStores } from '@/modules/sales/hooks/useStore';

import FilterMovement from './movement/filter-movement';
import ToggleMovementStatus from './movement/toggle-movement-status';

// 🔥 IMPORTAR SISTEMA DE PERMISOS OPTIMIZADO
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

const MovementComponentView: React.FC = () => {
  // Se inicializa el estado de los filtros con las fechas de los últimos 3 días
  const getInitialFilters = () => {
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 2);

    return {
      start_date: threeDaysAgo.toISOString().split('T')[0],
      end_date: today.toISOString().split('T')[0],
    };
  };

  const [filters, setFilters] = useState<any>(getInitialFilters);

  // Productos
  const { data: movements = [], isLoading: loading, error, refetch: fetchMovements } = useFetchMovements(filters);
  const [editing, setEditing] = useState<WarehouseMovementProductAttributes | null>(null);

  const {
    data: resourceMovements = [],
    isLoading: loadingResource,
    refetch: fetchResourceMovements,
  } = useFetchWarehouseMovementResources(filters);
  const [editingResource, setEditingResource] = useState<WarehouseMovementResource | null>(null);

  const { data: warehouses = [] } = useFetchWarehouses();
  const { data: resources = [] } = useFetchResources();
  const { data: products = [] } = useFetchProducts();
  const { data: storesData } = useFetchStores();
  const stores = Array.isArray(storesData?.stores) ? storesData.stores : [];

  // 🔥 USAR HOOK OPTIMIZADO DE PERMISOS - UNA SOLA LLAMADA
  const { canCreate, canEdit, canDelete, isAdmin } = useModulePermissions(MODULE_NAMES.INVENTORY);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedType, setSelectedType] = useState<'producto' | 'recurso'>('producto');

  // Asegura que los datos se carguen con los filtros iniciales
  useEffect(() => {
    fetchMovements();
    fetchResourceMovements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilter = (newFilters: any) => {
    setFilters(newFilters);
  };
  const getWarehouseName = (id: string) => warehouses.find((w: any) => w.id === id)?.name || id;
  const getResourceName = (id: string) => resources.find((r: any) => r.id === id)?.name || id;
  const getProductName = (id: string) => products.find((p: any) => p.id === id)?.name || id;
  const getStoreName = (id: string | null | undefined) => {
    if (!id) return '';
    const store = stores.find((s: any) => String(s.id) === String(id));
    return store ? (store.store_name || store.id) : id;
  };

  // Filtrar movimientos por producto, almacén o tienda
  const filteredMovements = movements.filter(
    (mov) =>
      (filters.product_id ? mov.product_id === filters.product_id : true) &&
      (filters.store_id ? mov.store_id?.toLowerCase().includes(filters.store_id.toLowerCase()) : true) &&
      (filters.movement_type ? mov.movement_type === filters.movement_type : true) &&
      (filters.start_date ? new Date(mov.movement_date).toISOString().split('T')[0] >= filters.start_date : true) &&
      (filters.end_date ? new Date(mov.movement_date).toISOString().split('T')[0] <= filters.end_date : true) &&
      (searchTerm
        ? getProductName(mov.product_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
          getWarehouseName(mov.warehouse_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
          getStoreName(mov.store_id).toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  // Filtrar movimientos de recursos
  const filteredResourceMovements = resourceMovements.filter(
    (mov) =>
      (filters.resource_id ? mov.resource_id === filters.resource_id : true) &&
      (filters.movement_type ? mov.movement_type === filters.movement_type : true) &&
      (filters.start_date ? new Date(mov.movement_date).toISOString().split('T')[0] >= filters.start_date : true) &&
      (filters.end_date ? new Date(mov.movement_date).toISOString().split('T')[0] <= filters.end_date : true) &&
      (searchTerm
        ? getResourceName(mov.resource_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
          getWarehouseName(mov.warehouse_id).toLowerCase().includes(searchTerm.toLowerCase())
        : true)
  );

  return (
    <div className="p-6 space-y-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-semibold text-red-700">
          Movimientos de {selectedType === 'producto' ? 'Productos' : 'Recursos'}
        </h2>
      </div>

      {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Permisos:</strong> 
            Módulo: {MODULE_NAMES.INVENTORY} | 
            Crear: {canCreate ? '✅' : '❌'} | 
            Editar: {canEdit ? '✅' : '❌'} | 
            Eliminar: {canDelete ? '✅' : '❌'} |
            Admin: {isAdmin ? '✅' : '❌'}
          </p>
        </div>
      )}

      {/* Acciones y Filtro */}
      <div className="flex flex-wrap gap-2 sm:justify-center md:justify-end sm:flex-nowrap">
        {/* 🔥 BOTÓN DE CREAR - SOLO SI TIENE PERMISOS */}
        {(canCreate || isAdmin) && (
          <button
            onClick={() => setShowCreate(true)}
            className={`w-full sm:w-auto px-4 py-2 rounded-full font-semibold flex items-center gap-2 ${
              selectedType === 'producto' ? 'bg-red-700 text-white' : 'bg-orange-500 text-white'
            }`}
          >
            <PlusCircle size={18} /> Crear {selectedType === 'producto' ? 'Producto' : 'Recurso'}
          </button>
        )}
        
        <button
          onClick={() => setSelectedType('producto')}
          className={`w-1/2 sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
            selectedType === 'producto' ? 'bg-red-700 text-white' : 'bg-white text-red-700 border border-red-700'
          }`}
        >
          <Package size={18} /> Producto
        </button>
        <button
          onClick={() => setSelectedType('recurso')}
          className={`w-1/2 sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-full font-semibold transition-colors duration-300 ${
            selectedType === 'recurso' ? 'bg-orange-500 text-white' : 'bg-white text-orange-500 border border-orange-500'
          }`}
        >
          <Users size={18} /> Recurso
        </button>
      </div>

      <FilterMovement
        selectedType={selectedType}
        filters={filters}
        onFilter={handleFilter}
        onSearchChange={setSearchTerm}
        searchTerm={searchTerm}
        products={products}
        stores={stores}
        resources={resources} 
      />

      {/* Display active filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(filters)
          .filter(([, v]) => !!v)
          .map(([k, v]) => (
            <div key={k} className="bg-gray-200 rounded-full px-3 py-1 text-sm flex items-center gap-2">
              <span className="font-semibold">{k.replace('_', ' ')}:</span>
              <span>{String(v)}</span>
            </div>
          ))}
      </div>

      {/* Tabla de movimientos */}
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        {/* Producto */}
        {showCreate && selectedType === 'producto' && (
          <CreateMovementProduct
            onCreated={() => {
              setShowCreate(false);
              fetchMovements();
            }}
            onClose={() => setShowCreate(false)}
          />
        )}
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
        {selectedType === 'producto' && (
          <>
            {loading && <p>Cargando movimientos...</p>}
            {error && <p className="text-red-500">{error.message}</p>}
            {!loading && filteredMovements.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm
                  ? 'No se encontraron movimientos que coincidan con la búsqueda'
                  : 'No hay movimientos registrados.'}
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-2">Almacén</th>
                    <th className="px-4 py-2">Tienda</th>
                    <th className="px-4 py-2">Producto</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2">Observaciones</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMovements.map((mov, idx) => (
                    <tr key={mov.id || `mov-${idx}`} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-center">{getWarehouseName(mov.warehouse_id)}</td>
                      <td className="px-4 py-2 text-center">{getStoreName(mov.store_id)}</td>
                      <td className="px-4 py-2 text-center">{getProductName(mov.product_id)}</td>
                      <td className="px-4 py-2 text-center capitalize">{mov.movement_type}</td>
                      <td className="px-4 py-2 text-center">{mov.quantity}</td>
                      <td className="px-4 py-2 text-center">
                        {new Date(mov.movement_date).toISOString().split('T')[0]}
                      </td>
                      <td className="px-4 py-2 text-center">{mov.observations || '-'}</td>
                      <td className="px-4 py-2 text-center">
                        {mov.status ? (
                          <span className="text-green-600 font-semibold">Activo</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Inactivo</span>
                        )}
                      </td>
                      <td className="px-4 py-2 flex justify-center space-x-2">
                        {/* 🔥 BOTÓN DE EDITAR - SOLO SI TIENE PERMISOS DE EDITAR */}
                        {(canEdit || isAdmin) && (
                          <button
                            onClick={() => setEditing(mov)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        
                        {/* 🔥 BOTÓN DE TOGGLE STATUS - SOLO SI TIENE PERMISOS DE ELIMINAR */}
                        {(canDelete || isAdmin) && (
                          <ToggleMovementStatus
                            id={mov.id}
                            status={mov.status}
                            onToggled={fetchMovements}
                            type="producto"
                          />
                        )}
                        
                        {/* 🔥 MENSAJE CUANDO NO HAY PERMISOS */}
                        {!canEdit && !canDelete && !isAdmin && (
                          <span className="text-gray-400 text-sm">Sin permisos</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {/* Recurso */}
        {showCreate && selectedType === 'recurso' && (
          <CreateMovementResource
            onCreated={() => {
              setShowCreate(false);
              fetchResourceMovements();
            }}
            onClose={() => setShowCreate(false)}
          />
        )}
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
        {selectedType === 'recurso' && (
          <>
            {loadingResource && <p>Cargando movimientos de recursos...</p>}
            {!loadingResource && filteredResourceMovements.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                {searchTerm
                  ? 'No se encontraron movimientos que coincidan con la búsqueda'
                  : 'No hay movimientos de recursos registrados.'}
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-2">Recurso</th>
                    <th className="px-4 py-2">Almacén</th>
                    <th className="px-4 py-2">Tipo</th>
                    <th className="px-4 py-2">Cantidad</th>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2">Observaciones</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResourceMovements.map((mov, idx) => (
                    <tr key={mov.id || `res-${idx}`} className="border-t hover:bg-orange-50">
                      <td className="px-4 py-2 text-center">{getResourceName(mov.resource_id)}</td>
                      <td className="px-4 py-2 text-center">{getWarehouseName(mov.warehouse_id)}</td>
                      <td className="px-4 py-2 text-center capitalize">{mov.movement_type}</td>
                      <td className="px-4 py-2 text-center">{mov.quantity}</td>
                      <td className="px-4 py-2 text-center">
                        {new Date(mov.movement_date).toISOString().split('T')[0]}
                      </td>
                      <td className="px-4 py-2 text-center">{mov.observations || '-'}</td>
                      <td className="px-4 py-2 text-center">
                        {mov.status ? (
                          <span className="text-green-600 font-semibold">Activo</span>
                        ) : (
                          <span className="text-red-600 font-semibold">Inactivo</span>
                        )}
                      </td>
                      <td className="px-4 py-2 flex justify-center space-x-2">
                        {/* 🔥 BOTÓN DE EDITAR - SOLO SI TIENE PERMISOS DE EDITAR */}
                        {(canEdit || isAdmin) && (
                          <button
                            onClick={() => setEditingResource(mov)}
                            className="text-blue-600 hover:text-blue-800"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        
                        {/* 🔥 BOTÓN DE TOGGLE STATUS - SOLO SI TIENE PERMISOS DE ELIMINAR */}
                        {(canDelete || isAdmin) && (
                          <ToggleMovementStatus
                            id={mov.id!}
                            status={mov.status}
                            onToggled={fetchResourceMovements}
                            type="recurso"
                          />
                        )}
                        
                        {/* 🔥 MENSAJE CUANDO NO HAY PERMISOS */}
                        {!canEdit && !canDelete && !isAdmin && (
                          <span className="text-gray-400 text-sm">Sin permisos</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MovementComponentView;
