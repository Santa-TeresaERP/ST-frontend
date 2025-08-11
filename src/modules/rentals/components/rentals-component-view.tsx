import React, { useState, useEffect, useMemo } from 'react';
import { FiMapPin, FiHome, FiBarChart2, FiCheckCircle, FiChevronLeft, FiChevronRight, FiX, FiUser } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import ModalCreateLocation from './information location/modal-create-location';
import ModalEditLocation from './information location/modal-edit-location';
import ModalCreatePlace from './places/modal-create-place';
import PlaceCard from './places/place-card';
import RentalHistoryView from './rental-history/rental-history-view';
import { Place } from '../types/places.d';
import { Location } from '../types/location';
import { useFetchLocations } from '../hook/useLocations';
import { useFetchPlacesByLocation, useDeletePlace } from '../hook/usePlaces';
import { useFetchCustomers } from '../hook/useCustomers';
import { useQueryClient } from '@tanstack/react-query';

const RentalsComponentView = () => {
  const [isCreateLocationModalOpen, setIsCreateLocationModalOpen] = useState(false);
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false);
  const [isCreatePlaceModalOpen, setIsCreatePlaceModalOpen] = useState(false);
  const [isCustomerPanelOpen, setIsCustomerPanelOpen] = useState(false);

  const [currentView, setCurrentView] = useState<"main" | "rental-history">("main");
  const [selectedPlaceForRentals, setSelectedPlaceForRentals] = useState<Place | null>(null);

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [forceRefetchKey, setForceRefetchKey] = useState<number>(0);

  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 20;

  const { data: locations = [], isLoading: locationsLoading, error: locationsError } = useFetchLocations();
  const { data: places = [], isLoading: placesLoading, error: placesError } = useFetchPlacesByLocation(selectedLocation?.id || null, forceRefetchKey);
  const { data: customers = [], isLoading: customersLoading, error: customersError } = useFetchCustomers();
  const { mutate: deletePlace } = useDeletePlace();
  const queryClient = useQueryClient();

  const totalPages = Math.ceil(places.length / placesPerPage);
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = useMemo(() => places.slice(indexOfFirstPlace, indexOfLastPlace), [places, indexOfFirstPlace, indexOfLastPlace]);

  useEffect(() => {
    if (selectedLocation) {
      setCurrentPage(1); 
    }
  }, [selectedLocation]);

  const handleSelectLocation = async (location: Location) => {

    await queryClient.cancelQueries({
      queryKey: ['places']
    });
    
    queryClient.removeQueries({
      queryKey: ['places'],
      exact: false
    });
    
    setForceRefetchKey(prev => prev + 1);
    setSelectedLocation(location);
  };


  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pageNumbers.push(1, '...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      pageNumbers.push('...', totalPages);
    }
    
    return pageNumbers;
  };

  const handleEditPlace = (placeId: string, updatedPlace: Partial<Place>) => {
    console.log('Editar place:', placeId, updatedPlace);
  };

  const handleDeletePlace = React.useCallback((placeId: string) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro que deseas eliminar este lugar?"
    );
    if (confirmDelete) {
      deletePlace(placeId, {
        onSuccess: () => {
          console.log("Lugar eliminado correctamente");
          setCurrentPage(1);
        },
        onError: (err) => {
          console.error("Error al eliminar lugar:", err);
        },
      });
    }
  }, [deletePlace]);

  const handleViewRentals = (place: Place) => {
    setSelectedPlaceForRentals(place);
    setCurrentView("rental-history");
  };

  const handleBackToMain = () => {
    setCurrentView("main");
    setSelectedPlaceForRentals(null);
  };

  if (currentView === "rental-history" && selectedPlaceForRentals) {
    return (
      <RentalHistoryView
        placeName={selectedPlaceForRentals.name}
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
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name} - {location.address}
                    </option>
                  ))}
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

          <button
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            onClick={() => setIsCustomerPanelOpen(true)}
          >
            👥 Ver clientes
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
            <>
              {placesLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Cargando lugares...</p>
                </div>
              ) : placesError ? (
                <div className="text-center py-8">
                  <p className="text-red-500">Error al cargar lugares: {placesError.message}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentPlaces.map((place: Place) => (
                    <PlaceCard
                      key={`${selectedLocation.id}-${place.id}-${forceRefetchKey}`}
                      place={place}
                      onEdit={handleEditPlace}
                      onDelete={handleDeletePlace}
                      onViewRentals={handleViewRentals}
                    />
                  ))}
                </div>
              )}

              {/* Componente de Paginación */}
              {places.length > placesPerPage && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronLeft size={20} />
                  </button>

                  {renderPageNumbers().map((number, index) => (
                    <button
                      key={index}
                      onClick={() => typeof number === 'number' && handlePageChange(number)}
                      className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors duration-200
                        ${
                          number === currentPage
                            ? 'bg-red-600 text-white shadow-md'
                            : typeof number === 'number'
                            ? 'text-gray-700 bg-gray-200 hover:bg-gray-300'
                            : 'text-gray-500 cursor-default'
                        }`}
                      disabled={typeof number !== 'number'}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : placesLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Cargando lugares...</p>
            </div>
          ) : placesError ? (
            <div className="text-center py-8">
              <p className="text-red-500">Error al cargar lugares: {placesError.message}</p>
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
          isOpen={isCreatePlaceModalOpen}
          locationId={selectedLocation.id}
          onClose={() => setIsCreatePlaceModalOpen(false)}
          onCreated={() => {
            queryClient.invalidateQueries({ queryKey: ['places', selectedLocation.id] });
          }}
        />
      )}

      {/* Panel lateral de clientes */}
      {isCustomerPanelOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-6">
              {/* Header del panel */}
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <FiUser className="text-blue-600" />
                  <span>Lista de Clientes</span>
                </h2>
                <button
                  onClick={() => setIsCustomerPanelOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FiX size={24} />
                </button>
              </div>

              {/* Contenido del panel */}
              {customersLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : customersError ? (
                <div className="text-red-600 text-center py-8">
                  Error al cargar clientes: {customersError.message}
                </div>
              ) : customers.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No hay clientes registrados
                </div>
              ) : (
                <div className="space-y-4">
                  {customers.map((customer) => (
                    <div key={customer.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-start space-x-3">
                        <div className="bg-blue-100 rounded-full p-2">
                          <FiUser className="text-blue-600" size={16} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 text-sm">
                            {customer.full_name}
                          </h3>
                          <p className="text-gray-600 text-xs mt-1">
                            📧 {customer.email}
                          </p>
                          <p className="text-gray-600 text-xs">
                            📱 {customer.phone}
                          </p>
                          <p className="text-gray-600 text-xs">
                            🆔 DNI: {customer.dni}
                          </p>
                          <p className="text-gray-500 text-xs mt-2">
                            ID: {customer.id}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalsComponentView;
