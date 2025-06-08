import React, { useState } from 'react';

interface ModalFilterProductProps {
  isOpen: boolean;
  onClose: () => void;
  categories: { id: string; name: string }[];
  onFilter: (filters: { startDate: string; endDate: string; category: string }) => void;
}

const ModalFilterProduct: React.FC<ModalFilterProductProps> = ({ isOpen, onClose, categories, onFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleApplyFilters = () => {
    onFilter({ startDate, endDate, category: selectedCategory });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100">
      {/* Header del modal */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5">
        <h3 className="text-xl font-semibold text-white">Filtrar Productos</h3>
      </div>

      {/* Cuerpo del modal */}
      <div className="p-6 space-y-5">
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Rango de fechas</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Fecha inicio</p>
            </div>
            <div>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Fecha fin</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="" className="text-gray-400">Todas las categorías</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id} className="text-gray-800">
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Footer del modal */}
      <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 shadow-sm"
        >
          Cancelar
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-5 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  </div>
);
};

export default ModalFilterProduct;