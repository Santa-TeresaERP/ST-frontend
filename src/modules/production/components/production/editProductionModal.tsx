import React, { useState, useEffect } from 'react';
import { ProductionData } from './production-stats-component-view';

interface EditProductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (production: ProductionData) => void;
  production: ProductionData;
}

const EditProductionModal: React.FC<EditProductionModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  production 
}) => {
  const [formData, setFormData] = useState<ProductionData>(production);

  useEffect(() => {
    setFormData(production);
  }, [production]);

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
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-bold text-gray-800">Editar Producción</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
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
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600"
            >
              Actualizar Producción
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductionModal;