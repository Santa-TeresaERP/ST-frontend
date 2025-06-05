import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

type ModalCreateProductWarehouseProps = {
  onClose: () => void;
  onCreate: (producto: { nombre: string; cantidad: number; almacen: string }) => void;
};

const ModalCreateProductWarehouse: React.FC<ModalCreateProductWarehouseProps> = ({
  onClose,
  onCreate,
}) => {
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState<number | ''>('');
  const [almacen, setAlmacen] = useState('Cerro Colorado');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    if (cantidad === '' || cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0.');
      return;
    }

    setError('');
    onCreate({ nombre: nombre.trim(), cantidad: Number(cantidad), almacen });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center">Crear Producto en Almacén</h2>
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
            <label className="block text-gray-700 mb-1 font-medium">Nombre del Producto*</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Ejemplo: Harina de Trigo"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Cantidad*</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Ejemplo: 50"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Almacén*</label>
            <select
              value={almacen}
              onChange={(e) => setAlmacen(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="Cerro Colorado">Cerro Colorado</option>
              <option value="Santa Catalina">Santa Catalina</option>
              <option value="San Juan">San Juan</option>
            </select>
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

export default ModalCreateProductWarehouse;
