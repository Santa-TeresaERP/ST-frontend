import React, { useState, useRef } from 'react';
import { Save, Trash2 } from 'lucide-react';

interface ModalCreateProductoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (producto: {
    id: number;
    nombre: string;
    categoria: string;
    precio: number;
    descripcion: string;
    stock: number;
    imagen: File | null;
    recursos: { nombre: string; cantidad: string }[];
  }) => void;
}

const ModalCreateProducto: React.FC<ModalCreateProductoProps> = ({ isOpen, onClose, onSave }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [stock, setStock] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [recursos, setRecursos] = useState<{ nombre: string; cantidad: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (!nombre || !categoria || !precio || !descripcion || !stock) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const nuevoProducto = {
      id: Date.now(),
      nombre,
      categoria,
      precio: parseFloat(precio),
      descripcion,
      stock: parseInt(stock),
      imagen,
      recursos,
    };

    onSave(nuevoProducto);
    onClose();

    // Reset fields
    setNombre('');
    setCategoria('');
    setPrecio('');
    setDescripcion('');
    setStock('');
    setImagen(null);
    setRecursos([]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImagen(event.target.files[0]);
    }
  };

  const handleAddRecurso = () => {
    setRecursos([...recursos, { nombre: '', cantidad: '' }]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-2xl w-[95%] max-w-5xl shadow-2xl">
        <h2 className="text-2xl font-semibold text-red-800 mb-6 text-center pb-2">
          Registrar Nuevo Producto
        </h2>

        <div className="flex gap-8">
          {/* Sección producto */}
          <div className="flex-1 space-y-4">
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
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Descripción del producto"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen del producto
              </label>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition"
              >
                Subir imagen
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
              {imagen && <p className="mt-2 text-sm text-gray-600">Imagen seleccionada: {imagen.name}</p>}
            </div>
          </div>

          {/* Separador vertical */}
          <div className="w-px bg-gray-300 mx-2"></div>

          {/* Sección recursos */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-red-700 mb-4">Receta</h3>
            <button
              onClick={handleAddRecurso}
              className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-400"
            >
              Agregar Recurso
            </button>

            {recursos.map((recurso, index) => (
              <div key={index} className="border border-gray-300 p-4 rounded-xl mb-3 shadow-sm">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[150px]">
                    <label className="text-sm font-medium text-gray-700">Recurso</label>
                    <input
                      type="text"
                      value={recurso.nombre}
                      onChange={(e) => {
                        const nuevos = [...recursos];
                        nuevos[index].nombre = e.target.value;
                        setRecursos(nuevos);
                      }}
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                      placeholder="Nombre del recurso"
                    />
                  </div>
                  <div className="w-[120px]">
                    <label className="text-sm font-medium text-gray-700">Cantidad</label>
                    <input
                      type="number"
                      value={recurso.cantidad}
                      onChange={(e) => {
                        const nuevos = [...recursos];
                        nuevos[index].cantidad = e.target.value;
                        setRecursos(nuevos);
                      }}
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex gap-2 mt-6">
                    <button
                      title="Guardar"
                      className="bg-green-600 hover:bg-green-500 text-white p-2 rounded-full"
                    >
                      <Save />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={() => {
                        const nuevos = recursos.filter((_, i) => i !== index);
                        setRecursos(nuevos);
                      }}
                      className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-full"
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-600 text-white transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateProducto;


