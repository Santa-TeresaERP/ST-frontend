'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { PlusCircle, Filter, Edit, Trash2 } from 'lucide-react';

// 1. IMPORTAR HOOKS Y TIPOS NECESARIOS
import { useFetchOverheads, useDeleteOverhead } from '@/modules/monastery/hooks/useOverheads';
import { Overhead } from '@/modules/monastery/types/overheads';

// Importar los modales que crearemos
import ModalCreateMonasteryExpense from './overhead/modal-create-monastery-expense';
import ModalEditMonasteryExpense from './overhead/modal-edit-monastery-expense';
import ModalDeleteMonasteryExpense from './overhead/modal-delete-monastery-expense';

const MonasteryComponentView: React.FC = () => {
  // 2. OBTENER DATOS Y MUTACIONES CON REACT QUERY
  const { data: allOverheads = [], isLoading, error } = useFetchOverheads();
  const { mutate: deleteOverhead, isPending: isDeleting } = useDeleteOverhead();

  // 3. ESTADO LOCAL PARA LA UI
  const [dateFilter, setDateFilter] = useState('all'); // Para el filtro de fecha
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOverhead, setSelectedOverhead] = useState<Overhead | null>(null);

  // 4. LÓGICA DE FILTRADO OPTIMIZADA
  const filteredMonasteryExpenses = useMemo(() => {
    // Primero, filtramos solo los de tipo 'monasterio'
    const monasteryExpenses = allOverheads.filter(o => o.type === 'monasterio' && o.status === true);

    // Luego, aplicamos el filtro de fecha
    if (dateFilter === 'all') {
      return monasteryExpenses;
    }
    const now = new Date();
    const filterDate = new Date();
    
    if (dateFilter === 'last3days') filterDate.setDate(now.getDate() - 3);
    if (dateFilter === 'last7days') filterDate.setDate(now.getDate() - 7);
    if (dateFilter === 'last30days') filterDate.setDate(now.getDate() - 30);

    return monasteryExpenses.filter(o => new Date(o.date) >= filterDate);
  }, [allOverheads, dateFilter]);

  // 5. MANEJADORES DE EVENTOS PARA MODALES
  const handleOpenEditModal = (overhead: Overhead) => {
    setSelectedOverhead(overhead);
    setEditModalOpen(true);
  };

  const handleOpenDeleteModal = (overhead: Overhead) => {
    setSelectedOverhead(overhead);
    setDeleteModalOpen(true);
  };
  
  const handleDeleteConfirm = () => {
    if (!selectedOverhead) return;
    deleteOverhead(selectedOverhead.id, {
      onSuccess: () => setDeleteModalOpen(false),
    });
  };

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
        <h2 className="text-3xl font-semibold text-red-700 mb-2 sm:mb-0">Lista de Gastos</h2>
        <div className="flex flex-col sm:flex-row justify-end gap-2 w-full sm:w-auto">
          <button
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center justify-center bg-red-700 text-white px-4 py-2 rounded-3xl whitespace-nowrap"
          >
            <PlusCircle className="mr-2" /> Registrar Gastos
          </button>
        </div>
      </div>

      <div className="flex items-center mb-4 gap-2">
        <label className="text-gray-700 font-semibold flex items-center gap-1"><Filter size={16} /> Mostrar:</label>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <option value="last3days">Últimos 3 días</option>
          <option value="last7days">Últimos 7 días</option>
          <option value="last30days">Últimos 30 días</option>
          <option value="all">Todos</option>
        </select>
      </div>
      
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
            {isLoading && <tr><td colSpan={5} className="text-center p-4">Cargando...</td></tr>}
            {error && <tr><td colSpan={5} className="text-center p-4 text-red-500">{error.message}</td></tr>}
            {!isLoading && !error && filteredMonasteryExpenses.length === 0 && (
              <tr><td colSpan={5} className="text-center p-4">No hay gastos que mostrar para el período seleccionado.</td></tr>
            )}
            {!isLoading && !error && filteredMonasteryExpenses.map(gasto => (
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
        isPending={isDeleting}
        overheadName={selectedOverhead?.name || ''}
      />
    </div>
  );
};

export default MonasteryComponentView;