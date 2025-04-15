"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../../app/components/ui/dialog';
import { Input } from '../../../app/components/ui/input';
import { Label } from "../../../app/components/ui/label";
import { Button } from "../../../app/components/ui/button";
import { Card } from "../../../app/components/ui/card";
import { Product } from '@/modules/products/types/product';
import { useFetchCategories } from '@/modules/products/hook/useCategories';
import { Package, Image as ImageIcon, DollarSign, Layers, Tag, Check, X } from 'lucide-react';

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (data: Omit<Product, 'createdAt' | 'updatedAt'>) => Promise<void>;
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSubmit }) => {
  const { data: categories } = useFetchCategories();
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: "",
    description: "",
    price: 0,
    imagen_url: "",
    category_id: "11111111-1111-1111-1111-111111111111",
    stock: 50,
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
          price: parseFloat(formData.price.toString()),
        };
        await onSubmit({ id: product.id, ...payload });
      } else {
        await onSubmit(formData);
      }
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-lg">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-green-600" />
            <DialogTitle className="text-2xl font-semibold text-gray-800">
              {product ? `Editar Producto` : "Crear Nuevo Producto"}
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <Card className="p-6 border border-gray-300 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Columna izquierda */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <Tag className="h-4 w-4 mr-2" />
                    Nombre del Producto
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <Package className="h-4 w-4 mr-2" />
                    Descripción
                  </Label>
                  <Input
                    id="description"
                    name="description"
                    type="text"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    URL de la imagen
                  </Label>
                  <Input
                    id="imagen_url"
                    name="imagen_url"
                    type="text"
                    value={formData.imagen_url}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>

              {/* Columna derecha */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Precio
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price.toFixed(2)}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <Layers className="h-4 w-4 mr-2" />
                    Stock
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    required
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center text-sm font-medium text-gray-700">
                    <Package className="h-4 w-4 mr-2" />
                    Categoría
                  </Label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
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
              </div>
            </div>
          </Card>

          <DialogFooter className="border-t pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="border-gray-400 text-gray-700 hover:bg-gray-100"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
            >
              <Check className="h-4 w-4 mr-2" />
              {product ? "Actualizar Producto" : "Crear Producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;