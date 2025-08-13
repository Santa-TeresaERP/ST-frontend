import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import ModalEditPlace from "./modal-edit-place";
import NewRentalModal from "../modals/new-rental-modal";
import { Place } from "../../types";
import { useCreateRental } from "../../hook/useRentals";
import { useFetchCustomers } from "../../hook/useCustomers";
import { useAuthStore } from "@/core/store/auth";

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

  // Hooks
  const createRentalMutation = useCreateRental();
  const { data: customers = [] } = useFetchCustomers();
  const { user } = useAuthStore();

  console.log("🔍 PlaceCard - Usuario autenticado:", {
    user,
    hasUser: !!user,
    userId: user?.id,
    userName: user?.name,
  });

  const handleEdit = () => setIsEditModalOpen(true);
  const handleAlquilar = () => setIsNewRentalModalOpen(true);
  const handleViewRentals = () => onViewRentals(place);

  const handleEditSubmit = (updatedPlace: Partial<Place>) => {
    if (place.id) {
      onEdit(place.id, updatedPlace);
    }
    setIsEditModalOpen(false);
  };

  const handleNewRentalSubmit = async (rentalData: {
    customerId: string;
    nombreVendedor: string;
    fechaInicio: string;
    fechaFin: string;
    monto: number;
  }) => {
    try {
      // Verificar que el usuario esté autenticado
      if (!user || !user.id) {
        console.error("❌ Usuario no autenticado");
        alert("Debes estar autenticado para crear un alquiler");
        return;
      }

      // Encontrar el customer seleccionado para obtener sus datos completos
      const selectedCustomer = customers.find(
        (c) => c.id === rentalData.customerId
      );

      if (!selectedCustomer) {
        console.error("❌ Customer no encontrado");
        alert("Cliente no encontrado");
        return;
      }

      // Preparar datos para backend - SOLO datos reales
      const rentalPayload = {
        customer_id: selectedCustomer.id, // UUID real del customer
        place_id: place.id, // ID real del place
        user_id: user.id, // ID real del usuario autenticado
        start_date: new Date(`${rentalData.fechaInicio}T10:00:00.000Z`), // Date object
        end_date: new Date(`${rentalData.fechaFin}T18:00:00.000Z`), // Date object
        amount: Number(rentalData.monto), // Number
      };

      console.log("✅ Usuario autenticado:", user);
      console.log("✅ Place ID:", place.id);
      console.log("✅ Payload correcto:", rentalPayload);

      // Crear el alquiler usando React Query
      await createRentalMutation.mutateAsync(rentalPayload);

      console.log("🎉 ¡Alquiler creado exitosamente!");
      setIsNewRentalModalOpen(false);
    } catch (error) {
      console.error("❌ Error al crear alquiler:", error);
    }
  };

  const handleDelete = () => {
    if (place.id) {
      onDelete(place.id);
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
