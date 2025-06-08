/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';
import { productSchema } from '../../schemas/productValidation';
import { Category } from '../../types/categories';
import { useFetchCategories } from '../../hook/useCategories';
import { useUpdateProduct } from '../../hook/useProducts';
import { useCreateRecipe, useUpdateRecipe, useDeleteRecipe, useFetchRecipeByProductId} from '../../hook/useRecipes';
import { useFetchResources } from '@/modules/inventory/hook/useResources';
import { Recipe } from '../../types/recipes';
import { Resource } from '@/modules/inventory/types/resource';

// Props del modal de edición de producto
interface ModalEditProductoProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  producto: any;
  onSubmit?: (data: {
    id?: string;
    name: string;
    category_id: Category['id'];
    price: number;
    description: string;
    imagen_url: string;
    recipe?: { resource_id: string; unit: string; quantity_required: number }[]; // Receta del producto
  }) => void | null;
  categories: { id: string; name: string; description: string; createdAt?: Date; updatedAt?: Date }[]; // Agregar esta propiedad
}

const ModalEditProducto: React.FC<ModalEditProductoProps> = ({ isOpen, onClose, producto, onSubmit }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = React.useState({
    id: '',
    name: '',
    category_id: '',
    price: 0,
    description: '',
    imagen_url: '',
  });
  
  const [recipe, setRecipe] = useState({
    unit: '',
    quantity_required: 0,
    resource_id:'',    
  });

  const [recipes, setRecipes] = useState<  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { id?: string; resource_id: string; unit: string; quantity_required: number; resource?: Resource }[]
  >([]);
  const { data: recursos} = useFetchResources();
  const { data: recetasProducto, refetch: refetchReceta } = useFetchRecipeByProductId(formData.id); // formData.id = product_id// formData.id = product_id
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();

  // Estado para los errores de validación
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});

  // Hook para obtener las categorías
  const { data: categorias, isLoading: isLoadingCategorias, error: errorCategorias } = useFetchCategories();

  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);

  // Hook para actualizar el producto
  const { mutateAsync: updateProduct } = useUpdateProduct();

  // Efecto para cargar los datos del producto al abrir el modal
