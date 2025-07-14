import React from 'react';
import { FiInfo, FiMapPin, FiHome, FiClipboard, FiDollarSign } from 'react-icons/fi';

const InformationComponentView: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
      
      {/* Información de la Tienda */}
      <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
        <FiInfo className="text-red-600" size={24} />
        <span>Información de la Tienda</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <FiHome className="text-red-500" size={20} />
            <span className="font-semibold">Nombre de la tienda</span>
          </div>
          <p>Panadería Dulce Sabor</p>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <FiMapPin className="text-red-500" size={20} />
            <span className="font-semibold">Dirección</span>
          </div>
          <p>Av. Principal 1234, Centro Histórico, Lima</p>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 shadow-sm text-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <FiClipboard className="text-red-500" size={20} />
          <span className="font-semibold">Observaciones</span>
        </div>
        <p>Especializada en pasteles personalizados, productos sin gluten, y servicio a domicilio en zonas cercanas.</p>
      </div>

      {/* Información de la Caja */}
      <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2 pt-6">
        <FiDollarSign className="text-red-600" size={24} />
        <span>Información de Caja</span>
      </h2>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="min-w-full bg-white text-left text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center align-middle">Usuario</th>
              <th className="px-4 py-2 text-center align-middle">Tienda</th>
              <th className="px-4 py-2 text-center align-middle">Dinero Inicial</th>
              <th className="px-4 py-2 text-center align-middle">Dinero Final</th>
              <th className="px-4 py-2 text-center align-middle">Total Pérdidas</th>
              <th className="px-4 py-2 text-center align-middle">Fecha de Término</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="px-4 py-2 text-center">Juan Pérez</td>
              <td className="px-4 py-2 text-center">Dulce Sabor</td>
              <td className="px-4 py-2 text-center">S/ 200.00</td>
              <td className="px-4 py-2 text-center">S/ 500.00</td>
              <td className="px-4 py-2 text-center">S/ 20.00</td>
              <td className="px-4 py-2 text-center">12/07/2025</td>
            </tr>
            <tr className="border-t bg-gray-50">
              <td className="px-4 py-2 text-center">María López</td>
              <td className="px-4 py-2 text-center">Dulce Sabor</td>
              <td className="px-4 py-2 text-center">S/ 300.00</td>
              <td className="px-4 py-2 text-center">S/ 700.00</td>
              <td className="px-4 py-2 text-center">S/ 15.00</td>
              <td className="px-4 py-2 text-center">13/07/2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InformationComponentView;
