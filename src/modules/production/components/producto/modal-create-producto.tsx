import React, { useState } from 'react';

interface ModalCreateProductoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    stock: number;
  }) => void;
}

const ModalCreateProducto: React.FC<ModalCreateProductoProps> = ({ isOpen, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = () => {
    if (!nombre || !categoria || !precio || !stock) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      categoria,
      precio: parseFloat(precio),
      stock: parseInt(stock),
    };

    onSave(nuevoProducto);
    onClose();

    setNombre('');
    setCategoria('');
    setPrecio('');
    setStock('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl w-[90%] max-w-md shadow-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center border-b pb-2">
          Registrar Nuevo Producto
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del producto
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Categoría"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio (S/.)
            </label>
            <input
              type="number"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Precio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock disponible
            </label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Stock"
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateProducto;
