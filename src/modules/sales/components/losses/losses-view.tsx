import React, { useState } from 'react';
import { FiAlertOctagon, FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import ModalCreateLoss from './modal-create-losses';
import ModalEditLoss from './modal-edit-losses';
import ModalDeleteLoss from './modal-delete-losses';

const LossesComponentView: React.FC = () => {
  const [losses, setLosses] = useState([
    {
      id: 1,
      producto: 'Pan Integral',
      tienda: 'Tienda Central',
      razon: 'Vencimiento',
      observacion: 'Producto caducado',
      fecha: '2025-07-15',
    },
    {
      id: 2,
      producto: 'Leche',
      tienda: 'Sucursal Norte',
      razon: 'Dañado',
      observacion: 'Envase roto',
      fecha: '2025-07-14',
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLoss, setCurrentLoss] = useState<any>(null);

  const handleCreateLoss = (newLoss: any) => {
    setLosses((prev) => [...prev, { ...newLoss, id: Date.now() }]);
    setIsCreateModalOpen(false);
  };

  const handleEditLoss = (updatedLoss: any) => {
    setLosses((prev) =>
      prev.map((item) => (item.id === currentLoss.id ? { ...item, ...updatedLoss } : item))
    );
    setIsEditModalOpen(false);
  };

  const handleDeleteLoss = () => {
    setLosses((prev) => prev.filter((item) => item.id !== currentLoss.id));
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-lg"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Nueva Pérdida
        </button>
      </div>

      <h2 className="text-2xl font-bold text-red-600 flex items-center space-x-2">
        <FiAlertOctagon className="text-red-600" size={24} />
        <span>Registro de Pérdidas</span>
      </h2>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="min-w-full text-left text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center">Producto</th>
              <th className="px-4 py-2 text-center">Tienda</th>
              <th className="px-4 py-2 text-center">Razón</th>
              <th className="px-4 py-2 text-center">Observación</th>
              <th className="px-4 py-2 text-center">Fecha</th>
              <th className="px-4 py-2 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {losses.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2 text-center">{item.producto}</td>
                <td className="px-4 py-2 text-center">{item.tienda}</td>
                <td className="px-4 py-2 text-center">{item.razon}</td>
                <td className="px-4 py-2 text-center">{item.observacion}</td>
                <td className="px-4 py-2 text-center">{item.fecha}</td>
                <td className="px-4 py-2 text-center flex justify-center space-x-3">
                  <button
                    className="text-blue-500 hover:text-yellow-600"
                    onClick={() => {
                      setCurrentLoss(item);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    className="text-red-500 hover:text-red-600"
                    onClick={() => {
                      setCurrentLoss(item);
                      setIsDeleteModalOpen(true);
                    }}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ModalCreateLoss
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateLoss}
      />

      <ModalEditLoss
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentLoss={currentLoss}
        onSave={handleEditLoss}
      />

      <ModalDeleteLoss
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteLoss}
      />
    </div>
  );
};

export default LossesComponentView;

