/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { X } from "lucide-react";

interface ModalCreateWarehousesViewProps {
  showModal: boolean;
  onClose: () => void;
  onCreate: (data: any) => Promise<void>; // Función para manejar la creación del almacén
}

const ModalCreateWarehousesView: React.FC<ModalCreateWarehousesViewProps> = ({ showModal, onClose, onCreate }) => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    observation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [createWarehouseStatus, setCreateWarehouseStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  if (!showModal) return null;

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Validar los datos del formulario
  const validateForm = () => {
    if (!form.name.trim()) {
      setError("El nombre del almacén es obligatorio.");
      return false;
    }
    if (!form.location.trim()) {
      setError("La locación del almacén es obligatoria.");
      return false;
    }
    if (!form.capacity || isNaN(Number(form.capacity)) || Number(form.capacity) <= 0) {
      setError("La capacidad debe ser un número mayor a 0.");
      return false;
    }
    return true;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setCreateWarehouseStatus("pending");

    try {
      await onCreate({
        name: form.name.trim(),
        location: form.location.trim(),
        capacity: Number(form.capacity),
        observation: form.observation.trim(),
      }); // Llamar a la función pasada como prop
      setCreateWarehouseStatus("success");
      onClose(); // Cerrar el modal después de la creación exitosa
    } catch (err) {
      console.error("Error al crear el almacén:", err);
      setError("Hubo un error al crear el almacén. Por favor, inténtalo de nuevo.");
      setCreateWarehouseStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
        {/* Encabezado */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Nuevo Almacén</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-red-800 transition-colors duration-200 text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-right">
              Nombre <span className="ml-2 text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Ej: Almacén Central"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-right">
              Locación <span className="ml-2 text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Ej: Calle Industrial 123"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-right">
              Capacidad <span className="ml-2 text-red-500">*</span>
            </label>
            <input
              type="number"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Ej: 1000 unidades"
              required
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-right">
              Observaciones
            </label>
            <textarea
              name="observation"
              value={form.observation}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Ej: Espacio compartido con zona de despacho"
              rows={3}
            ></textarea>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
              disabled={createWarehouseStatus === "pending"}
            >
              {createWarehouseStatus === "pending" ? "Guardando..." : "Guardar Almacén"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateWarehousesView;