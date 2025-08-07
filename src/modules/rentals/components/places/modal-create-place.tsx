import React, { useState } from "react";
import { FiX } from "react-icons/fi";

interface ModalCreatePlaceProps {
  onClose: () => void;
  onSubmit: (placeData: { name: string; area: string; location_id: string }) => void;
  locationId: string;
}

const ModalCreatePlace: React.FC<ModalCreatePlaceProps> = ({
  onClose,
  onSubmit,
  locationId,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    area: "",
    tipo: "",
    location_id: locationId || "",
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, area, location_id } = formData;

    if (name && area && location_id) {
      const payload = { location_id, name, area }; // 👈 EXCLUYE tipo
      console.log("Payload enviado:", payload);
      onSubmit(payload);
      setFormData({ name: "", area: "", tipo: "", location_id }); // limpia
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Lugar</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre del lugar
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Ej. Zona de piscina"
              required
            />
          </div>

          <div>
            <label
              htmlFor="area"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Área
            </label>
            <input
              type="text"
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Ej. Área Norte"
              required
            />
          </div>
          <div>
            <label
              htmlFor="tipo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tipo de lugar
            </label>
            <select
              id="tipo"
              name="tipo"
              value={formData.tipo} // <-- agregar
              onChange={handleChange} // <-- agregar
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="Piscina">Piscina</option>
              <option value="Parrilla">Parrilla</option>
              <option value="Catedral">Catedral</option>
              <option value="Salón">Salón</option>
              <option value="Jardín">Jardín</option>
              <option value="Terraza">Terraza</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <
            div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Crear Lugar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreatePlace;
