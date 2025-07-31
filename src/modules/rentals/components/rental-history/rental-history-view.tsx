import React, { useState } from 'react';
import { FiArrowLeft, FiUser, FiPhone, FiMail, FiCreditCard, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Rental, BuyerDetails } from '../../types';

interface RentalHistoryViewProps {
  placeName: string;
  onBack: () => void;
}

const RentalHistoryView: React.FC<RentalHistoryViewProps> = ({ placeName, onBack }) => {
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [buyerDetails] = useState<BuyerDetails>({
    nombreCompleto: 'Juanita Perez',
    dni: '77777777',
    numeroCelular: '999 999 999',
    correoElectronico: 'juanita@email.com'
  });

  const [rentals] = useState<Rental[]>([
    {
      id: 1,
      comprador: 'Juanita',
      lugar: 'XYZ',
      vendedor: 'Carlos',
      fechaInicio: '10/06/2025',
      fechaTermino: '10/06/2025',
      monto: 200,
      acciones: 'Activo'
    },
    {
      id: 2,
      comprador: 'Pablito',
      lugar: '123',
      vendedor: 'Sandra',
      fechaInicio: '10/06/2025',
      fechaTermino: '10/06/2025',
      monto: 150,
      acciones: 'Finalizado'
    }
  ]);

  const handleRentalSelect = (rental: Rental) => {
    setSelectedRental(rental);
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

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 max-w-6xl mx-auto">
        {/* Headers Row */}
        <div className="grid grid-cols-8 gap-4 mb-6 px-3">
          <div className="text-center">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full">
              Comprador
            </button>
          </div>
          <div className="text-center">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full">
              Lugar
            </button>
          </div>
          <div className="text-center">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full">
              Vendedor
            </button>
          </div>
          <div className="text-center">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full">
              Fecha Inicio
            </button>
          </div>
          <div className="text-center">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full">
              Fecha Termino
            </button>
          </div>
          <div className="text-center">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full">
              Monto
            </button>
          </div>
          <div className="text-center">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full">
              Estado
            </button>
          </div>
          <div className="text-center">
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium w-full">
              Acciones
            </button>
          </div>
        </div>

        {/* Rental List */}
        <div className="space-y-0">
          {rentals.map((rental) => (
            <React.Fragment key={rental.id}>
              {/* Rental Row */}
              <div
                className={`grid grid-cols-8 gap-4 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRental?.id === rental.id
                    ? 'bg-red-50 border-red-200'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => handleRentalSelect(rental)}
              >
                <div className="text-gray-700 text-center font-medium">{rental.comprador}</div>
                <div className="text-gray-700 text-center font-medium">{rental.lugar}</div>
                <div className="text-gray-700 text-center font-medium">{rental.vendedor}</div>
                <div className="text-gray-700 text-center font-medium">{rental.fechaInicio}</div>
                <div className="text-gray-700 text-center font-medium">{rental.fechaTermino}</div>
                <div className="text-gray-700 text-center font-medium">S/. {rental.monto.toFixed(2)}</div>
                <div className="flex items-center justify-center">
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    rental.acciones === 'Activo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {rental.acciones}
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <button 
                    className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Editar alquiler:', rental.id);
                    }}
                    title="Editar"
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button 
                    className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Eliminar alquiler:', rental.id);
                    }}
                    title="Eliminar"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Expanded Details Row */}
              {selectedRental?.id === rental.id && (
                <div className="bg-gray-100 border border-gray-200 rounded-lg p-6 mt-2 mb-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">DATOS DEL COMPRADOR</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="space-y-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <FiUser className="text-red-500" size={16} />
                        <span className="font-medium text-gray-700">Nombre Completo</span>
                      </div>
                      <p className="text-gray-900 font-medium">{buyerDetails.nombreCompleto}</p>
                    </div>

                    <div className="space-y-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <FiCreditCard className="text-red-500" size={16} />
                        <span className="font-medium text-gray-700">DNI</span>
                      </div>
                      <p className="text-gray-900 font-medium">{buyerDetails.dni}</p>
                    </div>

                    <div className="space-y-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <FiPhone className="text-red-500" size={16} />
                        <span className="font-medium text-gray-700">Número de celular</span>
                      </div>
                      <p className="text-gray-900 font-medium">{buyerDetails.numeroCelular}</p>
                    </div>

                    <div className="space-y-2 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <FiMail className="text-red-500" size={16} />
                        <span className="font-medium text-gray-700">Correo Electrónico</span>
                      </div>
                      <p className="text-gray-900 font-medium">{buyerDetails.correoElectronico}</p>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Section */}
      <div className="mt-6 text-center">
        <p className="text-gray-500 text-sm">Alquiler / información</p>
      </div>
    </div>
  );
};

export default RentalHistoryView;
