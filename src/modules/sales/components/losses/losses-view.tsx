import React, { useState } from "react";
import { FiAlertOctagon, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import ModalCreateLoss from "./modal-create-losses";
import ModalEditLoss from "./modal-edit-losses";
import ModalDeleteLoss from "./modal-delete-losses";
import {
  useFetchReturns,
  useCreateReturn,
  useUpdateReturn,
  useDeleteReturn
} from '@/modules/sales/hooks/useReturns'

import { useFetchProducts } from '@/modules/inventory/hook/useProducts'


const LossesComponentView: React.FC = () => {
  const { data: losses = [], isLoading } = useFetchReturns();
  const { data: products = [] } = useFetchProducts();

  const createReturnMutation = useCreateReturn();
  const updateReturnMutation = useUpdateReturn();
  const deleteReturnMutation = useDeleteReturn();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLoss, setCurrentLoss] = useState<any>(null);

  const handleCreateLoss = async (newLoss: any) => {
    await createReturnMutation.mutateAsync(newLoss);
    setIsCreateModalOpen(false);
  };

  const handleEditLoss = async (updatedLoss: any) => {
    await updateReturnMutation.mutateAsync({
      id: currentLoss.id,
      payload: updatedLoss,
    });
    setIsEditModalOpen(false);
  };

  const handleDeleteLoss = async () => {
    await deleteReturnMutation.mutateAsync(currentLoss.id);
    setIsDeleteModalOpen(false);
  };

  // Obtener nombre del producto desde el ID
  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : productId; // fallback al ID si no está cargado
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
            {!isLoading &&
              losses.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">
                    {getProductName(item.productId)}
                  </td>
                  <td className="px-4 py-2 text-center">{item.salesId}</td>
                  <td className="px-4 py-2 text-center">{item.reason}</td>
                  <td className="px-4 py-2 text-center">{item.observations}</td>
                  <td className="px-4 py-2 text-center">
                    {new Date(item.createdAt!).toLocaleDateString()}
                  </td>
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
