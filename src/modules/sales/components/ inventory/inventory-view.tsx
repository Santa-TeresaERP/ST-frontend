'use client';
import React, { useState, useMemo } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useFetchWarehouseStoreItems, useDeleteWarehouseStoreItem } from '../../hooks/useInventoryQueries';
import { WarehouseStoreItem } from '../../types/inventory.types';
import { StoreAttributes } from '@/modules/sales/types/store';
import { useCheckStoreActiveSession } from '../../hooks/useCashSession';
import { isStoreOperational, getStoreOperationalMessage } from '../../utils/store-status';
import ModalCreateInventory from './modal-create-inventory';
import ModalEditInventory from './modal-edit-inventory';
import ModalDeleteInventory from './modal-delete-inventory';

interface InventoryViewProps {
  selectedStoreId?: string;
}

const InventoryComponentsView: React.FC<InventoryViewProps> = ({ selectedStoreId }) => {
  const { data: inventory = [], isLoading, error } = useFetchWarehouseStoreItems();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteWarehouseStoreItem();
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WarehouseStoreItem | null>(null);

  const filteredInventory = useMemo(() => {
    if (!selectedStoreId) return [];
    return inventory.filter(item => item.store.id === selectedStoreId);
  }, [inventory, selectedStoreId]);

  const handleOpenEditModal = (item: WarehouseStoreItem) => { setSelectedItem(item); setEditModalOpen(true); };
  const handleOpenDeleteModal = (item: WarehouseStoreItem) => { setSelectedItem(item); setDeleteModalOpen(true); };
  const handleDeleteConfirm = () => { if (selectedItem) deleteItem(selectedItem.id, { onSuccess: closeModal }); };
  const closeModal = () => { setEditModalOpen(false); setDeleteModalOpen(false); setSelectedItem(null); };

  // Filtrar inventario por tienda seleccionada
  const filteredInventory = selectedStore
    ? inventory.filter((item) => item.storeId === selectedStore.id)
    : inventory;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      <div className="flex justify-end items-center">
        <button
          onClick={() => setCreateModalOpen(true)}
          disabled={!selectedStoreId}
          className={`flex items-center px-4 py-2 rounded-lg transition-all ${
            selectedStoreId
              ? "bg-gradient-to-r from-red-600 to-red-800 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          <FiPlus className="mr-2 h-5 w-5" />
          {selectedStore && isStoreOperational(storeSessionData) ? 'Nuevo Producto' : 'Selecciona Tienda'}
        </button>
      </div>
      <h2 className="text-2xl font-bold text-red-600 flex items-center space-x-2">
        <FiPackage size={24} />
        <span>Inventario de la Tienda</span>
      </h2>
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
                      <button onClick={() => handleOpenEditModal(item)} className="text-blue-500 hover:text-yellow-600"><FiEdit size={18} /></button>
                      <button onClick={() => handleOpenDeleteModal(item)} className="text-red-500 hover:text-red-600"><FiTrash2 size={18} /></button>
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-center">{item.product.name}</td>
                      <td className="px-4 py-2 text-center">{item.quantity}</td>
                      <td className="px-4 py-2 text-center">{new Date(item.updatedAt).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-center flex justify-center space-x-3">
                        <button onClick={() => handleOpenEditModal(item)} className="text-blue-500 hover:text-yellow-600">
                          <FiEdit size={18} />
                        </button>
                        <button onClick={() => handleOpenDeleteModal(item)} className="text-red-500 hover:text-red-600">
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <ModalCreateInventory isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} selectedStoreId={selectedStoreId} />
      <ModalEditInventory isOpen={isEditModalOpen} onClose={closeModal} item={selectedItem} />
      <ModalDeleteInventory isOpen={isDeleteModalOpen} onClose={closeModal} onConfirm={handleDeleteConfirm} itemName={selectedItem?.product.name || ''} isPending={isDeleting} />
    </div>
  );
};
export default InventoryComponentsView;