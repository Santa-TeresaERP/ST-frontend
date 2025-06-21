import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUpdateWarehouse } from "@/modules/inventory/hook/useWarehouses";
import { UpdateWarehousePayload, WarehouseAttributes } from "@/modules/inventory/types/warehouse";
import { toast } from "react-toastify";

interface ModalEditWarehousesViewProps {
  showModal: boolean;
  onClose: () => void;
  warehouse: WarehouseAttributes;
  onSuccess?: () => void;
}

const ModalEditWarehousesView: React.FC<ModalEditWarehousesViewProps> = ({
  showModal,
  onClose,
  warehouse,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState<number | "">("");
  const [observation, setObservation] = useState("");

  const updateWarehouse = useUpdateWarehouse();

  useEffect(() => {
    if (showModal && warehouse) {
      setName(warehouse.name);
      setLocation(warehouse.location);
      setCapacity(warehouse.capacity);
      setObservation(warehouse.observation || "");
    }
  }, [warehouse, showModal]);

  const handleSave = () => {
    if (!name.trim()) {
      toast.error("El nombre es obligatorio");
      return;
    }

    if (capacity === "" || capacity <= 0) {
      toast.error("La capacidad debe ser mayor a 0");
      return;
    }

    const payload: UpdateWarehousePayload = {
      name: name.trim(),
      location: location.trim(),
      capacity: Number(capacity),
      observation: observation.trim() || undefined,
    };

    updateWarehouse.mutate(
      { id: warehouse.id!, payload },
      {
        onSuccess: () => {
          toast.success("Almacén actualizado exitosamente");
          onSuccess?.();
          onClose();
        },
        onError: (error) => {
          console.error("Error al actualizar el almacén:", error);
          toast.error("Error al actualizar el almacén");
        },
      }
    );
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-t-xl p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Editar Almacén</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-yellow-700 transition-colors duration-200 text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
              placeholder="Ej: Almacén Central"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Locación
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
              placeholder="Ej: Calle Industrial 123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value === "" ? "" : Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
              placeholder="Ej: 1000"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
              placeholder="Notas adicionales"
              rows={3}
            ></textarea>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700"
            disabled={updateWarehouse.isPending}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={updateWarehouse.isPending}
          >
            {updateWarehouse.isPending ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditWarehousesView;
