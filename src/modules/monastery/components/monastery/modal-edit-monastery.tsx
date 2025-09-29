'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

// 1. IMPORTAR HOOKS, SCHEMAS Y TIPOS PARA MONASTERY EXPENSES
import { useUpdateMonasteryExpense } from '@/modules/monastery/hooks/useMonasteryExpenses';
import { useFetchMonasterioOverheads } from '@/modules/monastery/hooks/useOverheads';
import { updateMonasteryExpenseFormSchema, UpdateMonasteryExpenseFormData } from '@/modules/monastery/schemas/monasteryexpense.schema';
import { MonasteryExpense } from '@/modules/monastery/types/monasteryexpense';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit: MonasteryExpense | null;
}

const ModalEditMonastery: React.FC<Props> = ({ isOpen, onClose, expenseToEdit }) => {
  // 2. OBTENER LA LISTA DE OVERHEADS DISPONIBLES
  const { data: overheads = [], isLoading: overheadsLoading } = useFetchMonasterioOverheads();
  
  // 3. INICIALIZAR EL HOOK DE MUTACIÓN
  const { mutate: updateExpense, isPending } = useUpdateMonasteryExpense();

  // 3. CONFIGURAR REACT-HOOK-FORM
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateMonasteryExpenseFormData>({
    resolver: zodResolver(updateMonasteryExpenseFormSchema),
  });

  // 4. LLENAR EL FORMULARIO CUANDO SE ABRA CON DATOS EXISTENTES
  useEffect(() => {
    if (isOpen && expenseToEdit) {
      reset({
        category: expenseToEdit.category,
        amount: expenseToEdit.amount,
        Name: expenseToEdit.Name,
        date: expenseToEdit.date.split('T')[0], // Convertir fecha a formato YYYY-MM-DD
        descripción: expenseToEdit.descripción,
        overheadsId: expenseToEdit.overheadsId || '',
      });
    }
  }, [isOpen, expenseToEdit, reset]);

  // 5. FUNCIÓN PARA MANEJAR EL ENVÍO DEL FORMULARIO
  const onSubmit: SubmitHandler<UpdateMonasteryExpenseFormData> = async (data) => {
    if (!expenseToEdit) return;

    try {
      await updateExpense({
        id: expenseToEdit.id,
        payload: {
          category: data.category,
          amount: data.amount,
          Name: data.Name,
          date: data.date,
          descripción: data.descripción,
          overheadsId: data.overheadsId || undefined,
        },
      });

      onClose(); // Cerrar el modal después de actualizar
    } catch (error) {
      console.error('Error al actualizar gasto del monasterio:', error);
    }
  };

  if (!isOpen || !expenseToEdit) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Editar Gasto del Monasterio</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isPending}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          {/* Campo Nombre */}
          <div>
            <label htmlFor="Name" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              id="Name"
              type="text"
              {...register('Name')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.Name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingrese el nombre del gasto"
            />
            {errors.Name && (
              <p className="mt-1 text-sm text-red-600">{errors.Name.message}</p>
            )}
          </div>

          {/* Campo Categoría */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Categoría *
            </label>
            <input
              id="category"
              type="text"
              {...register('category')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingrese la categoría"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          {/* Campo Monto */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Monto *
            </label>
            <input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.amount ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.amount && (
              <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
            )}
          </div>

          {/* Campo Fecha */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha *
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.date ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          {/* Campo Descripción */}
          <div>
            <label htmlFor="descripción" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción *
            </label>
            <textarea
              id="descripción"
              {...register('descripción')}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                errors.descripción ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingrese la descripción del gasto"
            />
            {errors.descripción && (
              <p className="mt-1 text-sm text-red-600">{errors.descripción.message}</p>
            )}
          </div>

          {/* Campo Gasto General Asociado (requerido) */}
          <div>
            <label htmlFor="overheadsId" className="block text-sm font-medium text-gray-700 mb-1">
              Gasto General Asociado *
            </label>
            {overheadsLoading ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500">
                Cargando gastos generales...
              </div>
            ) : (
              <select
                id="overheadsId"
                {...register('overheadsId')}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  errors.overheadsId ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione un gasto general</option>
                {overheads.map((overhead) => (
                  <option key={overhead.id} value={overhead.id}>
                    {overhead.name} - S/ {overhead.amount} ({new Date(overhead.date).toLocaleDateString()})
                  </option>
                ))}
              </select>
            )}
            {errors.overheadsId && (
              <p className="mt-1 text-sm text-red-600">{errors.overheadsId.message}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? 'Actualizando...' : 'Actualizar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditMonastery;