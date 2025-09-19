'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2, Eye } from 'lucide-react';

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
    }
  ];

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

  // NUEVO: Componente para renderizar la vista de Registro General
  const renderGeneralRegistry = () => {
    return (
      <div className="overflow-hidden">
        <h2 className="text-3xl font-semibold text-red-700 mb-2 sm:mb-0 py-4">Registro General por mes</h2>

        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-gray-700">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Fecha</th>
                <th className="px-4 py-3 text-left font-medium">Gastos</th>
                <th className="px-4 py-3 text-left font-medium">Descripción</th>
                <th className="px-4 py-3 text-left font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {generalRegistryData.map((registro, index) => (
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-3xl font-semibold text-red-700 mb-2 sm:mb-0">Lista de Gastos</h2>
          <div className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-4 py-2 rounded-3xl whitespace-nowrap transition-all duration-300 shadow-lg"
            >
              <PlusCircle className="mr-2" /> Registrar Gastos
            </button>
          </div>
        </div>
        
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
              {!loading && !error && rows.length === 0 && (
                <tr><td colSpan={5} className="text-center p-4">No hay gastos que mostrar para el período seleccionado.</td></tr>
              )}
              {!loading && !error && rows.map(gasto => (
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
            overheadToEdit={selectedOverhead} onConfirm={function (): void {
              throw new Error('Function not implemented.');
            } } isPending={false} overheadName={''}          />
          <ModalDeleteMonasteryExpense
            isOpen={isDeleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleDeleteConfirm}
            isPending={deleting}
            overheadName={selectedOverhead?.name || ''}
          />
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