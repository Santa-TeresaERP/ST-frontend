import { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, Loader2, Check, Ban } from 'lucide-react';
import { useCreateCategory, useFetchCategories, useDeleteCategory, useUpdateCategory } from '@/modules/production/hook/useCategories';
import { useFetchProducts } from '@/modules/production/hook/useProducts';

interface ModalCreateCategoriaProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateCategoria = ({ isOpen, onClose }: ModalCreateCategoriaProps) => {
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; description: string } | null>(null);
  const [categoriesInUse, setCategoriesInUse] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{id: string, name: string} | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Hooks para categorías
  const createCategoryMutation = useCreateCategory();
  const deleteCategoryMutation = useDeleteCategory();
  const updateCategoryMutation = useUpdateCategory();
  const { data: existingCategories, isLoading, error, refetch } = useFetchCategories();
  
  // Hook para productos (para verificar categorías en uso)
  const { data: products } = useFetchProducts();

  // Determinar qué categorías están en uso
  useEffect(() => {
    if (products && existingCategories) {
      const inUse = new Set<string>();
      products.forEach(product => {
        if (product.category_id) {
          inUse.add(product.category_id);
        }
      });
      setCategoriesInUse(inUse);
    }
  }, [products, existingCategories]);

  const openAddModal = () => {
    setNewCategory({ name: '', description: '' });
    setShowAddModal(true);
  };

  const handleAddCategoryChange = (field: 'name' | 'description', value: string) => {
    setNewCategory(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCategory = async () => {
    if (!newCategory.name || newCategory.name.trim() === '') {
      alert('El campo "Nombre de la categoría" es obligatorio.');
      return;
    }

    try {
      await createCategoryMutation.mutateAsync({
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
      });
      
      setSuccessMessage(`Categoría "${newCategory.name}" creada exitosamente`);
      setShowSuccessMessage(true);
      setShowAddModal(false);
      refetch();
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error al guardar la categoría:', error);
      alert('No se pudo guardar la categoría. Intenta nuevamente.');
    }
  };

  const handleEditar = (id: string, name: string, description: string) => {
    setEditingCategory({ id, name, description });
  };

  const openDeleteModal = (id: string, name: string) => {
    if (categoriesInUse.has(id)) {
      alert('No se puede eliminar esta categoría porque está asignada a uno o más productos.');
      return;
    }
    setCategoryToDelete({id, name});
    setShowDeleteModal(true);
  };

  const handleEliminar = async () => {
    if (!categoryToDelete) return;

    try {
      await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
      refetch();
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Error desconocido. Por favor, intenta nuevamente.');
      }
      console.error('Error al eliminar la categoría:', error.response?.data || error.message);
    }
  };

  const handleActualizar = async () => {
    if (!editingCategory) return;

    const { id, name, description } = editingCategory;

    if (!name || name.trim() === '') {
      alert('El campo "Nombre de la categoría" es obligatorio.');
      return;
    }

    try {
      await updateCategoryMutation.mutateAsync({ id, payload: { name: name.trim(), description: description.trim() } });
      setEditingCategory(null);
      refetch();
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      alert('No se pudo actualizar la categoría. Intenta nuevamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Header con gradiente y botón de cierre */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-800 rounded-t-xl -m-6 mb-6 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Gestión de Categorías
              </h2>
              <p className="text-red-100 mt-1">Administra las categorías de producción</p>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-full hover:bg-red-700 transition-colors duration-200 text-white"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Mensaje de éxito al crear categoría */}
        {showSuccessMessage && (
          <div className="mb-6 animate-fade-in">
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {successMessage}
                  </p>
                </div>
                <button
                  onClick={() => setShowSuccessMessage(false)}
                  className="ml-auto -mx-1.5 -my-1.5 bg-green-50 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-100 inline-flex h-8 w-8"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Botón Agregar con efecto hover */}
        <div className="flex justify-end mb-8">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-5 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            <span className="font-medium">Agregar Categoría</span>
          </button>
        </div>

        {/* Sección de Categorías */}
        <div className="space-y-8">
          {/* Categorías Existentes */}
          <div>
            <div className="flex items-center mb-4">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-3"></span>
              <h3 className="text-xl font-semibold text-gray-800">Categorías Existentes</h3>
              {existingCategories && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {existingCategories.length} en total
                </span>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="animate-spin h-10 w-10 text-red-600" />
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error al cargar categorías</h3>
                    <p className="text-sm text-red-700 mt-1">Por favor, intenta nuevamente más tarde.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {existingCategories?.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No hay categorías registradas</h3>
                    <p className="mt-1 text-gray-500">Comienza agregando una nueva categoría.</p>
                  </div>
                ) : (
                  existingCategories?.map((cat) => {
                    const isAssigned = categoriesInUse.has(cat.id);
                    return (
                      <div
                        key={cat.id}
                        className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
                          isAssigned ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                            <div className="flex items-center">
                              <p className="text-lg font-medium text-gray-800">{cat.name}</p>
                              {isAssigned && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                  En uso
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Descripción</label>
                            <p className="text-gray-600">{cat.description || <span className="text-gray-400">Sin descripción</span>}</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-3">
                          <button
                            onClick={() => handleEditar(cat.id, cat.name, cat.description)}
                            className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="Editar"
                          >
                            <Edit size={20} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(cat.id, cat.name)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              isAssigned 
                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100'
                            }`}
                            title={isAssigned ? "Categoría en uso - No eliminable" : "Eliminar"}
                            disabled={isAssigned}
                          >
                            {isAssigned ? <Ban size={20} /> : <Trash2 size={20} />}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal para Agregar Nueva Categoría */}
        {showAddModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Nueva Categoría</h2>
                  <button 
                    onClick={() => setShowAddModal(false)} 
                    className="p-2 rounded-full hover:bg-red-800 transition-colors duration-200 text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Nombre*
                    <span className="ml-2 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) => handleAddCategoryChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: Materia Prima"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={newCategory.description}
                    onChange={(e) => handleAddCategoryChange('description', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                    rows={3}
                    placeholder="Ej: Materiales básicos para producción"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddCategory}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Guardar Categoría
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Edición */}
        {editingCategory && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Editar Categoría</h2>
                  <button 
                    onClick={() => setEditingCategory(null)} 
                    className="p-2 rounded-full hover:bg-blue-800 transition-colors duration-200 text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Nombre*
                    <span className="ml-2 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) =>
                      setEditingCategory((prev) => prev && { ...prev, name: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                  <textarea
                    value={editingCategory.description}
                    onChange={(e) =>
                      setEditingCategory((prev) => prev && { ...prev, description: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
                <button
                  onClick={() => setEditingCategory(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleActualizar}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}


        {/* Modal de Confirmación para Eliminar */}
        {showDeleteModal && categoryToDelete && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Confirmar Eliminación</h2>
                  <button 
                    onClick={() => setShowDeleteModal(false)} 
                    className="p-2 rounded-full hover:bg-red-800 transition-colors duration-200 text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex justify-center">
                  <div className="bg-red-100 p-4 rounded-full">
                    <Trash2 className="h-10 w-10 text-red-600" />
                  </div>
                </div>
                <p className="text-center text-gray-700">
                  ¿Estás seguro de que deseas eliminar la categoría <span className="font-semibold">&quot;{categoryToDelete.name}&quot;</span>?
                </p>
                <p className="text-center text-sm text-gray-500">
                  Esta acción no se puede deshacer.
                </p>
              </div>
              
              <div className="flex justify-center space-x-4 p-6 border-t border-gray-200">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminar}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalCreateCategoria;