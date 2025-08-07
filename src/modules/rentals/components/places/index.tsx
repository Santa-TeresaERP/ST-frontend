import React, { useState } from 'react';
import { Place } from '../../types/places';
import { useFetchPlaces, useCreatePlace, useUpdatePlace, useDeletePlace } from '../../hook/usePlaces';
import ModalCreatePlace from './modal-create-place';
import PlaceCard from './place-card';

const Places: React.FC = () => {
  const { data: places, isLoading, isError } = useFetchPlaces();
  const createPlace = useCreatePlace();
  const updatePlace = useUpdatePlace();
  const deletePlace = useDeletePlace();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Handle create
  const handleCreate = async (placeData: Omit<Place, '_id'>) => {
    createPlace.mutate(placeData, {
      onSuccess: () => setIsCreateModalOpen(false)
    });
  };

  // Handle edit
  const handleEdit = async (placeId: string, updated: Partial<Place>) => {
    updatePlace.mutate({ id: placeId, payload: updated });
  };

  // Handle delete
  const handleDelete = async (placeId: string) => {
    deletePlace.mutate(placeId);
  };

  // Handle view rentals (dummy)
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
        {places && places.map((place) => (
          <PlaceCard
            key={place._id}
            place={place}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewRentals={handleViewRentals}
          />
        ))}
      </div>
      {isCreateModalOpen && (
        <ModalCreatePlace
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
};


export default Places;
