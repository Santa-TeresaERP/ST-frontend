/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X, Plus, Edit3 } from "lucide-react";
import ModalCreateWarehousesView from "./modal-create-warehouses";
import ModalEditWarehousesView from "./modal-edit-warehouses";
import ModalDeleteWarehouse from "./modal-delete-warehouses";
import ToggleWarehouseStatus from "./toggle-warehouse-status";
import { 
  useFetchWarehouses, 
} from "@/modules/inventory/hook/useWarehouses";

interface ModalWarehousesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalWarehouses: React.FC<ModalWarehousesProps> = ({ open, onOpenChange }) => {
  // Estados para controlar los modales
  const [showCreateWarehouse, setShowCreateWarehouse] = useState(false);
  const [showEditWarehouse, setShowEditWarehouse] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null); // almacén a editar
  const [showDeleteWarehouse, setShowDeleteWarehouse] = useState(false); 

  // Hook debe estar antes del return condicional
  const { data: warehouses, isLoading, error } = useFetchWarehouses();

  if (!open) return null;

  const activeWarehouses = warehouses?.filter(warehouse => warehouse.status === true) || [];
  const inactiveWarehouses = warehouses?.filter(warehouse => warehouse.status === false) || [];

  // Debug: mostrar información en consola
  console.log('Warehouses data:', warehouses);
  console.log('Active warehouses:', activeWarehouses);
  console.log('Inactive warehouses:', inactiveWarehouses);
  console.log('Loading:', isLoading);
  console.log('Error:', error);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-6 md:px-8 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto px-0 pb-6 pt-0">
        {/* Encabezado */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-red-600 to-red-800 rounded-t-xl p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Gestión de Almacenes</h2>
              <p className="text-red-100 mt-1">Administra los almacenes de la empresa</p>
            </div>
            <button
              className="p-2 rounded-full hover:bg-red-700 transition-colors duration-200 text-white"
              onClick={() => onOpenChange(false)}
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Botón agregar */}
        <div className="flex justify-end mb-2 p-6 ">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-5 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => setShowCreateWarehouse(true)}
          >
            <Plus size={20} />
            <span className="font-medium">Agregar Almacén</span>
          </button>
        </div>

        {/* Estados de carga y error */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando almacenes...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-red-800">Error al cargar almacenes:</span>
            </div>
            <p className="text-red-700 mt-1">{error.message}</p>
          </div>
        )}

      {/* Lista de almacenes */}
      {!isLoading && !error && (
        <div className="space-y-8 p-6">
        {/* Almacenes activos */}
        <div>
          <div className="flex items-center mb-4">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
            <h3 className="text-xl font-semibold text-gray-800">Almacenes Activos</h3>
            <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {activeWarehouses.length} activos
            </span>
          </div>

          {activeWarehouses.length === 0 ? (
            
            <div className="text-center py-8 text-gray-500">
              No hay almacenes activos.
            </div>
          ) : (
            <div className="space-y-4">
              {activeWarehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                      <p className="text-lg font-medium text-gray-800">{warehouse.name}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Dirección</label>
                      <p className="text-gray-600">{warehouse.location}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado</label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                        Activo
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setShowEditWarehouse(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <Edit3 size={20} />
                    </button>
                    <ToggleWarehouseStatus warehouse={warehouse} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Almacenes inactivos */}
        <div>
          <div className="flex items-center mb-4">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-3"></span>
            <h3 className="text-xl font-semibold text-gray-800">Almacenes Inactivos</h3>
            <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {inactiveWarehouses.length} inactivos
            </span>
          </div>

          {inactiveWarehouses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay almacenes inactivos.
            </div>
          ) : (
            <div className="space-y-4">
              {inactiveWarehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition opacity-75"
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                      <p className="text-lg font-medium text-gray-800">{warehouse.name}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Dirección</label>
                      <p className="text-gray-600">{warehouse.location}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Estado</label>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <span className="w-2 h-2 bg-red-400 rounded-full mr-1"></span>
                        Inactivo
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => {
                        setSelectedWarehouse(warehouse);
                        setShowEditWarehouse(true);
                      }}
                      className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <Edit3 size={20} />
                    </button>
                    <ToggleWarehouseStatus warehouse={warehouse} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      )}

        {/* Modal crear almacén */}
        <ModalCreateWarehousesView
          showModal={showCreateWarehouse}
          onClose={() => setShowCreateWarehouse(false)}
        />

        {/* Modal editar almacén */}
        <ModalEditWarehousesView
          showModal={showEditWarehouse}
          onClose={() => setShowEditWarehouse(false)}
          warehouse={selectedWarehouse}
          onSuccess={() => setShowEditWarehouse(false)}
        />

        {/* Modal eliminar almacén */}
          <ModalDeleteWarehouse
            isOpen={showDeleteWarehouse}
            onClose={() => {
              setShowDeleteWarehouse(false);
              setSelectedWarehouse(null); // Limpiar selección
            }}
            onConfirm={() => {
              setShowDeleteWarehouse(false);
              setSelectedWarehouse(null); // Limpiar selección
            }}
            warehouseId={selectedWarehouse?.id} // ✅ Verificar que esto no sea undefined
            warehouseName={selectedWarehouse?.name}
          />
      </div>
    </div>
  );
};

export default ModalWarehouses;