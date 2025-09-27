import React, { useState } from "react";
import {
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiEdit2,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { Rental } from "../../types/rentals";
import { useFetchAllRentals, useDeleteRental } from "../../hook/useRentals";
import { useFetchUsers } from "../../../user-creations/hook/useUsers";
import { useFetchCustomers } from "../../hook/useCustomers";

interface RentalHistoryViewProps {
  placeName: string;
  placeId: string; // ✅ Cambiado de number a string (UUID)
  onBack: () => void;
}

const RentalHistoryView: React.FC<RentalHistoryViewProps> = ({
  placeName,
  placeId,
  onBack,
}) => {
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const { data: rentals = [], isLoading, isError } = useFetchAllRentals();
  const { data: users = [] } = useFetchUsers();
  const { data: customers = [] } = useFetchCustomers();
  const deleteRentalMutation = useDeleteRental();

  // Filtrar alquileres por el lugar específico
  const placeRentals = rentals.filter(rental => 
    rental.place_id === placeId.toString()
  );

  const userMap = new Map(users.map((user) => [user.id, user.name]));
  const customerMap = new Map(customers.map((customer) => [customer.id, customer]));
  
  const handleRentalSelect = (rental: Rental) => {
    setSelectedRental(rental);
  };

  const handleToggleStatus = (rental: Rental) => {
    deleteRentalMutation.mutate(rental.id);
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("es-PE");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={onBack}
            className="mr-4 p-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold text-red-600">
            Historial de Alquileres - {placeName}
          </h1>
        </div>

        {/* Tabla Header (visible solo en pantallas grandes) */}
        <div className="hidden md:grid md:grid-cols-8 gap-4 p-3 bg-red-600 text-white rounded-t-lg font-medium">
          <div className="text-center">Comprador</div>
          <div className="text-center">Lugar</div>
          <div className="text-center">Vendedor</div>
          <div className="text-center">Fecha Inicio</div>
          <div className="text-center">Fecha Fin</div>
          <div className="text-center">Monto</div>
          <div className="text-center">Estado</div>
          <div className="text-center">Acciones</div>
        </div>

        {/* Content */}
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando alquileres...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Error al cargar alquileres</p>
        ) : placeRentals.length === 0 ? (
          <p className="text-center text-gray-500 p-8">No hay alquileres para este lugar</p>
        ) : (
          <div className="space-y-4 md:space-y-0">
            {placeRentals.map((rental) => (
              <React.Fragment key={rental.id}>
                <div
                  className={`flex flex-col md:grid md:grid-cols-8 gap-y-2 md:gap-4 p-4 md:p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRental?.id === rental.id
                      ? "bg-red-50 border-red-200"
                      : "bg-white border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => handleRentalSelect(rental)}
                >
                  {/* Comprador */}
                  <div className="text-gray-700 font-medium md:text-center">
                    <span className="block md:hidden font-bold text-red-600">Comprador:</span>
                    {customerMap.get(rental.customer_id)?.full_name || 'Customer no encontrado'}
                  </div>
                  {/* Lugar */}
                  <div className="text-gray-700 font-medium md:text-center">
                    <span className="block md:hidden font-bold text-red-600">Lugar:</span>
                    {placeName}
                  </div>
                  {/* Vendedor */}
                  <div className="text-gray-700 font-medium md:text-center">
                    <span className="block md:hidden font-bold text-red-600">Vendedor:</span>
                    {userMap.get(rental.user_id) || "Usuario desconocido"}
                  </div>
                  {/* Fecha Inicio */}
                  <div className="text-gray-700 font-medium md:text-center">
                    <span className="block md:hidden font-bold text-red-600">Fecha Inicio:</span>
                    {formatDate(rental.start_date)}
                  </div>
                  {/* Fecha Fin */}
                  <div className="text-gray-700 font-medium md:text-center">
                    <span className="block md:hidden font-bold text-red-600">Fecha Fin:</span>
                    {formatDate(rental.end_date)}
                  </div>
                  {/* Monto */}
                  <div className="text-gray-700 font-medium md:text-center">
                    <span className="block md:hidden font-bold text-red-600">Monto:</span>
                    S/. {Number(rental.amount).toFixed(2)}
                  </div>
                  {/* Estado */}
                  <div className="flex justify-start md:justify-center items-center">
                    <span className="block md:hidden font-bold text-red-600 mr-2">Estado:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        rental.status
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {rental.status ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  {/* Acciones */}
                  <div className="flex justify-start md:justify-center gap-2">
                    <span className="block md:hidden font-bold text-red-600">Acciones:</span>
                    <button className="text-blue-600 hover:text-blue-800">
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(rental);
                      }}
                      className={rental.status ? "text-green-600 hover:text-green-800" : "text-gray-600 hover:text-gray-800"}
                    >
                      {rental.status ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                    </button>
                  </div>
                </div>

                {/* Detalles expandidos */}
                {selectedRental?.id === rental.id && (
                  <div className="bg-white border border-red-200 rounded-lg p-6 mx-0 md:mx-4 mb-4">
                    <h3 className="text-lg font-semibold text-red-600 mb-4 text-center">
                      DATOS DEL COMPRADOR
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                      <div>
                        <div className="flex justify-center items-center gap-2">
                          <FiUser className="text-red-500" size={16} />
                          <span className="text-gray-700 font-medium">
                            Nombre Completo
                          </span>
                        </div>
                        <p className="font-medium">
                          {customerMap.get(rental.customer_id)?.full_name || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-center items-center gap-2">
                          <FiCreditCard className="text-red-500" size={16} />
                          <span className="text-gray-700 font-medium">DNI</span>
                        </div>
                        <p className="font-medium">{customerMap.get(rental.customer_id)?.dni || 'N/A'}</p>
                      </div>
                      <div>
                        <div className="flex justify-center items-center gap-2">
                          <FiPhone className="text-red-500" size={16} />
                          <span className="text-gray-700 font-medium">
                            Número de celular
                          </span>
                        </div>
                        <p className="font-medium">
                          {customerMap.get(rental.customer_id)?.phone || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-center items-center gap-2">
                          <FiMail className="text-red-500" size={16} />
                          <span className="text-gray-700 font-medium">
                            Correo Electrónico
                          </span>
                        </div>
                        <p className="font-medium">
                          {customerMap.get(rental.customer_id)?.email || 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RentalHistoryView;
