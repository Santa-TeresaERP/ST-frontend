import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

type ModalCreateResourceMovementProps = {
  onClose: () => void;
  onCreate: (recurso: {
    recurso: string;
    almacen: string;
    tipoMovimiento: 'Entrada' | 'Salida';
    cantidad: number;
    fechaMovimiento: string;
  }) => void;
};

const ModalCreateResourceMovement: React.FC<ModalCreateResourceMovementProps> = ({
  onClose,
  onCreate,
}) => {
  const [recurso, setRecurso] = useState('');
  const [almacen, setAlmacen] = useState('');
  const [tipoMovimiento, setTipoMovimiento] = useState<'Entrada' | 'Salida'>('Entrada');
  const [cantidad, setCantidad] = useState<number | ''>('');
  const [fechaMovimiento, setFechaMovimiento] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recurso.trim()) {
      setError('El recurso es obligatorio.');
      return;
    }
    if (!almacen.trim()) {
      setError('El almacén es obligatorio.');
      return;
    }
    if (cantidad === '' || cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }
    if (!fechaMovimiento) {
      setError('La fecha de movimiento es obligatoria.');
      return;
    }

    setError('');
    onCreate({
      recurso: recurso.trim(),
      almacen: almacen.trim(),
      tipoMovimiento,
      cantidad: Number(cantidad),
      fechaMovimiento,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center">Nuevo Movimiento de Recurso</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Recurso*</label>
            <input
              type="text"
              value={recurso}
              onChange={(e) => setRecurso(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Nombre del recurso"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Almacén*</label>
            <input
              type="text"
              value={almacen}
              onChange={(e) => setAlmacen(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Nombre del almacén"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tipo de Movimiento*</label>
            <select
              value={tipoMovimiento}
              onChange={(e) => setTipoMovimiento(e.target.value as 'Entrada' | 'Salida')}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Cantidad*</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Cantidad"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Fecha de Movimiento*</label>
            <input
              type="date"
              value={fechaMovimiento}
              onChange={(e) => setFechaMovimiento(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
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
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <Save size={18} /> Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateResourceMovement;
