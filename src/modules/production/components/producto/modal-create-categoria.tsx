import { useState } from 'react';
import { Save, Trash2 } from 'lucide-react';

interface ModalCreateCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Categoria {
  nombre: string;
  descripcion: string;
}

const ModalCreateCategoria = ({ isOpen, onClose }: ModalCreateCategoriaProps) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const agregarCategoria = () => {
    setCategorias([...categorias, { nombre: '', descripcion: '' }]);
  };

  const handleChange = (index: number, field: keyof Categoria, value: string) => {
    const nuevasCategorias = [...categorias];
    nuevasCategorias[index][field] = value;
    setCategorias(nuevasCategorias);
  };

  const handleGuardar = (index: number) => {
    const categoria = categorias[index];
    console.log('Categoría guardada:', categoria);
  };

  const handleEliminar = (index: number) => {
    const nuevasCategorias = categorias.filter((_, i) => i !== index);
    setCategorias(nuevasCategorias);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 md:p-8">
        {/* Header */}
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-black">Categoría</h2>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-3xl font-light">
              &times;
            </button>
          </div>
          <hr className="mt-2 border-t-2 border-red-500 w-1/3" />
        </div>

        {/* Botón Agregar Categoría */}
        <div className="flex justify-end mb-6">
          <button
            onClick={agregarCategoria}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all duration-300"
          >
            Agregar Categoría
          </button>
        </div>

        {/* Contenedores de Categoría */}
        {categorias.map((cat, index) => (
          <div
            key={index}
            className="bg-gray-50 border border-gray-300 rounded-xl p-4 md:p-6 shadow-md flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0 mb-4"
          >
            {/* Nombre */}
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 font-medium">Nombre de la categoría</label>
              <input
                type="text"
                value={cat.nombre}
                onChange={(e) => handleChange(index, 'nombre', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ingrese el nombre"
              />
            </div>

            {/* Descripción */}
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1 font-medium">Descripción</label>
              <input
                type="text"
                value={cat.descripcion}
                onChange={(e) => handleChange(index, 'descripcion', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ingrese la descripción"
              />
            </div>

            {/* Íconos */}
            <div className="flex items-center justify-center gap-3 pt-8 md:pt-2">
              <button
                type="button"
                onClick={() => handleGuardar(index)}
                className="text-green-600 hover:text-green-700 transition-transform transform hover:scale-110"
                title="Guardar"
              >
                <Save size={24} />
              </button>
              <button
                type="button"
                onClick={() => handleEliminar(index)}
                className="text-red-600 hover:text-red-700 transition-transform transform hover:scale-110"
                title="Eliminar"
              >
                <Trash2 size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModalCreateCategoria;
