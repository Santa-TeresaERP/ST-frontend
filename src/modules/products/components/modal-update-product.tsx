"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../app/components/ui/dialog';
import { Input } from '../../../app/components/ui/input';
import { Label } from "../../../app/components/ui/label";
import { Button } from "../../../app/components/ui/button";
import { Product } from '@/modules/products/types/product';
import { useFetchCategories } from '@/modules/products/hook/useCategories'; // Importar el hook para obtener categorías

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (data: Omit<Product, 'createdAt' | 'updatedAt'>) => Promise<void>;
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSubmit }) => {
  const { data: categories } = useFetchCategories(); // Obtener categorías
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: "",
    description: "",
    price: 0,
    imagen_url: "",
    category_id: "11111111-1111-1111-1111-111111111111", // ID de categoría predeterminado
    stock: 50, // Stock predeterminado
  });

  useEffect(() => {
    if (product) {
      console.log('Cargando datos del producto en el modal:', product);
      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || 0,
        imagen_url: product.imagen_url || "",
        category_id: product.category_id || "11111111-1111-1111-1111-111111111111",
        stock: product.stock || 50,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: 0,
        imagen_url: "",
        category_id: "11111111-1111-1111-1111-111111111111",
        stock: 50,
      });
    }
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (product) {
        const payload = {
          ...formData,
          price: parseFloat(formData.price.toString()), // Asegura formato decimal
        };
        await onSubmit({ id: product.id, ...payload });
      }
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? "Editar Producto" : "Crear Producto"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-gray-300 rounded-md mt-1"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Precio</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price.toFixed(2)}
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-gray-300 rounded-md mt-1"
              required
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-gray-300 rounded-md mt-1"
              required
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category_id">Categoría</Label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-gray-300 rounded-md mt-1"
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
          <div className="space-y-2">
            <Label htmlFor="imagen_url">URL de la imagen</Label>
            <Input
              id="imagen_url"
              name="imagen_url"
              type="text"
              value={formData.imagen_url}
              onChange={handleInputChange}
              className="w-full p-2 border-2 border-gray-300 rounded-md mt-1"
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-green-500 text-white">
              {product ? "Actualizar" : "Crear"}
            </Button>
            <Button type="button" onClick={onClose} className="bg-red-500 text-white">
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;