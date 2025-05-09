import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Trash2, Save } from 'lucide-react';

export interface Plant {
  id: string;
  nombre: string;
}

interface PlantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plants: Plant[]) => void;
}

const PlantModal: React.FC<PlantModalProps> = ({ isOpen, onClose, onSave }) => {
  const [plants, setPlants] = useState<Plant[]>([]);

  const agregarPlanta = () => {
    setPlants([...plants, { id: Date.now().toString(), nombre: ''}]);
  };

  const handleChange = (index: number, field: keyof Plant, value: string) => {
    const newPlants = [...plants];
    newPlants[index][field] = value;
    setPlants(newPlants);
  };

  const handleEliminar = (index: number) => {
    const newPlants = plants.filter((_, i) => i !== index);
    setPlants(newPlants);
  };

  const handleGuardar = (index: number) => {
    const categoria = plants[index];
    console.log('Categoría guardada:', categoria);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 md:p-8">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-red-700">Gestión de Plantas</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-3xl font-light">
              <FiX />
            </button>
          </div>
          <hr className="mt-2 border-t-2 border-red-500 w-1/3" />
        </div>

        {/* Botón Agregar Planta */}
        <div className="flex justify-end mb-6">
          <button
            onClick={agregarPlanta}
            className="bg-red-800 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
          >
            Agregar Planta
          </button>
        </div>

        {/* Contenedores de Plantas */}
        {plants.map((plant, index) => (
          <div
            key={plant.id}
            className="bg-gray-50 border border-gray-300 rounded-xl p-4 md:p-6 shadow-md flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-4"
          >
            {/* Nombre */}
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 font-medium">Nombre de la Planta</label>
              <input
                type="text"
                value={plant.nombre}
                onChange={(e) => handleChange(index, 'nombre', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ingrese el nombre"
              />
            </div>

            {/* Íconos */}
            <div className="flex items-center justify-center gap-3 pt-8 md:pt-2">
              <button
                type="button"
                onClick={() => handleGuardar(index)}
                className="text-green-600 hover:text-green-700 transition-transform transform hover:scale-110"
                title="Guardar"
              >
                <Save size={24} />
              </button>
              <button
                type="button"
                onClick={() => handleEliminar(index)}
                className="text-red-600 hover:text-red-700 transition-transform transform hover:scale-110"
                title="Eliminar"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlantModal;