import React, { useState } from "react";
import {
  FiShoppingCart,
  FiPlus,
  FiEdit,
  FiHelpCircle,
} from "react-icons/fi";
import ModalCreateSales from "./modal-create-sales";
import ModalEditSales from "./modal-edit-sales";
import ModalDetailSales from "./modal-details-sales";
import { useFetchSales } from "../../hooks/useSales";
import { useFetchStores } from "@/modules/sales/hooks/useStore";
import { salesAttributes } from "../../types/sales";
import { StoreAttributes } from "@/modules/sales/types/store";
import { useCheckStoreActiveSession } from "../../hooks/useCashSession";
import {
  isStoreOperational,
  getStoreOperationalMessage,
} from "../../utils/store-status";
import { useModulePermissions } from "@/core/utils/permission-hooks";
import { MODULE_NAMES } from "@/core/utils/useModulesMap";

interface SalesComponentsViewProps {
  selectedStore: StoreAttributes | null;
}

const SalesComponentsView: React.FC<SalesComponentsViewProps> = ({
  selectedStore,
}) => {
  const { data: sales = [], isLoading, error } = useFetchSales();
  const { data: storesResponse } = useFetchStores();
  const stores: StoreAttributes[] = storesResponse?.stores || [];

  const { data: storeSessionData } = useCheckStoreActiveSession(
    selectedStore?.id
  );

  // Permisos del módulo
  const { canCreate, canEdit, canDelete, isAdmin } = useModulePermissions(MODULE_NAMES.SALES);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentSale, setCurrentSale] = useState<salesAttributes | null>(null);

  const handleEditClick = (sale: salesAttributes) => {
    setCurrentSale(sale);
    setIsEditModalOpen(true);
  };

  const handleDetailClick = (sale: salesAttributes) => {
    setCurrentSale(sale);
    setIsDetailModalOpen(true);
  };

  const getStoreName = (storeId: string): string => {
    const store = stores.find((s) => s.id === storeId);
    return store?.store_name || "Tienda no encontrada";
  };

  const filteredSales = selectedStore
    ? sales.filter((sale) => sale.store_id === selectedStore.id)
    : [];

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-gray-700">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Cargando ventas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 text-gray-700">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-red-600">
            Error al cargar las ventas: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6 text-gray-700">
      <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
        <FiShoppingCart className="text-red-600" size={24} />
        <span>Información de Ventas</span>
      </h2>

      {/* Panel de información de permisos (solo para debug) */}
      { (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <small className="text-blue-700">
            <strong>Debug Permisos:</strong>{" "}
            Módulo: {MODULE_NAMES.SALES} | 
            Crear: {canCreate ? "✅" : "❌"} | 
            Editar: {canEdit ? "✅" : "❌"} | 
            Eliminar: {canDelete ? "✅" : "❌"} | 
            Admin: {isAdmin ? "✅" : "❌"}
          </small>
        </div>
      )}



      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-sm font-medium text-green-800">
              Costo Total del Mes
            </h3>
            <p className="text-2xl font-bold text-green-600">
              S/{" "}
              {filteredSales
                .filter(
                  (sale) =>
                    new Date(sale.income_date).getMonth() ===
                      new Date().getMonth() &&
                    new Date(sale.income_date).getFullYear() ===
                      new Date().getFullYear()
                )
                .reduce((sum, sale) => sum + (sale.total_income || 0), 0)
                .toFixed(2)}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!selectedStore || !isStoreOperational(storeSessionData) || !canCreate}
          className={`flex items-center px-4 py-2 rounded-lg transition-all ${
            selectedStore && isStoreOperational(storeSessionData) && canCreate
              ? "bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          title={
            !selectedStore
              ? "Seleccione una tienda primero"
              : !isStoreOperational(storeSessionData)
              ? getStoreOperationalMessage(storeSessionData)
              : !canCreate
              ? "No tienes permisos para crear ventas"
              : "Crear nueva venta"
          }
        >
          <FiPlus className="mr-2 h-5 w-5" />
          {selectedStore && isStoreOperational(storeSessionData) && canCreate
            ? "Nueva Venta"
            : !canCreate
            ? "Sin Permisos"
            : "Selecciona Tienda"}
        </button>
      </div>

      {!selectedStore && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ <strong>Tienda requerida:</strong> Selecciona una tienda en el
            panel principal para gestionar las ventas.
          </p>
        </div>
      )}

      {!canCreate && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">
            🚫 <strong>Sin permisos:</strong> No tienes permisos para crear nuevas ventas.
          </p>
          <small className="text-red-600">
            Contacta con tu administrador para obtener los permisos necesarios.
          </small>
        </div>
      )}

      {selectedStore && !isStoreOperational(storeSessionData) && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <p className="text-orange-800">
            ⚠️ <strong>Sesión de caja requerida:</strong>{" "}
            {getStoreOperationalMessage(storeSessionData)}
          </p>
          <small className="text-orange-600">
            Para realizar ventas, la tienda debe tener una sesión de caja
            activa.
          </small>
        </div>
      )}

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
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay ventas registradas
                </td>
              </tr>
            ) : (
              filteredSales.map((sale) => (
                <tr key={sale.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-center">
                    {getStoreName(sale.store_id)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    S/ {sale.total_income?.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(sale.income_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-center">{sale.observations}</td>
                  <td className="px-4 py-2 text-center flex justify-center space-x-3">
                    <button
                      className="text-green-600 hover:text-green-800"
                      onClick={() => handleDetailClick(sale)}
                      title="Ver detalles de la venta"
                    >
                      <FiHelpCircle size={18} />
                    </button>
                    {canEdit && (
                      <button
                        className="text-blue-500 hover:text-yellow-600"
                        onClick={() => handleEditClick(sale)}
                        title="Editar venta"
                      >
                        <FiEdit size={18} />
                      </button>
                    )}
                    {!canEdit && (
                      <span
                        className="text-gray-400 cursor-not-allowed"
                        title="No tienes permisos para editar ventas"
                      >
                        <FiEdit size={18} />
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modales */}
      {canCreate && (
        <ModalCreateSales
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <ModalDetailSales
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        saleDetail={currentSale}
      />
      {canEdit && (
        <ModalEditSales
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          currentSale={currentSale}
          onSave={() => {
            setIsEditModalOpen(false);
            setCurrentSale(null);
          }}
        />
      )}
    </div>
  );
};

export default SalesComponentsView;
