import React, { useState, useMemo } from 'react';
import { FiFilter, FiSearch, FiPlus, FiTrash2, FiEdit, FiAlertTriangle, FiCalendar, FiX, FiSave } from 'react-icons/fi';
import { useFetchAllLost, useCreateLost, useDeleteLost, useUpdateLost } from '@/modules/production/hook/useLost';
import { lostSchema } from '@/modules/production/schemas/lostValidation';
import { CreateLostPayload, Lost } from '@/modules/production/types/lost';
import { toast } from 'react-toastify';
import { useFetchProductions } from '../../hook/useProductions';
import { useFetchProducts } from '../../hook/useProducts';

// 🔥 IMPORTAR SISTEMA DE PERMISOS OPTIMIZADO
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

const LostComponentView: React.FC = () => {
  // Obtener datos usando los hooks
  const { data: lostData = [], isLoading, error } = useFetchAllLost();
  const { data: productions = [], isLoading: loadingProductions } = useFetchProductions();
  const { data: productsData = [], isLoading: isLoadingProducts, error: errorProducts } = useFetchProducts();
  const createLostMutation = useCreateLost();
  const deleteLostMutation = useDeleteLost();
  const updateLostMutation = useUpdateLost(); // Hook que deberías tener

  // 🔥 USAR HOOK OPTIMIZADO DE PERMISOS - UNA SOLA LLAMADA
  const { canCreate, canEdit, canDelete, isAdmin } = useModulePermissions(MODULE_NAMES.PRODUCTION);

  const [editingLostItem, setEditingLostItem] = useState<Lost | null>(null);
  const [deletingLostItem, setDeletingLostItem] = useState<Lost | null>(null);

  // Estados para filtros y modal
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [showAllProducts, setShowAllProducts] = useState(false);

  // Estado para el nuevo registro
  const [newLostItem, setNewLostItem] = useState<CreateLostPayload>({
    production_id: '',
    quantity: 0,
    lost_type: '',
    observations: '',
  });

  const productionDisplayStrings = useMemo(() => {
    if (isLoading || loadingProductions || isLoadingProducts) {
      return new Map<string, string>();
    }

    // Primero creamos un mapa para contar cuántas veces aparece cada combinación producto-fecha
    const productDateCount = new Map<string, number>();
    const productionDisplayMap = new Map<string, { display: string, count: number }>();

    // Procesamos todas las producciones para crear las cadenas de visualización
    productions.forEach(production => {
      const product = productsData.find(p => p.id === production.productId);
      if (product) {
        const prodDate = production.productionDate 
          ? new Date(production.productionDate).toLocaleDateString() 
          : 'Sin fecha';
        const key = `${product.name} ${prodDate}`;
        
        // Contamos cuántas producciones hay para esta combinación producto-fecha
        const currentCount = (productDateCount.get(key) || 0) + 1;
        productDateCount.set(key, currentCount);
        
        // Guardamos la cadena de visualización para esta producción
        productionDisplayMap.set(production.id, {
          display: `${key} (${currentCount})`,
          count: currentCount
        });
      }
    });

    // Ahora mapeamos las pérdidas a sus cadenas de visualización
    const displayStrings = new Map<string, string>();
    lostData.forEach(lost => {
      const productionInfo = productionDisplayMap.get(lost.production_id);
      if (productionInfo) {
        displayStrings.set(lost.id, productionInfo.display);
      } else {
        displayStrings.set(lost.id, `Producción no encontrada: ${lost.production_id}`);
      }
    });

    return displayStrings;
  }, [lostData, productions, productsData, isLoading, loadingProductions, isLoadingProducts]);

  const getProductionDisplay = (lostId: string) => {
    return productionDisplayStrings.get(lostId) || 'ID de pérdida no encontrado';
  };
  
  // Filtrar datos
  const filteredData = lostData.filter(item => {
    const displayString = productionDisplayStrings.get(item.id) || '';
    const productName = displayString.toLowerCase();
    const matchesSearch = productName.includes(searchTerm.toLowerCase()) || 
                          item.observations?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.lost_type === selectedType;
    
    // Filtro por fecha
    const itemDate = new Date(item.created_at);
    const matchesStartDate = !startDate || itemDate >= new Date(startDate);
    const matchesEndDate = !endDate || itemDate <= new Date(endDate + 'T23:59:59');
    
    // Nuevo filtro: solo pérdidas de los últimos 3 días si no hay filtro de fecha manual
    const today = new Date();
    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 3); // Resta 3 días a la fecha actual

    // Aplica el filtro de 3 días solo si no hay un rango de fechas manual seleccionado
    const matchesDefaultDate = (!startDate && !endDate) ? itemDate >= threeDaysAgo : true;

    return matchesSearch && matchesType && matchesStartDate && matchesEndDate && matchesDefaultDate;
  });

  // Tipos de pérdida para el filtro
  const lossTypes = ['all', ...new Set(lostData.map(item => item.lost_type))];

  // Manejar agregar nuevo registro
  const handleAddLostItem = async () => {
    try {
      const validation = lostSchema.safeParse(newLostItem);
      if (!validation.success) {
        setValidationError(validation.error.errors[0].message);
        return;
      }

      setValidationError(null);
      await createLostMutation.mutateAsync(newLostItem);
      
      setIsAddModalOpen(false);
      setNewLostItem({
        production_id: '',
        quantity: 0,
        lost_type: '',
        observations: '',
      });
      
      toast.success('Pérdida registrada correctamente');
    } catch (error) {
      toast.error('Error al registrar la pérdida');
      console.error(error);
    }
  };

  const handleUpdateLostItem = async () => {
    if (!editingLostItem) return;

    try {
      const validation = lostSchema.safeParse(editingLostItem);
      if (!validation.success) {
        toast.error(validation.error.errors[0].message);
        return;
      }

      await updateLostMutation.mutateAsync({
        id: editingLostItem.id,
        payload: {
          production_id: editingLostItem.production_id,
          quantity: editingLostItem.quantity,
          lost_type: editingLostItem.lost_type,
          observations: editingLostItem.observations,
        }
      });

      toast.success('Pérdida actualizada correctamente');
      setEditingLostItem(null);
    } catch (error) {
      toast.error('Error al actualizar la pérdida');
      console.error(error);
    }
  };

  // Manejar eliminar registro
  const handleDeleteItem = async (id: string) => {
    try {
      await deleteLostMutation.mutateAsync(id);
      toast.success('Registro eliminado correctamente');
      setDeletingLostItem(null);
    } catch (error) {
      toast.error('Error al eliminar el registro');
      console.error(error);
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setStartDate('');
    setEndDate('');
  };

  if (isLoading || loadingProductions || isLoadingProducts) return <div className="p-4">Cargando datos...</div>;
  if (error) return <div className="p-4 text-red-500">Error al cargar pérdidas: {error.message}</div>;
  if (errorProducts) return <div className="p-4 text-red-500">Error al cargar productos: {errorProducts.message}</div>;

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold pb-4 flex text-orange-500 items-center gap-2">
          <FiAlertTriangle size={24} />
          <span>Gestión de Pérdidas</span>
        </h2>

        {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Debug Permisos:</strong> 
              Módulo: {MODULE_NAMES.PRODUCTION} | 
              Crear: {canCreate ? '✅' : '❌'} | 
              Editar: {canEdit ? '✅' : '❌'} | 
              Eliminar: {canDelete ? '✅' : '❌'} |
              Admin: {isAdmin ? '✅' : '❌'}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* 🔥 BOTÓN DE NUEVA PÉRDIDA - SOLO SI TIENE PERMISOS */}
          {(canCreate || isAdmin) && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
              disabled={createLostMutation.isPending}
            >
              <FiPlus /> Nueva Pérdida
            </button>
          )}
        </div>
      </div>

      {/* 🔥 MENSAJE INFORMATIVO SI NO HAY PERMISOS */}
      {!canCreate && !isAdmin && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Vista limitada:</strong> No tienes permisos para crear, editar o eliminar registros de pérdidas. Solo puedes ver los datos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Barra de búsqueda */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pérdidas..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtro por tipo */}
          <div className="relative">
            <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              {lossTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Todos los tipos' : type}
                </option>
              ))}
            </select>
          </div>
          
          {/* Filtro por fecha inicio */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Fecha inicio"
            />
          </div>
          
          {/* Filtro por fecha fin */}
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Fecha fin"
            />
          </div>
        </div>
        
        {/* Botón para limpiar filtros */}
        {(searchTerm || selectedType !== 'all' || startDate || endDate) && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800">Total Pérdidas</h3>
          <p className="text-2xl font-bold text-blue-600">
            {filteredData.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm font-medium text-red-800">Por Daños</h3>
          <p className="text-2xl font-bold text-red-600">
            {filteredData.filter(item => item.lost_type === 'Daño').reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 className="text-sm font-medium text-yellow-800">Por Pérdidas</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {filteredData.filter(item => item.lost_type === 'Pérdida').reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-700 text-white text-xs uppercase sticky top-0">
            <tr>
              <th className="px-6 py-3 text-center">Producto</th>
              <th className="px-6 py-3 text-center">Cantidad</th>
              <th className="px-6 py-3 text-center">Tipo</th>
              <th className="px-6 py-3 text-center">Observaciones</th>
              <th className="px-6 py-3 text-center">Fecha</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((lost) => (
                <tr key={lost.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getProductionDisplay(lost.id)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                      {lost.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      lost.lost_type === 'Daño' ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {lost.lost_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {lost.observations || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lost.created_at ? new Date(lost.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xl font-medium">
                    <div className="flex space-x-2 justify-center">
                      {/* 🔥 BOTÓN DE EDITAR - SOLO SI TIENE PERMISOS */}
                      {(canEdit || isAdmin) && (
                        <button 
                          onClick={() => setEditingLostItem(lost)} 
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar pérdida"
                        >
                          <FiEdit />
                        </button>
                      )}
                      
                      {/* 🔥 BOTÓN DE ELIMINAR - SOLO SI TIENE PERMISOS */}
                      {(canDelete || isAdmin) && (
                        <button 
                          onClick={() => setDeletingLostItem(lost)} 
                          className="text-red-600 hover:text-red-800"
                          title="Eliminar pérdida"
                        >
                          <FiTrash2 />
                        </button>
                      )}
                      
                      {/* 🔥 MENSAJE CUANDO NO HAY PERMISOS */}
                      {!canEdit && !canDelete && !isAdmin && (
                        <span className="text-gray-400 text-sm">Sin permisos</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No se encontraron registros de pérdidas
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar nueva pérdida */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <FiPlus /> Registrar Nueva Pérdida
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setValidationError(null);
                  setShowAllProducts(false);
                }}
                className="hover:text-gray-300"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {validationError && (
                <div className="p-2 bg-red-100 text-red-700 rounded">{validationError}</div>
              )}

              <div>
                <label className="text-base font-bold text-gray-700">
                  Producción <span className="text-red-600">*</span>
                </label>
                {(loadingProductions || isLoadingProducts) ? (
                  <div className="text-sm text-gray-500 mt-1">Cargando producciones/productos...</div>
                ) : productions.length === 0 ? (
                  <div className="text-sm text-red-500 mt-1">No hay producciones disponibles</div>
                ) : (
                  <select
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={newLostItem.production_id}
                    onChange={(e) => {
                      if (e.target.value === "show-more") {
                        setShowAllProducts(true);
                        return;
                      }
                      setNewLostItem({ ...newLostItem, production_id: e.target.value });
                    }}
                  >
                    <option value="">Seleccionar producción</option>
                    {(showAllProducts ? productions : productions.slice(0, 5)).map(prod => {
                      const product = productsData.find(p => p.id === prod.productId);
                      const productName = product ? product.name : 'Producto Desconocido';
                      const prodDate = prod.productionDate
                        ? new Date(prod.productionDate).toLocaleDateString()
                        : 'Sin fecha';
                      return (
                        <option key={prod.id} value={prod.id}>
                          {`${productName} ${prodDate}`}
                        </option>
                      );
                    })}
                    {!showAllProducts && productions.length > 5 && (
                      <option value="show-more" className="text-blue-600 italic">
                        Mostrar más...
                      </option>
                    )}
                  </select>
                )}
              </div>

              <div>
                <label className="text-base font-bold text-gray-700">
                  Cantidad <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={newLostItem.quantity || ''}
                  onChange={(e) =>
                    setNewLostItem({ ...newLostItem, quantity: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div>
                <label className="text-base font-bold text-gray-700">
                  Tipo de Pérdida <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={newLostItem.lost_type}
                  onChange={(e) =>
                    setNewLostItem({ ...newLostItem, lost_type: e.target.value })
                  }
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Daño">Daño</option>
                  <option value="Pérdida">Pérdida</option>
                </select>
              </div>

              <div>
                <label className="text-base font-bold text-gray-700">Observaciones</label>
                <textarea
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows={3}
                  value={newLostItem.observations || ''}
                  onChange={(e) =>
                    setNewLostItem({ ...newLostItem, observations: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setValidationError(null);
                  setShowAllProducts(false);
                }}
              >
                <FiX /> Cancelar
              </button>
              <button
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                onClick={handleAddLostItem}
                disabled={createLostMutation.isPending || loadingProductions || isLoadingProducts}
              >
                <FiSave />
                {createLostMutation.isPending ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar perdida */}
      {editingLostItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <FiEdit /> Editar Pérdida
              </h3>
              <button
                onClick={() => setEditingLostItem(null)}
                className="hover:text-gray-300"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-base font-bold text-gray-700">
                  Producción <span className="text-red-600">*</span>
                </label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={editingLostItem.production_id}
                  onChange={(e) => setEditingLostItem({ ...editingLostItem, production_id: e.target.value })}
                >
                  <option value="">Seleccionar producción</option>
                  {productions.map(prod => {
                    const product = productsData.find(p => p.id === prod.productId);
                    const productName = product ? product.name : 'Producto Desconocido';
                    const prodDate = prod.productionDate
                      ? new Date(prod.productionDate).toLocaleDateString()
                      : 'Sin fecha';
                    return (
                      <option key={prod.id} value={prod.id}>
                        {`${productName} ${prodDate}`}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-base font-bold text-gray-700">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={editingLostItem.quantity}
                  onChange={(e) => setEditingLostItem({ ...editingLostItem, quantity: parseInt(e.target.value) || 0 })}
                />
              </div>

              <div>
                <label className="text-base font-bold text-gray-700">Tipo de Pérdida</label>
                <select
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={editingLostItem.lost_type}
                  onChange={(e) => setEditingLostItem({ ...editingLostItem, lost_type: e.target.value })}
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Daño">Daño</option>
                  <option value="Pérdida">Pérdida</option>
                </select>
              </div>

              <div>
                <label className="text-base font-bold text-gray-700">Observaciones</label>
                <textarea
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:red-500"
                  rows={3}
                  value={editingLostItem.observations || ''}
                  onChange={(e) => setEditingLostItem({ ...editingLostItem, observations: e.target.value })}
                />
              </div>

              <div>
                <label className="text-base font-bold text-gray-700">Fecha de Registro</label>
                <input
                  type="text"
                  value={editingLostItem.created_at ? new Date(editingLostItem.created_at).toLocaleDateString() : 'N/A'}
                  disabled
                  className="w-full mt-1 px-3 py-2 border border-gray-200 bg-gray-100 rounded-lg"
                />
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
              <button
                onClick={() => setEditingLostItem(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <FiX /> Cancelar
              </button>
              <button
                onClick={handleUpdateLostItem}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-orange-800 text-white rounded-lg hover:opacity-90 flex items-center gap-2"
              >
                <FiSave /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {deletingLostItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <FiTrash2 /> Confirmar Eliminación
              </h3>
              <button
                onClick={() => setDeletingLostItem(null)}
                className="hover:text-gray-300"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                ¿Estás seguro de que quieres eliminar este registro de pérdida?
              </p>
              <div className="bg-gray-50 p-3 rounded-lg mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Producto:</strong> {getProductionDisplay(deletingLostItem.id)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Cantidad:</strong> {deletingLostItem.quantity}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tipo:</strong> {deletingLostItem.lost_type}
                </p>
              </div>
              <p className="text-red-600 text-sm font-medium">
                Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
              <button
                onClick={() => setDeletingLostItem(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center gap-2"
              >
                <FiX /> Cancelar
              </button>
              <button
                onClick={() => handleDeleteItem(deletingLostItem.id)}
                className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                disabled={deleteLostMutation.isPending}
              >
                <FiTrash2 />
                {deleteLostMutation.isPending ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default LostComponentView;