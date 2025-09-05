import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import ModalEditPlace from "./modal-edit-place";
import NewRentalModal from "../modals/new-rental-modal";
import { Place } from "../../types/places";
import Modal from "@/core/components/ui/Modal";
import { useCreateRental } from "../../hook/useRentals";
import { useAuthStore } from "@/core/store/auth";
import { Customer } from "../../types/customer";

interface PlaceCardProps {
  place: Place;
  customers: Customer[];
  onEdit: (placeId: string, updatedPlace: Partial<Place>) => void;
  onDelete: (placeId: string) => void;
  onViewRentals: (place: Place) => void;
  // 🔥 NUEVOS PROPS PARA PERMISOS
  canEdit?: boolean;
  canDelete?: boolean;
  canCreate?: boolean;
  isAdmin?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  customers,
  onEdit,
  onViewRentals,
  // 🔥 DESTRUCTURACIÓN DE NUEVOS PROPS DE PERMISOS
  canEdit = false,
  canCreate = false,
  isAdmin = false,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewRentalModalOpen, setIsNewRentalModalOpen] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalMessage, setCreateModalMessage] = useState("");

  // Hooks
  const createRentalMutation = useCreateRental();
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
  };

  const handleNewRentalSubmit = async (rentalData: {
    customerId: string;
    nombreVendedor: string;
    fechaInicio: string;
    fechaFin: string;
    monto: number;
  }) => {
    try {
      // Mostrar modal informativo inmediatamente al intentar crear
      setIsCreateModalOpen(true);
      setCreateModalMessage("Procesando creación del alquiler...");

      // Verificar que el usuario esté autenticado
      if (!user || !user.id) {
        console.error("❌ Usuario no autenticado");
        setIsCreateModalOpen(false);
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
      setCreateModalMessage("¡Alquiler creado exitosamente!");
    } catch (error: unknown) {
      console.error("❌ Error al crear alquiler:", error);
      type ApiError = { response?: { data?: { error?: string } } };
      const err = error as ApiError;
      const apiError = err.response?.data?.error || "Ocurrió un error inesperado.";
      
      if (apiError.includes("ya existe un alquiler activo")) {
        setIsCreateModalOpen(false);
        setErrorMessage(apiError);
        setIsErrorModalOpen(true);
      } else {
        setIsCreateModalOpen(false);
        setErrorMessage(apiError);
        setIsErrorModalOpen(true);
      }
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
          {/* 🔥 MOSTRAR BOTÓN EDITAR SOLO SI TIENE PERMISOS */}
          {(canEdit || isAdmin) && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              onClick={handleEdit}
            >
              Editar
            </button>
          )}
          {/* 🔥 MOSTRAR BOTÓN ALQUILAR SOLO SI TIENE PERMISOS DE CREAR */}
          {(canCreate || isAdmin) && (
            <button
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
              onClick={handleAlquilar}
            >
              Alquilar
            </button>
          )}
        </div>
      </div>

      {isEditModalOpen && (
        <ModalEditPlace
          place={place}
          onClose={() => setIsEditModalOpen(false)}
          onUpdated={() => setIsEditModalOpen(false)}
          onSubmit={handleEditSubmit}
        />
      )}

      {isNewRentalModalOpen && (
        <NewRentalModal
          onClose={() => setIsNewRentalModalOpen(false)}
          onSubmit={handleNewRentalSubmit}
        />
      )}

      <Modal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
        title="Error al Crear Alquiler"
      >
        <p>{errorMessage}</p>
        <button 
          onClick={() => setIsErrorModalOpen(false)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </Modal>

      {/* Modal informativo durante/tras creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Creación de Alquiler"
      >
        <p>{createModalMessage}</p>
        <button
          onClick={() => setIsCreateModalOpen(false)}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </Modal>
    </>
  );
};

export default PlaceCard;
