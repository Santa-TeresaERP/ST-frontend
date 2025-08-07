import React, { useEffect, useState } from 'react';
import { Place } from '../../types/places';
import { usePlaces } from '../../hook/usePlaces';
import ModalCreatePlace from './modal-create-place';
import PlaceCard from './place-card';

const Places: React.FC = () => {
  const { fetchPlaces, createPlace, updatePlace, deletePlace } = usePlaces();
  const [places, setPlaces] = useState<Place[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Fetch all places on mount
  useEffect(() => {
    fetchPlaces().then(setPlaces);
  }, [fetchPlaces]);

  // Handle create
  const handleCreate = async (placeData: Omit<Place, '_id'>) => {
    const newPlace = await createPlace(placeData);
    setPlaces((prev) => [...prev, newPlace]);
    setIsCreateModalOpen(false);
  };

  // Handle edit
  const handleEdit = async (placeId: string, updated: Partial<Place>) => {
    const updatedPlace = await updatePlace(placeId, updated);
    setPlaces((prev) => prev.map((p) => (p._id === placeId ? updatedPlace : p)));
  };

  // Handle delete
  const handleDelete = async (placeId: string) => {
    await deletePlace(placeId);
    setPlaces((prev) => prev.filter((p) => p._id !== placeId));
  };

  // Handle view rentals (dummy)
  const handleViewRentals = (place: Place) => {
    // Implementar lógica para ver alquileres de un lugar
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
      <div className="flex flex-wrap gap-4">
        {places.map((place) => (
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
