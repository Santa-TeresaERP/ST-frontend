'use client';
import React, { useState } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import { useFetchWarehouseStoreItems, useDeleteWarehouseStoreItem } from '../../hooks/useInventoryQueries';
import { WarehouseStoreItem } from '../../types/inventory.types';
import ModalCreateInventory from './modal-create-inventory';
import ModalEditInventory from './modal-edit-inventory';
import ModalDeleteInventory from './modal-delete-inventory'; 

const InventoryComponentsView: React.FC = () => {
  // HOOKS DE DATOS
  const { data: inventory = [], isLoading, error } = useFetchWarehouseStoreItems();
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteWarehouseStoreItem();

  // ESTADO LOCAL PARA GESTIONAR MODALES
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WarehouseStoreItem | null>(null);

  // MANEJADORES DE EVENTOS
  const handleOpenEditModal = (item: WarehouseStoreItem) => {
    setSelectedItem(item);
    setEditModalOpen(true);
  };

  const handleOpenDeleteModal = (item: WarehouseStoreItem) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedItem) return;
    deleteItem(selectedItem.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        setSelectedItem(null);
      },
    });
  };

  const closeModal = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      <div className="flex justify-end items-center">
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Nuevo Producto
        </button>
      </div>

      <h2 className="text-2xl font-bold text-red-600 flex items-center space-x-2">
        <FiPackage className="text-red-600" size={24} />
        <span>Inventario de Productos</span>
      </h2>

      <div className="min-h-[200px]">
        {isLoading ? (
          <p className="text-center text-gray-500 py-10">Cargando inventario...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">Error: {error.message}</p>
        ) : (
          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
            <table className="min-w-full text-left text-gray-700">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-4 py-2 text-center">Producto</th>
                  <th className="px-4 py-2 text-center">Cantidad</th>
                  <th className="px-4 py-2 text-center">Última Actualización</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- Modales --- */}
      <ModalCreateInventory isOpen={isCreateModalOpen} onClose={() => setCreateModalOpen(false)} />
      
      <ModalEditInventory 
        isOpen={isEditModalOpen} 
        onClose={closeModal} 
        item={selectedItem} 
      />

      <ModalDeleteInventory
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        itemName={selectedItem?.product.name || ''}
        isPending={isDeleting}
      />
    </div>
  );
};

export default InventoryComponentsView;