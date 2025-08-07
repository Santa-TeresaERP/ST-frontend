import React, { useState, useEffect } from 'react';
import { FiMapPin, FiHome, FiBarChart2, FiCheckCircle } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import ModalCreateLocation from './information location/modal-create-location';
import ModalEditLocation from './information location/modal-edit-location';
import ModalCreatePlace from './places/modal-create-place';
import PlaceCard from './places/place-card';
import RentalHistoryView from './rental-history/rental-history-view';
import { Place } from '../types';
import { Location } from '../types/location'; // ✅ Usar el tipo correcto
import { useFetchLocations } from '../hook/useLocations'; // ✅ Usar hook real
import { useFetchPlacesByLocation, useCreatePlace } from '../hook/usePlaces'; // ✅ Hooks para places
import { useQueryClient } from '@tanstack/react-query';

const RentalsComponentView = () => {
  const [isCreateLocationModalOpen, setIsCreateLocationModalOpen] = useState(false);
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false);
  const [isCreatePlaceModalOpen, setIsCreatePlaceModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"main" | "rental-history">("main");
  const [selectedPlaceForRentals, setSelectedPlaceForRentals] = useState<Place | null>(null);
  
  // ✅ Estado usando hooks reales - SIN mock data
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [forceRefetchKey, setForceRefetchKey] = useState<number>(0); // ✅ Key para forzar refetch
  const { data: locations = [], isLoading: locationsLoading, error: locationsError } = useFetchLocations();
  
  // ✅ Hook para cargar places por locación seleccionada - con key de forzado
  const { data: places = [], isLoading: placesLoading, error: placesError } = useFetchPlacesByLocation(selectedLocation?.id || null, forceRefetchKey);
  const createPlaceMutation = useCreatePlace();
  
  const queryClient = useQueryClient();

  // Efecto para manejar cambios en places
  useEffect(() => {
    // Places cambió para la ubicación seleccionada
  }, [places, selectedLocation, placesLoading, placesError, forceRefetchKey]);

  // Efecto cuando se selecciona una locación
  useEffect(() => {
    if (selectedLocation) {
      // Location seleccionada - places deberían actualizarse
    }
  }, [selectedLocation]);

  // Funciones para manejar locaciones
  const handleSelectLocation = async (location: Location) => {
    // FORZAR LIMPIEZA COMPLETA antes del cambio
    
    // 1. Cancelar queries en progreso
    await queryClient.cancelQueries({
      queryKey: ['places']
    });
    
    // 2. Remover completamente del cache
    queryClient.removeQueries({
      queryKey: ['places'],
      exact: false
    });
    
    // 3. Incrementar force key para forzar nueva query
    setForceRefetchKey(prev => prev + 1);
    
    // 4. Cambiar la locación seleccionada
    setSelectedLocation(location);
  };

  // Funciones para manejar lugares usando hooks reales
  const handleCreatePlace = async (newPlace: { nombre: string; area: string }) => {
    try {
      if (!selectedLocation?.id) {
        alert('Selecciona una locación primero');
        return;
      }
      // Crear place con datos reales en el backend
      const payload = {
        nombre: newPlace.nombre,
        area: newPlace.area,
        location_id: selectedLocation.id
      };

      await createPlaceMutation.mutateAsync(payload);

      setIsCreatePlaceModalOpen(false);
    } catch (error) {
      alert('Error al crear el lugar');
    }
  };

  const handleEditPlace = (placeId: string, updatedPlace: Partial<Place>) => {
    // Implementación de edición pendiente
    console.log('Editar place:', placeId, updatedPlace);
  };

  const handleDeletePlace = (placeId: string) => {
    // Implementación de eliminación pendiente
    console.log('Eliminar place:', placeId);
  };

  const handleViewRentals = (place: Place) => {
    setSelectedPlaceForRentals(place);
    setCurrentView("rental-history");
  };

  const handleBackToMain = () => {
    setCurrentView("main");
    setSelectedPlaceForRentals(null);
  };

  const places = allPlaces.filter((p) => p.location_id === selectedLocation?.id);

  if (currentView === "rental-history" && selectedPlaceForRentals) {
    return (
      <RentalHistoryView
        placeName={selectedPlaceForRentals.nombre}
        placeId={selectedPlaceForRentals.id}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center text-red-600 pb-6">Alquileres</h1>

      {/* Selector de Locaciones */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            {(() => {
              if (locationsLoading) {
                return (
                  <div className="w-full p-3 border border-gray-300 rounded-full bg-gray-100 text-gray-500">
                    Cargando locaciones...
                  </div>
                );
              }
              
              if (locationsError) {
                return (
                  <div className="w-full p-3 border border-red-300 rounded-full bg-red-50 text-red-600">
                    Error al cargar locaciones: {locationsError.message}
                  </div>
                );
              }
              
              if (!Array.isArray(locations)) {
                return (
                  <div className="w-full p-3 border border-red-300 rounded-full bg-red-50 text-red-600">
                    Error: Datos inválidos recibidos
                  </div>
                );
              }
              
              if (locations.length === 0) {
                return (
                  <div className="w-full p-3 border border-gray-300 rounded-full bg-yellow-50 text-yellow-600">
                    No hay locaciones creadas. Crea la primera locación.
                  </div>
                );
              }
              
              return (
                <select
                  value={selectedLocation?.id || ''}
                  onChange={(e) => {
                    const location = locations.find(loc => loc.id === e.target.value);
                    if (location) {
                      handleSelectLocation(location);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
                >
                  <option value="">Seleccionar locación</option>
                  {locations.map((location) => {
                    return (
                      <option key={location.id} value={location.id}>
                        {location.name} - {location.address}
                      </option>
                    );
                  })}
                </select>
              );
            })()}
          </div>

          <button
            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            onClick={() => setIsCreateLocationModalOpen(true)}
          >
            + Nueva locación
          </button>
        </div>
      </div>

      {/* Información de la Localización */}
      {selectedLocation ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <MdLocationOn className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-red-600">Información de Localización</h2>
            </div>

            <button
              onClick={() => setIsEditLocationModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              + Editar locación
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FiHome className="text-red-500" size={20} />
                <span className="font-semibold text-gray-900">Nombre de la Locación</span>
              </div>
              <p className="text-gray-700 ml-7">{selectedLocation.name}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FiMapPin className="text-red-500" size={20} />
                <span className="font-semibold text-gray-900">Dirección de la Localización</span>
              </div>
              <p className="text-gray-700 ml-7">{selectedLocation.address}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FiBarChart2 className="text-red-500" size={20} />
                <span className="font-semibold text-gray-900">Capacidad</span>
              </div>
              <p className="text-gray-700 ml-7">{selectedLocation.capacity}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <FiCheckCircle className="text-red-500" size={20} />
                <span className="font-semibold text-gray-900">Estado</span>
              </div>
              <p className="text-green-600 font-medium ml-7">{selectedLocation.status}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="text-center py-8">
            <MdLocationOn className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay locación seleccionada</h3>
            <p className="text-gray-500">Selecciona una locación o crea una nueva para comenzar</p>
          </div>
        </div>
      )}

      {/* Lugares en la Localización */}
      {selectedLocation ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <MdLocationOn className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-red-600">Lugares en {selectedLocation.name}</h2>
            </div>

            <button
              onClick={() => setIsCreatePlaceModalOpen(true)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
            >
              + Nuevo Lugar
            </button>
          </div>

          {places.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map((place: Place) => (
                <PlaceCard
                  key={`${selectedLocation?.id}-${place.id}-${forceRefetchKey}`}
                  place={place}
                  onEdit={handleEditPlace}
                  onDelete={handleDeletePlace}
                  onViewRentals={handleViewRentals}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FiHome className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay lugares en esta locación</h3>
              <p className="text-gray-500 mb-4">Crea el primer lugar para comenzar a gestionar alquileres</p>
              <button
                onClick={() => setIsCreatePlaceModalOpen(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                + Crear primer lugar
              </button>
            </div>
          )}
        </div>
      ) : null}

      {/* Modales */}
      {isCreateLocationModalOpen && (
        <ModalCreateLocation 
          handleClose={() => setIsCreateLocationModalOpen(false)} 
        />
      )}

      {isEditLocationModalOpen && selectedLocation && (
        <ModalEditLocation 
          handleClose={() => setIsEditLocationModalOpen(false)} 
          locationData={selectedLocation}
        />
      )}

      {isCreatePlaceModalOpen && selectedLocation && (
        <ModalCreatePlace
          locationId={selectedLocation.id}
          onClose={() => setIsCreatePlaceModalOpen(false)}
          onCreated={() => {
            queryClient.invalidateQueries({ queryKey: ['places', selectedLocation.id] });
          }}
        />
      )}
    </div>
  );
};

export default RentalsComponentView;