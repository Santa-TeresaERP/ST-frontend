import React, { useState, useEffect } from 'react';
import { Trash2, Edit, List, Plus, Loader2 } from 'lucide-react';
import ModalDeleteProduction from './modal-delete-production';
import ModalCreateProduction from './modal-create-production';
import ModalEditProduction from './modal-edit-production';
import ModalCreatePlant from './modal-create-plant';
import ModalFilterProduction from './modal-filter-production'; // Importar el modal de filtros
import { useFetchProductions, useDeleteProduction } from '../../hook/useProductions';
import { Production } from '../../types/productions';
import { useFetchProducts } from '../../hook/useProducts';
import { useFetchPlants } from '../../hook/usePlants';

const ProductionView = () => {
  const { data: productions, isLoading, error } = useFetchProductions();
  const deleteProductionMutation = useDeleteProduction();
  const { data: products } = useFetchProducts();
  const { data: plants } = useFetchPlants();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPlantModalOpen, setIsPlantModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // Estado para el modal de filtros
  const [selectedProduction, setSelectedProduction] = useState<Production | null>(null);
  const [filteredProductions, setFilteredProductions] = useState<Production[]>([]); // Estado para las producciones filtradas

  // Sincronizar las producciones filtradas con los datos originales
  useEffect(() => {
    setFilteredProductions(productions || []);
  }, [productions]);

  // Obtener el nombre de la planta
  const getPlantName = (plantId: string): string => {
    const plant = plants?.find((plt) => plt.id === plantId);
    return plant ? plant.plant_name : 'Planta no encontrada';
  };

  // Obtener el nombre del producto
  const getProductName = (productId: string): string => {
    const product = products?.find((prod) => prod.id === productId);
    return product ? product.name : 'Producto no encontrado';
  };

  // Manejar la eliminación de una producción
  const handleDeleteProduction = async () => {
    if (!selectedProduction || !selectedProduction.id) {
      console.error('No se puede eliminar: la producción seleccionada no tiene un ID válido.');
      alert('Error: No se puede eliminar esta producción porque no tiene un ID válido.');
      return;
    }

    try {
      console.log('Eliminando producción con ID:', selectedProduction.id); // Depuración
      await deleteProductionMutation.mutateAsync(selectedProduction.id);
      setIsDeleteModalOpen(false);
      setSelectedProduction(null);
    } catch (error) {
      console.error('Error al eliminar la producción:', error);
      alert('Hubo un error al intentar eliminar la producción.');
    }
  };

  // Lógica para aplicar los filtros
  const handleApplyFilters = (filters: { startDate: string; endDate: string; plant: string }) => {
    const { startDate, endDate, plant } = filters;

    const filtered = productions?.filter((production) => {
      const productionDate = new Date(production.productionDate); // Fecha de producción
      const isWithinDateRange =
        (!startDate || productionDate >= new Date(startDate)) &&
        (!endDate || productionDate <= new Date(endDate));
      const matchesPlant = !plant || production.plant_id === plant;

      return isWithinDateRange && matchesPlant;
    });

    setFilteredProductions(filtered || []);
  };

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenPlantModal = () => {
    setIsPlantModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-green-600" />
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mx-6 my-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293-1.293a1 1 0 00-1.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar los datos de producción
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Por favor, intenta nuevamente más tarde.
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800">
            Panel de Producción
          </h1>
          <p className="text-gray-500 mt-1">
            Gestión completa de productos, producción y pérdidas
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsFilterModalOpen(true)} // Abrir el modal de filtros
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <List size={18} />
            <span>Filtrar Producción</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <Plus size={18} />
            <span>Registrar Producción</span>
          </button>
          <button
            onClick={handleOpenPlantModal}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <List size={18} />
            <span>Plantas</span>
          </button>
        </div>
      </div>

      {/* Tabla de producción */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 mb-8">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-700">Gestión de Producción</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-gray-600 text-sm">
            <thead className="bg-gray-700 text-white text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Producto</th>
                <th className="px-6 py-3 text-left">Cantidad</th>
                <th className="px-6 py-3 text-left">Descripción</th>
                <th className="px-6 py-3 text-left">Planta</th>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProductions.map((production) => (
                <tr
                  key={production.id} // Usar production_id como clave única
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{getProductName(production.productId)}</td>
                  <td className="px-6 py-4">{production.quantityProduced}</td>
                  <td className="px-6 py-4">
                    {production.observation || 'Sin descripción'}
                  </td>
                  <td className="px-6 py-4">{getPlantName(production.plant_id)}</td>
                  <td className="px-6 py-4">
                    {new Date(production.productionDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => {
                          setSelectedProduction(production);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          if (production.id) {
                            setSelectedProduction(production); // Configura correctamente la producción seleccionada
                            setIsDeleteModalOpen(true);
                          } else {
                            console.error('La producción no tiene un ID válido.');
                            alert('Error: No se puede eliminar esta producción porque no tiene un ID válido.');
                          }
                        }}
                        className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-lg transition-colors duration-200"
                        title="Eliminar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modales */}
      <ModalFilterProduction
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        plants={plants?.map((plant) => ({
          id: plant.id,
          name: plant.plant_name, // Renombrar plant_name a name
        })) || []} // Pasa las plantas disponibles transformadas
        onFilter={handleApplyFilters}
      />
      <ModalCreateProduction
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
      <ModalEditProduction
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        production={
          selectedProduction
            ? {
                ...selectedProduction,
                observation: selectedProduction.observation || '', // Aseguramos que observation sea un string
              }
            : null
        }
      />
      <ModalDeleteProduction
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteProduction}
      />
      <ModalCreatePlant
        isOpen={isPlantModalOpen}
        onClose={() => setIsPlantModalOpen(false)}
      />
    </div>
  );
};

export default ProductionView;