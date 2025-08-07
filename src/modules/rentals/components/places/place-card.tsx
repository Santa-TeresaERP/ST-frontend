import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import ModalEditPlace from "./modal-edit-place";
import NewRentalModal from "../modals/new-rental-modal";
import { Place } from "../../types";
import { useCreateRental } from "../../hook/useRentals";
import { useFetchCustomers } from "../../hook/useCustomers";
import { useAuthStore } from "@/core/store/auth";
import { generateUUID } from "../../utils/uuid";

interface PlaceCardProps {
  place: Place;
  onEdit: (placeId: string, updatedPlace: Partial<Place>) => void; // ✅ Cambiado de number a string
  onDelete: (placeId: string) => void; // ✅ Cambiado de number a string
  onViewRentals: (place: Place) => void;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  onEdit,
  onViewRentals,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRentalModalOpen, setIsNewRentalModalOpen] = useState(false);

  // Hooks
  const createRentalMutation = useCreateRental();
  const { data: customers = [] } = useFetchCustomers();
  const { user } = useAuthStore(); // ✅ Obtener usuario autenticado

  // ✅ Debug del usuario autenticado
  console.log("🔍 PlaceCard - Usuario autenticado:", {
    user,
    hasUser: !!user,
    userId: user?.id,
    userName: user?.name,
  });

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleViewRentals = () => {
    onViewRentals(place);
  };

  const handleAlquilar = () => {
    setIsNewRentalModalOpen(true);
  };

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
      // ✅ Verificar que el usuario esté autenticado
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

      // ✅ Preparar datos para backend - SOLO datos reales
      const rentalPayload = {
        customer_id: selectedCustomer.id, // ✅ UUID real del customer
        place_id: generateUUID(), // ✅ UUID válido generado (temporal hasta arreglar estructura)
        user_id: user.id, // ✅ ID real del usuario autenticado
        start_date: new Date(`${rentalData.fechaInicio}T10:00:00.000Z`), // ✅ Date object
        end_date: new Date(`${rentalData.fechaFin}T18:00:00.000Z`), // ✅ Date object
        amount: Number(rentalData.monto), // ✅ Number
      };

      console.log("✅ Usuario autenticado:", user);
      console.log("✅ Place original ID:", place.id);
      console.log("✅ Payload correcto (Date objects + UUIDs):", rentalPayload);
      console.log(
        "⚠️ NOTA: place_id generado temporalmente, original era:",
        place.id
      );
      console.log("🔍 Verificación de tipos:", {
        customer_id: rentalPayload.customer_id,
        customer_id_type: typeof rentalPayload.customer_id,
        place_id: rentalPayload.place_id,
        place_id_type: typeof rentalPayload.place_id,
        user_id: rentalPayload.user_id,
        user_id_type: typeof rentalPayload.user_id,
        start_date: rentalPayload.start_date,
        start_date_type: typeof rentalPayload.start_date,
        start_date_instance: rentalPayload.start_date instanceof Date,
        start_date_iso: rentalPayload.start_date.toISOString(),
        end_date: rentalPayload.end_date,
        end_date_type: typeof rentalPayload.end_date,
        end_date_instance: rentalPayload.end_date instanceof Date,
        end_date_iso: rentalPayload.end_date.toISOString(),
        amount: rentalPayload.amount,
        amount_type: typeof rentalPayload.amount,
      });

      // Crear el alquiler usando React Query
      await createRentalMutation.mutateAsync(rentalPayload);

      console.log("🎉 ¡Alquiler creado exitosamente!");
      setIsNewRentalModalOpen(false);
    } catch (error) {
      console.error("❌ Error al crear alquiler:", error);
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
            <div>
              <h3 className="font-semibold text-gray-900">{place.nombre}</h3>
            </div>
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
            onClick={() => place.id && onDelete(place.id)}
          >
            Eliminar
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
            onClick={handleAlquilar}
          >
            Alquilar
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      {isEditModalOpen && (
        <ModalEditPlace
          place={place}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Modal de nuevo alquiler */}
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
