import React, { useState } from "react";
import { X } from "lucide-react";
import { useCreateWarehouse } from "../../../hook/useWarehouses";

interface ModalCreateWarehousesViewProps {
  showModal: boolean;
  onClose: () => void;
  onAddNew: (newWarehouse: { name: string; location: string; capacity: string; observation: string }) => void;
}

const ModalCreateWarehousesView: React.FC<ModalCreateWarehousesViewProps> = ({ showModal, onClose }) => {
  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    observation: "",
  });
  const [error, setError] = useState<string | null>(null);

  const createWarehouse = useCreateWarehouse();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.location || !form.capacity) {
      setError("Todos los campos obligatorios deben estar completos.");
      return;
    }
    try {
      await createWarehouse.mutateAsync({
        name: form.name,
        location: form.location,
        capacity: Number(form.capacity),
        observation: form.observation || undefined,
      });
      setForm({ name: "", location: "", capacity: "", observation: "" });
      onClose();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Error al crear el almacén.");
    }
  };

  if (!showModal) return null;

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
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-rigth">
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
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-rigth">
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
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-rigth">
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
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-rigth">
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
              disabled={createWarehouse.status === "pending"}
            >
              {createWarehouse.status === "pending" ? "Guardando..." : "Guardar Almacén"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateWarehousesView;
// ...resto del código...