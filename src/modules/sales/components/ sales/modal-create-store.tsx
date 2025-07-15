import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { FiShoppingCart } from 'react-icons/fi';

interface ModalCreateStoreProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateStore: React.FC<ModalCreateStoreProps> = ({ isOpen, onClose }) => {
  const [tienda, setTienda] = useState('');
  const [costoTotal, setCostoTotal] = useState('');
  const [fecha, setFecha] = useState('');
  const [observacion, setObservacion] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tienda || !costoTotal || !fecha || !observacion) {
      setLocalError('Por favor, completa todos los campos.');
      return;
    }

    console.log('Venta creada:', { tienda, costoTotal, fecha, observacion });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiShoppingCart size={24} />
          <h2 className="text-xl font-semibold text-center">Crear Venta</h2>
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
              <label className="block text-gray-700 mb-1 font-medium">Tienda*</label>
              <input
                type="text"
                value={tienda}
                onChange={(e) => setTienda(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Nombre de la tienda"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Costo Total*</label>
              <input
                type="number"
                value={costoTotal}
                onChange={(e) => setCostoTotal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="S/ 0.00"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Fecha*</label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Observación*</label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Detalle u observaciones de la venta"
                rows={3}
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
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateStore;
