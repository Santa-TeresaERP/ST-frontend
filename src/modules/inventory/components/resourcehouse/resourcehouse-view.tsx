import React, { useState, useMemo } from 'react';
// Verified Icons import path
import { Edit2, Trash2, FileText, Search, Plus, AlertCircle, Filter, X, Calendar } from 'lucide-react';
// Corrected Hooks import path (from ../../hooks/ to ../../hook/)
import { useFetchResourcesWithBuys, useCreateBuysResource, useUpdateResource, useDeleteBuysResource } from '../../hook/usebuysResource';
// Verified Types/Actions import paths (assuming they are correct relative to this file)
import { UpdateResourcePayload } from '../../types/resource';
import { BuysResourceWithResource, CreateBuysResourcePayload } from '../../types/buysResource';
// Verified Modal import paths (assuming they are correct relative to this file)
import ModalNuevoRecurso from './resource/modal-create-resource-resourcehouse';
import ModalEditResource from './resource/modal-edit-resource-resourcehouse';
import ModalDeleteResource from './resource/modal-delete-resource-resourcehouse';

import { Input } from '@/app/components/ui/input';
// Verified Button component import path
import { Button } from '@/app/components/ui/button';

const ResourcesView: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<BuysResourceWithResource | null>(null);
  const [resourceToEdit, setResourceToEdit] = useState<BuysResourceWithResource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states - only date filters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  // Fetch resources using the hook
  const { data: resources = [], isLoading, error } = useFetchResourcesWithBuys();

  // Mutation hooks
  const createResourceMutation = useCreateBuysResource();
  const updateResourceMutation = useUpdateResource();
  const deleteResourceMutation = useDeleteBuysResource();

  // Filter resources based on search term and date filters only
  const filteredResources = useMemo(() => {
    if (!resources) return [];
    
    return resources.filter((resource: BuysResourceWithResource) => {
      // Text search filter
      const matchesSearch = 
        resource.resource?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (resource.warehouse?.name && resource.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (resource.supplier?.suplier_name && resource.supplier.suplier_name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Date filter
      let matchesDate = true;
      if (startDate || endDate) {
        const entryDate = resource.entry_date ? new Date(resource.entry_date) : null;
        if (entryDate) {
          if (startDate && new Date(startDate) > entryDate) {
            matchesDate = false;
          }
          if (endDate && new Date(endDate) < entryDate) {
            matchesDate = false;
          }
        } else if (startDate || endDate) {
          matchesDate = false; // No entry date but filters are set
        }
      }
      
      return matchesSearch && matchesDate;
    });
  }, [resources, searchTerm, startDate, endDate]);

  const handleEdit = (resource: BuysResourceWithResource) => {
    setResourceToEdit(resource);
  };

  const handleDelete = (resource: BuysResourceWithResource) => {
    setResourceToDelete(resource);
  };

  const confirmDelete = async () => {
    if (resourceToDelete && resourceToDelete.id) {
      try {
        await deleteResourceMutation.mutateAsync(resourceToDelete.id);
        setResourceToDelete(null);
      } catch (err) {
        console.error('Error deleting resource:', err);
        // TODO: Implement proper user feedback for errors
      }
    }
  };

  const cancelDelete = () => {
    setResourceToDelete(null);
  };

  const handleCreateResource = async (payload: CreateBuysResourcePayload) => {
    try {
      console.log('Creando recurso con payload:', payload);
      const result = await createResourceMutation.mutateAsync(payload);
      console.log('Resultado de la creación:', result);
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Error creating resource:', err);
       // TODO: Implement proper user feedback for errors
    }
  };

  const handleUpdateResource = async (id: string, payload: UpdateResourcePayload) => {
    try {
      await updateResourceMutation.mutateAsync({ id, payload });
      setResourceToEdit(null);
    } catch (err) {
      console.error('Error updating resource:', err);
       // TODO: Implement proper user feedback for errors
    }
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="p-6 space-y-4 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-4xl font-semibold text-yellow-500">Recursos</h2>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <FileText size={24} className="text-yellow-500" />
          <span className="text-lg font-medium text-gray-800">Gestión de Recursos</span>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-red-700 hover:bg-red-800 text-white w-full md:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Agregar Recurso
        </Button>
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

      {/* Filters Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fecha desde */}
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

            {/* Fecha hasta */}
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
          </div>

          {/* Filtros activos */}
          {(startDate || endDate) && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Filtros activos:</span>
                {startDate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Desde: {new Date(startDate).toLocaleDateString()}
                  </span>
                )}
                {endDate && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Hasta: {new Date(endDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

      {/* Loading and Error States */}
      {isLoading && (
        <div className="flex justify-center items-center p-4 text-gray-500">
          {/* Simple text loading indicator */}
          Cargando recursos...
        </div>
      )}
      {error && (
         /* Simple div for error message */
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
          <AlertCircle className="inline w-4 h-4 mr-2"/>
          <span className="font-medium">Error:</span> No se pudieron cargar los recursos: {error.message}
        </div>
      )}

      {/* Table */} 
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
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    {searchTerm ? 'No se encontraron recursos que coincidan con la búsqueda' : 'No hay recursos para mostrar.'}
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
                    <td className="px-4 py-2 text-left">{r.entry_date ? new Date(r.entry_date).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-2 text-left">
                      {r.resource?.observation ? (
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          Ver arriba
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-2 text-left space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(r)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4"/>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(r)}
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4"/>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals - Now using corrected components */}
      {isCreateModalOpen && (
        <ModalNuevoRecurso
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateResource}
          isCreating={createResourceMutation.isPending}
        />
      )}

      {resourceToEdit && (
        <ModalEditResource
          isOpen={!!resourceToEdit}
          recurso={resourceToEdit.resource || { id: resourceToEdit.id || '', name: '', observation: null }}
          onClose={() => setResourceToEdit(null)}
          onUpdate={handleUpdateResource}
          isUpdating={updateResourceMutation.isPending}
        />
      )}

      {resourceToDelete && (
        <ModalDeleteResource
          isOpen={!!resourceToDelete}
          onClose={cancelDelete}
          onConfirm={confirmDelete}
          resourceName={resourceToDelete.resource?.name || 'Recurso'}
          isDeleting={deleteResourceMutation.isPending}
        />
      )}
    </div>
  );
};

export default ResourcesView;

