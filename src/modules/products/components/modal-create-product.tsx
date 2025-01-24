"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/modules/products/types/product';
import { useFetchCategories } from '@/modules/products/hook/useCategories'; // Importar el hook para obtener categorías

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (data: Omit<Product, 'created_at' | 'updated_at'>) => Promise<void>;
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSubmit }) => {
  const { data: categories } = useFetchCategories(); // Obtener categorías
  const [name, setName] = useState(product?.name || '');
  const [category_id, setCategoryId] = useState(product?.category_id || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [description, setDescription] = useState(product?.description || '');
  const [image_url, setImageUrl] = useState(product?.image_url || '');
  const [useUrl, setUseUrl] = useState(true); // Estado para cambiar entre URL y subida de imagen

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.category_id);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description);
      setImageUrl(product.image_url);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ name, category_id, price, stock, description, image_url });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-lg font-medium mb-4">{product ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Nombre del Producto</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Categoría</label>
            <select
              value={category_id}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            >
              <option value="">Seleccione una categoría</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Precio</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-semibold text-gray-700">Imagen</label>
            <div className="flex items-center mb-2">
              <input
                type="radio"
                id="url"
                name="imageSource"
                checked={useUrl}
                onChange={() => setUseUrl(true)}
              />
              <label htmlFor="url" className="ml-2">URL</label>
              <input
                type="radio"
                id="upload"
                name="imageSource"
                checked={!useUrl}
                onChange={() => setUseUrl(false)}
                className="ml-4"
              />
              <label htmlFor="upload" className="ml-2">Subir Imagen</label>
            </div>
            {useUrl ? (
              <input
                type="text"
                value={image_url}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md mt-1"
                required
              />
            ) : (
              <input
                type="file"
                onChange={handleImageUpload}
                className="w-full p-2 border border-gray-300 rounded-md mt-1"
                required
              />
            )}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white p-2 rounded-md mr-2"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-red-500 text-white p-2 rounded-md"
            >
              {product ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;