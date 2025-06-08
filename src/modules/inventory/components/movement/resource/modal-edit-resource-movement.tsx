import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface ModalEditResourceMovementProps {
  movimiento: {
    id: number;
    recurso: string;
    almacen: string;
    tipoMovimiento: string;
    cantidad: number;
    fechaMovimiento: string;
  };
  onClose: () => void;
  onUpdate: (movimiento: {
    id: number;
    recurso: string;
    almacen: string;
    tipoMovimiento: string;
    cantidad: number;
    fechaMovimiento: string;
  }) => void;
}

const ModalEditResourceMovement: React.FC<ModalEditResourceMovementProps> = ({
  movimiento,
  onClose,
  onUpdate,
}) => {
  const [recurso, setRecurso] = useState(movimiento.recurso);
  const [almacen, setAlmacen] = useState(movimiento.almacen);
  const [tipoMovimiento, setTipoMovimiento] = useState(movimiento.tipoMovimiento);
  const [cantidad, setCantidad] = useState(movimiento.cantidad);
  const [fechaMovimiento, setFechaMovimiento] = useState(movimiento.fechaMovimiento);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!recurso.trim() || !almacen.trim() || !tipoMovimiento.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    setError('');
    onUpdate({
      id: movimiento.id,
      recurso: recurso.trim(),
      almacen: almacen.trim(),
      tipoMovimiento: tipoMovimiento.trim(),
      cantidad,
      fechaMovimiento,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center">Editar Movimiento de Recurso</h2>
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
              onChange={(e) => setTipoMovimiento(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="">Selecciona tipo</option>
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
              <option value="ajuste">Ajuste</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Cantidad*</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
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
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditResourceMovement;
