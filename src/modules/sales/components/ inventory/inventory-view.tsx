import React, { useState } from 'react';
import { FiPackage, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import ModalCreateProduct from './modal-create-inventory';
import ModalEditProduct from './modal-edit-inventory';
import ModalDeleteProduct from './modal-delete-inventory';

const InventoryComponentsView: React.FC = () => {
  const [inventory, setInventory] = useState([
    { id: 1, producto: 'Harina', cantidad: 50, fecha: '2025-07-15' },
    { id: 2, producto: 'Azúcar', cantidad: 30, fecha: '2025-07-14' },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>(null);

  const handleCreateProduct = (newProduct: any) => {
    setInventory((prev) => [...prev, { ...newProduct, id: Date.now() }]);
    setIsCreateModalOpen(false);
  };

  const handleEditProduct = (updatedProduct: any) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === currentProduct.id ? { ...item, ...updatedProduct } : item))
    );
    setIsEditModalOpen(false);
  };

  const handleDeleteProduct = () => {
    setInventory((prev) => prev.filter((item) => item.id !== currentProduct.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
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

      <ModalCreateProduct
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateProduct}
      />

      <ModalEditProduct
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentProduct={currentProduct}
        onSave={handleEditProduct}
      />

      <ModalDeleteProduct
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
};

export default InventoryComponentsView;
