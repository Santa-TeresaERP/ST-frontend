import React, { useState } from 'react';
import { ProductionData } from './production-stats-component-view';


interface ProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (production: Omit<ProductionData, 'id'>) => void;
  plants: string[];
}

export interface ProductionFormData {
  produccion: string;
  cantidad: string;
  descripcion: string;
  planta: string;
  fecha: string;
}

const ProductionModal: React.FC<ProductionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProductionFormData>({
    produccion: '',
    cantidad: '',
    descripcion: '',
    planta: 'Santa Catalina',
    fecha: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      cantidad: Number(formData.cantidad)
    });
    setFormData({
      produccion: '',
      cantidad: '',
      descripcion: '',
      planta: 'Santa Catalina',
      fecha: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
      <div className="flex justify-between items-center border-b p-4">
        <div className="flex-1 text-center">
            <h2 className="text-2xl font-semibold text-red-800 inline-block pb-2">
            Registrar Nueva Producción
            </h2>
        </div>
        <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 ml-4"
        >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Producto</label>
            <input
              type="text"
              name="produccion"
              value={formData.produccion}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Cantidad</label>
            <input
              type="number"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Planta</label>
            <select
              name="planta"
              value={formData.planta}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option>Santa Catalina</option>
              <option>Otra Planta</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductionModal;