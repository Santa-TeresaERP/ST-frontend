import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/core/store/auth";

interface NewRentalModalProps {
  onClose: () => void;
  onSubmit: (rentalData: {
    nombreComprador: string;
    nombreVendedor: string;
    fechaInicio: string;
    fechaFin: string;
    monto: number;
  }) => void;
}

const NewRentalModal: React.FC<NewRentalModalProps> = ({
  onClose,
  onSubmit,
}) => {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    nombreComprador: "",
    nombreVendedor: "",
    fechaInicio: "",
    fechaFin: "",
    monto: "",
  });

  // ✅ Actualizar nombre del vendedor cuando el usuario esté disponible
  useEffect(() => {
    if (user) {
      console.log("👤 Usuario activo desde store:", {
        id: user.id,
        name: user.name,
        email: user.email,
      });

      if (user.name) {
        setFormData((prev) => ({
          ...prev,
          nombreVendedor: user.name,
        }));
      }
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      formData.nombreComprador &&
      formData.nombreVendedor &&
      formData.fechaInicio &&
      formData.fechaFin &&
      formData.monto
    ) {
      onSubmit({
        nombreComprador: formData.nombreComprador,
        nombreVendedor: formData.nombreVendedor,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        monto: parseFloat(formData.monto),
      });

      // Limpiar formulario
      setFormData({
        nombreComprador: "",
        nombreVendedor: user?.name || "",
        fechaInicio: "",
        fechaFin: "",
        monto: "",
      });
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
      <div className="bg-white rounded-lg w-96 max-w-md mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="bg-red-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white text-center">
            Nuevo Alquiler
          </h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="nombreComprador"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del comprador
              </label>
              <input
                type="text"
                id="nombreComprador"
                name="nombreComprador"
                value={formData.nombreComprador}
                onChange={handleChange}
                className="w-full p-2 border-2 border-orange-400 rounded text-gray-700 focus:outline-none focus:border-red-500"
                placeholder="Ignacio"
                required
              />
            </div>

            <div>
              <label
                htmlFor="nombreVendedor"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del vendedor
              </label>
              <input
                type="text"
                id="nombreVendedor"
                name="nombreVendedor"
                value={formData.nombreVendedor}
                readOnly // ✅ evita que el campo se edite
                className="w-full p-2 border-2 border-orange-400 bg-gray-100 text-gray-700 rounded focus:outline-none"
                placeholder="Cargando..."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="fechaInicio"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha inicio
              </label>
              <input
                type="date"
                id="fechaInicio"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleChange}
                className="w-full p-2 border-2 border-orange-400 rounded text-gray-700 focus:outline-none focus:border-red-500"
                required
              />
            </div>

            <div>
              <label
                htmlFor="fechaFin"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Fecha fin
              </label>
              <input
                type="date"
                id="fechaFin"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleChange}
                className="w-full p-2 border-2 border-orange-400 rounded text-gray-700 focus:outline-none focus:border-red-500"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="monto"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              id="monto"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              className="w-full p-2 border-2 border-orange-400 rounded text-gray-700 focus:outline-none focus:border-red-500"
              placeholder="S/. 200.00"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRentalModal;