useEffect(() => {
  if (producto) {
    setFormData({
      id: producto.id || '',
      name: producto.name || '',
      category_id: producto.category_id || '',
      price: producto.price || 0,
      description: producto.description || '',
      imagen_url: producto.imagen_url || '',
    });
  }
  setErrors({});
  // Cargar ingredientes de la receta si hay recetas asociadas al producto
  if (recetasProducto && recetasProducto.length > 0) {
    setRecipes(
      recetasProducto.map((receta: Recipe) => ({
        id: receta.id,
        resource_id: receta.resourceId,
        unit: receta.unit,
        quantity_required: receta.quantity,
        resource: receta.resource, // Incluye el objeto resource si viene con la receta
      }))
    );
  } else {
    setRecipes([]);
  }
}, [producto, isOpen, recetasProducto]);
// ...existing code...

    // Maneja cambios en el formulario de ingrediente
  const handleIngredienteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: name === 'quantity_required' ? Number(value) : value });
  };


  // Agrega un ingrediente (crea receta si no existe, o actualiza si existe)
  const handleAgregarIngrediente = async () => {
    if (!recipe.resource_id || !recipe.unit || !recipe.quantity_required) return;
    const payload = {
      productId: formData.id,
      resourceId: recipe.resource_id,
      unit: recipe.unit,
      quantity: recipe.quantity_required,
    };
    await createRecipe.mutateAsync(payload);
    setRecipe({ resource_id: '', unit: '', quantity_required: 1 });
    refetchReceta();
  };

  // Elimina un ingrediente de la receta
  const handleEliminarIngrediente = async (conn: Recipe) => {
    if (conn.id && conn.resource_id) {
      await deleteRecipe.mutateAsync({ id: conn.id });
      refetchReceta();
    }
  };

  // Maneja los cambios en los inputs del formulario
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validación de datos con Zod
      const dataToValidate = { ...formData, price: Number(formData.price) };
      productSchema.parse(dataToValidate);
      setErrors({});
      // Si hay función onSubmit, la ejecuta
      if (onSubmit) {
        await onSubmit(dataToValidate);
      }
      // Actualiza el producto si tiene id
      if (formData.id) {
        await updateProduct({ id: formData.id, payload: dataToValidate });
      }
      // Cierra el modal si todo salió bien
      onClose();
    } catch (error) {
      // Si hay errores de validación, los muestra
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof typeof formData, string>> = {};
        error.errors.forEach((err) => {
          if (err.path.length > 0) {
            fieldErrors[err.path[0] as keyof typeof formData] = err.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  // Si el modal no está abierto, no renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header del modal */}
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

        {/* Contenido principal del modal */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {/* Formulario de edición */}
            <form onSubmit={handleSubmit}>
              {/* Campo: Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del producto*</label>
                <input
                  type="text"
                  name="name"
                  onChange={handleInputChange}
                  value={formData.name}
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-400'} border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                  placeholder="Nombre del producto"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Campo: Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría*</label>
                {isLoadingCategorias ? (
                  <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
                ) : errorCategorias ? (
                  <p className="text-red-500 text-sm">Error al cargar categorías</p>
                ) : (
                  <>
                  <select
                    id="category_id"
                    name="category_id"
                    required
                    onChange={handleInputChange}
                    value={formData.category_id}
                    className={`w-full px-4 py-2 border ${errors.category_id ? 'border-red-500' : 'border-gray-400'} border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias?.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                  </>
                )}
              </div>

              {/* Campo: Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Precio (S/.)*</label>
                <input
                  type="number"
                  name="price"
                  onChange={handleInputChange}
                  value={formData.price}
                  className={`w-full px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-400'} border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              {/* Campo: Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción*</label>
                <textarea
                  name="description"
                  onChange={handleInputChange}
                  value={formData.description}
                  className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-400'} border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                  placeholder="Descripción detallada del producto"
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Campo: Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del producto</label>
                <input
                  type="text"
                  name="imagen_url"
                  onChange={handleInputChange}
                  value={formData.imagen_url}
                  className={`w-full px-4 py-2 border ${errors.imagen_url ? 'border-red-500' : 'border-gray-400'} border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                  placeholder="URL de la imagen"
                />
                {errors.imagen_url && <p className="text-red-500 text-xs mt-1">{errors.imagen_url}</p>}
              </div>

              {/* Footer con botones */}
              <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
                <button
                  onClick={onClose}
                  type="button"
                  className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all duration-200"
                  type="submit"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>

          {/* Columna derecha - Receta (puedes agregar aquí los campos de ingredientes) */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Receta del Producto</h3>
              {/* Formulario para agregar ingrediente */}
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <select
                  name="resource_id"
                  value={recipe.resource_id}
                  onChange={handleIngredienteChange}
                  className="flex-1 px-2 py-1 border rounded"
                  disabled={editRecipe !== null} // <-- Solo editable al agregar, no al editar
                >
                  <option value="">Seleccione recurso</option>
                  {recursos?.map((recurso: Resource) => (
                    <option key={recurso.id} value={recurso.id}>
                      {recurso.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="unit"
                  value={recipe.unit}
                  onChange={handleIngredienteChange}
                  className="w-32 px-2 py-1 border rounded"
                  placeholder="Unidad"
                />
                <input
                  type="number"
                  min={1}
                  name="quantity_required"
                  value={recipe.quantity_required}
                  onChange={handleIngredienteChange}
                  className="w-24 px-2 py-1 border rounded"
                  placeholder="Cantidad"
                />
              </div>
              {/* Botón para agregar recurso */}
              <div className="mb-4">
                {editRecipe === null ? (
                  <button
                    className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={handleAgregarIngrediente}
                    type="button"
                  >
                    Agregar recurso
                  </button>
                ) : (
                  <button
                    className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={async () => {
                      if (!recipe.resource_id || !recipe.unit || !recipe.quantity_required) return;
                      await updateRecipe.mutateAsync({
                        id: editRecipe.id,
                        payload: {
                          productId: formData.id,
                          resourceId: recipe.resource_id,
                          unit: recipe.unit,
                          quantity: recipe.quantity_required,
                        }
                      });
                      setRecipe({ resource_id: '', unit: '', quantity_required: 1 });
                      setEditRecipe(null);
                      refetchReceta();
                    }}
                    type="button"
                  >
                    Guardar recurso
                  </button>
                )}
                {editRecipe !== null && (
                  <button
                    className="ml-2 px-4 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                    onClick={() => {
                      setRecipe({ resource_id: '', unit: '', quantity_required: 1 });
                      setEditRecipe(null);
                    }}
                    type="button"
                  >
                    Cancelar
                  </button>
                )}
              </div>
              {/* Lista de recursos asociados a la receta */}
              <div>
                {recipes.length === 0 && (
                  <p className="text-gray-500 text-sm">No hay recursos asociados a la receta.</p>
                )}
                {recipes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 border-b py-1">
                    <span className="flex-1">{item.resource?.name || 'Recurso'}</span>
                    <span className="w-20 text-center">{item.unit}</span>
                    <span className="w-16 text-center">{item.quantity_required}</span>
                    <button
                      type="button"
                      className="text-blue-600 px-2"
                      onClick={() => {
                        setRecipe({
                          resource_id: item.resource_id,
                          unit: item.unit,
                          quantity_required: item.quantity_required,
                        });
                        setEditRecipe(item);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="text-red-500 px-2"
                      onClick={() => handleEliminarIngrediente(item)}
                    >
                      Eliminar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditProducto;