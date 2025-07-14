import React, { useState } from 'react';
import { FiShoppingCart, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import ModalCreateStore from './modal-create-store';

const SalesComponentsView: React.FC = () => {
  const [sales, setSales] = useState([
    {
      id: 1,
      tienda: 'Panadería Dulce Sabor',
      costoTotal: 'S/ 120.00',
      fecha: '14/07/2025',
      observacion: 'Venta de tortas y cupcakes',
    },
    {
      id: 2,
      tienda: 'Pastelería Delicias',
      costoTotal: 'S/ 200.00',
      fecha: '13/07/2025',
      observacion: 'Pedidos para evento empresarial',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      
      <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
        <FiShoppingCart className="text-red-600" size={24} />
        <span>Información de Ventas</span>
      </h2>

      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Nueva Venta
        </button>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-left text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center">Tienda</th>
              <th className="px-4 py-2 text-center">Costo Total</th>
              <th className="px-4 py-2 text-center">Fecha</th>
              <th className="px-4 py-2 text-center">Observación</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{sale.tienda}</td>
                <td className="px-4 py-2 text-center">{sale.costoTotal}</td>
                <td className="px-4 py-2 text-center">{sale.fecha}</td>
                <td className="px-4 py-2 text-center">{sale.observacion}</td>
                <td className="px-4 py-2 text-center flex justify-center space-x-3">
                  <button className="text-blue-500 hover:text-yellow-600">
                    <FiEdit size={18} />
                  </button>
                  <button className="text-red-500 hover:text-red-600">
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Crear Venta */}
      <ModalCreateStore isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
};

export default SalesComponentsView;
