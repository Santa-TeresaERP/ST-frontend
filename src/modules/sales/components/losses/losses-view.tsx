/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FiAlertOctagon, FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import ModalCreateLoss from "./modal-create-losses";
import ModalEditLoss from "./modal-edit-losses";
import ModalDeleteLoss from "./modal-delete-losses";
import {
  useFetchReturns,
  useCreateReturn,
  useUpdateReturn,
  useDeleteReturn,
} from "@/modules/sales/hooks/useReturns";
import { useFetchProducts } from "@/modules/inventory/hook/useProducts";
import { useFetchSales } from "@/modules/sales/hooks/useSales";
import { useCheckStoreActiveSession } from "@/modules/sales/hooks/useCashSession";
import { isStoreOperational, getStoreOperationalMessage } from "@/modules/sales/utils/store-status";
import { returnsAttributes } from "@/modules/sales/types/returns";

interface LossesComponentViewProps {
  selectedStoreId?: string;
}

const LossesComponentView: React.FC<LossesComponentViewProps> = ({
  selectedStoreId,
}) => {
  const { data: losses = [], isLoading: isLoadingLosses } = useFetchReturns();
  const { data: products = [] } = useFetchProducts();
  const { data: sales = [], isLoading: isLoadingSales } = useFetchSales();
  
  // Hook para verificar si la tienda tiene una sesión de caja activa
  const { data: storeSessionData, isLoading: isLoadingSessionData } = useCheckStoreActiveSession(selectedStoreId);

  const createReturnMutation = useCreateReturn();
  const updateReturnMutation = useUpdateReturn();
  const deleteReturnMutation = useDeleteReturn();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLoss, setCurrentLoss] = useState<returnsAttributes | null>(null);

  // Show all losses for the selected store, including those without salesId
  const filteredLosses = selectedStoreId && !isLoadingSales
    ? losses.filter((loss) => {
        // If there's a salesId, check if it belongs to the selected store
        if (loss.salesId) {
          const relatedSale = sales.find((s) => s.id === loss.salesId);
          return relatedSale?.store_id === selectedStoreId;
        }
        // If no salesId, include it in the list (will show empty store name)
        return true;
      })
    : [];

  const handleCreateLoss = async (
    newLoss: Omit<returnsAttributes, "id" | "createdAt" | "updatedAt" | "price">
  ) => {
    await createReturnMutation.mutateAsync(newLoss);
    setIsCreateModalOpen(false);
  };

  const handleEditLoss = async (
    updatedLoss: Partial<Omit<returnsAttributes, "id" | "createdAt" | "updatedAt" | "price">>
  ) => {
    if (!currentLoss) return;
    await updateReturnMutation.mutateAsync({
      id: currentLoss.id!,
      payload: updatedLoss,
    });
    setIsEditModalOpen(false);
  };

  const handleDeleteLoss = async () => {
    if (!currentLoss) return;
    await deleteReturnMutation.mutateAsync(currentLoss.id!);
    setIsDeleteModalOpen(false);
  };

  const getProductName = (productId?: string) => {
    if (!productId) return "-";
    const product = products.find((p) => p.id === productId);
    return product ? product.name : `Producto ${productId.slice(0, 6)}...`;
  };

  const getStoreName = (salesId?: string) => {
    if (!salesId) return ""; // Return empty string for missing salesId
    const rawSale = sales.find((s) => s.id === salesId);
    const store_name = (rawSale as { store?: { store_name?: string } })?.store?.store_name;
    return store_name || "";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedStoreId || !isStoreOperational(storeSessionData)}
          className={`flex items-center px-4 py-2 rounded-lg transition-all ${
            selectedStoreId && isStoreOperational(storeSessionData)
              ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          title={
            !selectedStoreId 
              ? "Seleccione una tienda primero" 
              : !isStoreOperational(storeSessionData)
                ? getStoreOperationalMessage(storeSessionData)
                : "Crear nueva pérdida"
          }
        >
          <FiPlus className="mr-2 h-5 w-5" />
          {selectedStoreId && isStoreOperational(storeSessionData) ? 'Nueva Pérdida' : 'Selecciona Tienda'}
        </button>
      </div>

      {!selectedStoreId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ <strong>Tienda requerida:</strong> Selecciona una tienda en el panel principal para gestionar las pérdidas.
          </p>
        </div>
      )}

      <h2 className="text-2xl font-bold text-red-600 flex items-center space-x-2">
        <FiAlertOctagon className="text-red-600" size={24} />
        <span>Registro de Pérdidas</span>
      </h2>

      {/* Estadísticas y botón */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-sm font-medium text-blue-800">Total Pérdidas</h3>
            <p className="text-2xl font-bold text-blue-600">
              {filteredLosses.length}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-sm font-medium text-green-800">Por Gastos</h3>
            <p className="text-2xl font-bold text-green-600">
              {filteredLosses.filter(item => item.reason === 'Gasto').length}
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="text-sm font-medium text-purple-800">Por Vencimiento</h3>
            <p className="text-2xl font-bold text-purple-600">
              {filteredLosses.filter(item => item.reason === 'Vencimiento').length}
            </p>
          </div>

          <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
            <h3 className="text-sm font-medium text-pink-800">Por Transporte</h3>
            <p className="text-2xl font-bold text-pink-600">
              {filteredLosses.filter(item => item.reason === 'Transporte').length}
            </p>
          </div>
        </div>
      </div>

      {/* Estado de carga o mensajes según el contexto */}
      {isLoadingLosses || isLoadingSales || isLoadingSessionData ? (
        <div className="text-center text-gray-500 italic">
          Cargando datos...
        </div>
      ) : !selectedStoreId ? (
        <div className="text-center text-gray-500 italic">
          Seleccione una tienda para ver las pérdidas registradas.
        </div>
      ) : !isStoreOperational(storeSessionData) ? (
        <div className="text-center text-orange-600 italic bg-orange-50 p-4 rounded-lg border border-orange-200">
          {getStoreOperationalMessage(storeSessionData)}
          <br />
          <small>Para registrar pérdidas, la tienda debe tener una sesión de caja activa.</small>
        </div>
      ) : filteredLosses.length === 0 ? (
        <div className="text-center text-gray-500 italic">
          No hay pérdidas registradas para esta tienda.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
          <table className="min-w-full text-left text-gray-700">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 text-center">Producto</th>
                <th className="px-4 py-2 text-center">Tienda</th>
                <th className="px-4 py-2 text-center">Cantidad</th>
                <th className="px-4 py-2 text-center">Precio (S/)</th>
                <th className="px-4 py-2 text-center">Razón</th>
                <th className="px-4 py-2 text-center">Observación</th>
                <th className="px-4 py-2 text-center">Fecha</th>
                <th className="px-4 py-2 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredLosses.map((item) => (
                <tr key={item.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">
                    {getProductName(item.productId)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {getStoreName(item.salesId)}
                  </td>
                  <td className="px-4 py-2 text-center">{item.quantity}</td>
                  <td className="px-4 py-2 text-center">
                    {item.price !== undefined
                      ? Number(item.price).toFixed(2)
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-center">{item.reason}</td>
                  <td className="px-4 py-2 text-center">
                    {item.observations || "-"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
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
      )}

      <ModalCreateLoss
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateLoss}
        selectedStoreId={selectedStoreId}
      />

      <ModalEditLoss
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentLoss={currentLoss}
        onSave={handleEditLoss}
        selectedStoreId={selectedStoreId}
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
