import React, { useEffect, useState } from 'react';
import { Location } from '../../types/location';
import { FiX } from 'react-icons/fi';
import { useCreatePlace } from '../../hook/usePlaces';
import { CreatePlacePayload } from '../../types/places';

interface ModalCreatePlaceProps {
  onClose: () => void;
  onCreated?: () => void;
  locationId?: string;
}

import { fetchLocations } from '../../action/locationActions';

const ModalCreatePlace: React.FC<ModalCreatePlaceProps> = ({ onClose, onCreated, locationId }) => {
  const [formData, setFormData] = useState({
    name: '',
    area: '',
    location_id: locationId || ''
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);
  const [isErrorLocations, setIsErrorLocations] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { mutate: createPlace } = useCreatePlace();
  
  const handleSuccess = () => {
    if (onCreated) onCreated();
    onClose();
  };

  useEffect(() => {
    setIsLoadingLocations(true);
    fetchLocations()
      .then((data) => {
        const array = Array.isArray(data)
          ? data
          : Array.isArray((data as any)?.data)
            ? (data as any).data
            : [];
        setLocations(array);
        setIsErrorLocations(false);
      })
      .catch(() => {
        setLocations([]);
        setIsErrorLocations(true);
      })
      .finally(() => setIsLoadingLocations(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.area || !formData.location_id) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    
    setFormError(null);
    
    const payload: CreatePlacePayload = {
      name: formData.name,
      area: formData.area,
      location_id: formData.location_id
    };
    
    createPlace(payload, {
      onSuccess: handleSuccess,
      onError: (error: Error) => {
        console.error('Error al crear el lugar:', error);
        setFormError('Error al crear el lugar. Por favor, inténtalo de nuevo.');
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Crear Lugar</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {isLoadingLocations && <p className="text-sm text-gray-500 mb-2">Cargando ubicaciones...</p>}
        {isErrorLocations && <p className="text-sm text-red-500 mb-2">Error al cargar ubicaciones.</p>}
        {formError && <p className="text-sm text-red-500 mb-2">{formError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre del lugar
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>
          <div>
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Área
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            />
          </div>
          <div>
            <label htmlFor="location_id" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <select
              id="location_id"
              name="location_id"
              value={formData.location_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              required
            >
              <option value="">Selecciona una ubicación</option>
              {isLoadingLocations && <option disabled>Cargando localizaciones...</option>}
              {isErrorLocations && <option disabled>Error cargando localizaciones</option>}
              {!isLoadingLocations && !isErrorLocations && Array.isArray(locations) && locations.map((loc: Location) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              disabled={createPlace.status === 'pending'}
            >
              {createPlace.status === 'pending' ? 'Creando...' : 'Crear Lugar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreatePlace;
