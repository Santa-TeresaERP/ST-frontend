import { Pencil, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

interface ModalEditProductoProps {
  isOpen: boolean;
  onClose: () => void;
  producto: { id: number; nombre: string; categoria: string; precio: number; stock: number } | null;
  onSave: (producto: { id: number; nombre: string; categoria: string; precio: number; stock: number }) => void;
}

const ModalEditProducto: React.FC<ModalEditProductoProps> = ({ isOpen, onClose, producto, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    if (producto) {
      setNombre(producto.nombre);
      setCategoria(producto.categoria);
      setPrecio(producto.precio);
      setStock(producto.stock);
    }
  }, [producto]);

  if (!isOpen || !producto) return null;

  const handleSave = () => {
    onSave({ id: producto.id, nombre, categoria, precio, stock });
    onClose();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50 transition-opacity duration-300">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6 flex items-center justify-center">
          <Pencil size={24} className="mr-2 text-red-600" />
          Editar Producto
        </h2>

        <form className="space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-gray-700">Nombre del Producto</label>
            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg mt-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label htmlFor="categoria" className="block text-gray-700">Categoría</label>
            <input
              id="categoria"
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full p-3 border border-gray-600 rounded-lg mt-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label htmlFor="precio" className="block text-gray-700">Precio</label>
            <input
              id="precio"
              type="number"
              value={precio}
              onChange={(e) => setPrecio(parseFloat(e.target.value))}
              className="w-full p-3 border border-gray-600 rounded-lg mt-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label htmlFor="stock" className="block text-gray-700">Stock</label>
            <input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(parseInt(e.target.value))}
              className="w-full p-3 border border-gray-600 rounded-lg mt-2 bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-gray-300 px-6 py-3 rounded-lg shadow-md hover:bg-gray-700 hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <X size={20} className="text-white" />
              <span>Cancelar</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-red-800 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-600 hover:scale-105 transition-all duration-300 flex items-center space-x-2"
            >
              <Pencil size={20} className="text-white" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditProducto;