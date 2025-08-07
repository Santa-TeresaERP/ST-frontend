import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import ModalEditPlace from "./modal-edit-place";
import NewRentalModal from "../modals/new-rental-modal";
import { Place } from "../../types/places";

interface PlaceCardProps {
  place: Place;
  onEdit: (placeId: string, updatedPlace: Partial<Place>) => void;
  onDelete: (placeId: string) => void;
  onViewRentals: (place: Place) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onEdit,
  onDelete,
  onViewRentals,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRentalModalOpen, setIsNewRentalModalOpen] = useState(false);

  const handleEdit = () => setIsEditModalOpen(true);
  const handleAlquilar = () => setIsNewRentalModalOpen(true);
  const handleViewRentals = () => onViewRentals(place);

  const handleEditSubmit = (updatedPlace: Partial<Place>) => {
    if (place.id) {
      onEdit(place.id, updatedPlace);
    }
    setIsEditModalOpen(false);
  };

  const handleNewRentalSubmit = (rentalData: {
    nombreComprador: string;
    nombreVendedor: string;
    fechaInicio: string;
    fechaFin: string;
    monto: number;
  }) => {
    console.log("Nuevo alquiler para lugar:", place.name, "Datos:", rentalData);
    setIsNewRentalModalOpen(false);
  };
  const handleDelete = () => {
    if (place.id) {
      onDelete(place.id); // 👈 sin confirmación
    }
  };
  return (
    <>
      <div className="bg-gray-200 rounded-lg p-4 w-64 h-80 flex flex-col">
        {/* Icono del lugar */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-2xl" />
          </div>
        </div>

        {/* Información del lugar */}
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="font-semibold text-gray-900">{place.name}</h3>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">Área</h4>
            <p className="text-sm text-gray-600">{place.area}</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between mt-4">
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            onClick={handleViewRentals}
          >
            Alquileres
          </button>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            onClick={handleEdit}
          >
            Editar
          </button>
          <button 
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            onClick={handleAlquilar}
          >
            Alquilar
          </button>
                    <button 
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </div>
      </div>


      {isEditModalOpen && (
        <ModalEditPlace
          place={place}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {isNewRentalModalOpen && (
        <NewRentalModal
          onClose={() => setIsNewRentalModalOpen(false)}
          onSubmit={handleNewRentalSubmit}
        />
      )}
    </>
  );
};

export default PlaceCard;
