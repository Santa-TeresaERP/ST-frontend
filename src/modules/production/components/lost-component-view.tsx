import React, { useState } from 'react';
import { FiFilter, FiSearch, FiPlus, FiTrash2, FiEdit } from 'react-icons/fi';
import { LostAttributes } from '../types/lost';
import { lostValidation } from '@/modules/production/schemas/lostValidation';

const LostComponentView: React.FC = () => {
  // Estado para los datos y filtros
  const [lostData, setLostData] = useState<LostAttributes[]>([
    {
      id: '1',
      product_id: 'prod-A',
      quantity: 5,
      lost_type: 'Daño',
      observations: 'Producto dañado durante el transporte',
      created_at: new Date('2023-10-01'),
    },
    {
      id: '2',
      product_id: 'prod-B',
      quantity: 3,
      lost_type: 'Pérdida',
      observations: 'Producto extraviado en almacén',
      created_at: new Date('2023-10-02'),
    },
    {
      id: '3',
      product_id: 'prod-C',
      quantity: 7,
      lost_type: 'Daño',
      observations: 'Producto dañado en almacén',
      created_at: new Date('2023-10-03'),
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [newLostItem, setNewLostItem] = useState<Omit<LostAttributes, 'id'>>({
    product_id: '',
    quantity: 0,
    lost_type: '',
    observations: '',
    created_at: new Date(),
  });

  // Filtrar datos
  const filteredData = lostData.filter(item => {
    const matchesSearch = item.observations?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesType = selectedType === 'all' || item.lost_type === selectedType;
    return matchesSearch && matchesType;
  });

  // Tipos de pérdida para el filtro
  const lossTypes = ['all', 'Daño', 'Pérdida'];

  // Manejar agregar nuevo registro con validación
  const handleAddLostItem = () => {
    const validation = lostValidation({
      ...newLostItem,
      id: 'temp-id', // ID temporal para validación
    });

    if (!validation.success) {
      setValidationError(validation.error.errors[0].message);
      return;
    }

    setValidationError(null);
    const newItem: LostAttributes = {
      ...newLostItem,
      id: (lostData.length + 1).toString(),
    };
    
    setLostData([...lostData, newItem]);
    setIsAddModalOpen(false);
    setNewLostItem({
      product_id: '',
      quantity: 0,
      lost_type: '',
      observations: '',
      created_at: new Date(),
    });
  };

  // Manejar eliminar registro
  const handleDeleteItem = (id: string) => {
    setLostData(lostData.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-md">
      {/* Header con título y controles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Pérdidas</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Barra de búsqueda */}
          <div className="relative flex-grow">
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
          <div className="relative flex-grow">
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
          
          {/* Botón para agregar */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FiPlus /> Nueva Pérdida
          </button>
        </div>
      </div>

      {/* Estadísticas resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800">Total Pérdidas</h3>
          <p className="text-2xl font-bold text-blue-600">
            {lostData.reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-100">
          <h3 className="text-sm font-medium text-red-800">Por Daños</h3>
          <p className="text-2xl font-bold text-red-600">
            {lostData.filter(item => item.lost_type === 'Daño').reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
          <h3 className="text-sm font-medium text-yellow-800">Por Pérdidas</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {lostData.filter(item => item.lost_type === 'Pérdida').reduce((sum, item) => sum + item.quantity, 0)}
          </p>
        </div>
      </div>

      {/* Tabla de datos */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Producto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observaciones</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map((lost) => (
                <tr key={lost.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {lost.product_id}
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
                    {lost.observations}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lost.created_at.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <FiEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(lost.id)}
                        className="text-red-600 hover:text-red-900"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Producto</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newLostItem.product_id}
                    onChange={(e) => setNewLostItem({...newLostItem, product_id: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newLostItem.quantity}
                    onChange={(e) => setNewLostItem({...newLostItem, quantity: parseInt(e.target.value) || 0})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Pérdida</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newLostItem.lost_type}
                    onChange={(e) => setNewLostItem({...newLostItem, lost_type: e.target.value})}
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newLostItem.created_at.toISOString().split('T')[0]}
                    onChange={(e) => setNewLostItem({...newLostItem, created_at: new Date(e.target.value)})}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleAddLostItem}
              >
                Guardar
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