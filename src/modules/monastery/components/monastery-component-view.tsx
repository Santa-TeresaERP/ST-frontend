'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';


// 1. IMPORTAR HOOKS Y TIPOS NECESARIOS
import { useMonasteryOverheads } from '@/modules/monastery/hooks/useOverheads';
import { Overhead } from '@/modules/monastery/types/overheads';

// Importar los modales de monasterio
import ModalCreateMonasteryExpense from './overhead/modal-create-monastery-expense';
import ModalEditMonasteryExpense from './overhead/modal-edit-monastery-expense';
import ModalDeleteMonasteryExpense from './overhead/modal-delete-monastery-expense';

const MonasteryComponentView: React.FC = () => {
  // 2. OBTENER DATOS Y MUTACIONES AL ESTILO MUSEO
  const { data, loading, error, remove, deleting } = useMonasteryOverheads();

  // 3. ESTADO LOCAL PARA LA UI
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
 
  {/* Filtros removidos intencionalmente */}
      
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-gray-700">
          <thead className="bg-gray-800 text-white">
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
              <tr key={gasto.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 font-medium">{gasto.name}</td>
                <td className="px-4 py-2">{gasto.description || '-'}</td>
        <td className="px-4 py-2">S/ {Number(gasto.amount).toFixed(2)}</td>
        <td className="px-4 py-2">{new Date(gasto.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 flex items-center space-x-2">
                  <button onClick={() => handleOpenEditModal(gasto)} className="text-blue-600 hover:text-blue-800"><Edit size={16}/></button>
                  <button onClick={() => handleOpenDeleteModal(gasto)} className="text-red-600 hover:text-red-800"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6. RENDERIZADO DE MODALES */}
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
        overheadName={selectedOverhead?.name || ''}
      />

    </div>
  );
};

export default MonasteryComponentView;