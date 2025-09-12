// C:\...ST-frontend\src\modules\finanzas\components\reporte\modal-list-monthly-expenses.tsx

'use client';

import React, { useState } from 'react';
import { X, PlusCircle, AlertCircle, Edit, Trash2 } from 'lucide-react';
// Usamos el hook existente del módulo 'monastery'
import { useFetchMonthlyOverheads } from '@/modules/monastery/hooks/useOverheads';
// Importamos el segundo modal que crearemos a continuación
import ModalCreateGeneralOverhead from './modal-create-general-overhead';
import ModalEditMonthlyExpense from './modal-edit-monthly-expense';
import ModalDeleteMonthlyExpense from './modal-delete-monthly-expense';
import type { Overhead } from '@/modules/monastery/types/overheads';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalListMonthlyExpenses: React.FC<Props> = ({ isOpen, onClose }) => {
  // Estado para controlar el segundo modal (el de creación)
  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Overhead | null>(null);

  // Usamos el hook para obtener los gastos de Monasterio
  const { data: monthlyExpenses = [], isLoading, isError, error } = useFetchMonthlyOverheads();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
          {/* Header del Modal */}
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-xl font-semibold text-gray-800">Gastos Mensuales Registrados</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>

          {/* Contenido del Modal (Tabla y Botón) */}
          <div className="p-6 overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-red-700 transition-colors"
              >
                <PlusCircle size={18} />
                Registrar Nuevo Gasto
              </button>
            </div>
            
            {/* Tabla de gastos */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-gray-700">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Nombre</th>
                    <th className="px-4 py-2 text-left">Monto</th>
                    <th className="px-4 py-2 text-left">Fecha</th>
                    <th className="px-4 py-2 text-left">Estado</th>
                    <th className="px-4 py-2 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading && <tr><td colSpan={3} className="text-center p-4">Cargando...</td></tr>}
                  {isError && (
                    <tr>
                      <td colSpan={3} className="text-center p-4 text-red-600">
                        <div className="flex justify-center items-center gap-2">
                           <AlertCircle size={18} /> 
                           <span>{error?.message || 'No se encontraron gastos mensuales.'}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  {!isLoading && !isError && monthlyExpenses.length === 0 && (
                    <tr><td colSpan={3} className="text-center p-4">No hay gastos mensuales para mostrar.</td></tr>
                  )}
                  {!isLoading && !isError && monthlyExpenses.map(gasto => (
                    <tr key={gasto.id} className={`border-b hover:bg-gray-50 ${gasto.status ? '' : 'opacity-60'}`}>
                      <td className="px-4 py-2 font-medium">{gasto.name}</td>
                      <td className="px-4 py-2">S/ {Number(gasto.amount).toFixed(2)}</td>
                      <td className="px-4 py-2">{new Date(gasto.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        {gasto.status ? (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">Activo</span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-700">Inactivo</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            title="Editar"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => { setSelectedExpense(gasto as Overhead); setEditModalOpen(true); }}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            type="button"
                            title={gasto.status ? 'Deshabilitar' : 'Habilitar'}
                            className="text-red-600 hover:text-red-800"
                            onClick={() => { setSelectedExpense(gasto as Overhead); setDeleteModalOpen(true); }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Renderizado del segundo modal */}
      <ModalCreateGeneralOverhead 
        isOpen={isCreateModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />

      {/* Modal de edición */}
      <ModalEditMonthlyExpense
        isOpen={isEditModalOpen}
        onClose={() => { setEditModalOpen(false); setSelectedExpense(null); }}
        expense={selectedExpense}
      />

      {/* Modal de eliminación */}
      <ModalDeleteMonthlyExpense
        isOpen={isDeleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setSelectedExpense(null); }}
        expense={selectedExpense}
      />
    </>
  );
};

export default ModalListMonthlyExpenses;