import React, { useState } from "react";
import { FiMapPin, FiHome, FiBarChart2, FiCheckCircle } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import ModalCreateLocation from "./information location/modal-create-location";
import ModalEditLocation from "./information location/modal-edit-location";
import ModalCreatePlace from "./places/modal-create-place";
import RentalHistoryView from "./rental-history/rental-history-view";
import { Location } from "../types/location";
import { Place } from "../types/places";
import { useFetchPlaces } from "../hook/usePlaces"; // 👈 se importa aquí

const RentalsComponentView = () => {
  const [isCreateLocationModalOpen, setIsCreateLocationModalOpen] =
    useState(false);
  const [isEditLocationModalOpen, setIsEditLocationModalOpen] = useState(false);
  const [isCreatePlaceModalOpen, setIsCreatePlaceModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"main" | "rental-history">(
    "main"
  );
  const [selectedPlaceForRentals, setSelectedPlaceForRentals] =
    useState<Place | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>({
    nombre: "Localización ABC",
    direccion: "Calle Industrial",
    capacidad: "100",
    estado: "Desocupado",
  });

  const { data: places = [], isLoading } = useFetchPlaces(); // 👈 usar datos reales del backend

  const handleEditPlace = (
    placeId: number | string,
    updatedPlace: Partial<Place>
  ) => {
    // Lógica para actualizar un lugar, si se implementa
  };

  const handleDeletePlace = (placeId: number | string) => {
    // Lógica para eliminar un lugar, si se implementa
  };

  const handleCreatePlace = (newPlace: Omit<Place, "id">) => {
    // Se puede usar un mutation + invalidation con react-query si se implementa
    setIsCreatePlaceModalOpen(false);
  };

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
        placeName={selectedPlaceForRentals.nombre}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center text-red-600 pb-4">
          Alquileres
        </h1>
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
            <h2 className="text-xl font-bold text-red-600">
              Información de Localización
            </h2>
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
              <span className="font-semibold text-gray-900">
                Nombre de la Locación
              </span>
            </div>
            <p className="text-gray-700 ml-7">{selectedLocation?.nombre}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <FiMapPin className="text-red-500" size={20} />
              <span className="font-semibold text-gray-900">
                Dirección de la Localización
              </span>
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
            <p className="text-green-600 font-medium ml-7">
              {selectedLocation?.estado}
            </p>
          </div>
        </div>
      </div>
      {/* Lugares en la Localización */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <MdLocationOn className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-red-600">
              Lugares en la Localización
            </h2>
          </div>

          <button
            onClick={() => setIsCreatePlaceModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            + Nuevo Lugar
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-600">Cargando lugares...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onEdit={handleEditPlace}
                onDelete={handleDeletePlace}
                onViewRentals={handleViewRentals}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modales */}
      {isCreateLocationModalOpen && (
        <ModalCreateLocation
          handleClose={() => setIsCreateLocationModalOpen(false)}
          handleSubmit={(data) => {
            setIsCreateLocationModalOpen(false);
            setSelectedLocation(data);
          }}
        />
      )}

      {isEditLocationModalOpen && (
        <ModalEditLocation
          handleClose={() => setIsEditLocationModalOpen(false)}
          handleSubmit={(data) => {
            setIsEditLocationModalOpen(false);
            setSelectedLocation({ ...selectedLocation, ...data });
          }}
          locationData={
            selectedLocation || {
              nombre: "",
              direccion: "",
              capacidad: "",
              estado: "",
            }
          }
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
