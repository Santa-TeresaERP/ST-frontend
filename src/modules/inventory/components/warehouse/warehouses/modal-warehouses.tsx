/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X, Plus, Edit3, Trash2 } from "lucide-react";
import ModalCreateWarehousesView from "./modal-create-warehouses";
import ModalEditWarehousesView from "./modal-edit-warehouses";
import ModalDeleteWarehouse from "./modal-delete-warehouses";
import { useFetchWarehouses, useCreateWarehouse, useDeleteWarehouse } from "@/modules/inventory/hook/useWarehouses";

interface ModalWarehousesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ModalWarehouses: React.FC<ModalWarehousesProps> = ({ open, onOpenChange }) => {
  // Estados para controlar los modales
  const [showCreateWarehouse, setShowCreateWarehouse] = useState(false);
  const [showEditWarehouse, setShowEditWarehouse] = useState(false);
  const [showDeleteWarehouse, setShowDeleteWarehouse] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<any>(null);

  // Hooks para manejar las operaciones
  const { data: warehouses, refetch } = useFetchWarehouses(); // Obtener la lista de almacenes
  const createWarehouse = useCreateWarehouse(); // Hook para crear almacenes
  const deleteWarehouse = useDeleteWarehouse(); // Hook para eliminar almacenes

  // Manejar la creación de un almacén
  const handleCreateWarehouse = async (data: any) => {
    try {
      await createWarehouse.mutateAsync(data); // Llama al hook para crear el almacén
      setShowCreateWarehouse(false); // Cierra el modal
      refetch(); // Actualiza la lista de almacenes
    } catch (error) {
      console.error("Error al crear el almacén:", error);
    }
  };

  // Manejar la eliminación de un almacén
  const handleDeleteWarehouse = async () => {
    if (!selectedWarehouse) return;

    try {
      await deleteWarehouse.mutateAsync(selectedWarehouse.id); // Llama al hook para eliminar el almacén
      setShowDeleteWarehouse(false); // Cierra el modal
      setSelectedWarehouse(null); // Limpia el almacén seleccionado
      refetch(); // Actualiza la lista de almacenes
    } catch (error) {
      console.error("Error al eliminar el almacén:", error);
    }
  };

  if (!open) return null;

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
                {warehouses?.length ?? 0} activos
              </span>
            </div>

            {(warehouses?.length ?? 0) === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay almacenes registrados. Crea tu primer almacén.
              </div>
            ) : null}
          </div>

          {/* Almacenes existentes */}
          <div>
            <div className="flex items-center mb-4">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-3"></span>
              <h3 className="text-xl font-semibold text-gray-800">Almacenes Existentes</h3>
              <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {warehouses?.length ?? 0} en total
              </span>
            </div>

            {warehouses?.map((warehouse) => (
              <div
                key={warehouse.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                    <p className="text-lg font-medium text-gray-800">{warehouse.name}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Dirección</label>
                    <p className="text-gray-600">{warehouse.location}</p>
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
                      setSelectedWarehouse(warehouse);
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

        {/* Modal crear almacén */}
        <ModalCreateWarehousesView
          showModal={showCreateWarehouse}
          onClose={() => setShowCreateWarehouse(false)}
          onCreate={handleCreateWarehouse} // Pasa la función implementada
        />

        {/* Modal editar almacén */}
        <ModalEditWarehousesView
          showModal={showEditWarehouse}
          onClose={() => setShowEditWarehouse(false)}
          warehouse={selectedWarehouse}
          onSave={() => {
            setShowEditWarehouse(false);
            refetch(); // Actualiza la lista después de editar
          }}
        />

        {/* Modal eliminar almacén */}
        <ModalDeleteWarehouse
          isOpen={showDeleteWarehouse}
          onClose={() => setShowDeleteWarehouse(false)}
          onConfirm={handleDeleteWarehouse} // Llama a la función para eliminar
          warehouseName={selectedWarehouse?.name}
        />
      </div>
    </div>
  );
};

export default ModalWarehouses;