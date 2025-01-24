"use client";

import React, { useState } from 'react';
import { useFetchProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/modules/products/hook/useProducts';
import { Product, CreateProductPayload, UpdateProductPayload } from '@/modules/products/types/product';
import Image from 'next/image';
import ProductModal from './modal-create-product';
import UpdateProductModal from './modal-update-product';
import { Plus, Trash2 } from 'lucide-react';

const ProductList: React.FC = () => {
  const { data: products, isLoading, error } = useFetchProducts();
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProductMutation.mutateAsync(productId);
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
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md flex items-center"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="mr-1 h-4 w-4" />
              Agregar Producto
            </button>
          </div>
          <div className="mt-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 shadow-sm w-full">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts?.map((product: Product) => (
              <div
                key={product.id}
                className="overflow-hidden bg-white shadow-md rounded-md w-[350px] h-[450px]"
              >
                <Image
                  src={product.imagen_url}
                  alt={product.name}
                  width={400}
                  height={300}
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-bold">{product.name}</h3>
                  <div className="mt-2 space-y-1 text-sm">
                    <p>Precio: S/. {product.price}</p>
                    <p>Stock: {product.stock} unidades</p>
                  </div>
                </div>
                <div className="flex gap-2 p-4 pt-0">
                  <button
                    className="flex-1 bg-red-500 text-white p-2 rounded-md"
                    onClick={() => handleEditProduct(product)}
                  >
                    Editar
                  </button>
                  <button
                    className="flex-1 bg-gray-500 text-white p-2 rounded-md"
                    onClick={() => handleDeleteProduct(product.id)}
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
    </div>
  );
};

export default ProductList;
