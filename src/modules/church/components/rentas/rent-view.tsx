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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Estados de Modales
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<RentChurch | null>(null);

  // Lógica de Filtrado
  const filteredData = useMemo(() => {
    // Aseguramos que rentasData sea un array para evitar crashes
    const safeData = Array.isArray(rentasData) ? rentasData : [];
    
    return safeData.filter(item => {
      // Búsqueda segura (valida que name exista)
      const itemName = item.name ? item.name.toLowerCase() : '';
      const matchesSearch = itemName.includes(searchTerm.toLowerCase());
      
      // Filtro de fecha
      const matchesDate = selectedDate === '' || item.date === selectedDate;
      
      return matchesSearch && matchesDate;
    });
  }, [rentasData, searchTerm, selectedDate]);

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

        {/* Tarjetas de Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <p className="text-sm text-red-600 font-medium">Total Eventos</p>
            <p className="text-2xl font-bold text-red-700">{stats.totalEvents}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-600 font-medium">Ingresos Estimados</p>
            <p className="text-2xl font-bold text-blue-700">S/. {stats.totalIncome.toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <p className="text-sm text-green-600 font-medium">Precio Promedio</p>
            <p className="text-2xl font-bold text-green-700">S/. {stats.avgPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Inputs de Filtro */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Buscar evento por nombre..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm text-gray-600"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        </div>
        
        {/* Botón limpiar filtros */}
        {(searchTerm || selectedDate) && (
          <div className="mt-4 flex justify-end">
             <button 
               onClick={() => { setSearchTerm(''); setSelectedDate(''); }}
               className="text-sm text-red-600 hover:text-red-800 underline"
             >
               Limpiar filtros
             </button>
          </div>
        )}
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
              <div className="grid grid-cols-6 gap-4 px-6 py-4">
                <div className="font-semibold text-center">Nombre</div>
                <div className="font-semibold text-center">Tipo</div>
                <div className="font-semibold text-center">Fecha</div>
                <div className="font-semibold text-center">Horario</div>
                <div className="font-semibold text-center">Precio</div>
                <div className="font-semibold text-center">Acciones</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`grid grid-cols-6 gap-4 px-6 py-5 transition-colors duration-200 items-center ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    } hover:bg-red-50`}
                  >
                    {/* Nombre */}
                    <div className="text-gray-800 font-medium text-center truncate" title={item.name}>
                      {item.name}
                    </div>

                    {/* Tipo */}
                    <div className="text-center">
                       <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                          ${item.type === 'bautizo' ? 'bg-blue-100 text-blue-700' : 
                            item.type === 'matrimonio' ? 'bg-purple-100 text-purple-700' : 
                            'bg-orange-100 text-orange-700'}`}
                        >
                          {item.type}
                        </span>
                    </div>

                    {/* Fecha - Usamos el formateador seguro */}
                    <div className="text-gray-700 text-center text-sm">
                      {formatDateSafe(item.date)}
                    </div>

                    {/* Horario */}
                    <div className="text-gray-600 text-sm text-center flex justify-center items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.startTime} - {item.endTime}
                    </div>

                    {/* Precio - Casteamos a Number para evitar errores de .toFixed */}
                    <div className="text-gray-800 font-medium text-center">
                      S/. {Number(item.price).toFixed(2)}
                    </div>

                    {/* Acciones */}
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
                  {searchTerm || selectedDate ? 'No hay eventos que coincidan con los filtros.' : 'No se encontraron eventos registrados.'}
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
        onSubmit={handleCreateSubmit} // <-- PASADO AL MODAL
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