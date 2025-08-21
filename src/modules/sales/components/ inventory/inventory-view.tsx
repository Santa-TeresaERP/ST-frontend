import React, { useState, useMemo } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useFetchWarehouseStoreItems, useDeleteWarehouseStoreItem } from '../../hooks/useInventoryQueries';
import { WarehouseStoreItem } from '../../types/inventory.types';
import ModalCreateInventory from './modal-create-inventory';
import ModalEditInventory from './modal-edit-inventory';
import ModalDeleteInventory from './modal-delete-inventory';
import { useModulePermissions } from "@/core/utils/permission-hooks";
import { MODULE_NAMES } from "@/core/utils/useModulesMap";

interface InventoryViewProps {
  selectedStoreId?: string;
}

const InventoryComponentsView: React.FC<InventoryViewProps> = ({ selectedStoreId }) => {
  const { data: inventory = [], isLoading, error } = useFetchWarehouseStoreItems(); 
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteWarehouseStoreItem();
  
  // Permisos del módulo
  const { canCreate, canEdit, canDelete, isAdmin } = useModulePermissions(MODULE_NAMES.SALES);
  
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WarehouseStoreItem | null>(null);

  const filteredInventory = useMemo(() => {
    if (!selectedStoreId) return [];
    return inventory.filter(item => item.storeId === selectedStoreId);
  }, [inventory, selectedStoreId]);

  const handleOpenEditModal = (item: WarehouseStoreItem) => { setSelectedItem(item); setEditModalOpen(true); };
  const handleOpenDeleteModal = (item: WarehouseStoreItem) => { setSelectedItem(item); setDeleteModalOpen(true); };
  const handleDeleteConfirm = () => { if (selectedItem) deleteItem(selectedItem.id, { onSuccess: closeModal }); };
  const closeModal = () => { setEditModalOpen(false); setDeleteModalOpen(false); setSelectedItem(null); };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      
      {/* Panel de permisos para verificación */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <small className="text-blue-700">
          <strong>Estado Permisos:</strong>{" "}
          Módulo: {MODULE_NAMES.SALES} | 
          Crear: {canCreate ? "✅ SÍ" : "❌ NO"} | 
          Editar: {canEdit ? "✅ SÍ" : "❌ NO"} | 
          Eliminar: {canDelete ? "✅ SÍ" : "❌ NO"} | 
          Admin: {isAdmin ? "✅ SÍ" : "❌ NO"}
          <br />
        </small>
      </div>

      <div className="flex justify-end items-center">
        <button
          onClick={() => setCreateModalOpen(true)}
          disabled={!selectedStoreId || !canCreate}
          className={`flex items-center px-4 py-2 rounded-lg transition-all ${
            selectedStoreId && canCreate
              ? "bg-gradient-to-r from-red-600 to-red-800 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          title={
            !selectedStoreId
              ? "Seleccione una tienda primero"
              : !canCreate
              ? "No tienes permisos para crear productos"
              : "Crear nuevo producto"
          }
        >
          <FiPlus className="mr-2 h-5 w-5" />
          {selectedStoreId && canCreate
            ? 'Nuevo Producto' 
            : !selectedStoreId
            ? 'Selecciona Tienda'
            : !canCreate 
            ? 'Sin Permisos'
            : 'Selecciona Tienda'}
        </button>
      </div>
      <h2 className="text-2xl font-bold text-red-600 flex items-center space-x-2">
        <FiPackage size={24} />
        <span>Inventario de la Tienda</span>
      </h2>

      {!canCreate && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            🚫 <strong>Sin permisos:</strong> No tienes permisos para crear productos en el inventario.
          </p>
          <small className="text-red-600">
            Contacta con tu administrador para obtener los permisos necesarios.
          </small>
        </div>
      )}

      <div className="min-h-[200px]">
        {isLoading ? <p className="text-center text-gray-500 py-10">Cargando inventario...</p>
        : error ? <p className="text-center text-red-500 py-10">Error: {error.message}</p>
        : !selectedStoreId ? <p className="text-center text-gray-500 py-10">Seleccione una tienda para ver su inventario.</p>
        : filteredInventory.length === 0 ? <p className="text-center text-gray-500 py-10">No hay productos en el inventario de esta tienda.</p>
        : (
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full text-left text-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-center">Producto</th>
                  <th className="px-4 py-2 text-center">Cantidad</th>
                  {/* [CORREGIDO] Se cambia la columna de vuelta a "Última Actualización" */}
                  <th className="px-4 py-2 text-center">Última Actualización</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              {/* [CORREGIDO] Se asegura que no haya nada entre <tbody> y el map para evitar el error de hidratación */}
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">{item.product.name}</td>
                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                    {/* [CORREGIDO] Se muestra la fecha de actualización */}
                    <td className="px-4 py-2 text-center">{new Date(item.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-2 text-center flex justify-center space-x-3">
                      {canEdit && (
                        <button 
                          onClick={() => handleOpenEditModal(item)} 
                          className="text-blue-500 hover:text-yellow-600"
                          title="Editar producto"
                        >
                          <FiEdit size={18} />
                        </button>
                      )}
                      {!canEdit && (
                        <span 
                          className="text-gray-400 cursor-not-allowed"
                          title="No tienes permisos para editar productos"
                        >
                          <FiEdit size={18} />
                        </span>
                      )}
                      {canDelete && (
                        <button 
                          onClick={() => handleOpenDeleteModal(item)} 
                          className="text-red-500 hover:text-red-600"
                          title="Eliminar producto"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                      {!canDelete && (
                        <span 
                          className="text-gray-400 cursor-not-allowed"
                          title="No tienes permisos para eliminar productos"
                        >
                          <FiTrash2 size={18} />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {canCreate && (
        <ModalCreateInventory 
          isOpen={isCreateModalOpen} 
          onClose={() => setCreateModalOpen(false)} 
          selectedStoreId={selectedStoreId} 
        />
      )}
      {canEdit && (
        <ModalEditInventory 
          isOpen={isEditModalOpen} 
          onClose={closeModal} 
          item={selectedItem} 
        />
      )}
      {canDelete && (
        <ModalDeleteInventory 
          isOpen={isDeleteModalOpen} 
          onClose={closeModal} 
          onConfirm={handleDeleteConfirm} 
          itemName={selectedItem?.product.name || ''} 
          isPending={isDeleting} 
        />
      )}
    </div>
  );
};
export default InventoryComponentsView;