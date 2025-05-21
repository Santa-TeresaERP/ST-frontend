import React, { useState, useEffect, useMemo } from 'react';
import { X, Save } from 'lucide-react';

interface ModalEditResourceProps {
  recurso: {
    id: number;
    nombre: string;
    cantidad: number;
    precioUnitario?: number;
    precioTotal?: number;
    proveedor?: string;
    fechaEntrada: string;
  };
  onClose: () => void;
  onUpdate: (recurso: {
    id: number;
    nombre: string;
    unidad: number;
    precioUnitario: number;
    precioTotal?: number;
    proveedor: string;
    fechaCompra: string;
  }) => void;
}

const ModalEditResource: React.FC<ModalEditResourceProps> = ({
  recurso,
  onClose,
  onUpdate,
}) => {
  const [nombre, setNombre] = useState(recurso.nombre);
  const [unidad, setUnidad] = useState(recurso.cantidad);
  const [precioUnitario, setPrecioUnitario] = useState(recurso.precioUnitario || 0);
  const [proveedor, setProveedor] = useState(recurso.proveedor || '');
  const [fechaCompra, setFechaCompra] = useState(recurso.fechaEntrada);
  const [error, setError] = useState('');

  const precioTotal = useMemo(() => {
    return unidad * precioUnitario;
  }, [unidad, precioUnitario]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (unidad <= 0) {
      setError('La unidad debe ser mayor a 0.');
      return;
    }
    if (precioUnitario <= 0) {
      setError('El precio unitario debe ser mayor a 0.');
      return;
    }

    setError('');
    onUpdate({
      id: recurso.id,
      nombre: nombre.trim(),
      unidad,
      precioUnitario,
      precioTotal,
      proveedor: proveedor.trim(),
      fechaCompra
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center">Editar Recurso</h2>
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
            <label className="block text-gray-700 mb-1 font-medium">Nombre*</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Nombre del recurso"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Unidad*</label>
              <input
                type="number"
                min={1}
                value={unidad}
                onChange={(e) => setUnidad(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Cantidad"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Precio Unitario*</label>
              <input
                type="number"
                min={0.01}
                step={0.01}
                value={precioUnitario}
                onChange={(e) => setPrecioUnitario(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="Precio por unidad"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Proveedor</label>
            <input
              type="text"
              value={proveedor}
              onChange={(e) => setProveedor(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Nombre del proveedor"
            />
          </div>

          <div className="bg-gray-100 p-3 rounded-lg">
            <label className="block text-gray-500 mb-1 text-sm">Precio Total</label>
            <p className="text-lg font-semibold">S/ {precioTotal.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Fecha de compra</label>
            <input
              type="date"
              value={fechaCompra}
              onChange={(e) => setFechaCompra(e.target.value)}
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

export default ModalEditResource;