import React, { useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { Save, X } from 'lucide-react';
import { useCreateLocation } from '../../hook/useLocations';

const ModalCreateLocation = ({ handleClose }: { handleClose: () => void }) => {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [estado, setEstado] = useState('');
  const [localError, setLocalError] = useState('');

  const {
    mutate,
    status,
    error,
  } = useCreateLocation();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre || !direccion || !capacidad || !estado) {
      setLocalError('Todos los campos son obligatorios.');
      return;
    }

    const payload = {
      name: nombre,
      address: direccion,
      capacity: Number(capacidad),
      status: estado,
    };

    console.log('🚀 Creating location with payload:', payload);

    mutate(payload, {
      onSuccess: (data) => {
        console.log('✅ Location created successfully:', data);
        handleClose();
      },
      onError: (error) => {
        console.error('❌ Error creating location:', error);
        setLocalError('Hubo un error al crear la locación.');
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative mx-2">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiMapPin size={24} />
          <h2 className="text-xl font-semibold text-center">Crear Locación</h2>
          <button
            onClick={handleClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-5 text-left">
          {localError && (
            <p className="text-sm text-red-600 font-medium">{localError}</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-600 font-medium">
              {(error as Error)?.message || 'Error desconocido.'}
            </p>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Nombre de la Locación <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Nombre de la locación"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Dirección de la Locación <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Dirección"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Capacidad <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={capacidad}
                onChange={(e) => setCapacidad(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Capacidad máxima"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Estado <span className="text-red-600">*</span>
              </label>
              <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none bg-white"
              >
                <option value="">-- Seleccione estado --</option>
                <option value="Disponible">Disponible</option>
                <option value="No disponible">No disponible</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={status === 'pending'}
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={18} /> {status === 'pending' ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateLocation;
