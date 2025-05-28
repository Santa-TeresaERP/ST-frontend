import React, { useState, useEffect } from 'react';
import { useUpdateProduct } from '@/modules/production/hook/useProducts';
import { useFetchCategories } from '@/modules/production/hook/useCategories';
import { Plus, Trash2, X, Edit, Check } from 'lucide-react';

interface Ingredient {
  id?: string; // ID del ingrediente para identificarlo en el CRUD
  quantity_required: string;
  unit: string;
  resource_id?: string;
}

interface ModalEditProductoProps {
  isOpen: boolean;
  onClose: () => void;
  producto: {
    id: string;
    name: string;
    category_id: string;
    price: number;
    description: string;
    imagen_url: string;
    recipe?: Ingredient[]; // Receta del producto
  } | null;
  categories: { id: string; name: string; description: string; createdAt?: Date; updatedAt?: Date }[]; // Agregar esta propiedad
}

const ModalEditProducto: React.FC<ModalEditProductoProps> = ({ isOpen, onClose, producto }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null); // Para editar un ingrediente existente
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

  const updateProductMutation = useUpdateProduct();
  const { data: categorias, isLoading: isLoadingCategorias, error: errorCategorias } = useFetchCategories();

  useEffect(() => {
    if (producto) {
      setNombre(producto.name);
      setPrecio(producto.price.toString());
      setDescripcion(producto.description);
      setImagen(producto.imagen_url);
      setCategoria(producto.category_id);
      setIngredients(producto.recipe || []); // Cargar la receta si existe
    }
  }, [producto]);

  const handleAddIngredient = () => {
    if (!newIngredient.quantity_required || !newIngredient.unit) {
      setErrors((prev) => ({
        ...prev,
        ingredient: 'La cantidad requerida y la unidad son obligatorias.',
      }));
      return;
    }

    setIngredients((prev) => [...prev, { ...newIngredient, id: crypto.randomUUID() }]); // Generar un ID único para el nuevo ingrediente
    setNewIngredient({ quantity_required: '', unit: '', resource_id: '' });
    setErrors((prev) => ({ ...prev, ingredient: '' })); // Limpiar errores
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    setEditingIngredient(ingredient); // Cargar el ingrediente en edición
  };

  const handleUpdateIngredient = () => {
    if (!editingIngredient?.quantity_required || !editingIngredient.unit) {
      alert('La cantidad requerida y la unidad son obligatorias.');
      return;
    }

    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === editingIngredient.id ? editingIngredient : ingredient
      )
    );
    setEditingIngredient(null); // Limpiar el estado de edición
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients((prev) => prev.filter((ingredient) => ingredient.id !== id));
  };

  const handleSubmit = async () => {
    const newErrors = {
      nombre: !nombre ? 'El nombre es obligatorio.' : '',
      categoria: !categoria ? 'La categoría es obligatoria.' : '',
      precio: !precio ? 'El precio es obligatorio.' : '',
      descripcion: !descripcion ? 'La descripción es obligatoria.' : '',
      ingredient: ingredients.length === 0 ? 'Debe agregar al menos un ingrediente.' : '',
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    const productoActualizado = {
      name: nombre,
      category_id: categoria,
      price: parseFloat(precio),
      description: descripcion,
      imagen_url: imagen,
      recipe: ingredients.map((ingredient) => ({
        id: ingredient.id, // Incluir el ID del ingrediente si existe
        quantity_required: ingredient.quantity_required,
        unit: ingredient.unit,
        ...(ingredient.resource_id && { resource_id: ingredient.resource_id }),
      })),
    };

    try {
      if (producto) {
        await updateProductMutation.mutateAsync({ id: producto.id, payload: productoActualizado });
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Error al actualizar el producto. Por favor, intenta nuevamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">Editar Producto</h2>
            <button 
              onClick={onClose} 
              className="p-1 rounded-full hover:bg-blue-800 transition-colors text-white"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="Nombre del producto"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="URL de la imagen"
              />
            </div>
          </div>

          {/* Columna derecha - Receta */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Receta del Producto</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad requerida*</label>
                  <input
                    type="text"
                    value={newIngredient.quantity_required}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, quantity_required: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: 200g de harina"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unidad*</label>
                  <input
                    type="text"
                    value={newIngredient.unit}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, unit: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: gramos, litros"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ID del recurso (opcional)</label>
                  <input
                    type="text"
                    value={newIngredient.resource_id || ''}
                    onChange={(e) =>
                      setNewIngredient({ ...newIngredient, resource_id: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="ID del recurso (opcional)"
                  />
                </div>

                <button
                  onClick={handleAddIngredient}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Plus size={18} />
                  <span>Agregar Ingrediente</span>
                </button>
              </div>

              {/* Lista de ingredientes */}
              {ingredients.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Ingredientes agregados</h4>
                  <ul className="space-y-2">
                    {ingredients.map((ingredient, index) => (
                      <li
                        key={ingredient.id || index}
                        className="flex justify-between items-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                      >
                        <span className="text-gray-800">
                          {ingredient.quantity_required} ({ingredient.unit})
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditIngredient(ingredient)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded-full hover:bg-blue-50 transition-colors duration-150"
                            title="Editar ingrediente"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleRemoveIngredient(ingredient.id!)}
                            className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50 transition-colors duration-150"
                            title="Eliminar ingrediente"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Edición de ingrediente */}
              {editingIngredient && (
                <div className="mt-6 bg-gray-100 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Editar Ingrediente</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad requerida*</label>
                      <input
                        type="text"
                        value={editingIngredient.quantity_required}
                        onChange={(e) =>
                          setEditingIngredient((prev) =>
                            prev ? { ...prev, quantity_required: e.target.value } : null
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Ej: 200g de harina"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Unidad*</label>
                      <input
                        type="text"
                        value={editingIngredient.unit}
                        onChange={(e) =>
                          setEditingIngredient((prev) =>
                            prev ? { ...prev, unit: e.target.value } : null
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="Ej: gramos, litros"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID del recurso (opcional)</label>
                      <input
                        type="text"
                        value={editingIngredient.resource_id || ''}
                        onChange={(e) =>
                          setEditingIngredient((prev) =>
                            prev ? { ...prev, resource_id: e.target.value } : null
                          )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        placeholder="ID del recurso (opcional)"
                      />
                    </div>

                    <button
                      onClick={handleUpdateIngredient}
                      className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                      <Check size={18} />
                      <span>Guardar Cambios</span>
                    </button>
                  </div>
                </div>
              )}
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
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditProducto;