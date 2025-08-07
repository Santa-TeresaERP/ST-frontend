import React, { useState } from 'react';
import { Location } from '../../types/location';
import { FiX } from 'react-icons/fi';
import { Place } from '../../types/places';
import { useUpdatePlace } from '../../hook/usePlaces';
import { useFetchLocations } from '../../hook/useLocations';

interface ModalEditPlaceProps {
  place: Place;
  onClose: () => void;
}

const ModalEditPlace: React.FC<ModalEditPlaceProps> = ({ place, onClose }) => {
  const [formData, setFormData] = useState({
    name: place.name,
    area: place.area,
    location_id: place.location_id
  });
  const [formError, setFormError] = useState<string | null>(null);

  const updatePlace = useUpdatePlace();
  const { data, isLoading, isError } = useFetchLocations();
  const locations = React.useMemo(() => {
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object' && Array.isArray((data as any)?.data)) {
      return (data as any).data;
    }
    return [];
  }, [data]);
  React.useEffect(() => {
    console.log('Datos de ubicaciones recibidos:', data);
    console.log('Ubicaciones procesadas:', locations);
  }, [data, locations]);

  const currentLocationName = React.useMemo(() => {
    if (!formData.location_id || !locations.length) return 'Cargando ubicaciones...';
    const location = locations.find((loc: Location) => loc.id === formData.location_id);
    return location ? location.name : 'Ubicación no disponible';
  }, [formData.location_id, locations]);

  React.useEffect(() => {
    console.log('Current location_id:', formData.location_id);
    console.log('All locations:', locations);
    const foundLocation = locations.find((l: Location) => String(l.id).trim() === String(formData.location_id).trim());
    console.log('Found location:', foundLocation);
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
          onClose();
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
