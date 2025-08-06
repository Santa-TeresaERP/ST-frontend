import React, { useState, useMemo } from 'react';
import { FiMapPin, FiHome, FiBarChart2, FiCheckCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { MdLocationOn } from 'react-icons/md';
import ModalCreateLocation from './information location/modal-create-location';
import ModalEditLocation from './information location/modal-edit-location';
import ModalCreatePlace from './places/modal-create-place';
import PlaceCard from './places/place-card';
import RentalHistoryView from './rental-history/rental-history-view';
import { Location, Place } from '../types';

const RentalsComponentView = () => {
  const [isCreateLocationModalOpen, setIsCreateLocationModalOpen] = useState(false);
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false);
  const [isCreatePlaceModalOpen, setIsCreatePlaceModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'rental-history'>('main');
  const [selectedPlaceForRentals, setSelectedPlaceForRentals] = useState<Place | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    nombre: 'Localización ABC',
    direccion: 'Calle Industrial',
    capacidad: '100',
    estado: 'Desocupado'
  });
  const [places, setPlaces] = useState<Place[]>([
    {
      id: 1,
      nombre: 'Catedral',
      area: 'Area XYZ',
      tipo: 'Catedral'
    },
    {
      id: 2,
      nombre: 'Catedral',
      area: 'Area XYZ',
      tipo: 'Catedral'
    },
    {
      id: 3,
      nombre: 'Catedral',
      area: 'Area XYZ',
      tipo: 'Catedral'
    }
  ]);

  // --- Estado para la paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 20;

  // --- Lógica de paginación ---
  const totalPages = Math.ceil(places.length / placesPerPage);
  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = useMemo(() => places.slice(indexOfFirstPlace, indexOfLastPlace), [places, currentPage, placesPerPage]);

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
  // ---

  const handleCreatePlace = (newPlace: Omit<Place, 'id'>) => {
    setPlaces([...places, { ...newPlace, id: Date.now() }]);
    setIsCreatePlaceModalOpen(false);
    setCurrentPage(1); 
  };

  const handleEditPlace = (placeId: number, updatedPlace: Partial<Place>) => {
    setPlaces(places.map(place => 
      place.id === placeId ? { ...place, ...updatedPlace } : place
    ));
  };

  const handleDeletePlace = (placeId: number) => {
    setPlaces(places.filter(place => place.id !== placeId));
    setCurrentPage(1);
  };

  const handleViewRentals = (place: Place) => {
    setSelectedPlaceForRentals(place);
    setCurrentView('rental-history');
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedPlaceForRentals(null);
  };

  // Renderizado condicional basado en la vista actual
  if (currentView === 'rental-history' && selectedPlaceForRentals) {
    return (
      <RentalHistoryView
        placeName={selectedPlaceForRentals.nombre}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-red-600 pb-4">Alquileres</h1>
      </div>

      {/* Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Listado de locaciones"
              className="w-full p-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-gray-900"
              readOnly
            />
          </div>
          
          <button
            onClick={() => setIsCreateLocationModalOpen(true)}
            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            + Nueva locación
          </button>
        </div>
      </div>

      {/* Información de la Localización */}
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
            <p className="text-gray-700 ml-7">{selectedLocation?.nombre}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FiMapPin className="text-red-500" size={20} />
              <span className="font-semibold text-gray-900">Dirección de la Localización</span>
            </div>
            <p className="text-gray-700 ml-7">{selectedLocation?.direccion}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FiBarChart2 className="text-red-500" size={20} />
              <span className="font-semibold text-gray-900">Capacidad</span>
            </div>
            <p className="text-gray-700 ml-7">{selectedLocation?.capacidad}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FiCheckCircle className="text-red-500" size={20} />
              <span className="font-semibold text-gray-900">Estado</span>
            </div>
            <p className="text-green-600 font-medium ml-7">{selectedLocation?.estado}</p>
          </div>
        </div>
      </div>

      {/* Lugares en la Localización */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <MdLocationOn className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-red-600">Lugares en la Localización</h2>
          </div>

          <button
            onClick={() => setIsCreatePlaceModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            + Nuevo Lugar
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPlaces.map((place) => (
            <PlaceCard
              key={place.id}
              place={place}
              onEdit={handleEditPlace}
              onDelete={handleDeletePlace}
              onViewRentals={handleViewRentals}
            />
          ))}
        </div>
      </div>

      {/* --- Componente de Paginación --- */}
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

      {/* Modales */}
      {isCreateLocationModalOpen && (
        <ModalCreateLocation 
          handleClose={() => setIsCreateLocationModalOpen(false)} 
          handleSubmit={(data) => {
            console.log('Crear locación:', data);
            setIsCreateLocationModalOpen(false);
            setSelectedLocation(data);
          }} 
        />
      )}

      {isEditLocationModalOpen && (
        <ModalEditLocation 
          handleClose={() => setIsEditLocationModalOpen(false)} 
          handleSubmit={(data) => {
            console.log('Editar locación:', data);
            setIsEditLocationModalOpen(false);
            setSelectedLocation({ ...selectedLocation, ...data });
          }} 
          locationData={selectedLocation || { nombre: '', direccion: '', capacidad: '', estado: '' }}
        />
      )}

      {isCreatePlaceModalOpen && (
        <ModalCreatePlace
          onClose={() => setIsCreatePlaceModalOpen(false)}
          onSubmit={handleCreatePlace}
        />
      )}
    </div>
  );
};

export default RentalsComponentView;