import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

type Producto = {
  id: number;
  nombre: string;
  cantidad: number;
  almacen: string;
  fechaEntrada: string;
};

type ModalEditProductWarehouseProps = {
  producto: Producto;
  onClose: () => void;
  onUpdate: (productoActualizado: Producto) => void;
};

const ModalEditProductWarehouse: React.FC<ModalEditProductWarehouseProps> = ({
  producto,
  onClose,
  onUpdate,
}) => {
  const [nombre, setNombre] = useState(producto.nombre);
  const [cantidad, setCantidad] = useState<number>(producto.cantidad);
  const [almacen, setAlmacen] = useState(producto.almacen);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      return setError('El nombre es obligatorio.');
    }

    if (!cantidad || cantidad <= 0) {
      return setError('La cantidad debe ser mayor a 0.');
    }

    setError('');

    onUpdate({
      ...producto,
      nombre: nombre.trim(),
      cantidad,
      almacen,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        {/* Encabezado */}
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex justify-center items-center relative">
          <h2 className="text-lg font-semibold">Editar Producto del Almacén</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          {/* Campo: Nombre */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-left">Nombre del Producto*</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Ejemplo: Harina de Trigo"
            />
          </div>

          {/* Campo: Cantidad */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-left">Cantidad*</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Ejemplo: 50"
            />
          </div>

          {/* Campo: Almacén */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-left">Almacén*</label>
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

          {/* Botones */}
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

export default ModalEditProductWarehouse;
