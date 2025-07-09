import React, { useState, useMemo } from 'react';
// Verified Icons import path
import { Edit2, Trash2, FileText, Search, Plus, AlertCircle } from 'lucide-react';
// Corrected Hooks import path (from ../../hooks/ to ../../hook/)
import { useFetchResourcesWithBuys, useCreateBuysResource, useUpdateResource, useDeleteResource } from '../../hook/usebuysResource';
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

  // Fetch resources using the hook
  const { data: resources = [], isLoading, error } = useFetchResourcesWithBuys();

  // Mutation hooks
  const createResourceMutation = useCreateBuysResource();
  const updateResourceMutation = useUpdateResource();
  const deleteResourceMutation = useDeleteResource();

  // Filter resources based on the search term
  const filteredResources = useMemo(() => {
    if (!resources) return [];
    return resources.filter((resource: BuysResourceWithResource) =>
      resource.resource?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.warehouse?.name && resource.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (resource.supplier?.suplier_name && resource.supplier.suplier_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [resources, searchTerm]);

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
      await createResourceMutation.mutateAsync(payload);
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

  return (
    <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-start">
        <h2 className="text-4xl font-semibold text-yellow-500 dark:text-yellow-400">
          Recursos
        </h2>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FileText size={24} className="text-yellow-500 dark:text-yellow-400" />
          <span className="text-lg font-medium dark:text-gray-200">Gestión de Recursos</span>
        </div>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 text-white"
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
          className="pl-10 dark:bg-gray-800 dark:text-white dark:border-gray-700"
          placeholder="Buscar por recurso, almacén o proveedor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading and Error States - Replaced non-existent components */}
      {isLoading && (
        <div className="flex justify-center items-center p-4 text-gray-500 dark:text-gray-400">
          {/* Simple text loading indicator */}
          Cargando recursos...
        </div>
      )}
      {error && (
         /* Simple div for error message - Replace with actual Alert component if implemented */
        <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
          <AlertCircle className="inline w-4 h-4 mr-2"/>
          <span className="font-medium">Error:</span> No se pudieron cargar los recursos: {error.message}
        </div>
      )}

      {/* Table */} 
      {!isLoading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm dark:text-gray-300">
            <thead className="bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-200">
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
                  <td colSpan={10} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No se encontraron recursos que coincidan con la búsqueda' : 'No hay recursos para mostrar.'}
                  </td>
                </tr>
              ) : (
                filteredResources.map((r: BuysResourceWithResource) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-t dark:border-gray-700">
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
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                          Ver arriba
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-2 text-left space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(r)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4"/>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(r)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
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

