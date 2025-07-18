// src/modules/sales/components/inventory/inventory-view.tsx
'use client';
import React, { useState } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

// Importamos nuestros hooks de React Query
import { useFetchInventory, useDeleteInventoryProduct } from '../../hooks/useInventoryQueries';
import { InventoryItem } from '../../types/inventory.types';

// Importamos los modales
import ModalCreateProduct from './modal-create-inventory';
import ModalEditProduct from './modal-edit-inventory';
import ModalDeleteProduct from './modal-delete-inventory';

const InventoryComponentsView: React.FC = () => {
  // 1. Hook para obtener los datos
  const { data: inventory = [], isLoading, error } = useFetchInventory();
  
  // 2. Hook para la mutación de borrado
  const { mutate: deleteProduct } = useDeleteInventoryProduct();

  // Estado local para manejar los modales y el producto seleccionado
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<InventoryItem | null>(null);

  const handleDelete = () => {
    if (!currentProduct) return;
    deleteProduct(currentProduct.id, {
      onSuccess: () => {
        // La tabla se actualizará automáticamente gracias a la invalidación
        setIsDeleteModalOpen(false); // Cerramos el modal
        // Opcional: Mostrar notificación de éxito
      },
      onError: (error) => {
        console.error("Error al eliminar:", error);
        // Opcional: Mostrar notificación de error
      },
    });
  };

  // El esqueleto principal del componente ahora se renderiza siempre
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      {/* --- Encabezado y Botón (Siempre visible) --- */}
      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsCreateModalOpen(true)}
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

      {/* --- Contenido de la Tabla (Carga condicional) --- */}
      <div className="min-h-[200px]"> {/* Contenedor para evitar saltos de layout */}
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
                  <th className="px-4 py-2 text-center">Fecha</th>
                  <th className="px-4 py-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 text-center">{item.producto}</td>
                    <td className="px-4 py-2 text-center">{item.cantidad}</td>
                    <td className="px-4 py-2 text-center">{item.fecha}</td>
                    <td className="px-4 py-2 text-center flex justify-center space-x-3">
                      <button
                        className="text-blue-500 hover:text-yellow-600"
                        onClick={() => {
                          setCurrentProduct(item);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <FiEdit size={18} />
                      </button>
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          setCurrentProduct(item);
                          setIsDeleteModalOpen(true);
                        }}
                      >
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

      {/* --- Modales (Siempre renderizados pero controlados por estado) --- */}
      <ModalCreateProduct
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {currentProduct && (
        <ModalEditProduct
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentProduct={currentProduct}
        />
      )}

      <ModalDeleteProduct
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default InventoryComponentsView;