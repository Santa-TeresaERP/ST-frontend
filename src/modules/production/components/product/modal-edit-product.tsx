import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Product } from '../../types/products';
import { z } from 'zod';
import { productSchema } from '../../schemas/productValidation';

interface ModalEditProductoProps {
  isOpen: boolean;
  onClose: () => void;
  producto: any;
  onSubmit?: (data: {
    id?: string;
    nombre: string;
    categoria: string;
    precio: number;
    descripcion: string;
    imagen_url: string;
  }) => Promise<void>;
}

const ModalEditProducto: React.FC<ModalEditProductoProps> = ({ isOpen, onClose, producto, onSubmit }) => {
  const [formData, setFormData] = React.useState({
    id: producto?.id || '',
    nombre: producto?.name || '',
    categoria: producto?.category_id || '',
    precio: producto?.price || 0,
    descripcion: producto?.description || '',
    imagen_url: producto?.imagen_url || '',
  });

  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof Product, string>>>({});

  useEffect(() => {
    if (producto) {
      setFormData(producto);
    } else {
      setFormData({
        id: '',
        nombre: '',
        categoria: '',
        precio: 0,
        descripcion: '',
        imagen_url: '',
      });
    }
    setErrors({});
  }, [producto, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e. preventDefault();
    try{
      productSchema.parse(formData);
      setErrors({});
      setShowConfirmation(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof Product, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof Product] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Editar Producto</h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-blue-800 transition-colors text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del producto*</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoría*</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Categoría"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio (S/.)*</label>
              <input
                type="number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción*</label>
              <textarea
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Descripción detallada del producto"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="URL de la imagen"
              />
            </div>
          </div>

          {/* Columna derecha - Receta */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Receta del Producto</h3>
              {/* Aquí irán los campos de ingredientes */}
            </div>
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
            disabled
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditProducto;