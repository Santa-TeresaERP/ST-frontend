import React, { useState } from 'react';
import { Location } from '../../types/location';
import { FiX } from 'react-icons/fi';
import { Place } from '../../types/places';
import { useUpdatePlace } from '../../hook/usePlaces';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchLocations } from '../../hook/useLocations';

interface ModalEditPlaceProps {
  place: Place;
  onClose: () => void;
  onUpdated?: () => void;
}

const ModalEditPlace: React.FC<ModalEditPlaceProps> = ({ place, onClose, onUpdated }) => {
  const [formData, setFormData] = useState({
    name: place.name,
    area: place.area,
    location_id: place.location_id
  });
  const [formError, setFormError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const updatePlace = useUpdatePlace();
  const { data, isLoading, isError } = useFetchLocations();

  const locations = React.useMemo<Location[]>(() => {
    try {

      if (Array.isArray(data)) {
        return data;
      }

      if (data && typeof data === 'object' && data !== null) {
        const dataObj = data as { data?: unknown };
        if (Array.isArray(dataObj.data)) {
          return dataObj.data as Location[];
        }
      }
      console.warn('Unexpected data format for locations:', data);
      return [];
    } catch (error) {
      console.error('Error processing locations data:', error);
      return [];
    }
  }, [data]);
  React.useEffect(() => {
    console.log('Datos de ubicaciones recibidos:', data);
    console.log('Ubicaciones procesadas:', locations);
  }, [data, locations]);

  React.useEffect(() => {
    if (formData.location_id && locations.length > 0) {
      const foundLocation = locations.find(loc => String(loc.id).trim() === String(formData.location_id).trim());
      console.log('Location debug:', {
        currentLocationId: formData.location_id,
        locations,
        foundLocation,
        locationIdType: typeof formData.location_id,
        locationIds: locations.map(loc => ({
          id: loc.id,
          idType: typeof loc.id,
          name: loc.name
        }))
      });
    }
  }, [formData.location_id, locations]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.area || !formData.location_id) {
      setFormError('Todos los campos son obligatorios.');
      return;
    }
    setFormError(null);
    updatePlace.mutate(
      { id: place.id, payload: formData },
      {
        onSuccess: () => {

          queryClient.invalidateQueries({ queryKey: ['places'] });
          onClose();
          if (onUpdated) {
            onUpdated();
          }
        },
        onError: () => {
          setFormError('Error al actualizar el lugar.');
        }
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Editar Lugar</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
        {isLoading && <p className="text-sm text-gray-500 mb-2">Cargando ubicaciones...</p>}
        {isError && <p className="text-sm text-red-500 mb-2">Error al cargar ubicaciones.</p>}
        {formError && <p className="text-sm text-red-500 mb-2">{formError}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del lugar
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Ej. Zona de piscina"
              required
            />
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
              Área
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Ej. Area Norte"
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
              value={formData.location_id || ''}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
              disabled={isLoading || isError}
            >
              <option value="">Seleccione una ubicación</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          <div className="text-sm text-gray-500">
            <p>Nota: Los lugares se identifican únicamente por nombre y área.</p>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              disabled={updatePlace.status === 'pending'}
            >
              {updatePlace.status === 'pending' ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditPlace;
