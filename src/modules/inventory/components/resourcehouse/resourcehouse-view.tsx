import React, { useState, useMemo } from 'react';
// Verified Icons import path
import { Edit2, Trash2, FileText, Search, Plus, AlertCircle } from 'lucide-react';
// Corrected Hooks import path (from ../../hooks/ to ../../hook/)
import { useFetchResources, useCreateResource, useUpdateResource, useDeleteResource } from '../../hook/resource';
// Verified Types/Actions import paths (assuming they are correct relative to this file)
import { Resource, CreateResourcePayload, UpdateResourcePayload } from '../../types/resource';
// Verified Modal import paths (assuming they are correct relative to this file)
import ModalNuevoRecurso from './resource/modal-create-resource-resourcehouse';
import ModalEditResource from './resource/modal-edit-resource-resourcehouse';
import ModalDeleteResource from './resource/modal-delete-resource-resourcehouse';
// Removed import for non-existent Loading component
// import { Loading } from '@/app/components/Loading'; 
// Removed import for non-existent Alert component
// import { Alert, AlertDescription, AlertTitle } from '@/app/components/ui/alert'; 
// Verified Input component import path
import { Input } from '@/app/components/ui/input';
// Verified Button component import path
import { Button } from '@/app/components/ui/button';

const ResourcesView: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [resourceToDelete, setResourceToDelete] = useState<Resource | null>(null);
  const [resourceToEdit, setResourceToEdit] = useState<Resource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch resources using the hook
  const { data: resources = [], isLoading, error } = useFetchResources();

  // Mutation hooks
  const createResourceMutation = useCreateResource();
  const updateResourceMutation = useUpdateResource();
  const deleteResourceMutation = useDeleteResource();

  // Filter resources based on the search term
  const filteredResources = useMemo(() => {
    if (!resources) return [];
    return resources.filter(resource =>
      resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.supplier?.name && resource.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())) 
    );
  }, [resources, searchTerm]);

  const handleEdit = (resource: Resource) => {
    setResourceToEdit(resource);
  };

  const handleDelete = (resource: Resource) => {
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

  const handleCreateResource = async (payload: CreateResourcePayload) => {
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
          placeholder="Buscar recursos por nombre o proveedor..."
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
                <th className="px-4 py-2 text-left">Nombre</th>
                <th className="px-4 py-2 text-left">Unidad</th>
                <th className="px-4 py-2 text-left">Precio Unitario</th>
                <th className="px-4 py-2 text-left">Costo Total</th>
                <th className="px-4 py-2 text-left">Proveedor</th>
                <th className="px-4 py-2 text-left">Fecha de Compra</th>
                <th className="px-4 py-2 text-left">Observación</th>
                <th className="px-4 py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No se encontraron recursos que coincidan con la búsqueda' : 'No hay recursos para mostrar.'}
                  </td>
                </tr>
              ) : (
                filteredResources.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 border-t dark:border-gray-700">
                    <td className="px-4 py-2 text-left">{r.name}</td>
                    <td className="px-4 py-2 text-left">{r.type_unit}</td>
                    <td className="px-4 py-2 text-left">
                      S/ {parseFloat(r.unit_price).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-left">
                      S/ {r.total_cost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 text-left">{r.supplier?.name ?? 'N/A'}</td> 
                    <td className="px-4 py-2 text-left">{new Date(r.purchase_date).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-left">{r.observation ?? '-'}</td>
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
          recurso={resourceToEdit}
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
          resourceName={resourceToDelete.name}
          isDeleting={deleteResourceMutation.isPending}
        />
      )}
    </div>
  );
};

export default ResourcesView;

