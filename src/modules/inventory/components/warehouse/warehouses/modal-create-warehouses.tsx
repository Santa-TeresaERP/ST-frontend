import React from "react";
import { X } from "lucide-react";

const ModalCreateWarehousesView = ({ showModal, onClose }) => {
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
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-rigth">
              Nombre <span className="ml-2 text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Ej: Almacén Central"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-rigth">
              Locación
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Ej: Calle Industrial 123"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-rigth">
              Capacidad
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Ej: 1000 unidades"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-rigth">
              Observaciones
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Ej: Espacio compartido con zona de despacho"
              rows={3}
            ></textarea>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Guardar Almacén
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateWarehousesView;
