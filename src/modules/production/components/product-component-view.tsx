"use client";

import React, { useState } from 'react';
import { useFetchProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/modules/production/hook/useProducts';
import { Product, CreateProductPayload, UpdateProductPayload } from '@/modules/production/types/products';
import Image from 'next/image';
import ProductModal from './modal-create-product';
import UpdateProductModal from './modal-update-product';
import { Plus, Trash2, AlertTriangle, Edit2, Search, Loader2 } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, onConfirm, productName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl animate-fade-in">
        <div className="flex items-center text-red-500 mb-4">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <h3 className="text-xl font-bold">Confirmar eliminación</h3>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-r-lg">
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
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition duration-200 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition duration-200 font-medium shadow-md hover:shadow-red-200"
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
      const { id, name, category_id, price, description, imagen_url } = product;
      const payload: UpdateProductPayload = {
        name,
        category_id,
        price: parseFloat(price.toString()),
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
      await deleteProductMutation.mutateAsync(deleteConfirmation.productId, {
        onError: (error) => {
          console.error('Error deleting product:', error);
          alert('No se pudo eliminar el producto. Intenta nuevamente.');
        },
      });
      closeDeleteConfirmation();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg font-medium text-gray-700">Cargando productos...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-r-lg max-w-md">
        <h3 className="text-lg font-bold text-red-700">Error al cargar los productos</h3>
        <p className="text-red-600">Por favor intenta nuevamente más tarde.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 w-full">
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gestión de Productos</h1>
              <p className="text-gray-600">Administra el inventario de productos</p>
            </div>
            <button
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="mr-2 h-5 w-5" />
              <span className="font-semibold">Nuevo Producto</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar producto por nombre..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          {filteredProducts?.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400">
                <Search className="w-full h-full" />
              </div>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron productos</h3>
              <p className="mt-1 text-gray-500">Intenta con otro término de búsqueda o crea un nuevo producto.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProducts?.map((product: Product) => (
                <div
                  key={product.id}
                  className="overflow-hidden bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={product.imagen_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{product.name}</h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span className="font-medium">Precio:</span>
                        <span className="text-red-500 font-bold">S/. {product.price}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-5 pb-5 flex gap-3">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => openDeleteConfirmation(product.id, product.name)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
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