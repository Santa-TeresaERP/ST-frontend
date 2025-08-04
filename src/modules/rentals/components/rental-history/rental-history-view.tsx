import React, { useState } from "react";
import {
  FiArrowLeft,
  FiUser,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { Rental } from "../../types/rentals";
import { useFetchAllRentals } from "../../hook/useRentals"; // Asegúrate que la ruta sea correcta
import { useFetchUsers } from "../../../user-creations/hook/useUsers"; // ajusta la ruta si es distinta

interface RentalHistoryViewProps {
  placeName: string;
  onBack: () => void;
}

const RentalHistoryView: React.FC<RentalHistoryViewProps> = ({
  placeName,
  onBack,
}) => {
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const { data: rentals = [], isLoading, isError } = useFetchAllRentals();
  const { data: users = [] } = useFetchUsers();

  // Datos mock del comprador (temporal hasta que se relacione con backend)
  const buyerDetails = {
    nombreCompleto: "Juanita Perez",
    dni: "77777777",
    numeroCelular: "999 999 999",
    correoElectronico: "juanita@email.com",
  };
  const userMap = new Map(users.map((user) => [user.id, user.name]));
  const handleRentalSelect = (rental: Rental) => {
    setSelectedRental(rental);
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
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <FiArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-center text-red-600">
            Alquileres de Lugar {placeName}
          </h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 max-w-6xl mx-auto">
        {/* Headers */}
        <div className="grid grid-cols-8 gap-4 mb-6 px-3">
          {[
            "Comprador",
            "Lugar",
            "Vendedor",
            "Fecha Inicio",
            "Fecha Termino",
            "Monto",
            "Estado",
            "Acciones",
          ].map((label) => (
            <div key={label} className="text-center">
              <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full">
                {label}
              </button>
            </div>
          ))}
        </div>

        {/* Content */}
        {isLoading ? (
          <p className="text-center text-gray-500">Cargando alquileres...</p>
        ) : isError ? (
          <p className="text-center text-red-500">Error al cargar alquileres</p>
        ) : (
          <div className="space-y-0">
            {rentals.map((rental) => (
              <React.Fragment key={rental.id}>
                <div
                  className={`grid grid-cols-8 gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRental?.id === rental.id
                      ? "bg-red-50 border-red-200"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => handleRentalSelect(rental)}
                >
                  <div className="text-center text-gray-700 font-medium">
                    Comprador
                  </div>
                  <div className="text-center text-gray-700 font-medium">
                    {rental.place_id}
                  </div>
                  <div className="text-center text-gray-700 font-medium">
                    {userMap.get(rental.user_id) || "Usuario desconocido"}
                  </div>

                  <div className="text-center text-gray-700 font-medium">
                    {formatDate(rental.start_date)}
                  </div>
                  <div className="text-center text-gray-700 font-medium">
                    {formatDate(rental.end_date)}
                  </div>
                  <div className="text-center text-gray-700 font-medium">
                    S/. {Number(rental.amount).toFixed(2)}
                  </div>
                  <div className="flex justify-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                      Activo
                    </span>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <button
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Editar alquiler:", rental.id);
                      }}
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Eliminar alquiler:", rental.id);
                      }}
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Detalles del comprador (mock) */}
                {selectedRental?.id === rental.id && (
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 mt-2 mb-3">
                    <h3 className="text-lg font-bold text-center mb-4">
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
                          {buyerDetails.nombreCompleto}
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-center items-center gap-2">
                          <FiCreditCard className="text-red-500" size={16} />
                          <span className="text-gray-700 font-medium">DNI</span>
                        </div>
                        <p className="font-medium">{buyerDetails.dni}</p>
                      </div>
                      <div>
                        <div className="flex justify-center items-center gap-2">
                          <FiPhone className="text-red-500" size={16} />
                          <span className="text-gray-700 font-medium">
                            Número de celular
                          </span>
                        </div>
                        <p className="font-medium">
                          {buyerDetails.numeroCelular}
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
                          {buyerDetails.correoElectronico}
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

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">Alquiler / información</p>
      </div>
    </div>
  );
};

export default RentalHistoryView;
