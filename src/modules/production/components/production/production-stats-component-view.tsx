import React, { useState, useEffect } from 'react';
import { Edit, List, Plus, Loader2, MinusCircle, PlusCircle } from 'lucide-react';
import ModalCreateProduction from './modal-create-production';
import ModalEditProduction from './modal-edit-production';
import ModalCreatePlant from './modal-create-plant';
import ModalFilterProduction from './modal-filter-production'; // Importar el modal de filtros
import { useFetchProductions } from '../../hook/useProductions';
import { Production } from '../../types/productions';
import { useFetchProducts } from '../../hook/useProducts';
import { useFetchPlants } from '../../hook/usePlants';
import { toggleProduction } from '../../action/productions';

// 🔥 IMPORTAR SISTEMA DE PERMISOS OPTIMIZADO
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

const ProductionView = () => {
  const { data: productions, isLoading, error } = useFetchProductions();
  const { data: products } = useFetchProducts();
  const { data: plants } = useFetchPlants();

  // 🔥 USAR HOOK OPTIMIZADO DE PERMISOS - UNA SOLA LLAMADA
  const { canCreate, canEdit, isAdmin } = useModulePermissions(MODULE_NAMES.PRODUCTION);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
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

  const handleToggle = async (prod: Production) => {
    await toggleProduction({ id: prod.id, isActive: !prod.isActive });

    // Actualizar el estado local luego del cambio
    setFilteredProductions((prev) =>
      prev.map((p) =>
        p.id === prod.id ? { ...p, isActive: !p.isActive } : p
      )
    );
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

        {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Debug Permisos:</strong> 
              Módulo: {MODULE_NAMES.PRODUCTION} | 
              Crear: {canCreate ? '✅' : '❌'} | 
              Editar: {canEdit ? '✅' : '❌'} | 
              Admin: {isAdmin ? '✅' : '❌'}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsFilterModalOpen(true)} // Abrir el modal de filtros
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <List size={18} />
            <span>Filtrar Producción</span>
          </button>
          
          {/* 🔥 BOTÓN DE CREAR PRODUCCIÓN - SOLO SI TIENE PERMISOS */}
          {(canCreate || isAdmin) && (
            <button
              onClick={handleOpenCreateModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-500 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <Plus size={18} />
              <span>Registrar Producción</span>
            </button>
          )}
          
          {/* 🔥 BOTÓN DE PLANTAS - SOLO SI TIENE PERMISOS */}
          {(canCreate || isAdmin) && (
            <button
              onClick={handleOpenPlantModal}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-700 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-500 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <List size={18} />
              <span>Plantas</span>
            </button>
          )}
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
                <th className="px-6 py-3 text-left">Estado</th>
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
                    {production.isActive
                      ? <span className="px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Activo</span>
                      : <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">Inactivo</span>
                    }
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2 justify-center">
                      {/* 🔥 BOTÓN DE EDITAR - SOLO SI TIENE PERMISOS */}
                      {(canEdit || isAdmin) && (
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
                      )}
                      
                      {/* 🔥 BOTÓN DE TOGGLE (ACTIVAR/DESACTIVAR) - SOLO SI TIENE PERMISOS DE EDITAR */}
                      {(canEdit || isAdmin) && (
                        <button
                          onClick={() => handleToggle(production)}
                          className="p-2 text-yellow-600 hover:text-yellow-800 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors duration-200"
                          title={production.isActive ? "Desactivar" : "Activar"}
                        >
                          {production.isActive
                            ? <MinusCircle size={18}/>
                            : <PlusCircle size={18}/>
                          }
                        </button>
                      )}
                      
                      {/* 🔥 MENSAJE CUANDO NO HAY PERMISOS */}
                      {!canEdit && !isAdmin && (
                        <span className="text-gray-400 text-sm">Sin permisos</span>
                      )}
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
        onSave={(updatedProduction) => {
          console.log('Producción actualizada:', updatedProduction);
          // Aquí puedes agregar lógica para manejar la producción actualizada, como enviarla al servidor
          setIsEditModalOpen(false);
        }}
        production={
          selectedProduction
            ? {
                ...selectedProduction,
                observation: selectedProduction.observation || '', // Aseguramos que observation sea un string
              }
            : null
        }
      />
      <ModalCreatePlant
        isOpen={isPlantModalOpen}
        onClose={() => setIsPlantModalOpen(false)}
      />
    </div>
  );
};

export default ProductionView;