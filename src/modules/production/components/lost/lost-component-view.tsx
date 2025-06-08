import React, { useState } from 'react';
import { FiFilter, FiSearch, FiPlus, FiTrash2, FiEdit, FiAlertTriangle, FiCalendar } from 'react-icons/fi';
import { useFetchAllLost, useCreateLost, useDeleteLost } from '@/modules/production/hook/useLost';
import { lostSchema } from '@/modules/production/schemas/lostValidation';
import { CreateLostPayload } from '@/modules/production/types/lost';
import { useFetchProducts } from '@/modules/production/hook/useProducts';
import { toast } from 'react-toastify';

const LostComponentView: React.FC = () => {
  // Obtener datos usando los hooks
  const { data: lostData = [], isLoading, error } = useFetchAllLost();
  const { data: products = [], isLoading: loadingProducts } = useFetchProducts();
  const createLostMutation = useCreateLost();
  const deleteLostMutation = useDeleteLost();

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
    product_id: '',
    quantity: 0,
    lost_type: '',
    observations: '',
  });

  // Obtener nombre completo del producto para mostrar
  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : productId;
  };
  
  // Filtrar datos
  const filteredData = lostData.filter(item => {
    const productName = getProductName(item.product_id).toLowerCase();
    const matchesSearch = productName.includes(searchTerm.toLowerCase()) || 
                         item.observations?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.lost_type === selectedType;
    
    // Filtro por fecha
    const itemDate = new Date(item.created_at);
    const matchesStartDate = !startDate || itemDate >= new Date(startDate);
    const matchesEndDate = !endDate || itemDate <= new Date(endDate + 'T23:59:59'); // Incluir todo el día
    
    return matchesSearch && matchesType && matchesStartDate && matchesEndDate;
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
        product_id: '',
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

  // Manejar eliminar registro
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      try {
        await deleteLostMutation.mutateAsync(id);
        toast.success('Registro eliminado correctamente');
      } catch (error) {
        toast.error('Error al eliminar el registro');
        console.error(error);
      }
    }
  };

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setStartDate('');
    setEndDate('');
  };

  if (isLoading) return <div className="p-4">Cargando datos de pérdidas...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold pb-4 flex text-orange-500 items-center gap-2">
          <FiAlertTriangle size={24} />
          <span>Gestión de Pérdidas</span>
        </h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            disabled={createLostMutation.isPending}
          >
            <FiPlus /> Nueva Pérdida
          </button>
        </div>
      </div>

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
              <th className="px-6 py-3 text-left">Producto</th>
              <th className="px-6 py-3 text-left">Cantidad</th>
              <th className="px-6 py-3 text-left">Tipo</th>
              <th className="px-6 py-3 text-left">Observaciones</th>
              <th className="px-6 py-3 text-left">Fecha</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((lost) => (
                <tr key={lost.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {getProductName(lost.product_id)}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 justify-center">
                      <button className="text-green-600 hover:text-green-800">
                        <FiEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(lost.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={deleteLostMutation.isPending}
                      >
                        <FiTrash2 />
                      </button>
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
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Registrar Nueva Pérdida</h3>
              
              {validationError && (
                <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                  {validationError}
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Producto *</label>
                  {loadingProducts ? (
                    <div className="text-sm text-gray-500">Cargando productos...</div>
                  ) : products.length === 0 ? (
                    <div className="text-sm text-red-500">No hay productos disponibles</div>
                  ) : (
                    <div className="relative">
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={newLostItem.product_id}
                        onChange={(e) => {
                          if (e.target.value === "show-more") {
                            setShowAllProducts(true);
                            return;
                          }
                          setNewLostItem({...newLostItem, product_id: e.target.value});
                        }}
                        required
                      >
                        <option value="">Seleccionar producto</option>
                        {(showAllProducts ? products : products.slice(0, 5)).map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name}
                          </option>
                        ))}
                        
                        {!showAllProducts && products.length > 5 && (
                          <option value="show-more" className="text-blue-600 italic">
                            Mostrar más...
                          </option>
                        )}
                      </select>
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad *</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newLostItem.quantity || ''}
                    onChange={(e) => setNewLostItem({...newLostItem, quantity: parseInt(e.target.value) || 0})}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pérdida *</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newLostItem.lost_type}
                    onChange={(e) => setNewLostItem({...newLostItem, lost_type: e.target.value})}
                    required
                  >
                    <option value="">Seleccionar tipo</option>
                    <option value="Daño">Daño</option>
                    <option value="Pérdida">Pérdida</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    value={newLostItem.observations || ''}
                    onChange={(e) => setNewLostItem({...newLostItem, observations: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                onClick={handleAddLostItem}
                disabled={createLostMutation.isPending || loadingProducts}
              >
                {createLostMutation.isPending ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setValidationError(null);
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostComponentView;