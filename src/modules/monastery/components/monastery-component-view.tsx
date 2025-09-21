'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2, Eye, Filter, Calendar, Search, DollarSign } from 'lucide-react';

// 1. IMPORTAR HOOKS Y TIPOS NECESARIOS
import { useMonasteryOverheads } from '@/modules/monastery/hooks/useOverheads';
import { Overhead } from '@/modules/monastery/types/overheads';

// Importar los modales de monasterio
import ModalCreateMonasteryExpense from './overhead/modal-create-monastery-expense';
import ModalEditMonasteryExpense from './overhead/modal-edit-monastery-expense';
import ModalDeleteMonasteryExpense from './overhead/modal-delete-monastery-expense';

// NUEVO: Importar los modales de registro general
import ModalViewGeneralRegistry from './generalReport/modal-view';
import ModalDeleteGeneralRegistry from './generalReport/modal.delete';

// NUEVO: Definir tipo para registro general
interface GeneralRegistry {
  id: number;
  name: string;
  date: string;
  amount: string;
  description: string;
  status: 'pending' | 'completed';
}

const MonasteryComponentView: React.FC = () => {
  // 2. OBTENER DATOS Y MUTACIONES AL ESTILO MUSEO
  const { data, loading, error, remove, deleting } = useMonasteryOverheads();

  // 3. ESTADO LOCAL PARA LA UI - MONASTERIO
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOverhead, setSelectedOverhead] = useState<Overhead | null>(null);
  
  // NUEVO: ESTADO LOCAL PARA LA UI - REGISTRO GENERAL
  const [isViewGeneralModalOpen, setViewGeneralModalOpen] = useState(false);
  const [isDeleteGeneralModalOpen, setDeleteGeneralModalOpen] = useState(false);
  const [selectedGeneralRegistry, setSelectedGeneralRegistry] = useState<GeneralRegistry | null>(null);
  
  // NUEVO: Estado para controlar qué vista mostrar
  const [activeView, setActiveView] = useState<'general' | 'monastery'>('monastery');

  // NUEVO: Estados para filtros de Registro General
  const [generalFilters, setGeneralFilters] = useState({
    searchTerm: '',
    statusFilter: 'all' as 'all' | 'pending' | 'completed',
    sortBy: 'date' as 'date' | 'name' | 'amount'
  });

  // NUEVO: Estados para filtros de Gastos de Monasterio
  const [monasteryFilters, setMonasteryFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'date' as 'date' | 'name' | 'amount'
  });

  // 4. DATOS SIN FILTROS
  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  // NUEVO: Datos de ejemplo para registro general por mes
  const generalRegistryData: GeneralRegistry[] = [
    {
      id: 1,
      name: "Gasto de Septiembre",
      date: "En proceso",
      amount: "En proceso ...",
      description: "Gastos realizados en el monasterio en el mes de septiembre",
      status: "pending"
    },
    {
      id: 2,
      name: "Gasto de Agosto", 
      date: "30/08/2025",
      amount: "S/. 20.50",
      description: "Gastos realizados en el monasterio en el mes de agosto",
      status: "completed"
    },
    {
      id: 3,
      name: "Gasto de Julio", 
      date: "31/07/2025",
      amount: "S/. 150.75",
      description: "Gastos realizados en el monasterio en el mes de julio",
      status: "completed"
    }
  ];

  // NUEVO: Filtrar datos del registro general
  const filteredGeneralData = useMemo(() => {
    let filtered = generalRegistryData;

    // Filtro por término de búsqueda
    if (generalFilters.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(generalFilters.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(generalFilters.searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (generalFilters.statusFilter !== 'all') {
      filtered = filtered.filter(item => item.status === generalFilters.statusFilter);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (generalFilters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          const amountA = a.status === 'completed' ? parseFloat(a.amount.replace(/[^\d.]/g, '')) : 0;
          const amountB = b.status === 'completed' ? parseFloat(b.amount.replace(/[^\d.]/g, '')) : 0;
          return amountB - amountA;
        case 'date':
        default:
          if (a.status === 'pending') return -1;
          if (b.status === 'pending') return 1;
          return new Date(b.date.split('/').reverse().join('-')).getTime() - new Date(a.date.split('/').reverse().join('-')).getTime();
      }
    });

    return filtered;
  }, [generalFilters]);

  // NUEVO: Filtrar datos de gastos del monasterio
  const filteredMonasteryData = useMemo(() => {
    let filtered = rows;

    // Filtro por término de búsqueda
    if (monasteryFilters.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(monasteryFilters.searchTerm.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(monasteryFilters.searchTerm.toLowerCase()))
      );
    }

    // Filtro por rango de fechas
    if (monasteryFilters.dateFrom) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(monasteryFilters.dateFrom));
    }
    if (monasteryFilters.dateTo) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(monasteryFilters.dateTo));
    }

    // Filtro por rango de montos
    if (monasteryFilters.minAmount) {
      filtered = filtered.filter(item => Number(item.amount) >= Number(monasteryFilters.minAmount));
    }
    if (monasteryFilters.maxAmount) {
      filtered = filtered.filter(item => Number(item.amount) <= Number(monasteryFilters.maxAmount));
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (monasteryFilters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'amount':
          return Number(b.amount) - Number(a.amount);
        case 'date':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [rows, monasteryFilters]);

  // NUEVO: Estadísticas para registro general
  const generalStats = useMemo(() => {
    const completed = generalRegistryData.filter(item => item.status === 'completed');
    const totalAmount = completed.reduce((sum, item) => {
      return sum + parseFloat(item.amount.replace(/[^\d.]/g, ''));
    }, 0);

    return {
      total: generalRegistryData.length,
      completed: completed.length,
      pending: generalRegistryData.filter(item => item.status === 'pending').length,
      totalAmount: totalAmount
    };
  }, []);

  // NUEVO: Estadísticas para gastos del monasterio
  const monasteryStats = useMemo(() => {
    const totalAmount = filteredMonasteryData.reduce((sum, item) => sum + Number(item.amount), 0);
    const avgAmount = filteredMonasteryData.length > 0 ? totalAmount / filteredMonasteryData.length : 0;

    return {
      total: filteredMonasteryData.length,
      totalAmount: totalAmount,
      avgAmount: avgAmount
    };
  }, [filteredMonasteryData]);

  // Logs de depuración para verificar los datos recibidos y renderizados
  useEffect(() => {
    console.log('[Monastery] raw data from hook:', data);
    console.log('[Monastery] rows used in table:', rows);
  }, [data, rows]);

  useEffect(() => {
    if (error) {
      console.error('[Monastery] error from hook:', error);
    }
  }, [error]);

  // 5. MANEJADORES DE EVENTOS PARA MODALES DE MONASTERIO
  const handleOpenEditModal = (overhead: Overhead) => {
    setSelectedOverhead(overhead);
    setEditModalOpen(true);
  };

  const handleOpenDeleteModal = (overhead: Overhead) => {
    setSelectedOverhead(overhead);
    setDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedOverhead) return;
    await remove(selectedOverhead.id);
    setDeleteModalOpen(false);
  };

  // NUEVO: MANEJADORES DE EVENTOS PARA MODALES DE REGISTRO GENERAL
  const handleOpenViewGeneralModal = (registry: GeneralRegistry) => {
    setSelectedGeneralRegistry(registry);
    setViewGeneralModalOpen(true);
  };

  const handleOpenDeleteGeneralModal = (registry: GeneralRegistry) => {
    setSelectedGeneralRegistry(registry);
    setDeleteGeneralModalOpen(true);
  };

  const handleDeleteGeneralConfirm = async () => {
    if (!selectedGeneralRegistry) return;
    
    // Aquí implementarías la lógica de eliminación
    // await removeGeneralRegistry(selectedGeneralRegistry.id);
    console.log('Eliminar registro general:', selectedGeneralRegistry.id);
    
    setDeleteGeneralModalOpen(false);
    setSelectedGeneralRegistry(null);
  };

  // NUEVO: Componente de filtros para Registro General
  const renderGeneralFilters = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Filter className="text-red-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Filtros y Estadísticas</h3>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Total Registros</p>
          <p className="text-2xl font-bold text-red-700">{generalStats.total}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Completados</p>
          <p className="text-2xl font-bold text-green-700">{generalStats.completed}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-600 font-medium">Pendientes</p>
          <p className="text-2xl font-bold text-yellow-700">{generalStats.pending}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Total S/.</p>
          <p className="text-2xl font-bold text-blue-700">{generalStats.totalAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={generalFilters.searchTerm}
            onChange={(e) => setGeneralFilters({...generalFilters, searchTerm: e.target.value})}
          />
        </div>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={generalFilters.statusFilter}
          onChange={(e) => setGeneralFilters({...generalFilters, statusFilter: e.target.value as 'all' | 'pending' | 'completed'})}
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendientes</option>
          <option value="completed">Completados</option>
        </select>
        
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={generalFilters.sortBy}
          onChange={(e) => setGeneralFilters({...generalFilters, sortBy: e.target.value as 'date' | 'name' | 'amount'})}
        >
          <option value="date">Ordenar por fecha</option>
          <option value="name">Ordenar por nombre</option>
          <option value="amount">Ordenar por monto</option>
        </select>
      </div>
    </div>
  );

  // NUEVO: Componente de filtros para Gastos de Monasterio
  const renderMonasteryFilters = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Filter className="text-red-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Filtros y Estadísticas</h3>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Total Gastos</p>
          <p className="text-2xl font-bold text-red-700">{monasteryStats.total}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Monto Total S/.</p>
          <p className="text-2xl font-bold text-blue-700">{monasteryStats.totalAmount.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Promedio S/.</p>
          <p className="text-2xl font-bold text-green-700">{monasteryStats.avgAmount.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative md:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar gastos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={monasteryFilters.searchTerm}
            onChange={(e) => setMonasteryFilters({...monasteryFilters, searchTerm: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={monasteryFilters.dateFrom}
              onChange={(e) => setMonasteryFilters({...monasteryFilters, dateFrom: e.target.value})}
              title="Fecha desde"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={monasteryFilters.dateTo}
            onChange={(e) => setMonasteryFilters({...monasteryFilters, dateTo: e.target.value})}
            title="Fecha hasta"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="number"
              placeholder="Monto mín."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={monasteryFilters.minAmount}
              onChange={(e) => setMonasteryFilters({...monasteryFilters, minAmount: e.target.value})}
            />
          </div>
          <input
            type="number"
            placeholder="Monto máx."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={monasteryFilters.maxAmount}
            onChange={(e) => setMonasteryFilters({...monasteryFilters, maxAmount: e.target.value})}
          />
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={monasteryFilters.sortBy}
          onChange={(e) => setMonasteryFilters({...monasteryFilters, sortBy: e.target.value as 'date' | 'name' | 'amount'})}
        >
          <option value="date">Ordenar por fecha</option>
          <option value="name">Ordenar por nombre</option>
          <option value="amount">Ordenar por monto</option>
        </select>
        
        <button
          onClick={() => setMonasteryFilters({searchTerm: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '', sortBy: 'date'})}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );

  // NUEVO: Componente para renderizar la vista de Registro General
  const renderGeneralRegistry = () => {
    return (
      <div className="overflow-hidden">
        <h2 className="text-3xl font-semibold text-red-700 mb-6">Registro General por mes</h2>
        
        {renderGeneralFilters()}

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-gray-700">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Gastos</th>
                <th className="px-4 py-3 text-left font-medium">Estado</th>
                <th className="px-4 py-3 text-left font-medium">Descripción</th>
                <th className="px-4 py-3 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredGeneralData.map((registro, index) => (
                <tr key={registro.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-colors duration-200`}>
                  <td className="px-4 py-4 text-gray-800 font-medium">
                    {registro.name}
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {registro.date}
                  </td>
                  <td className="px-4 py-4 text-gray-700">
                    {registro.amount}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registro.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registro.status === 'completed' ? 'Completado' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-sm">
                    {registro.description}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => handleOpenViewGeneralModal(registro)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                        title="Ver detalle"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteGeneralModal(registro)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                        title="Eliminar registro"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredGeneralData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-8 text-gray-500">
                    No se encontraron registros con los filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // NUEVO: Componente para renderizar la vista de Gastos de Monasterio
  const renderMonasteryExpenses = () => {
    return (
      <>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-3xl font-semibold text-red-700">Lista de Gastos</h2>
          <div className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-3xl whitespace-nowrap transition-all duration-300 shadow-lg"
            >
              <PlusCircle className="mr-2" /> Registrar Gastos
            </button>
          </div>
        </div>
        
        {renderMonasteryFilters()}
        
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-gray-700">
            <thead className="bg-gradient-to-r from-gray-700 to-gray-900 text-white">
              <tr>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Monto</th>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={5} className="text-center p-4">Cargando...</td></tr>}
              {error && <tr><td colSpan={5} className="text-center p-4 text-red-500">{error}</td></tr>}
              {!loading && !error && filteredMonasteryData.length === 0 && (
                <tr><td colSpan={5} className="text-center p-8 text-gray-500">No hay gastos que mostrar con los filtros aplicados.</td></tr>
              )}
              {!loading && !error && filteredMonasteryData.map(gasto => (
                <tr key={gasto.id} className="border-b hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-4 py-2 font-medium">{gasto.name}</td>
                  <td className="px-4 py-2">{gasto.description || '-'}</td>
                  <td className="px-4 py-2">S/ {Number(gasto.amount).toFixed(2)}</td>
                  <td className="px-4 py-2">{new Date(gasto.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center space-x-2">
                      <button 
                        onClick={() => handleOpenEditModal(gasto)} 
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Edit size={16}/>
                      </button>
                      <button 
                        onClick={() => handleOpenDeleteModal(gasto)} 
                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Switch de navegación con tema rojo degradado */}
      <div className="flex justify-center mb-6">
        <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveView('general')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeView === 'general'
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md transform scale-105'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Registro General
            </button>
            <button
              onClick={() => setActiveView('monastery')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeView === 'monastery'
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-md transform scale-105'
                  : 'text-red-600 hover:bg-red-50'
              }`}
            >
              Gastos de Monasterio
            </button>
          </div>
        </div>
      </div>

      {/* Imagen de Santa Teresa */}
      <div className="flex justify-center mt-4 mb-6 md:mt-6 md:mb-8">
        <Image
          src="/santa teresa.jpg"
          alt="Santa Teresa"
          width={1900}
          height={500}
          className="rounded-xl shadow-md object-cover object-[center_60%] h-48 md:h-64 w-full"
        />
      </div>

      {/* Renderizado condicional basado en la vista activa */}
      {activeView === 'general' ? renderGeneralRegistry() : renderMonasteryExpenses()}

      {/* MODALES DE MONASTERIO - Solo se muestran en vista de monasterio */}
      {activeView === 'monastery' && (
        <>
          <ModalCreateMonasteryExpense
            isOpen={isCreateModalOpen}
            onClose={() => setCreateModalOpen(false)}
          />
          <ModalEditMonasteryExpense
            isOpen={isEditModalOpen}
            onClose={() => setEditModalOpen(false)}
            overheadToEdit={selectedOverhead}
          />
          <ModalDeleteMonasteryExpense
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            isPending={deleting}
            overheadName={selectedOverhead?.name || ''} overheadToEdit={null}          />
        </>
      )}

      {/* NUEVO: MODALES DE REGISTRO GENERAL - Solo se muestran en vista general */}
      {activeView === 'general' && (
        <>
          <ModalViewGeneralRegistry
            isOpen={isViewGeneralModalOpen}
            onClose={() => setViewGeneralModalOpen(false)}
            registryData={selectedGeneralRegistry}
          />
          <ModalDeleteGeneralRegistry
            isOpen={isDeleteGeneralModalOpen}
            onClose={() => setDeleteGeneralModalOpen(false)}
            onConfirm={handleDeleteGeneralConfirm}
            isPending={false} // Aquí deberías usar tu estado de loading para eliminación
            registryData={selectedGeneralRegistry}
          />
        </>
      )}
    </div>
  );
};

export default MonasteryComponentView;