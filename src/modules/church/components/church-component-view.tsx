'use client';

import React, { useState, useMemo } from 'react';
import { PlusCircle, Edit, Trash2, Filter, Calendar, Search, DollarSign } from 'lucide-react';
import ModalCreateDonativo from '../components/donativos/modal-create-view';
import ModalEditDonativo from '../components/donativos/modal-update-view';
import ModalDeleteDonativo from '../components/donativos/modal-delete-view';

// Tipos
type Donativo = {
  id: number;
  nombre: string;
  precio: number;
  tipo: string;
  fecha: string;
  descripcion?: string;
};

type TabType = 'donativos' | 'reservas';

const ChurchComponentView = () => {
  // Estado para controlar la vista activa
  const [activeTab, setActiveTab] = useState<TabType>('donativos');
  
  // Estados para los modales
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDonativo, setSelectedDonativo] = useState<Donativo | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Estados para filtros de Donativos
  const [donativosFilters, setDonativosFilters] = useState({
    searchTerm: '',
    dateFrom: '',
    dateTo: '',
    minAmount: '',
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

  // Handlers para crear
  const handleCreateSubmit = (data: any) => {
    console.log('Crear donativo:', data);
    
    // Crear nuevo donativo con ID autogenerado
    const newDonativo: Donativo = {
      id: Math.max(...donativos.map(d => d.id)) + 1,
      nombre: data.nombre,
      precio: Number(data.precio),
      tipo: data.tipo,
      fecha: data.fecha,
      descripcion: data.descripcion
    };
    
    setDonativos([...donativos, newDonativo]);
    // TODO: Aquí llamarías a tu API
  };

  // Handlers para editar
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

  // Handlers para eliminar
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

  const handleRegister = () => {
    setCreateModalOpen(true);
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
                {filteredDonativos.map((donativo, index) => (
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
          // Placeholder para Reservas y Eventos
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <Calendar className="w-20 h-20 mx-auto text-red-300" />
              </div>
              <h2 className="text-3xl font-bold text-red-700 mb-4">
                Reservas y Eventos
              </h2>
              <p className="text-gray-600 text-lg mb-6">
                Esta sección está en desarrollo y será implementada próximamente.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 text-sm">
                  💡 <strong>Nota:</strong> Aquí se gestionarán las reservas para ceremonias religiosas, 
                  eventos especiales y servicios de la iglesia.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODALES */}
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
    </div>
  );
};

export default ChurchComponentView;