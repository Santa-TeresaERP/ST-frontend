import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface Warehouse {
  id: number;
  nombre: string;
  locacion: string;
  capacidad: string;
  observaciones: string;
}

interface ModalEditWarehousesViewProps {
  showModal: boolean;
  onClose: () => void;
  warehouse: Warehouse;
  onSave: (updatedWarehouse: Warehouse) => void;
}

const ModalEditWarehousesView: React.FC<ModalEditWarehousesViewProps> = ({
  showModal,
  onClose,
  warehouse,
  onSave,
}) => {
  const [nombre, setNombre] = useState("");
  const [locacion, setLocacion] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [observaciones, setObservaciones] = useState("");

  useEffect(() => {
    if (warehouse) {
      setNombre(warehouse.nombre);
      setLocacion(warehouse.locacion);
      setCapacidad(warehouse.capacidad);
      setObservaciones(warehouse.observaciones);
    }
  }, [warehouse]);

  const handleSave = () => {
    const updatedWarehouse: Warehouse = {
      ...warehouse,
      nombre,
      locacion,
      capacidad,
      observaciones,
    };
    onSave(updatedWarehouse);
    onClose();
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
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
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
              value={locacion}
              onChange={(e) => setLocacion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
              placeholder="Ej: Calle Industrial 123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacidad
            </label>
            <input
              type="text"
              value={capacidad}
              onChange={(e) => setCapacidad(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500"
              placeholder="Ej: 1000 unidades"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
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
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white shadow-md hover:shadow-lg"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditWarehousesView;
