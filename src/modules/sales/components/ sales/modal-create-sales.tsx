import React, { useState } from 'react';
import { X, Save, Pencil, Trash2 } from 'lucide-react';
import { FiShoppingCart, FiPackage } from 'react-icons/fi';

interface Product {
  nombre: string;
  cantidad: number;
  total: number;
}

interface ModalCreateSalesProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateSales: React.FC<ModalCreateSalesProps> = ({ isOpen, onClose }) => {
  const [tienda, setTienda] = useState('');
  const [costoTotal, setCostoTotal] = useState('');
  const [fecha, setFecha] = useState('');
  const [observacion, setObservacion] = useState('');
  const [localError, setLocalError] = useState('');

  const [producto, setProducto] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [totalProducto, setTotalProducto] = useState('');
  const [productos, setProductos] = useState<Product[]>([]);

  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddOrUpdateProducto = () => {
    if (!producto || !cantidad || !totalProducto) return;

    const nuevoProducto: Product = {
      nombre: producto,
      cantidad: Number(cantidad),
      total: Number(totalProducto),
    };

    if (editingIndex !== null) {
      // Editar producto
      const productosActualizados = [...productos];
      productosActualizados[editingIndex] = nuevoProducto;
      setProductos(productosActualizados);
      setEditingIndex(null);
    } else {
      // Agregar nuevo producto
      setProductos([...productos, nuevoProducto]);
    }

    setProducto('');
    setCantidad('');
    setTotalProducto('');
  };

  const handleEditProducto = (index: number) => {
    const prod = productos[index];
    setProducto(prod.nombre);
    setCantidad(prod.cantidad.toString());
    setTotalProducto(prod.total.toString());
    setEditingIndex(index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tienda || !costoTotal || !fecha || !observacion) {
      setLocalError('Por favor, completa todos los campos.');
      return;
    }

    console.log('Venta creada:', { tienda, costoTotal, fecha, observacion, productos });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl relative mx-2 animate-fadeIn">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-4 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiShoppingCart size={24} />
          <h2 className="text-lg font-semibold text-center">Registrar Nueva Venta</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSubmit} className="md:w-1/2 space-y-4 text-left">
            {localError && <p className="text-sm text-red-600 font-semibold">{localError}</p>}

            <div>
              <label className="block text-gray-700 font-medium mb-1">Tienda <span className="text-red-600">*</span></label>
              <input
                type="text"
                value={tienda}
                onChange={(e) => setTienda(e.target.value)}
                className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Costo Total <span className="text-red-600">*</span></label>
              <input
                type="number"
                value={costoTotal}
                onChange={(e) => setCostoTotal(e.target.value)}
                className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Fecha <span className="text-red-600">*</span></label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none shadow-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">Observación <span className="text-red-600">*</span></label>
              <textarea
                value={observacion}
                onChange={(e) => setObservacion(e.target.value)}
                className="w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none shadow-sm"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 bg-red-800 text-white rounded-lg hover:bg-red-600 text-sm flex items-center gap-2"
              >
                <Save size={16} /> Guardar Venta
              </button>
            </div>
          </form>

          <div className="w-px bg-gray-300 hidden md:block"></div>

          <div className="md:w-1/2">
            <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FiPackage size={18} /> Productos de la venta
            </h3>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div>
                <label className="block text-xs text-gray-700 mb-1">Producto</label>
                <input
                  type="text"
                  value={producto}
                  onChange={(e) => setProducto(e.target.value)}
                  placeholder="Producto"
                  className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Cantidad</label>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  placeholder="Cantidad"
                  className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-700 mb-1">Total S/</label>
                <input
                  type="number"
                  value={totalProducto}
                  onChange={(e) => setTotalProducto(e.target.value)}
                  placeholder="Total S/"
                  className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-red-600 focus:outline-none w-full"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddOrUpdateProducto}
              className={`mb-3 text-white px-3 py-1.5 rounded-lg text-sm w-full ${
                editingIndex !== null
                  ? 'bg-green-700 hover:bg-green-600'
                  : 'bg-red-700 hover:bg-red-600'
              }`}
            >
              {editingIndex !== null ? 'Actualizar Producto' : 'Agregar Producto'}
            </button>


            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {productos.map((prod, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border border-gray-200 rounded-lg p-2 bg-gray-50 text-sm"
                >
                  <div>
                    <p className="font-medium">{prod.nombre}</p>
                    <p className="text-gray-500">
                      Cantidad: {prod.cantidad} | <span className="font-bold text-black">Total: S/ {prod.total.toFixed(2)}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="text-blue-600 hover:scale-105"
                      onClick={() => handleEditProducto(index)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="text-red-600 hover:scale-105"
                      onClick={() => setProductos(productos.filter((_, idx) => idx !== index))}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateSales;
