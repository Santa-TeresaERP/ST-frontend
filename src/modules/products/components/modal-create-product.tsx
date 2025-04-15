"use client";

import React, { useState, useEffect } from 'react';
import { Product } from '@/modules/products/types/product';
import { useFetchCategories } from '@/modules/products/hook/useCategories';
import { z } from 'zod';
import { productsSchema } from '@/modules/products/Schema/productValidation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../../../app/components/ui/dialog";
import { Button } from "../../../app/components/ui/button";
import { Input } from "../../../app/components/ui/input";
import { Label } from "../../../app/components/ui/label";
import { Card } from "../../../app/components/ui/card";
import { Package, Upload, Link, Check, AlertTriangle, ImageIcon } from 'lucide-react';

type ProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmit: (data: Omit<Product, 'created_at' | 'updated_at'>) => Promise<void>;
};

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSubmit }) => {
  const { data: categories } = useFetchCategories();
  const [name, setName] = useState(product?.name || '');
  const [category_id, setCategoryId] = useState(product?.category_id || '');
  const [price, setPrice] = useState(product?.price || 0);
  const [stock, setStock] = useState(product?.stock || 0);
  const [description, setDescription] = useState(product?.description || '');
  const [imagen_url, setImagenUrl] = useState(product?.image_url || '');
  const [useUrl, setUseUrl] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setCategoryId(product.category_id);
      setPrice(product.price);
      setStock(product.stock);
      setDescription(product.description);
      setImagenUrl(product.imagen_url);
    } else {
      // Reset form when creating new product
      setName('');
      setCategoryId('');
      setPrice(0);
      setStock(0);
      setDescription('');
      setImagenUrl('');
      setUseUrl(true);
    }
    setErrors({});
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = { name, category_id, price, stock, description, imagen_url };
  
    const result = productsSchema.safeParse(formData);
    if (!result.success) {
      const validationErrors: Record<string, string> = {};
      result.error.errors.forEach((error: z.ZodIssue) => {
        if (error.path.length > 0) {
          validationErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(validationErrors);
      return;
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    const formData = { name, category_id, price, stock, description, imagen_url };
    try {
      await onSubmit(formData);
      setShowConfirmation(false);
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagenUrl(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[700px] rounded-lg">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center space-x-3">
              <Package className="h-6 w-6 text-green-600" />
              <DialogTitle className="text-2xl font-semibold text-black">
                {product ? `Editar Producto - ${product.name}` : "Crear Nuevo Producto"}
              </DialogTitle>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 border border-gray-400 shadow-sm">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium text-gray-700">
                      <Package className="h-4 w-4 mr-2" />
                      Nombre del Producto
                    </Label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black`}
                      required
                    />
                    {errors.name && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium text-gray-700">
                      <Package className="h-4 w-4 mr-2" />
                      Categoría
                    </Label>
                    <select
                      value={category_id}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className={`w-full p-3 border ${errors.category_id ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black`}
                      required
                    >
                      <option value="">Seleccione una categoría</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.category_id && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.category_id}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium text-gray-700">
                      <Package className="h-4 w-4 mr-2" />
                      Precio
                    </Label>
                    <Input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className={`w-full p-3 border ${errors.price ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black`}
                      required
                    />
                    {errors.price && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.price}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium text-gray-700">
                      <Package className="h-4 w-4 mr-2" />
                      Stock
                    </Label>
                    <Input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(Number(e.target.value))}
                      className={`w-full p-3 border ${errors.stock ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black`}
                      required
                    />
                    {errors.stock && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.stock}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-4 border border-gray-400 shadow-sm">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium text-gray-700">
                      <Package className="h-4 w-4 mr-2" />
                      Descripción
                    </Label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black min-h-[120px]`}
                      required
                    />
                    {errors.description && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center text-sm font-medium text-gray-700">
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Imagen del Producto
                    </Label>
                    <div className="flex items-center space-x-4 mb-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          id="url"
                          name="imageSource"
                          checked={useUrl}
                          onChange={() => setUseUrl(true)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-400"
                        />
                        <span className="ml-2 flex items-center">
                          <Link className="h-4 w-4 mr-1" /> URL
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          id="upload"
                          name="imageSource"
                          checked={!useUrl}
                          onChange={() => setUseUrl(false)}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-400"
                        />
                        <span className="ml-2 flex items-center">
                          <Upload className="h-4 w-4 mr-1" /> Subir Imagen
                        </span>
                      </label>
                    </div>
                    {useUrl ? (
                      <Input
                        type="text"
                        value={imagen_url}
                        onChange={(e) => setImagenUrl(e.target.value)}
                        className={`w-full p-3 border ${errors.image_url ? 'border-red-500' : 'border-gray-400'} rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black`}
                        required
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-400 rounded-lg p-4">
                        <input
                          type="file"
                          onChange={handleImageUpload}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-green-50 file:text-green-700
                            hover:file:bg-green-100"
                          required
                        />
                        {imagen_url && (
                          <div className="mt-2 text-sm text-gray-600">
                            Imagen seleccionada
                          </div>
                        )}
                      </div>
                    )}
                    {errors.image_url && (
                      <div className="flex items-center text-red-500 text-sm mt-1">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {errors.image_url}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            <DialogFooter className="border-t pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                className="border-gray-400 text-gray-700 hover:bg-gray-200"
              >
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

      {/* Modal de Confirmación */}
      {showConfirmation && (
        <Dialog open={showConfirmation} onOpenChange={() => setShowConfirmation(false)}>
          <DialogContent className="sm:max-w-[425px] rounded-lg">
            <DialogHeader className="border-b pb-4">
              <div className="flex items-center space-x-3">
                <Package className="h-6 w-6 text-green-600" />
                <DialogTitle className="text-xl font-semibold text-black">
                  Confirmar Cambios
                </DialogTitle>
              </div>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-gray-600">
                ¿Estás seguro de que deseas {product ? "actualizar" : "crear"} este producto?
              </p>
              <div className="bg-gray-100 border-l-4 border-gray-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700">
                      Esta acción {product ? "actualizará" : "creará"} el producto en el sistema.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="border-t pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="border-gray-400 text-gray-700 hover:bg-gray-200"
              >
                Revisar de nuevo
              </Button>
              <Button 
                type="button" 
                onClick={handleConfirmSubmit}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white shadow-lg"
              >
                <Check className="h-4 w-4 mr-2" />
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ProductModal;