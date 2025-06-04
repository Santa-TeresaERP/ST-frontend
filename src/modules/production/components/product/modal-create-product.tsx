import React, { useState } from 'react';
import { useCreateProduct } from '@/modules/production/hook/useProducts';
import { useFetchCategories } from '@/modules/production/hook/useCategories';
import { Plus, X, Trash2 } from 'lucide-react';

interface Ingredient {
  quantity_required: string;
  unit: string; // Nuevo campo
  resource_id?: string; // Nuevo campo opcional
}

interface ModalCreateProductoProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateProducto: React.FC<ModalCreateProductoProps> = ({ isOpen, onClose }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    quantity_required: '',
    unit: '',
    resource_id: '',
  });
  const [errors, setErrors] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    descripcion: '',
    ingredient: '',
  });

  const createProductMutation = useCreateProduct();
  const { data: categorias, isLoading: isLoadingCategorias, error: errorCategorias } = useFetchCategories();

  const handleAddIngredient = () => {
    if (!newIngredient.quantity_required || !newIngredient.unit) {
      setErrors((prev) => ({
        ...prev,
        ingredient: 'La cantidad requerida y la unidad son obligatorias.',
      }));
      return;
    }

    setIngredients((prev) => [...prev, newIngredient]);
    setNewIngredient({ quantity_required: '', unit: '', resource_id: '' });
    setErrors((prev) => ({ ...prev, ingredient: '' })); // Limpiar errores
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const newErrors = {
      nombre: !nombre ? 'El nombre es obligatorio.' : '',
      categoria: !categoria ? 'La categoría es obligatoria.' : '',
      precio: !precio ? 'El precio es obligatorio.' : '',
      descripcion: !descripcion ? 'La descripción es obligatoria.' : '',
      ingredient: errors.ingredient, // Preserve the current ingredient error state
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    if (ingredients.length === 0) {
      setErrors((prev) => ({
        ...prev,
        ingredient: 'Debe agregar al menos un ingrediente.',
      }));
      return;
    }

    const nuevoProducto = {
      name: nombre,
      category_id: categoria,
      price: parseFloat(precio),
      description: descripcion,
      ...(imagen && { imagen_url: imagen }),
      recipe: ingredients.map((ingredient) => ({
        quantity_required: ingredient.quantity_required,
        unit: ingredient.unit,
        ...(ingredient.resource_id && { resource_id: ingredient.resource_id }),
      })),
    };

    try {
      await createProductMutation.mutateAsync(nuevoProducto);
      onClose();
    } catch (error) {
      console.error('Error al crear el producto:', error);
      alert('Error al crear el producto. Por favor, intenta nuevamente.');
    }
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-t-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Registrar Nuevo Producto</h2>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-red-700 transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna izquierda - Datos del producto */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del producto*</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Ej: Pizza Margarita"
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría*</label>
            {isLoadingCategorias ? (
              <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
            ) : errorCategorias ? (
              <p className="text-red-500 text-sm">Error al cargar categorías</p>
            ) : (
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              >
                <option value="">Seleccione una categoría</option>
                {categorias?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
            {errors.categoria && <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Precio (S/.)*</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/.</span>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                placeholder="0.00"
                step="0.01"
              />
            </div>
            {errors.precio && <p className="text-red-500 text-sm mt-1">{errors.precio}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción*</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="Descripción detallada del producto"
              rows={3}
            />
            {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
            <input
              type="text"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
              placeholder="URL de la imagen"
            />
          </div>
        </div>
      </div>

      {/* Footer con botones */}
      <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
        <button
          onClick={onClose}
          className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
        >
          Guardar Producto
        </button>
      </div>
    </div>
  </div>
  );
};

export default ModalCreateProducto;