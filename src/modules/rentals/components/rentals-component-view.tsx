import React, { useState } from "react";
import { FiMapPin, FiHome, FiBarChart2, FiCheckCircle } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";
import ModalCreateLocation from "./information location/modal-create-location";
import ModalEditLocation from "./information location/modal-edit-location";
import ModalCreatePlace from "./places/modal-create-place";
import PlaceCard from "./places/place-card";
import RentalHistoryView from "./rental-history/rental-history-view";
import { Location } from "../types/location";
import { Place } from "../types/places";
import { useFetchLocations } from "../hook/useLocations";
import { useFetchPlaces, useCreatePlace } from "../hook/usePlaces"; // 👈 AÑADIDO

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

  const {
    data: locationsData,
    isLoading: isLoadingLocations,
    isError,
    refetch,
  } = useFetchLocations();

  const { data: allPlaces = [], isLoading: isLoadingPlaces } = useFetchPlaces();
  const { mutate: createPlace } = useCreatePlace(); // 👈 HOOK

  const locations: Location[] = Array.isArray(locationsData)
    ? locationsData
    : Array.isArray((locationsData as any)?.data)
      ? (locationsData as any).data
      : [];

  const [selectedLocation, setSelectedLocation] = useState<Location>({
    id: "",
    name: "",
    address: "",
    capacity: 0,
    status: "",
  });

  const handleSelectLocation = (locationId: string) => {
    const found = locations.find((loc) => loc.id === locationId);
    if (found) {
      setSelectedLocation(found);
    }
  };

  const handleCreatePlace = (newPlace: Omit<Place, "_id">) => {
    createPlace(newPlace, {
      onSuccess: () => {
        console.log("✅ Lugar creado correctamente");
        setIsCreatePlaceModalOpen(false);
      },
      onError: (err) => {
        console.error("❌ Error al crear lugar:", err);
      },
    });
  };

  const handleEditPlace = (placeId: string, updates: Partial<Place>) => {
    // Implementa si tienes lógica de edición de lugares
  };

  const handleDeletePlace = (placeId: string) => {
    // Implementa si tienes lógica de eliminación de lugares
  };

  const handleViewRentals = (place: Place) => {
    setSelectedPlaceForRentals(place);
    setCurrentView("rental-history");
  };

  const handleBackToMain = () => {
    setCurrentView("main");
    setSelectedPlaceForRentals(null);
  };

  const places = allPlaces.filter(
    (p) => p.location_id === selectedLocation?.id
  );

  if (currentView === "rental-history" && selectedPlaceForRentals) {
    return (
      <RentalHistoryView
        placeName={selectedPlaceForRentals.name}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center text-red-600 pb-6">
        Alquileres
      </h1>

      {/* Selector de locaciones */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            {isLoadingLocations ? (
              <p className="text-gray-500">Cargando locaciones...</p>
            ) : isError ? (
              <p className="text-red-500">Error al cargar las locaciones.</p>
            ) : (
              <select
                className="w-full p-3 border border-gray-300 rounded-full bg-white text-gray-900 focus:ring-2 focus:ring-red-500"
                value={selectedLocation?.id || ""}
                onChange={(e) => handleSelectLocation(e.target.value)}
              >
                <option value="">Seleccione una locación</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            className="ml-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            onClick={() => setIsCreateLocationModalOpen(true)}
          >
            + Nueva locación
          </button>
        </div>
      </div>

      {/* Información de la locación */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <MdLocationOn className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-red-600">
              Información de la Localización
            </h2>
          </div>
          <button
            onClick={() => setIsEditLocationModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Editar locación
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FiHome className="text-red-500 inline mr-2" />
            <span className="font-semibold">Nombre:</span>
            <p className="ml-7">{selectedLocation?.name}</p>
          </div>
          <div>
            <FiMapPin className="text-red-500 inline mr-2" />
            <span className="font-semibold">Dirección:</span>
            <p className="ml-7">{selectedLocation?.address}</p>
          </div>
          <div>
            <FiBarChart2 className="text-red-500 inline mr-2" />
            <span className="font-semibold">Capacidad:</span>
            <p className="ml-7">{selectedLocation?.capacity}</p>
          </div>
          <div>
            <FiCheckCircle className="text-red-500 inline mr-2" />
            <span className="font-semibold">Estado:</span>
            <p className="ml-7 text-green-600 font-semibold">
              {selectedLocation?.status}
            </p>
          </div>
        </div>
      </div>

      {/* Lugares */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <MdLocationOn className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-red-600">
              Lugares en la Localización
            </h2>
          </div>
          <button
            onClick={() => setIsCreatePlaceModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            + Nuevo Lugar
          </button>
        </div>

        {isLoadingPlaces ? (
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
      {isCreatePlaceModalOpen && (
        <ModalCreatePlace
          onClose={() => setIsCreatePlaceModalOpen(false)}
          onSubmit={handleCreatePlace} // 👈 INTEGRACIÓN REAL
          locationId={selectedLocation?.id}
        />
      )}

      {isEditLocationModalOpen && (
        <ModalEditLocation
          handleClose={() => setIsEditLocationModalOpen(false)}
          onUpdated={(data) => {
            setSelectedLocation((prev) => ({ ...prev, ...data }));
            refetch();
          }}
          locationData={selectedLocation}
        />
      )}

      {isCreatePlaceModalOpen && (
        <ModalCreatePlace
          onClose={() => setIsCreatePlaceModalOpen(false)}
          onSubmit={handleCreatePlace}
          locationId={selectedLocation?.id}
        />
      )}
    </div>
  );
};

export default RentalsComponentView;
