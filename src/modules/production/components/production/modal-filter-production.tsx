import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';

interface ModalFilterProductionProps {
  isOpen: boolean;
  onClose: () => void;
  plants: { id: string; name: string }[];
  onFilter: (filters: { startDate: string; endDate: string; plant: string }) => void;
}

const ModalFilterProduction: React.FC<ModalFilterProductionProps> = ({ isOpen, onClose, plants, onFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedPlant, setSelectedPlant] = useState('');

  const handleApplyFilters = () => {
    onFilter({ startDate, endDate, plant: selectedPlant });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Filtrar Producción</h2>
            <p className="text-blue-100 mt-1 text-sm">Define los criterios para el filtrado</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-blue-700 text-white transition"
            aria-label="Cerrar modal"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Inicio</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Fin</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Planta</label>
            <select
              value={selectedPlant}
              onChange={(e) => setSelectedPlant(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las plantas</option>
              {plants.map((plant) => (
                <option key={plant.id} value={plant.id}>
                  {plant.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white shadow-md hover:shadow-lg transition"
          >
            <Filter size={18} /> Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalFilterProduction;
