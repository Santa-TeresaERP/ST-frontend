/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X, Plus, Edit3, Trash2 } from "lucide-react";
import ModalCreateWarehousesView from "./modal-create-warehouses";
import ModalEditWarehousesView from "./modal-edit-warehouses";
import ModalDeleteWarehouse from "./modal-delete-warehouses";
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
  const [, setSelectedWarehouseName] = useState<string | undefined>(); // almacén a eliminar
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null); // almacén a editar
  const [showDeleteWarehouse, setShowDeleteWarehouse] = useState(false); 


  if (!open) return null;

  // Simulación de datos (podrías usar props si vienen del backend)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: warehouses } = useFetchWarehouses();

  

  const activeWarehouses = warehouses?.filter(warehouse => warehouse.status === true) || [];
  const inactiveWarehouses = warehouses?.filter(warehouse => warehouse.status === false) || [];


  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Encabezado */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-800 rounded-t-xl -m-6 mb-6 p-6">
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
        <div className="flex justify-end mb-8">
          <button
            className="flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-5 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            onClick={() => setShowCreateWarehouse(true)}
          >
            <Plus size={20} />
            <span className="font-medium">Agregar Almacén</span>
          </button>
        </div>

      {/* Lista de almacenes */}
      <div className="space-y-8">
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
                    <button
                      onClick={() => {
                        console.log('Warehouse seleccionado (activo):', warehouse); // ✅ Debug
                        setSelectedWarehouse(warehouse); // ✅ Cambiar: guardar el warehouse completo, no solo el nombre
                        setShowDeleteWarehouse(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
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
                    <button
                      onClick={() => {
                        console.log('Warehouse seleccionado:', warehouse); // ✅ Debug
                        setSelectedWarehouse(warehouse); // Guardar el warehouse completo
                        setShowDeleteWarehouse(true);
                      }}
                      className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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
          onSave={() => setShowEditWarehouse(false)}
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