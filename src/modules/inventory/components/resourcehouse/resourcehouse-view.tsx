import React, { useState, useMemo } from 'react';
import { Edit2, Trash2, FileText, Search, Plus, AlertCircle, Filter, X, Calendar } from 'lucide-react';
import { useFetchResourcesWithBuys, useCreateBuysResource, useUpdateBuysResource, useDeleteBuysResource } from '../../hook/usebuysResource';
import { BuysResourceWithResource, CreateBuysResourcePayload, UpdateBuysResourcePayload } from '../../types/buysResource';
import ModalNuevoRecurso from './resource/modal-create-resource-resourcehouse';
import ModalEditResource from './resource/modal-edit-resource-resourcehouse';
import ModalDeleteResource from './resource/modal-delete-resource-resourcehouse';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { formatDateLocal } from '../../../../core/utils/dateUtils';

// 🔥 IMPORTAR SISTEMA DE PERMISOS OPTIMIZADO
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

const ResourcesView: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resourceToEdit, setResourceToEdit] = useState<BuysResourceWithResource | null>(null);
  const [resourceToDelete, setResourceToDelete] = useState<BuysResourceWithResource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [supplierFilter, setSupplierFilter] = useState('');

  // 🔥 USAR HOOK OPTIMIZADO DE PERMISOS - UNA SOLA LLAMADA
  const { canCreate, canEdit, canDelete, isAdmin } = useModulePermissions(MODULE_NAMES.INVENTORY);

  const { data: resources = [], isLoading, error } = useFetchResourcesWithBuys();

  const createResourceMutation = useCreateBuysResource();
  const updateResourceMutation = useUpdateBuysResource();
  const deleteResourceMutation = useDeleteBuysResource();

  const suppliersList = useMemo(() => {
    const uniqueSuppliers = new Set(
      resources.map(r => r.supplier?.suplier_name).filter(Boolean)
    );
    return Array.from(uniqueSuppliers);
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (!resources) return [];
    return resources.filter((resource: BuysResourceWithResource) => {
      const matchesSearch =
        resource.resource?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.warehouse?.name && resource.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.supplier?.suplier_name && resource.supplier.suplier_name.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesDate = true;
      if (startDate || endDate) {
        const entryDate = resource.entry_date ? new Date(resource.entry_date) : null;
        if (entryDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          const entryDateNoTime = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
          if (startDate && start.getTime() > entryDateNoTime.getTime()) matchesDate = false;
          if (endDate && end.getTime() < entryDateNoTime.getTime()) matchesDate = false;
        } else if (startDate || endDate) {
          matchesDate = false;
        }
      }

      const matchesSupplier = supplierFilter
        ? resource.supplier?.suplier_name === supplierFilter
        : true;

      return matchesSearch && matchesDate && matchesSupplier;
    });
  }, [resources, searchTerm, startDate, endDate, supplierFilter]);

  const handleEdit = (resource: BuysResourceWithResource) => {
    setResourceToEdit(resource);
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete?.id) return;
    try {
      await deleteResourceMutation.mutateAsync({
        id: resourceToDelete.id,
        status: false, // Desactivar en lugar de eliminar completamente
      });
      setResourceToDelete(null);
    } catch (err) {
      console.error('Error deleting resource:', err);
    }
  };

  const handleToggleStatus = async (r: BuysResourceWithResource) => {
    if (!r.id) return;
    try {
      await deleteResourceMutation.mutateAsync({
        id: r.id,
        status: !r.status,
      });
    } catch (err) {
      console.error('Error toggling status:', err);
    }
  };


  const handleCreateResource = async (payload: CreateBuysResourcePayload) => {
    try {
      console.log('Creando recurso con payload:', payload);
      const result = await createResourceMutation.mutateAsync(payload);
      console.log('Resultado de la creación:', result);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating resource:', err);
    }
  };

  const handleUpdateResource = async (id: string, payload: UpdateBuysResourcePayload) => {
    try {
      await updateResourceMutation.mutateAsync({ id, payload });
      setResourceToEdit(null);
    } catch (err) {
      console.error('Error updating resource:', err);
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStartDate("");
    setEndDate("");
    setSupplierFilter('');
  };

  return (
    <div className="p-6 space-y-4 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-4xl font-semibold text-yellow-500">Recursos</h2>
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

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <FileText size={24} className="text-yellow-500" />
          <span className="text-lg font-medium text-gray-800">Gestión de Recursos</span>
        </div>
        
        {/* 🔥 BOTÓN DE CREAR - SOLO SI TIENE PERMISOS */}
        {(canCreate || isAdmin) && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-red-700 hover:bg-red-800 text-white w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" /> Agregar Recurso
          </Button>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="text-gray-400" />
        </div>
        <Input
          type="text"
          className="pl-10 bg-white text-gray-900 border-gray-300"
          placeholder="Buscar por recurso, almacén o proveedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow p-4 border border-gray-200">
        <div className="flex flex-row md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="text-gray-600" size={20} />
            <h3 className="text-lg font-medium text-gray-800">Filtros</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-800 self-start md:self-auto"
          >
            <X className="mr-1 h-4 w-4 justify-end" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              <Calendar className="inline mr-1 h-4 w-4" />
              Fecha desde
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-10 bg-white text-gray-900 border-gray-300 w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              <Calendar className="inline mr-1 h-4 w-4" />
              Fecha hasta
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-10 bg-white text-gray-900 border-gray-300 w-full item-end"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              <FileText className="inline mr-1 h-4 w-4 text-gray-500" />
              Proveedor
            </label>
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="h-10 bg-white text-gray-900 border border-gray-300 rounded-md w-full px-3"
            >
              <option value="">Todos los proveedores</option>
              {suppliersList.map((supplierName, index) => (
                <option key={index} value={supplierName}>
                  {supplierName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || startDate || endDate || supplierFilter) && (
          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Filtros activos:</span>
              {startDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Desde: {formatDateLocal(startDate)}
                </span>
              )}
              {endDate && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Hasta: {formatDateLocal(endDate)}
                </span>
              )}
              {supplierFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Proveedor: {supplierFilter}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center items-center p-4 text-gray-500">
          Cargando recursos...
        </div>
      )}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <AlertCircle className="inline w-4 h-4 mr-2" />
          <span className="font-medium">Error:</span> No se pudieron cargar los recursos: {error.message}
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-xl shadow p-4 overflow-x-auto border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Recurso</th>
                <th className="px-4 py-2 text-left">Almacén</th>
                <th className="px-4 py-2 text-left">Unidad</th>
                <th className="px-4 py-2 text-left">Precio Unitario</th>
                <th className="px-4 py-2 text-left">Costo Total</th>
                <th className="px-4 py-2 text-left">Proveedor</th>
                <th className="px-4 py-2 text-left">Cantidad</th>
                <th className="px-4 py-2 text-left">Fecha de Entrada</th>
                <th className="px-4 py-2 text-left">Observación</th>
                <th className="px-4 py-2 text-left">Estado</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    {searchTerm || startDate || endDate || supplierFilter
                      ? "No se encontraron recursos que coincidan con los filtros"
                      : "No hay recursos para mostrar."}
                  </td>
                </tr>
              ) : (
                filteredResources.map((r: BuysResourceWithResource) => (
                  <tr key={r.id} className="hover:bg-gray-50 border-t border-gray-200">
                    <td className="px-4 py-2 text-left">
                      <div>
                        <div className="font-medium">{r.resource?.name || 'N/A'}</div>
                        {r.resource?.observation && (
                          <div className="text-xs text-gray-500">{r.resource.observation}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-left">{r.warehouse?.name || 'N/A'}</td>
                    <td className="px-4 py-2 text-left">{r.type_unit}</td>
                    <td className="px-4 py-2 text-left">
                      S/ {r.unit_price.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-left">
                      S/ {r.total_cost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-left">{r.supplier?.suplier_name || 'N/A'}</td>
                    <td className="px-4 py-2 text-left">{r.quantity}</td>
                    <td className="px-4 py-2 text-left">{formatDateLocal(r.entry_date)}</td>
                    <td className="px-4 py-2 text-left">
                      {r.resource?.observation ? (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Ver arriba
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-2 text-left">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${r.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {r.status ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-left space-x-2">
                      {/* 🔥 BOTÓN DE EDITAR - SOLO SI TIENE PERMISOS DE EDITAR */}
                      {(canEdit || isAdmin) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(r)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {/* 🔥 BOTÓN DE TOGGLE STATUS - SOLO SI TIENE PERMISOS DE ELIMINAR */}
                      {(canDelete || isAdmin) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(r)}
                          className={r.status ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                          title={r.status ? 'Desactivar' : 'Activar'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {/* 🔥 MENSAJE CUANDO NO HAY PERMISOS */}
                      {!canEdit && !canDelete && !isAdmin && (
                        <span className="text-gray-400 text-sm">Sin permisos</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 🔥 MODAL DE CREAR - SOLO SI TIENE PERMISOS */}
      {isCreateModalOpen && (canCreate || isAdmin) && (
        <ModalNuevoRecurso
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateResource}
          isCreating={createResourceMutation.isPending}
        />
      )}

      {/* 🔥 MODAL DE EDITAR - SOLO SI TIENE PERMISOS */}
      {resourceToEdit && (canEdit || isAdmin) && (
        <ModalEditResource
          isOpen={!!resourceToEdit}
          recurso={resourceToEdit}
          onClose={() => setResourceToEdit(null)}
          onUpdate={handleUpdateResource}
          isUpdating={updateResourceMutation.isPending}
        />
      )}

      {/* 🔥 MODAL DE ELIMINAR - SOLO SI TIENE PERMISOS */}
      {resourceToDelete && (canDelete || isAdmin) && (
        <ModalDeleteResource
          isOpen={!!resourceToDelete}
          onClose={() => setResourceToDelete(null)}
          onConfirm={handleConfirmDelete}
          resourceName={resourceToDelete.resource?.name}
          isDeleting={deleteResourceMutation.isPending}
        />
      )}
    </div>
  );
};

export default ResourcesView;