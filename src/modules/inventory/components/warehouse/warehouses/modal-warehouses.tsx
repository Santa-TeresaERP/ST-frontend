import React, { useState } from "react";
import { X, Plus, Check, Edit3, Trash2 } from "lucide-react";
import ModalCreateWarehousesView from "./modal-create-warehouses";
import ModalEditWarehousesView from "./modal-edit-warehouses";
import ModalDeleteWarehouse from "./modal-delete-warehouses"; // importa el modal de eliminar

interface ModalWarehousesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalWarehouses: React.FC<ModalWarehousesProps> = ({ open, onOpenChange }) => {
  const [showCreateWarehouse, setShowCreateWarehouse] = useState(false);
  const [showEditWarehouse, setShowEditWarehouse] = useState(false);
  const [showDeleteWarehouse, setShowDeleteWarehouse] = useState(false); // estado para mostrar modal eliminar
  const [selectedWarehouseName, setSelectedWarehouseName] = useState<string | undefined>(); // almacén a eliminar

  if (!open) return null;

  // Simulación de datos (podrías usar props si vienen del backend)
  const warehouses = [
    { name: "Almacén 1", address: "Calle Ejemplo 1, Ciudad" },
    { name: "Almacén 2", address: "Calle Ejemplo 2, Ciudad" },
  ];

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Encabezado */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-800 rounded-t-xl -m-6 mb-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">Gestión de Almacenes</h2>
              <p className="text-red-100 mt-1">Administra almacenes</p>
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
          {/* Nuevos almacenes */}
          <div>
            <div className="flex items-center mb-4">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
              <h3 className="text-xl font-semibold text-gray-800">Nuevos Almacenes</h3>
              <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                1 nuevo
              </span>
            </div>

            <div className="bg-white border-2 border-green-200 rounded-xl p-5 shadow-sm bg-gradient-to-br from-green-50 to-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                  <p className="text-lg font-medium text-gray-800 flex items-center">
                    Almacén Central
                    <span className="ml-2 text-green-500">
                      <Check size={18} />
                    </span>
                  </p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Dirección</label>
                  <p className="text-gray-600">Av. Industrial 123, Arequipa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Almacenes existentes */}
          <div>
            <div className="flex items-center mb-4">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-3"></span>
              <h3 className="text-xl font-semibold text-gray-800">Almacenes Existentes</h3>
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {warehouses.length} en total
              </span>
            </div>

            <div className="space-y-4">
              {warehouses.map((warehouse, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                      <p className="text-lg font-medium text-gray-800">{warehouse.name}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Dirección</label>
                      <p className="text-gray-600">{warehouse.address}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 space-x-3">
                    <button
                      onClick={() => setShowEditWarehouse(true)}
                      className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                    >
                      <Edit3 size={20} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedWarehouseName(warehouse.name);
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
        />

        {/* Modal eliminar almacén */}
        <ModalDeleteWarehouse
          isOpen={showDeleteWarehouse}
          onClose={() => setShowDeleteWarehouse(false)}
          onConfirm={() => {
            console.log("Eliminar almacén:", selectedWarehouseName);
            setShowDeleteWarehouse(false);
          }}
          warehouseName={selectedWarehouseName}
        />
      </div>
    </div>
  );
};

export default ModalWarehouses;
