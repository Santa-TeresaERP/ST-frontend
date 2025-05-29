import React, { useState, useEffect } from 'react';
import { useUpdateProduct } from '@/modules/production/hook/useProducts';
import { useFetchCategories } from '@/modules/production/hook/useCategories';
import { useCreateRecipe, useUpdateRecipe, useDeleteRecipe } from '@/modules/production/hook/useRecipes';
import { useFetchResources } from '@/modules/inventory/hook/useResources';
import { Plus, Trash2, X, Edit, Check } from 'lucide-react';
import { Resource } from '@/modules/inventory/types/resource';

interface Ingredient {
  id?: string;
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
    recipe?: Ingredient[];
    RecipeProductResources?: {
      id: string; // <-- Add this line
      quantity_required: string;
      unit: string;
      recipe_product_conections: {
        resource: Resource;
      }[];
    }[];
  } | null;


}

const ModalEditProducto: React.FC<ModalEditProductoProps> = ({ isOpen, onClose, producto }) => {
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
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
  const createRecipeMutation = useCreateRecipe();
  const updateRecipeMutation = useUpdateRecipe();
  const deleteRecipeMutation = useDeleteRecipe();
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);
  const [editedResource, setEditedResource] = useState<{
    quantity_required: string;
    unit: string;
    resource_id: string;
  }>({
    quantity_required: '',
    unit: '',
    resource_id: '',
  });

  const { data: categorias, isLoading: isLoadingCategorias, error: errorCategorias } = useFetchCategories();
  const { data: recursos, isLoading: isLoadingRecursos, error: errorRecursos } = useFetchResources();

  useEffect(() => {
    if (producto) {
      setNombre(producto.name);
      setPrecio(producto.price.toString());
      setDescripcion(producto.description);
      setImagen(producto.imagen_url);
      setCategoria(producto.category_id);
      setIngredients(producto.recipe || []);
    }
  }, [producto]);

  const handleAddIngredient = () => {
    if (!newIngredient.quantity_required || !newIngredient.unit || !newIngredient.resource_id) {
      setErrors((prev) => ({
        ...prev,
        ingredient: 'La cantidad requerida, la unidad y el recurso son obligatorios.',
      }));
      return;
    }
    setIngredients((prev) => [...prev, { ...newIngredient, id: crypto.randomUUID() }]);
    setNewIngredient({ quantity_required: '', unit: '', resource_id: '' });
    setErrors((prev) => ({ ...prev, ingredient: '' }));
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
    setEditingIngredient(null);
  };


  // Para editar una receta (recibe el objeto receta)
  const handleEditRecipe = (recipe: any) => { 
    setEditingResourceId(recipe.id);
    setEditedResource({
      quantity_required: recipe.quantity_required,
      unit: recipe.unit,
      resource_id: recipe.recipe_product_conections[0]?.resource.id ?? '', // O muestra un select para elegir recurso
    });
  };

  // Guardar cambios en la receta
  const handleSaveRecipe = (recipeId: string) => {
    updateRecipeMutation.mutate(
      { id: recipeId, payload: editedResource }, // id en la URL, resto en el body
      {
        onSuccess: () => {
          setEditingResourceId(null);
        },
        onError: (error) => {
          alert('Error al actualizar la receta: ' + error.message);
        },
      }
    );
  };

  // Eliminar una receta
  const handleRemoveRecipe = (recipeId: string, productId: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta receta?')) {
      deleteRecipeMutation.mutate(
        { id: recipeId, product_id: productId },
        {
          onSuccess: () => {
            // Puedes actualizar el producto o recargar las recetas si es necesario
          },
          onError: (error) => {
            alert('Error al eliminar la receta: ' + error.message);
          },
        }
      );
    }
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
    };

    try {
      if (producto) {
        // 1. Actualizar producto
        await updateProductMutation.mutateAsync({ id: producto.id, payload: productoActualizado });

        // 2. Crear nuevas recetas (solo las que no tienen id)
        await Promise.all(
          ingredients
            .filter((ingredient) => !ingredient.id)
            .map((ingredient) =>
              createRecipeMutation.mutateAsync({
                product_id: producto.id,
                quantity_required: ingredient.quantity_required,
                unit: ingredient.unit,
                resource_id: ingredient.resource_id,
              })
            )
        );

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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recurso*</label>
                  {isLoadingRecursos ? (
                    <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
                  ) : errorRecursos ? (
                    <p className="text-red-500 text-sm">Error al cargar recursos</p>
                  ) : (
                    <select
                      value={newIngredient.resource_id || ''}
                      onChange={(e) =>
                        setNewIngredient({ ...newIngredient, resource_id: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    >
                      <option value="">Seleccione un recurso</option>
                      {recursos?.map((recurso: Resource) => (
                        <option key={recurso.id} value={recurso.id}>
                          {recurso.name}
                        </option>
                      ))}
                    </select>
                  )}
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
              {producto?.RecipeProductResources && (
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-2">Recetas relacionadas a este producto:</h4>
                  <ul className="list-disc pl-5">
                    {producto.RecipeProductResources.map((rpr, idx) => (
                      <li
                        key={rpr.recipe_product_conections[0]?.resource?.id ?? idx}
                        className="text-gray-800 flex items-center justify-between"
                      >
                        {editingResourceId === rpr.id ? (
                          <div className="flex items-center gap-2 w-full">
                            <input
                              type="text"
                              value={editedResource.quantity_required}
                              onChange={e => setEditedResource(prev => ({ ...prev, quantity_required: e.target.value }))}
                              className="border px-2 py-1 rounded w-1/4"
                              placeholder="Cantidad"
                            />
                            <input
                              type="text"
                              value={editedResource.unit}
                              onChange={e => setEditedResource(prev => ({ ...prev, unit: e.target.value }))}
                              className="border px-2 py-1 rounded w-1/4"
                              placeholder="Unidad"
                            />
                            <select
                              value={editedResource.resource_id}
                              onChange={e => setEditedResource(prev => ({ ...prev, resource_id: e.target.value }))}
                              className="border px-2 py-1 rounded w-1/4"
                            >
                              <option value="">Seleccione un recurso</option>
                              {recursos?.map((recurso: Resource) => (
                                <option key={recurso.id} value={recurso.id}>
                                  {recurso.name}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleSaveRecipe(rpr.id)}
                              className="text-green-600 hover:text-green-800 p-1 rounded-full"
                              title="Guardar"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setEditingResourceId(null)}
                              className="text-gray-600 hover:text-gray-800 p-1 rounded-full"
                              title="Cancelar"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span>
                              {rpr?.quantity_required ?? ''} {rpr?.unit ?? ''} - {rpr.recipe_product_conections[0]?.resource?.name ?? 'Sin recurso'}
                            </span>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditRecipe(rpr)}
                                className="text-blue-600 hover:text-blue-800 p-1 rounded-full"
                                title="Editar receta"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => handleRemoveRecipe(rpr.id, producto.id)}
                                className="text-red-600 hover:text-red-800 p-1 rounded-full"
                                title="Eliminar receta"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </>
                        )}
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
                      <label className="block text-sm font-medium text-gray-700 mb-2">Recurso*</label>
                      {isLoadingRecursos ? (
                        <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
                      ) : errorRecursos ? (
                        <p className="text-red-500 text-sm">Error al cargar recursos</p>
                      ) : (
                        <select
                          value={editingIngredient.resource_id || ''}
                          onChange={(e) =>
                            setEditingIngredient((prev) =>
                              prev ? { ...prev, resource_id: e.target.value } : null
                            )
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                        >
                          <option value="">Seleccione un recurso</option>
                          {recursos?.map((recurso: Resource) => (
                            <option key={recurso.id} value={recurso.id}>
                              {recurso.name}
                            </option>
                          ))}
                        </select>
                      )}
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