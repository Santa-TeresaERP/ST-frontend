import React, { useState } from 'react';
import { Place } from '../../types/places.d';
import { useFetchPlaces, useDeletePlace } from '../../hook/usePlaces';
import { useQueryClient } from '@tanstack/react-query';
import ModalCreatePlace from './modal-create-place';
import ModalEditPlace from './modal-edit-place';
import PlaceCard from './place-card';

const Places: React.FC = () => {
  const { data: places = [], isLoading, isError } = useFetchPlaces();
  const deletePlace = useDeletePlace();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<Place | null>(null);
  const queryClient = useQueryClient();

  const handleCreated = () => {
    // Invalidar la consulta para forzar la recarga de lugares
    queryClient.invalidateQueries({ queryKey: ['places'] });
    setIsCreateModalOpen(false);
  };

  const handleUpdated = () => {
    queryClient.invalidateQueries({ queryKey: ['places'] });
    setEditingPlace(null);
  };

  const handleDelete = async (placeId: string) => {
    try {
      await deletePlace.mutateAsync(placeId);
    } catch (error) {
      console.error('Error eliminando lugar:', error);
    }
  };

  const handleViewRentals = (place: Place) => {
    alert(`Ver alquileres de: ${place.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lugares</h1>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Crear Lugar
        </button>
      </div>

      {isLoading && <p>Cargando lugares...</p>}
      {isError && <p>Error al cargar lugares.</p>}

      <div className="flex flex-wrap gap-4">
        {places.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            onEdit={() => setEditingPlace(place)}
            onDelete={handleDelete}
            onViewRentals={handleViewRentals}
          />
        ))}
      </div>

      {/* Modal de creación */}
      {isCreateModalOpen && (
        <ModalCreatePlace
          isOpen={true}
          onClose={() => setIsCreateModalOpen(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Modal de edición */}
      {editingPlace && (
        <ModalEditPlace
          place={editingPlace}
          onClose={() => setEditingPlace(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
};

export default Places;