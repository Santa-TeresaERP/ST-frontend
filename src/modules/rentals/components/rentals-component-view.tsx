import React, { useState } from 'react';
import { FiPlus, FiInfo, FiMapPin, FiHome, FiBarChart2, FiCheckCircle, FiEdit } from 'react-icons/fi';
import ModalCreateLocation from './information location/modal-create-location';
import ModalEditLocation from './information location/modal-edit-location';

const RentalsComponentView = () => {
  const [isCreateLocationModalOpen, setIsCreateLocationModalOpen] = useState(false);
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null); // Estado real para selectedLocation

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-center text-red-700 pb-4">Panel de Alquileres</h1>
        <p className="text-gray-600 text-center">Gestión completa de alquileres y eventos disponibles</p>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Seleccionar Alquiler</h2>

          <button
            onClick={() => setIsCreateLocationModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus size={16} /> Nueva Locación
          </button>
        </div>

        <div>
          <select
            id="rental-select"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
          >
            <option value="">-- Seleccione un alquiler --</option>
            <option value="1">Alquiler 1</option>
            <option value="2">Alquiler 2</option>
          </select>
        </div>
      </div>

      {/* Información de la Locación */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <FiInfo className="text-red-600" size={24} />
            <h2 className="text-2xl font-bold text-red-700">Información de la Locación</h2>
          </div>

          <button
            onClick={() => setIsEditLocationModalOpen(true)}
            className="flex items-center space-x-1 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiEdit size={18} />
            <span>Editar Locación</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <FiHome className="text-red-500" size={20} />
              <span className="font-semibold">Nombre de la Locación</span>
            </div>
            <p className={selectedLocation ? 'text-gray-900' : 'text-gray-400 italic'}>
              {selectedLocation ? selectedLocation.nombre : 'Selecciona una locación para ver su información'}
            </p>
          </div>

          <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <FiMapPin className="text-red-500" size={20} />
              <span className="font-semibold">Dirección</span>
            </div>
            <p className={selectedLocation ? 'text-gray-900' : 'text-gray-400 italic'}>
              {selectedLocation ? selectedLocation.direccion : 'Selecciona una locación para ver la dirección'}
            </p>
          </div>

          <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <FiBarChart2 className="text-red-500" size={20} />
              <span className="font-semibold">Capacidad</span>
            </div>
            <p className={selectedLocation ? 'text-gray-900' : 'text-gray-400 italic'}>
              {selectedLocation ? selectedLocation.capacidad : 'Selecciona una locación para ver la capacidad'}
            </p>
          </div>

          <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-2">
              <FiCheckCircle className="text-red-500" size={20} />
              <span className="font-semibold">Estado</span>
            </div>
            <p className={selectedLocation ? 'text-gray-900' : 'text-gray-400 italic'}>
              {selectedLocation ? selectedLocation.estado : 'Selecciona una locación para ver el estado'}
            </p>
          </div>
        </div>
      </div>

      {isCreateLocationModalOpen && (
        <ModalCreateLocation 
          handleClose={() => setIsCreateLocationModalOpen(false)} 
          handleSubmit={(data) => {
            console.log('Crear locación:', data);
            setIsCreateLocationModalOpen(false);
            setSelectedLocation(data); // opcional: actualizar la locación seleccionada
          }} 
        />
      )}

      {isEditLocationModalOpen && (
        <ModalEditLocation 
          handleClose={() => setIsEditLocationModalOpen(false)} 
          handleSubmit={(data) => {
            console.log('Editar locación:', data);
            setIsEditLocationModalOpen(false);
            setSelectedLocation(data); // opcional: actualizar la locación seleccionada
          }} 
          locationData={selectedLocation || { nombre: '', direccion: '', capacidad: '', estado: '' }}
        />
      )}
    </div>
  );
};

export default RentalsComponentView;
