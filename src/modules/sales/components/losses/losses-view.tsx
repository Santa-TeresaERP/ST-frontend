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
import { useCheckStoreActiveSession } from "@/modules/sales/hooks/useCashSession";
import { isStoreOperational, getStoreOperationalMessage } from "@/modules/sales/utils/store-status";
import { returnsAttributes } from "@/modules/sales/types/returns";
import { useModulePermissions } from "@/core/utils/permission-hooks";
import { MODULE_NAMES } from "@/core/utils/useModulesMap";
import { useFetchStores } from "../../hooks/useStore";

interface LossesComponentViewProps {
  selectedStoreId?: string;
}

const LossesComponentView: React.FC<LossesComponentViewProps> = ({
  selectedStoreId,
}) => {
  const { data: losses = [], isLoading: isLoadingLosses } = useFetchReturns();
  const { data: products = [] } = useFetchProducts();
  const { data: storesResponse } = useFetchStores(1, 200);
  const stores = storesResponse?.stores || [];
  
  // Hook para verificar si la tienda tiene una sesión de caja activa
  const { data: storeSessionData, isLoading: isLoadingSessionData } = useCheckStoreActiveSession(selectedStoreId);

  // Permisos del módulo
  const { canCreate, canEdit, canDelete, isAdmin } = useModulePermissions(MODULE_NAMES.SALES);

  const createReturnMutation = useCreateReturn();
  const updateReturnMutation = useUpdateReturn();
  const deleteReturnMutation = useDeleteReturn();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentLoss, setCurrentLoss] = useState<returnsAttributes | null>(null);

  // Show all losses for the selected store
  const filteredLosses = selectedStoreId
    ? losses.filter((loss) => loss.storeId === selectedStoreId)
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

  const getStoreName = (storeId: string) => {
    if (!storeId) return "No asignada";
    const store = stores.find((s) => s.id === storeId);
    return store ? store.store_name : `Tienda no encontrada`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      
      {/* Panel de permisos para verificación */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <small className="text-blue-700">
          <strong>Estado Permisos:</strong>{" "}
          Módulo: {MODULE_NAMES.SALES} | 
          Crear: {canCreate ? "✅ SÍ" : "❌ NO"} | 
          Editar: {canEdit ? "✅ SÍ" : "❌ NO"} | 
          Eliminar: {canDelete ? "✅ SÍ" : "❌ NO"} | 
          Admin: {isAdmin ? "✅ SÍ" : "❌ NO"}
          <br />
        </small>
      </div>

      <div className="flex justify-end items-center">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={!selectedStoreId || !isStoreOperational(storeSessionData) || !canCreate}
          className={`flex items-center px-4 py-2 rounded-lg transition-all ${
            selectedStoreId && isStoreOperational(storeSessionData) && canCreate
              ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          title={
            !selectedStoreId 
              ? "Seleccione una tienda primero" 
              : !isStoreOperational(storeSessionData)
                ? getStoreOperationalMessage(storeSessionData)
                : !canCreate
                ? "No tienes permisos para crear pérdidas"
                : "Crear nueva pérdida"
          }
        >
          <FiPlus className="mr-2 h-5 w-5" />
          {selectedStoreId && isStoreOperational(storeSessionData) && canCreate 
            ? 'Nueva Pérdida' 
            : !canCreate 
            ? 'Sin Permisos'
            : 'Selecciona Tienda'}
        </button>
      </div>

      {!selectedStoreId && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ <strong>Tienda requerida:</strong> Selecciona una tienda en el panel principal para gestionar las pérdidas.
          </p>
        </div>
      )}

      {!canCreate && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            🚫 <strong>Sin permisos:</strong> No tienes permisos para crear nuevas pérdidas.
          </p>
          <small className="text-red-600">
            Contacta con tu administrador para obtener los permisos necesarios.
          </small>
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
      {isLoadingLosses || isLoadingSessionData ? (
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
                    {getStoreName(item.storeId)}
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
                    {canEdit && (
                      <button
                        className="text-blue-500 hover:text-yellow-600"
                        onClick={() => {
                          setCurrentLoss(item);
                          setIsEditModalOpen(true);
                        }}
                        title="Editar pérdida"
                      >
                        <FiEdit size={18} />
                      </button>
                    )}
                    {!canEdit && (
                      <span
                        className="text-gray-400 cursor-not-allowed"
                        title="No tienes permisos para editar pérdidas"
                      >
                        <FiEdit size={18} />
                      </span>
                    )}
                    {canDelete && (
                      <button
                        className="text-red-500 hover:text-red-600"
                        onClick={() => {
                          setCurrentLoss(item);
                          setIsDeleteModalOpen(true);
                        }}
                        title="Eliminar pérdida"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                    {!canDelete && (
                      <span
                        className="text-gray-400 cursor-not-allowed"
                        title="No tienes permisos para eliminar pérdidas"
                      >
                        <FiTrash2 size={18} />
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {canCreate && (
        <ModalCreateLoss
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSave={handleCreateLoss}
          selectedStoreId={selectedStoreId}
        />
      )}

      {canEdit && (
        <ModalEditLoss
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentLoss={currentLoss}
          onSave={handleEditLoss}
          selectedStoreId={selectedStoreId}
        />
      )}

      {canDelete && (
        <ModalDeleteLoss
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteLoss}
        />
      )}
    </div>
  );
};

export default LossesComponentView;
