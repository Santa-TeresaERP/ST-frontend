import { useState, useEffect } from 'react';
import { Trash2, Save, Plus, X, Check } from 'lucide-react';
import { useFetchProductions } from '../../hook/useProductions';
import { useFetchPlants, useCreatePlant, useUpdatePlant, useDeletePlant } from '../../hook/usePlants';

interface ModalCreatePlantProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreatePlant = ({ isOpen, onClose }: ModalCreatePlantProps) => {
  const [newPlant, setNewPlant] = useState({ plant_name: '', address: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPlant, setEditingPlant] = useState<{id: string, plant_name: string, address: string} | null>(null);
  const [newPlants, setNewPlants] = useState<{plant_name: string, address: string}[]>([]);
  const [plantsInUse, setPlantsInUse] = useState<Set<string>>(new Set());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [plantToDelete, setPlantToDelete] = useState<{id: string, name: string} | null>(null);
  
  // Hooks para plantas
  const createPlantMutation = useCreatePlant();
  const updatePlantMutation = useUpdatePlant();
  const deletePlantMutation = useDeletePlant();
  const { data: existingPlants, isLoading, error, refetch } = useFetchPlants();
  
  // Hook para producciones (para verificar plantas en uso)
  const { data: productions } = useFetchProductions();

  // Determinar qué plantas están en uso
  useEffect(() => {
    if (productions && existingPlants) {
      const inUse = new Set<string>();
      productions.forEach((production) => {
        if (production.plant_id) {
          inUse.add(production.plant_id);
        }
      });
      setPlantsInUse(inUse);
    }
  }, [productions, existingPlants]);

  const openAddModal = () => {
    setNewPlant({ plant_name: '', address: '' });
    setShowAddModal(true);
  };

  const handleAddPlantChange = (field: 'plant_name' | 'address', value: string) => {
    setNewPlant(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPlant = async () => {
    if (!newPlant.plant_name || newPlant.plant_name.trim() === '') {
      alert('El nombre de la planta es obligatorio.');
      return;
    }

    try {
      await createPlantMutation.mutateAsync({
        plant_name: newPlant.plant_name.trim(),
        address: newPlant.address.trim(),
      });
      
      setNewPlants(prev => [newPlant, ...prev]);
      setShowAddModal(false);
      refetch();
    } catch (error) {
      console.error('Error al guardar la planta:', error);
      alert('No se pudo guardar la planta. Intenta nuevamente.');
    }
  };

  const handleEditar = (id: string, plant_name: string, address: string) => {
    setEditingPlant({ id, plant_name, address });
  };

  const openDeleteModal = (id: string, name: string) => {
    if (isPlantInUse(id)) {
      alert('No se puede eliminar esta planta porque está asignada a una o más producciones.');
      return;
    }
    setPlantToDelete({id, name});
    setShowDeleteModal(true);
  };

  const handleEliminar = async () => {
    if (!plantToDelete) return;

    try {
      await deletePlantMutation.mutateAsync(plantToDelete.id);
      refetch();
      setShowDeleteModal(false);
      setPlantToDelete(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.data?.error) {
        alert(`Error: ${error.response.data.error}`);
      } else {
        alert('Error desconocido. Por favor, intenta nuevamente.');
      }
      console.error('Error al eliminar la planta:', error.response?.data || error.message);
    }
  };

  // Función auxiliar para verificar si una planta está en uso
  const isPlantInUse = (plantId: string): boolean => {
    return plantsInUse.has(plantId);
  };

  const handleActualizar = async () => {
    if (!editingPlant) return;

    const { id, plant_name, address } = editingPlant;

    if (!plant_name || plant_name.trim() === '') {
      alert('El nombre de la planta es obligatorio.');
      return;
    }

    try {
      await updatePlantMutation.mutateAsync({ 
        id, 
        payload: { 
          plant_name: plant_name.trim(), 
          address: address.trim() 
        } 
      });
      setEditingPlant(null);
      refetch();
    } catch (error) {
      console.error('Error al actualizar la planta:', error);
      alert('No se pudo actualizar la planta. Intenta nuevamente.');
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
                Gestión de Plantas
              </h2>
              <p className="text-red-100 mt-1">Administra las plantas de producción</p>
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

        {/* Botón Agregar */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => openAddModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-5 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={20} />
            <span className="font-medium">Agregar Planta</span>
          </button>
        </div>

        {/* Sección de Plantas */}
        <div className="space-y-8">
          {/* Plantas Nuevas */}
          {newPlants.length > 0 && (
            <div>
              <div className="flex items-center mb-4">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-3"></span>
                <h3 className="text-xl font-semibold text-gray-800">Nuevas Plantas</h3>
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {newPlants.length} nueva(s)
                </span>
              </div>
              
              <div className="grid gap-4">
                {newPlants.map((plant, index) => (
                  <div
                    key={`new-${index}`}
                    className="bg-white border-2 border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 bg-gradient-to-br from-green-50 to-white"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                        <p className="text-lg font-medium text-gray-800 flex items-center">
                          {plant.plant_name} 
                          <span className="ml-2 text-green-500">
                            <Check size={18} />
                          </span>
                        </p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Dirección</label>
                        <p className="text-gray-600">{plant.address || <span className="text-gray-400">Sin dirección</span>}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Plantas Existentes */}
          <div>
            <div className="flex items-center mb-4">
              <span className="w-3 h-3 bg-red-600 rounded-full mr-3"></span>
              <h3 className="text-xl font-semibold text-gray-800">Plantas Existentes</h3>
              {existingPlants && (
                <span className="ml-2 bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {existingPlants.length} en total
                </span>
              )}
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin h-10 w-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
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
                    <h3 className="text-sm font-medium text-red-800">Error al cargar plantas</h3>
                    <p className="text-sm text-red-700 mt-1">Por favor, intenta nuevamente más tarde.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                {existingPlants?.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No hay plantas registradas</h3>
                    <p className="mt-1 text-gray-500">Comienza agregando una nueva planta.</p>
                  </div>
                ) : (
                  existingPlants?.map((plant) => {
                    const isInUse = plant.id ? isPlantInUse(plant.id) : false;
                    return (
                      <div
                        key={plant.id}
                        className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
                          isInUse ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                        }`}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nombre</label>
                            <div className="flex items-center">
                              <p className="text-lg font-medium text-gray-800">{plant.plant_name}</p>
                              {isInUse && (
                                <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                  En uso
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Dirección</label>
                            <p className="text-gray-600">{plant.address || <span className="text-gray-400">Sin dirección</span>}</p>
                          </div>
                        </div>
                        <div className="flex justify-end mt-4 space-x-3">
                          <button
                            onClick={() => handleEditar(plant.id ?? '', plant.plant_name ?? '', plant.address ?? '')}
                            className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                            title="Editar"
                          >
                            <Save size={20} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(plant.id ?? '', plant.plant_name ?? '')}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              isInUse
                                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100'
                            }`}
                            title={isInUse ? "Planta en uso - No eliminable" : "Eliminar"}
                            disabled={isInUse}
                          >
                            <Trash2 size={20} />
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

        {/* Modal para Agregar Plant */}
        {showAddModal && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
              <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-t-xl p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Nueva Planta</h2>
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
                    Nombre de la Planta
                    <span className="ml-2 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newPlant.plant_name}
                    onChange={(e) => handleAddPlantChange('plant_name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: Planta Norte"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={newPlant.address}
                    onChange={(e) => handleAddPlantChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: Calle Principal 123"
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
                  onClick={handleAddPlant}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Guardar Planta
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Editar Plant */}
        {editingPlant && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 hover:scale-100">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">Editar Planta</h2>
                  <button 
                    onClick={() => setEditingPlant(null)} 
                    className="p-2 rounded-full hover:bg-blue-800 transition-colors duration-200 text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Nombre de la Planta
                    <span className="ml-2 text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingPlant.plant_name}
                    onChange={(e) => setEditingPlant({...editingPlant, plant_name: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: Planta Norte"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  <input
                    type="text"
                    value={editingPlant.address}
                    onChange={(e) => setEditingPlant({...editingPlant, address: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Ej: Calle Principal 123"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 p-6 border-t border-gray-200">
                <button
                  onClick={() => setEditingPlant(null)}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleActualizar}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmación para Eliminar */}
        {showDeleteModal && plantToDelete && (
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
                  ¿Estás seguro de que deseas eliminar la planta <span className="font-semibold">&quot;{plantToDelete.name}&quot;</span>?
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

export default ModalCreatePlant;