'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { PlusCircle, Edit, Trash2, ShieldAlert, Loader2 } from 'lucide-react';

// 1. IMPORTAR HOOKS Y TIPOS NECESARIOS
import { useMonasteryOverheads } from '@/modules/monastery/hooks/useOverheads';
import { Overhead } from '@/modules/monastery/types/overheads';
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

// Importar los modales que crearemos
import ModalCreateMonasteryExpense from './overhead/modal-create-monastery-expense';
import ModalEditMonasteryExpense from './overhead/modal-edit-monastery-expense';
import ModalDeleteMonasteryExpense from './overhead/modal-delete-monastery-expense';

const MonasteryComponentView: React.FC = () => {
  // 🔥 HOOK DE PERMISOS
  const { canView, canCreate, canEdit, canDelete, isLoading, isAdmin } = useModulePermissions(MODULE_NAMES.MONASTERIO);

  // 2. OBTENER DATOS Y MUTACIONES AL ESTILO MUSEO
  const { data, loading, error, remove, deleting } = useMonasteryOverheads();

  // 3. ESTADO LOCAL PARA LA UI
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOverhead, setSelectedOverhead] = useState<Overhead | null>(null);

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


  // 5. MANEJADORES DE EVENTOS PARA MODALES CON VERIFICACIÓN DE PERMISOS
  const handleOpenEditModal = (overhead: Overhead) => {
    // 🔥 VERIFICAR PERMISOS ANTES DE ABRIR MODAL
    if (!canEdit && !isAdmin) {
      return;
    }
    setSelectedOverhead(overhead);
    setEditModalOpen(true);
  };

  const handleOpenDeleteModal = (overhead: Overhead) => {
    // 🔥 VERIFICAR PERMISOS ANTES DE ABRIR MODAL
    if (!canDelete && !isAdmin) {
      return;
    }
    setSelectedOverhead(overhead);
    setDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!selectedOverhead) return;
    // 🔥 VERIFICACIÓN ADICIONAL DE PERMISOS
    if (!canDelete && !isAdmin) {
      return;
    }
    await remove(selectedOverhead.id);
    setDeleteModalOpen(false);
  };

  // 🔥 VERIFICACIÓN DE PERMISOS DE LECTURA
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder al módulo de Monasterio.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contacta al administrador para obtener acceso.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* ... (Header e Imagen se mantienen igual) ... */}
       <div className="flex justify-center mt-4 mb-6 md:mt-6 md:mb-8">
              <Image
  src="/santa teresa.jpg"
  alt="Santa Teresa"
  width={1900}
  height={500}
  className="rounded-xl shadow-md object-cover object-[center_60%] h-48 md:h-64 w-full"
/>
            </div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h2 className="text-3xl font-semibold text-red-700 mb-2 sm:mb-0">Lista de Gastos</h2>
          {/* 🔥 DEBUG PANEL DE PERMISOS - Temporal */}
          <div className="mt-2 p-2 bg-gray-100 rounded-lg text-xs">
            <p className="font-mono">
              📋 Permisos MONASTERIO - 
              Ver: {canView ? '✅' : '❌'} | 
              Crear: {canCreate ? '✅' : '❌'} | 
              Editar: {canEdit ? '✅' : '❌'} | 
              Eliminar: {canDelete ? '✅' : '❌'} | 
              Admin: {isAdmin ? '✅' : '❌'}
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
          {/* 🔥 BOTÓN CREAR SOLO SI TIENE PERMISOS */}
          {(canCreate || isAdmin) && (
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center justify-center bg-red-700 text-white px-4 py-2 rounded-3xl whitespace-nowrap"
            >
              <PlusCircle className="mr-2" /> Registrar Gastos
            </button>
          )}
          {/* 🔥 MENSAJE SI NO TIENE PERMISOS DE CREACIÓN */}
          {!canCreate && !isAdmin && (
            <div className="flex items-center justify-center bg-yellow-100 border border-yellow-300 text-yellow-800 px-4 py-2 rounded-3xl whitespace-nowrap text-sm">
              <ShieldAlert className="mr-2" size={16} />
              Sin permisos para crear
            </div>
          )}
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
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    {/* 🔥 BOTÓN EDITAR SOLO SI TIENE PERMISOS */}
                    {(canEdit || isAdmin) && (
                      <button 
                        onClick={() => handleOpenEditModal(gasto)} 
                        className="text-blue-600 hover:text-blue-800"
                        title="Editar gasto"
                      >
                        <Edit size={16}/>
                      </button>
                    )}
                    {/* 🔥 BOTÓN ELIMINAR SOLO SI TIENE PERMISOS */}
                    {(canDelete || isAdmin) && (
                      <button 
                        onClick={() => handleOpenDeleteModal(gasto)} 
                        className="text-red-600 hover:text-red-800"
                        title="Eliminar gasto"
                      >
                        <Trash2 size={16}/>
                      </button>
                    )}
                    {/* 🔥 MENSAJE SI NO TIENE PERMISOS */}
                    {!canEdit && !canDelete && !isAdmin && (
                      <span className="text-gray-400 text-xs">Sin permisos</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6. RENDERIZADO DE MODALES CON VERIFICACIÓN DE PERMISOS */}
      {(canCreate || isAdmin) && (
        <ModalCreateMonasteryExpense
          isOpen={isCreateModalOpen}
          onClose={() => setCreateModalOpen(false)}
        />
      )}
      {(canEdit || isAdmin) && (
        <ModalEditMonasteryExpense
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          overheadToEdit={selectedOverhead}
        />
      )}
      {(canDelete || isAdmin) && (
        <ModalDeleteMonasteryExpense
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          isPending={deleting}
          overheadName={selectedOverhead?.name || ''}
        />
      )}
    </div>
  );
};

export default MonasteryComponentView;