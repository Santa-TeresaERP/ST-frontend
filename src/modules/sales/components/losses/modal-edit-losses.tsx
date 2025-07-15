import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { FiAlertOctagon } from 'react-icons/fi';

interface ModalEditLossProps {
  isOpen: boolean;
  onClose: () => void;
  currentLoss: any;
  onSave: (updatedLoss: any) => void;
}

const ModalEditLoss: React.FC<ModalEditLossProps> = ({ isOpen, onClose, currentLoss, onSave }) => {
  const [producto, setProducto] = useState('');
  const [tienda, setTienda] = useState('');
  const [razon, setRazon] = useState('');
  const [observacion, setObservacion] = useState('');
  const [fecha, setFecha] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (currentLoss) {
      setProducto(currentLoss.producto || '');
      setTienda(currentLoss.tienda || '');
      setRazon(currentLoss.razon || '');
      setObservacion(currentLoss.observacion || '');
      setFecha(currentLoss.fecha || '');
    }
  }, [currentLoss]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!producto || !tienda || !razon || !observacion || !fecha) {
      setLocalError('Por favor, completa todos los campos.');
      return;
    }

    onSave({ producto, tienda, razon, observacion, fecha });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiAlertOctagon size={24} />
          <h2 className="text-xl font-semibold text-center">Editar Pérdida</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {localError && <p className="text-sm text-red-600 font-medium">{localError}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Producto <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Tienda <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={tienda}
                onChange={(e) => setTienda(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Nombre de la tienda"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Razón <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={razon}
                onChange={(e) => setRazon(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Motivo de la pérdida"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Observación <span className="text-red-600">*</span>
              </label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Detalle u observaciones"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Fecha <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <Save size={18} /> Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditLoss;
