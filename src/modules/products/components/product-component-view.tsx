"use client";

import React, { useState } from 'react';
import { useFetchProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/modules/products/hook/useProducts';
import { Product, CreateProductPayload, UpdateProductPayload } from '@/modules/products/types/product';
import Image from 'next/image';
import ProductModal from './modal-create-product';
import UpdateProductModal from './modal-update-product';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl transform transition-all">
        <div className="flex items-center text-red-500 mb-4">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <h3 className="text-lg font-bold">Confirmar eliminación</h3>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-sm text-gray-700">
            ¿Estás seguro de que deseas eliminar el producto <span className="font-semibold">&quot;{productName}&quot;</span>?
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Esta acción no se puede deshacer.
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition duration-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductList: React.FC = () => {
  const { data: products, isLoading, error } = useFetchProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    productId: '',
    productName: ''
  });

  const filteredProducts = products?.filter((product: Product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = async (data: Omit<Product, "created_at" | "updated_at">) => {
    try {
      const payload: CreateProductPayload = {
        name: data.name,
        category_id: data.category_id,
        price: parseFloat(data.price.toString()),
        stock: data.stock,
        description: data.description,
        imagen_url: data.imagen_url,
      };

      await createProductMutation.mutateAsync(payload);
      setCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      const { id, name, category_id, price, stock, description, imagen_url } = product;
      const payload: UpdateProductPayload = {
        name,
        category_id,
        price: parseFloat(price.toString()),
        stock,
        description,
        imagen_url,
      };
      await updateProductMutation.mutateAsync({ id, payload });
      setUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setUpdateModalOpen(true);
  };

  const openDeleteConfirmation = (productId: string, productName: string) => {
    setDeleteConfirmation({
      isOpen: true,
      productId,
      productName
    });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({
      isOpen: false,
      productId: '',
      productName: ''
    });
  };

  const confirmDeleteProduct = async () => {
    try {
      await deleteProductMutation.mutateAsync(deleteConfirmation.productId);
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 w-full">
      <main className="flex-grow w-full p-4">
        <div className="mb-8 rounded-lg bg-white p-4 shadow-sm w-full">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium">Lista de Productos</h2>
            <button
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-2 rounded-lg flex items-center shadow-lg transform transition-transform duration-300 hover:scale-105"
            onClick={() => setCreateModalOpen(true)}
          >
            <Plus className="mr-2 h-5 w-5" />
            <span className="font-semibold text-lg">Agregar Producto</span>
          </button>
          </div>
          <div className="mt-4 flex justify-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar producto..."
              className="w-1/2 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm w-full">
          <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4 justify-center">
            {filteredProducts?.map((product: Product) => (
              <div
                key={product.id}
                className="overflow-hidden bg-white shadow-lg rounded-lg w-[350px] h-[450px] transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="p-2">
                  <Image
                    src={product.imagen_url}
                    alt={product.name}
                    width={320}
                    height={240}
                    className="h-56 w-full object-cover rounded-md"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>Precio: S/. {product.price}</p>
                    <p>Stock: {product.stock} unidades</p>
                  </div>
                </div>
                <div className="flex gap-2 p-4 pt-0">
                  <button
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white p-2 rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 hover:shadow-lg transition duration-300"
                    onClick={() => handleEditProduct(product)}
                  >
                    Editar
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white p-2 rounded-md shadow-md hover:from-red-600 hover:to-red-700 hover:shadow-lg transition duration-300"
                    onClick={() => openDeleteConfirmation(product.id, product.name)}
                  >
                    <Trash2 className="inline-block h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <ProductModal
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        product={null}
        onSubmit={handleCreateProduct}
      />

      <UpdateProductModal
        isOpen={isUpdateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        product={editingProduct}
        onSubmit={handleUpdateProduct}
      />

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={confirmDeleteProduct}
        productName={deleteConfirmation.productName}
      />
    </div>
  );
};

export default ProductList;