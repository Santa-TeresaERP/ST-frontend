/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { z } from 'zod';
import { productSchema } from '../../schemas/productValidation';
import { Category } from '../../types/categories';
import { useFetchCategories } from '../../hook/useCategories';
import { useUpdateProduct } from '../../hook/useProducts';
import { useCreateRecipe, useUpdateRecipe, useDeleteRecipe, useFetchRecipeByProductId } from '../../hook/useRecipes';
import { useFetchResources } from '@/modules/inventory/hook/useResources';
import { Recipe } from '../../types/recipes';
import { Resource } from '@/modules/inventory/types/resource';

interface ModalEditProductoProps {
  isOpen: boolean;
  onClose: () => void;
  producto: any;
  onSubmit?: (data: {
    id?: string;
    name: string;
    category_id: Category['id'];
    price: number;
    description: string;
    imagen_url: string;
    recipe?: { resource_id: string; unit: string; quantity_required: number }[];
  }) => void | null;
  categories: { id: string; name: string; description: string; createdAt?: Date; updatedAt?: Date }[];
}

const ModalEditProducto: React.FC<ModalEditProductoProps> = ({ isOpen, onClose, producto, onSubmit }) => {
  const [formData, setFormData] = useState({
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
    resource_id: '',    
  });

  const [recipes, setRecipes] = useState<{ 
    id?: string; 
    resource_id: string; 
    unit: string; 
    quantity_required: number; 
    resource?: Resource 
  }[]>([]);

  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({});
  const [editRecipe, setEditRecipe] = useState<Recipe | null>(null);

  const { data: categorias, isLoading: isLoadingCategorias, error: errorCategorias } = useFetchCategories();
  const { data: recursos } = useFetchResources();
  const { data: recetasProducto, refetch: refetchReceta } = useFetchRecipeByProductId(formData.id);
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const createRecipe = useCreateRecipe();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();

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

    if (recetasProducto && recetasProducto.length > 0) {
      setRecipes(
        recetasProducto.map((receta: Recipe) => ({
          id: receta.id,
          resource_id: receta.resourceId,
          unit: receta.unit,
          quantity_required: receta.quantity,
          resource: receta.resource,
        }))
      );
    } else {
      setRecipes([]);
    }
  }, [producto, isOpen, recetasProducto]);

  const handleIngredienteChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: name === 'quantity_required' ? Number(value) : value });
  };

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

  const handleEliminarIngrediente = async (conn: Recipe) => {
    if (conn.id && conn.resource_id) {
      await deleteRecipe.mutateAsync({ id: conn.id });
      refetchReceta();
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToValidate = { ...formData, price: Number(formData.price) };
      productSchema.parse(dataToValidate);
      setErrors({});

      if (onSubmit) {
        await onSubmit(dataToValidate);
      }

      if (formData.id) {
        await updateProduct({ id: formData.id, payload: dataToValidate });
      }

      onClose();
    } catch (error) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[90%] sm:max-w-[1080px] max-h-[90vh] overflow-y-auto px-0 pb-6 pt-0">
        {/* Header del modal */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-t-2xl"> 
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

        {/* Contenido principal */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Columna izquierda - Formulario del producto */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del producto*</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ej. Brownies"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Categoría */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría*</label>
                {isLoadingCategorias ? (
                  <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
                ) : errorCategorias ? (
                  <p className="text-red-500 text-sm">Error al cargar categorías</p>
                ) : (
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${errors.category_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Seleccione una categoría</option>
                    {categorias?.map((cat: Category) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                )}
                {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
              </div>

              {/* Precio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($/.)*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="0.00"
                  step="0.01"
                />
                {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Ej. Chewy chocolate brownies"
                  rows={3}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Imagen del producto</label>
                <input
                  type="text"
                  name="imagen_url"
                  value={formData.imagen_url}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border ${errors.imagen_url ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="URL de la imagen"
                />
                {errors.imagen_url && <p className="text-red-500 text-xs mt-1">{errors.imagen_url}</p>}
              </div>

              {/* Botones */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg transition-all"
                >
                  Guardar Cambios
                </button>
              </div>  
            </form>
          </div>

          {/* Columna derecha - Receta */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Receta del Producto</h3>
              {/* Formulario para agregar ingrediente */}
              <div className="flex flex-col md:flex-row gap-2 mb-4">
                <select
                  name="resource_id"
                  value={recipe.resource_id}
                  onChange={handleIngredienteChange}
                  className="w-50 px-2 py-1 border rounded"
                  disabled={editRecipe !== null} 
                >
                  <option value="">Seleccione recurso</option>
                  {recursos?.map((recurso: Resource) => (
                    <option key={recurso.id} value={recurso.id}>
                      {recurso.name}
                    </option>
                  ))}
                </select>
                <select
                  name="unit"
                  value={recipe.unit}
                  onChange={handleIngredienteChange}
                  className="w-34 px-2 py-1 border rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecciona una unidad</option>
                  <option value="unidades">unidades</option>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                </select>
                <input
                  type="number"
                  min={1}
                  name="quantity_required"
                  value={recipe.quantity_required}
                  onChange={handleIngredienteChange}
                  className="w-20 px-2 py-1 border rounded"
                  placeholder="Cantidad"
                />
              </div>
              {/* Botón para agregar o editar recurso */}
              <div className="mb-4 flex gap-2">
                <button
                  type="button"
                  onClick={
                    editRecipe === null
                      ? handleAgregarIngrediente
                      : async () => {
                          if (!recipe.resource_id || !recipe.unit || !recipe.quantity_required) return;
                          await updateRecipe.mutateAsync({
                            id: editRecipe!.id,
                            payload: {
                              productId: formData.id,
                              resourceId: recipe.resource_id,
                              unit: recipe.unit,
                              quantity: recipe.quantity_required,
                            },
                          });
                          setRecipe({ resource_id: '', unit: '', quantity_required: 1 });
                          setEditRecipe(null);
                          refetchReceta();
                        }
                  }
                  className={`px-4 py-2 text-white rounded-lg transition-colors mb-4 ${
                    editRecipe === null ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {editRecipe === null ? 'Agregar recurso' : 'Guardar cambios'}
                </button>
                {editRecipe !== null && (
                  <button
                    type="button"
                    onClick={() => {
                      setRecipe({ resource_id: '', unit: '', quantity_required: 1 });
                      setEditRecipe(null);
                    }}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors mb-4"
                  >
                    Cancelar
                  </button>
                )}
              </div>
              {/* Lista de recursos */}
              <div className="border-t pt-4">
                {recipes.length === 0 ? (
                  <p className="text-gray-500 text-sm">No hay recursos asociados a la receta.</p>
                ) : (
                  <div className="space-y-3">
                    {recipes.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 px-3 bg-white rounded-lg shadow-sm">
                        <span className="flex-1 font-medium">{item.resource?.name || 'Recurso no encontrado'}</span>
                        <div className="flex items-center space-x-6">
                          <span className="w-20 text-center">{item.unit}</span>
                          <span className="w-16 text-center font-semibold">{item.quantity_required}</span>
                          <div className="flex space-x-2">
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50"
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
                              type="button"
                              className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded hover:bg-red-50"
                              onClick={() => handleEliminarIngrediente(item)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditProducto;