'use client';

import React, { useState, useMemo } from 'react';
import { 
  PlusCircle, Edit, Trash2, Filter, Search, 
  Clock, Calendar
} from 'lucide-react';

// Hooks
import useFetchRents from '../../hook/RentChurch/useFetchRents';
import useUpdateRent from '../../hook/RentChurch/useUpdateRent';
import useDeleteRent from '../../hook/RentChurch/useDeleteRent';
import useCreateRent from '../../hook/RentChurch/useCreateRent';

// Modales
import ModalCreateReserva from './modal-create-view';
import ModalEditReserva from './modal-update-view';
import ModalDeleteReserva from './modal-delete-view';

// Tipos
import { RentChurch, UpdateRentChurchPayload } from '../../types/rentChurch';

// UTILIDAD: Formateador de fecha seguro (Evita errores de Hydration/Timezone)
const formatDateSafe = (dateString: string) => {
  if (!dateString) return '-';
  // Asumimos formato YYYY-MM-DD que viene del input date o BD
  const [year, month, day] = dateString.split('-');
  if (!year || !month || !day) return dateString; // Retorno fallback
  return `${day}/${month}/${year}`;
};

const RentView = () => {
  // Hooks de Datos
  const { data: rentasData, loading, refetch } = useFetchRents();
  const { update } = useUpdateRent();
  const { remove } = useDeleteRent();
  const { create } = useCreateRent();

  // Estados de Interfaz
  const [filters, setFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'fecha' as 'fecha' | 'nombre' | 'precio'
  });

  // Estados de Modales
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<RentChurch | null>(null);

  // Filtrado y orden
  const filteredData = useMemo(() => {
    let filtered = Array.isArray(rentasData) ? rentasData : [];

    // Búsqueda
    if (filters.searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Fechas
    if (filters.dateFrom) {
      filtered = filtered.filter(item => new Date(item.date) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(item => new Date(item.date) <= new Date(filters.dateTo));
    }

    // Montos
    if (filters.minAmount) {
      filtered = filtered.filter(item => Number(item.price) >= Number(filters.minAmount));
    }
    if (filters.maxAmount) {
      filtered = filtered.filter(item => Number(item.price) <= Number(filters.maxAmount));
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'nombre':
          return a.name.localeCompare(b.name);
        case 'precio':
          return Number(b.price) - Number(a.price);
        case 'fecha':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [rentasData, filters]);

  // Estadísticas
  const stats = useMemo(() => {
    const totalEvents = filteredData.length;
    const totalIncome = filteredData.reduce((acc, curr) => acc + Number(curr.price || 0), 0);
    const avgPrice = totalEvents > 0 ? totalIncome / totalEvents : 0;

    return { totalEvents, totalIncome, avgPrice };
  }, [filteredData]);

  // Handlers
  const handleEditSubmit = async (payload: UpdateRentChurchPayload) => {
    if (!selectedReserva) return;
    const result = await update(selectedReserva.id, payload);
    if (result) {
      await refetch(); // Esperamos a que recargue
      setEditModalOpen(false);
      setSelectedReserva(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedReserva) return;
    await remove(selectedReserva.id);
    await refetch(); // Esperamos a que recargue
    setDeleteModalOpen(false);
    setSelectedReserva(null);
  };

  const handleCreateSuccess = async () => {
    await refetch(); // Forzamos recarga de datos
    setCreateModalOpen(false);
  };

  const handleCreateSubmit = async (payload: any) => {
    const res = await create(payload);
    if (res) {
      await refetch();
      setCreateModalOpen(false);
    }
  };

  return (
    <div className="animate-fadeIn">
      
      {/* 1. HEADER SECCIÓN */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-red-700">Reservas y Eventos</h2>
        <button
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          Registrar Evento
        </button>
      </div>

      {/* 2. FILTROS Y ESTADÍSTICAS */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <Filter className="text-red-600 mr-2" size={20} />
          <h3 className="text-lg font-semibold text-gray-800">Filtros y Estadísticas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-600 font-medium">Total Reservas</p>
            <p className="text-2xl font-bold text-red-700">{stats.totalEvents}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Monto Total S/.</p>
            <p className="text-2xl font-bold text-blue-700">{stats.totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-medium">Promedio S/.</p>
            <p className="text-2xl font-bold text-green-700">{stats.avgPrice.toFixed(2)}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative md:col-span-2 lg:col-span-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre o tipo..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={filters.searchTerm}
              onChange={e => setFilters({ ...filters, searchTerm: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="date"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                value={filters.dateFrom}
                onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                title="Fecha desde"
              />
            </div>
            <input
              type="date"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={filters.dateTo}
              onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
              title="Fecha hasta"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="number"
                placeholder="Min S/."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                value={filters.minAmount}
                onChange={e => setFilters({ ...filters, minAmount: e.target.value })}
              />
            </div>
            <input
              type="number"
              placeholder="Max S/."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={filters.maxAmount}
              onChange={e => setFilters({ ...filters, maxAmount: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={filters.sortBy}
            onChange={e => setFilters({ ...filters, sortBy: e.target.value as 'fecha' | 'nombre' | 'precio' })}
          >
            <option value="fecha">Ordenar por fecha</option>
            <option value="nombre">Ordenar por nombre</option>
            <option value="precio">Ordenar por monto</option>
          </select>
          <button
            onClick={() => setFilters({ searchTerm: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '', sortBy: 'fecha' })}
            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* 3. TABLA (Diseño Grid) */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
             <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mb-3"></div>
             <p>Cargando eventos...</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-gray-700 text-white">
              <div className="grid grid-cols-7 gap-4 px-6 py-4">
                <div className="font-semibold text-center">Nombre</div>
                <div className="font-semibold text-center">Precio</div>
                <div className="font-semibold text-center">Tipo</div>
                <div className="font-semibold text-center">Fecha</div>
                <div className="font-semibold text-center">Tiempo de inicio</div>
                <div className="font-semibold text-center">Tiempo de fin</div>
                <div className="font-semibold text-center">Acciones</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`grid grid-cols-7 gap-4 px-6 py-5 transition-colors duration-200 items-center ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-red-50`}
                  >
                    {/* Nombre */}
                    <div className="text-gray-800 font-medium text-center truncate" title={item.name}>
                      {item.name}
                    </div>
                    <div className="text-gray-800 font-medium text-center">
                      S/. {Number(item.price).toFixed(2)}
                    </div>
                    <div className="text-gray-700 text-center">{item.type}</div>
                    <div className="text-gray-700 text-center">{formatDateSafe(item.date)}</div>
                    <div className="text-gray-600 text-sm text-center">{item.startTime}</div>
                    <div className="text-gray-600 text-sm text-center">{item.endTime}</div>
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => { setSelectedReserva(item); setEditModalOpen(true); }}
                        className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 transition-all duration-200 hover:scale-110"
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => { setSelectedReserva(item); setDeleteModalOpen(true); }}
                        className="p-2 rounded-full bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-all duration-200 hover:scale-110"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No se encontraron reservas que coincidan con los filtros aplicados
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* MODALES */}
      <ModalCreateReserva
        isOpen={isCreateModalOpen}
        onClose={() => { setCreateModalOpen(false); refetch(); }}
        onSubmit={handleCreateSubmit}
        idChurch="6a705ffb-ee07-46c6-bc3c-275cdab7966f" // <-- Coloca aquí el ID real de la iglesia
      />
      
      <ModalEditReserva
        isOpen={isEditModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedReserva(null); }}
        onSubmit={handleEditSubmit}
        reservaToEdit={selectedReserva}
      />

      <ModalDeleteReserva
        isOpen={isDeleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedReserva(null); }}
        onConfirm={handleDeleteConfirm}
        isPending={false}
        reservaData={selectedReserva}
      />
    </div>
  );
};

export default RentView;