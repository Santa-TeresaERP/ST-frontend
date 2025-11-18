'use client';

import React, { useState, useMemo } from 'react';
import { PlusCircle, Edit, Trash2, Filter, Calendar, Search, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';
import ModalCreateDonativo from '../components/donativos/modal-create-view';
import ModalEditDonativo from '../components/donativos/modal-update-view';
import ModalDeleteDonativo from '../components/donativos/modal-delete-view';
import ModalCreateReserva from '../components/rentas/modal-create-view';
import ModalEditReserva from '../components/rentas/modal-update-view';
import ModalDeleteReserva from '../components/rentas/modal-delete-view';

// Tipos
type Donativo = {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
  fecha: string;
  descripcion?: string;
};

// NUEVO: Tipo para Reserva
type Reserva = {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
  tiempoInicio: string;
  tiempoFin: string;
  fecha: string;
};

type TabType = 'donativos' | 'reservas';

const ChurchComponentView = () => {
  // Estado para controlar la vista activa
  const [activeTab, setActiveTab] = useState<TabType>('donativos');
  
  // Estados para los modales de Donativos
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDonativo, setSelectedDonativo] = useState<Donativo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados para los modales de Reservas
  const [isCreateReservaModalOpen, setCreateReservaModalOpen] = useState(false);
  const [isEditReservaModalOpen, setEditReservaModalOpen] = useState(false);
  const [isDeleteReservaModalOpen, setDeleteReservaModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
  const [isDeletingReserva, setIsDeletingReserva] = useState(false);


  // Datos de ejemplo - Donativos
  const [donativos, setDonativos] = useState<Donativo[]>([
    {
      id: 1,
      nombre: 'Limosna',
      precio: 5.00,
      tipo: 'Limosna yape',
      fecha: '2025-08-30',
      descripcion: 'Donación por yape'
    },
    {
      id: 2,
      nombre: 'Donativo',
      precio: 20.50,
      tipo: 'Donativo',
      fecha: '2025-08-30',
      descripcion: 'Donación mensual'
    },
    {
      id: 3,
      nombre: 'Ofrenda',
      precio: 15.00,
      tipo: 'Ofrenda',
      fecha: '2025-09-01',
      descripcion: 'Ofrenda especial'
    },
    {
      id: 4,
      nombre: 'Limosna',
      precio: 10.00,
      tipo: 'Limosna efectivo',
      fecha: '2025-09-02',
      descripcion: 'Donación en efectivo'
    },
    {
      id: 5,
      nombre: 'Donativo',
      precio: 50.00,
      tipo: 'Donativo',
      fecha: '2025-09-03',
      descripcion: 'Apoyo especial'
    }
  ]);

  // Datos de ejemplo - Reservas
  const [reservas, setReservas] = useState<Reserva[]>([
    {
      id: 1,
      nombre: 'Bautizo',
      precio: 500,
      tipo: 'Bautizo',
      tiempoInicio: '10:00 am',
      tiempoFin: '3:00 pm',
      fecha: '2025-08-30',
    },
    {
      id: 2,
      nombre: 'Matrimonio',
      precio: 2500,
      tipo: 'Matrimonio',
      tiempoInicio: '5:00 pm',
      tiempoFin: '8:00 pm',
      fecha: '2025-08-30',
    },
  ]);

  // Estados para filtros de Donativos
  const [donativosFilters, setDonativosFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
    maxAmount: '',
    sortBy: 'fecha' as 'fecha' | 'nombre' | 'precio'
  });

  // NUEVO: Estados para filtros de Reservas
  const [reservasFilters, setReservasFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '', // <-- AÑADIR ESTA LÍNEA
    maxAmount: '',
    sortBy: 'fecha' as 'fecha' | 'nombre' | 'precio'
  });

  // Filtrar y ordenar donativos
  const filteredDonativos = useMemo(() => {
    let filtered = donativos;

    // Filtro por búsqueda
    if (donativosFilters.searchTerm) {
      filtered = filtered.filter(item =>
        item.nombre.toLowerCase().includes(donativosFilters.searchTerm.toLowerCase()) ||
        item.tipo.toLowerCase().includes(donativosFilters.searchTerm.toLowerCase()) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(donativosFilters.searchTerm.toLowerCase()))
      );
    }

    // Filtro por rango de fechas
    if (donativosFilters.dateFrom) {
      filtered = filtered.filter(item => new Date(item.fecha) >= new Date(donativosFilters.dateFrom));
    }
    if (donativosFilters.dateTo) {
      filtered = filtered.filter(item => new Date(item.fecha) <= new Date(donativosFilters.dateTo));
    }

    // Filtro por rango de montos
    if (donativosFilters.minAmount) {
      filtered = filtered.filter(item => item.precio >= Number(donativosFilters.minAmount));
    }
    if (donativosFilters.maxAmount) {
      filtered = filtered.filter(item => item.precio <= Number(donativosFilters.maxAmount));
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (donativosFilters.sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'precio':
          return b.precio - a.precio;
        case 'fecha':
        default:
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      }
    });

    return filtered;
  }, [donativos, donativosFilters]);

  // NUEVO: Filtrar y ordenar reservas
  const filteredReservas = useMemo(() => {
    let filtered = reservas;

    // Filtro por búsqueda
    if (reservasFilters.searchTerm) {
      filtered = filtered.filter(item =>
        item.nombre.toLowerCase().includes(reservasFilters.searchTerm.toLowerCase()) ||
        item.tipo.toLowerCase().includes(reservasFilters.searchTerm.toLowerCase())
      );
    }

    // Filtro por rango de fechas
    if (reservasFilters.dateFrom) {
      filtered = filtered.filter(item => new Date(item.fecha) >= new Date(reservasFilters.dateFrom));
    }
    if (reservasFilters.dateTo) {
      filtered = filtered.filter(item => new Date(item.fecha) <= new Date(reservasFilters.dateTo));
    }

    // Filtro por rango de montos
    if (reservasFilters.minAmount) {
      filtered = filtered.filter(item => item.precio >= Number(reservasFilters.minAmount));
    }
    if (reservasFilters.maxAmount) {
      filtered = filtered.filter(item => item.precio <= Number(reservasFilters.maxAmount));
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (reservasFilters.sortBy) {
        case 'nombre':
          return a.nombre.localeCompare(b.nombre);
        case 'precio':
          return b.precio - a.precio;
        case 'fecha':
        default:
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
      }
    });

    return filtered;
  }, [reservas, reservasFilters]);


  // Estadísticas de donativos
  const donativosStats = useMemo(() => {
    const total = filteredDonativos.reduce((sum, item) => sum + item.precio, 0);
    const avg = filteredDonativos.length > 0 ? total / filteredDonativos.length : 0;

    return {
      count: filteredDonativos.length,
      total,
      avg
    };
  }, [filteredDonativos]);

  // NUEVO: Estadísticas de reservas (AHORA COMPLETAS)
  const reservasStats = useMemo(() => {
  const total = filteredReservas.reduce((sum, item) => sum + item.precio, 0);
  const avg = filteredReservas.length > 0 ? total / filteredReservas.length : 0;

  return {
    count: filteredReservas.length,
    total,
    avg
  };
}, [filteredReservas]);

  // Handlers para crear Donativo
  const handleCreateSubmit = (data: any) => {
    console.log('Crear donativo:', data);
    
    // Crear nuevo donativo con ID autogenerado
    const newDonativo: Donativo = {
      id: donativos.length > 0 ? Math.max(...donativos.map(d => d.id)) + 1 : 1,
      nombre: data.nombre,
      precio: Number(data.precio),
      tipo: data.tipo,
      fecha: data.fecha,
      descripcion: data.descripcion
    };
    
    setDonativos([...donativos, newDonativo]);
    // TODO: Aquí llamarías a tu API
  };

  // Handlers para editar Donativo
  const handleEdit = (donativo: Donativo) => {
    setSelectedDonativo(donativo);
    setEditModalOpen(true);
  };

  const handleEditSubmit = (id: number, data: any) => {
    console.log('Editar donativo:', id, data);
    
    // Actualizar donativo en el array
    setDonativos(donativos.map(d => 
      d.id === id 
        ? {
            ...d,
            nombre: data.nombre,
            precio: Number(data.precio),
            tipo: data.tipo,
            fecha: data.fecha,
            descripcion: data.descripcion
          }
        : d
    ));
    
    // TODO: Aquí llamarías a tu API
  };

  // Handlers para eliminar Donativo
  const handleDelete = (donativo: Donativo) => {
    setSelectedDonativo(donativo);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDonativo) return;
    
    setIsDeleting(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Eliminar donativo:', selectedDonativo.id);
      
      // Eliminar donativo del array
      setDonativos(donativos.filter(d => d.id !== selectedDonativo.id));
      
      // TODO: Aquí llamarías a tu API
      
      setDeleteModalOpen(false);
      setSelectedDonativo(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handler para botón de registro de Donativo
  const handleRegister = () => {
    setCreateModalOpen(true);
  };

  // --- NUEVO: Handlers para Reservas ---

  // Handler para botón de registro de Reserva
  const handleRegisterReserva = () => {
    setCreateReservaModalOpen(true);
  };

  // Handler para crear Reserva
  const handleCreateReservaSubmit = (data: any) => {
    console.log('Crear reserva:', data);
    const newReserva: Reserva = {
      id: reservas.length > 0 ? Math.max(...reservas.map(r => r.id)) + 1 : 1,
      nombre: data.nombre,
      precio: Number(data.precio),
      tipo: data.tipo,
      fecha: data.fecha,
      tiempoInicio: data.tiempoInicio,
      tiempoFin: data.tiempoFin
    };
    setReservas([...reservas, newReserva]);
    // TODO: API call
  };

  // Handler para editar Reserva
  const handleEditReserva = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setEditReservaModalOpen(true);
  };

  const handleEditReservaSubmit = (id: number, data: any) => {
    console.log('Editar reserva:', id, data);
    setReservas(reservas.map(r =>
      r.id === id
        ? {
            ...r,
            nombre: data.nombre,
            precio: Number(data.precio),
            tipo: data.tipo,
            fecha: data.fecha,
            tiempoInicio: data.tiempoInicio,
            tiempoFin: data.tiempoFin
          }
        : r
    ));
    // TODO: API call
  };

  // Handler para eliminar Reserva
  const handleDeleteReserva = (reserva: Reserva) => {
    setSelectedReserva(reserva);
    setDeleteReservaModalOpen(true);
  };

  const handleDeleteReservaConfirm = async () => {
    if (!selectedReserva) return;
    setIsDeletingReserva(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API
      console.log('Eliminar reserva:', selectedReserva.id);
      setReservas(reservas.filter(r => r.id !== selectedReserva.id));
      setDeleteReservaModalOpen(false);
      setSelectedReserva(null);
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
    } finally {
      setIsDeletingReserva(false);
    }
  };

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Número de elementos por página

  // Calcular elementos para la página actual - Donativos
  const paginatedDonativos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredDonativos.slice(startIndex, endIndex);
  }, [filteredDonativos, currentPage]);

  // Calcular elementos para la página actual - Reservas
  const paginatedReservas = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReservas.slice(startIndex, endIndex);
  }, [filteredReservas, currentPage]);

  // Total de páginas
  const totalPagesDonativos = Math.ceil(filteredDonativos.length / itemsPerPage);
  const totalPagesReservas = Math.ceil(filteredReservas.length / itemsPerPage);

  // Función para cambiar de página
  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > (activeTab === 'donativos' ? totalPagesDonativos : totalPagesReservas)) return;
    setCurrentPage(pageNumber);
  };


  // Componente de filtros para Donativos
  const renderDonativosFilters = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Filter className="text-red-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Filtros y Estadísticas</h3>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Total Donativos</p>
          <p className="text-2xl font-bold text-red-700">{donativosStats.count}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Monto Total S/.</p>
          <p className="text-2xl font-bold text-blue-700">{donativosStats.total.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Promedio S/.</p>
          <p className="text-2xl font-bold text-green-700">{donativosStats.avg.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative md:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar donativos..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={donativosFilters.searchTerm}
            onChange={(e) => setDonativosFilters({...donativosFilters, searchTerm: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={donativosFilters.dateFrom}
              onChange={(e) => setDonativosFilters({...donativosFilters, dateFrom: e.target.value})}
              title="Fecha desde"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={donativosFilters.dateTo}
            onChange={(e) => setDonativosFilters({...donativosFilters, dateTo: e.target.value})}
            title="Fecha hasta"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="number"
              placeholder="Min S/."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={donativosFilters.minAmount}
              onChange={(e) => setDonativosFilters({...donativosFilters, minAmount: e.target.value})}
            />
          </div>
          <input
            type="number"
            placeholder="Max S/."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={donativosFilters.maxAmount}
            onChange={(e) => setDonativosFilters({...donativosFilters, maxAmount: e.target.value})}
          />
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={donativosFilters.sortBy}
          onChange={(e) => setDonativosFilters({...donativosFilters, sortBy: e.target.value as 'fecha' | 'nombre' | 'precio'})}
        >
          <option value="fecha">Ordenar por fecha</option>
          <option value="nombre">Ordenar por nombre</option>
          <option value="precio">Ordenar por monto</option>
        </select>
        
        <button
          onClick={() => setDonativosFilters({searchTerm: '', dateFrom: '', dateTo: '', minAmount: '', maxAmount: '', sortBy: 'fecha'})}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );

  // NUEVO: Componente de filtros para Reservas
  const renderReservasFilters = () => (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Filter className="text-red-600 mr-2" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Filtros y Estadísticas</h3>
      </div>
      
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-600 font-medium">Total Reservas</p>
          <p className="text-2xl font-bold text-red-700">{reservasStats.count}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Monto Total S/.</p>
          <p className="text-2xl font-bold text-blue-700">{reservasStats.total.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-600 font-medium">Promedio S/.</p>
          <p className="text-2xl font-bold text-green-700">{reservasStats.avg.toFixed(2)}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative md:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Buscar por nombre o tipo..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            value={reservasFilters.searchTerm}
            onChange={(e) => setReservasFilters({...reservasFilters, searchTerm: e.target.value})}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={reservasFilters.dateFrom}
              onChange={(e) => setReservasFilters({...reservasFilters, dateFrom: e.target.value})}
              title="Fecha desde"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={reservasFilters.dateTo}
            onChange={(e) => setReservasFilters({...reservasFilters, dateTo: e.target.value})}
            title="Fecha hasta"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="number"
              placeholder="Min S/."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
              value={reservasFilters.minAmount}
              onChange={(e) => setReservasFilters({...reservasFilters, minAmount: e.target.value})}
            />
          </div>
          <input
            type="number"
            placeholder="Max S/."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            value={reservasFilters.maxAmount}
            onChange={(e) => setReservasFilters({...reservasFilters, maxAmount: e.target.value})}
          />
        </div>
        {/* Espacio vacío para alinear el select y botón */}
        <div></div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <select
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          value={reservasFilters.sortBy}
          onChange={(e) => setReservasFilters({...reservasFilters, sortBy: e.target.value as 'fecha' | 'nombre' | 'precio'})}
        >
          <option value="fecha">Ordenar por fecha</option>
          <option value="nombre">Ordenar por nombre</option>
          <option value="precio">Ordenar por precio</option>
        </select>
        
        <button
          onClick={() => setReservasFilters({searchTerm: '', dateFrom: '', dateTo: '',minAmount: '', maxAmount: '', sortBy: 'fecha'})}
          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors duration-200"
        >
          Limpiar Filtros
        </button>
      </div>
    </div>
  );


  // Renderizar contenido de Reservas y Eventos (ACTUALIZADO)
  const renderReservas = () => (
    <div className="space-y-6"> {/* Añadido para consistencia */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-red-700">Reservas y Eventos</h2>
        <button
          onClick={handleRegisterReserva} // <-- CORREGIDO: Llama al handler de reservas
          className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          Registrar Evento
        </button>
      </div>

      {renderReservasFilters()}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gray-700 text-white">
          <div className="grid grid-cols-7 gap-4 px-6 py-4">
            <div className="font-semibold text-center">Nombre</div>
            <div className="font-semibold text-center">Precio</div>
            <div className="font-semibold text-center">Tipo</div>
            <div className="font-semibold text-center">Fecha</div>
            <div className="font-semibold text-center">Tiempo de Inicio</div>
            <div className="font-semibold text-center">Tiempo de Fin</div>
            <div className="font-semibold text-center">Acciones</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {paginatedReservas.map((reserva, index) => (
            <div
              key={reserva.id}
              className={`grid grid-cols-7 gap-4 px-6 py-5 transition-colors duration-200 ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-red-50`}
            >
              <div className="text-gray-800 font-medium text-center">{reserva.nombre}</div>
              <div className="text-gray-800 font-medium text-center">S/. {reserva.precio.toFixed(2)}</div>
              <div className="text-gray-700 text-center">{reserva.tipo}</div>
              <div className="text-gray-700 text-center">{new Date(reserva.fecha).toLocaleDateString('es-PE')}</div>
              <div className="text-gray-700 text-center">{reserva.tiempoInicio}</div>
              <div className="text-gray-700 text-center">{reserva.tiempoFin}</div>
              <div className="flex justify-center items-center gap-3">
                <button
                  onClick={() => handleEditReserva(reserva)}
                  className="p-2 rounded-full bg-gray-100 hover:bg-red-100 text-gray-700 hover:text-red-700 transition-all duration-200 hover:scale-110"
                  title="Editar"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteReserva(reserva)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-600 text-red-600 hover:text-white transition-all duration-200 hover:scale-110"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* --- NUEVO: Estado Vacío --- */}
        {filteredReservas.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay reservas registradas que coincidan con los filtros aplicados
          </div>
        )}

      </div>
    </div>
  );

  // Actualizar lógica de renderizado de tabs
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-red-700 mb-2">Iglesia</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-800 mx-auto rounded-full"></div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setActiveTab('donativos')}
              className={`
                py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                ${activeTab === 'donativos'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              Donativos y limosnas
            </button>
            <button
              onClick={() => setActiveTab('reservas')}
              className={`
                py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300
                ${activeTab === 'reservas'
                  ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              Reservas y Eventos
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'donativos' ? (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold text-red-700">Donativos y Limosnas</h2>
              <button
                onClick={handleRegister}
                className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <PlusCircle className="w-5 h-5" />
                Registrar Donativo
              </button>
            </div>

            {renderDonativosFilters()}

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-700 text-white">
                <div className="grid grid-cols-6 gap-4 px-6 py-4">
                  <div className="font-semibold text-center">Nombre</div>
                  <div className="font-semibold text-center">Precio</div>
                  <div className="font-semibold text-center">Tipo</div>
                  <div className="font-semibold text-center">Fecha</div>
                  <div className="font-semibold text-center">Descripción</div>
                  <div className="font-semibold text-center">Acciones</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {paginatedDonativos.map((donativo, index) => (
                  <div
                    key={donativo.id}
                    className={`
                      grid grid-cols-6 gap-4 px-6 py-5 
                      transition-colors duration-200
                      ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      hover:bg-red-50
                    `}
                  >
                    <div className="text-gray-800 font-medium text-center">
                      {donativo.nombre}
                    </div>
                    <div className="text-gray-800 font-medium text-center">
                      S/. {donativo.precio.toFixed(2)}
                    </div>
                    <div className="text-gray-700 text-center">
                      {donativo.tipo}
                    </div>
                    <div className="text-gray-700 text-center">
                      {new Date(donativo.fecha).toLocaleDateString('es-PE')}
                    </div>
                    <div className="text-gray-600 text-sm text-center">
                      {donativo.descripcion || '-'}
                    </div>
                    <div className="flex justify-center items-center gap-3">
                      <button
                        onClick={() => handleEdit(donativo)}
                        className="
                          p-2 rounded-full 
                          bg-gray-100 hover:bg-red-100 
                          text-gray-700 hover:text-red-700
                          transition-all duration-200
                          hover:scale-110
                        "
                        title="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(donativo)}
                        className="
                          p-2 rounded-full 
                          bg-red-100 hover:bg-red-600 
                          text-red-600 hover:text-white
                          transition-all duration-200
                          hover:scale-110
                        "
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {filteredDonativos.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No hay donativos registrados que coincidan con los filtros aplicados
                </div>
              )}
            </div>
          </div>
        ) : (
          // Contenido de Reservas y Eventos
          renderReservas()
        )}
      </div>
      {/* Paginación - NUEVO */}
      <div className="flex justify-center items-center space-x-2 mt-8">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
        </button>

        {Array.from({ length: activeTab === 'donativos' ? totalPagesDonativos : totalPagesReservas }, (_, index) => index + 1).map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors duration-200 ${
              number === currentPage
                ? 'bg-red-600 text-white shadow-md'
                : 'text-gray-700 bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === (activeTab === 'donativos' ? totalPagesDonativos : totalPagesReservas)}
          className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* MODALES DE DONATIVOS */}
      <ModalCreateDonativo
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateSubmit}
      />

      <ModalEditDonativo
        isOpen={isEditModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedDonativo(null);
        }}
        onSubmit={handleEditSubmit}
        donativoToEdit={selectedDonativo}
      />

      <ModalDeleteDonativo
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDonativo(null);
        }}
        onConfirm={handleDeleteConfirm}
        isPending={isDeleting}
        donativoData={selectedDonativo}
      />

      {/* NUEVO: MODALES DE RESERVAS */}
      <ModalCreateReserva
        isOpen={isCreateReservaModalOpen}
        onClose={() => setCreateReservaModalOpen(false)}
        onSubmit={handleCreateReservaSubmit}
      />
      
      <ModalEditReserva
        isOpen={isEditReservaModalOpen}
        onClose={() => {
          setEditReservaModalOpen(false);
          setSelectedReserva(null);
        }}
        onSubmit={handleEditReservaSubmit}
        reservaToEdit={selectedReserva}
      />

      <ModalDeleteReserva
        isOpen={isDeleteReservaModalOpen}
        onClose={() => {
          setDeleteReservaModalOpen(false);
          setSelectedReserva(null);
        }}
        onConfirm={handleDeleteReservaConfirm}
        isPending={isDeletingReserva}
        reservaData={selectedReserva}
      />
    </div>
  );
};

export default ChurchComponentView;