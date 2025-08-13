'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';

// 1. IMPORTAR HOOKS, SCHEMAS Y TIPOS
import { useUpdateOverhead } from '@/modules/monastery/hooks/useOverheads';
import { updateOverheadFormSchema, UpdateOverheadFormData } from '@/modules/monastery/schemas/overheads.schema';
import { Overhead } from '@/modules/monastery/types/overheads';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  overheadToEdit: Overhead | null;
}

const ModalEditMonasteryExpense: React.FC<Props> = ({ isOpen, onClose, overheadToEdit }) => {
  // 2. INICIALIZAR EL HOOK DE MUTACIÓN
  const { mutate: updateOverhead, isPending } = useUpdateOverhead();

  // 3. CONFIGURAR REACT-HOOK-FORM
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateOverheadFormData>({
    resolver: zodResolver(updateOverheadFormSchema),
  });

  // 4. EFECTO PARA POBLAR EL FORMULARIO CUANDO SE SELECCIONA UN GASTO
  useEffect(() => {
    if (overheadToEdit) {
      // Formateamos la fecha para que el input type="date" la acepte (YYYY-MM-DD)
      const formattedDate = new Date(overheadToEdit.date).toISOString().split('T')[0];
      reset({ ...overheadToEdit, date: formattedDate });
    }
  }, [overheadToEdit, reset]);

  // 5. MANEJADOR DEL ENVÍO DEL FORMULARIO
  const onSubmit: SubmitHandler<UpdateOverheadFormData> = (data) => {
    if (!overheadToEdit) return;

    updateOverhead({ id: overheadToEdit.id, payload: data }, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error) => {
        console.error("Error al actualizar el gasto:", error);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Editar Gasto</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 space-y-4">
            {/* Los campos del formulario son idénticos a los de creación */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" {...register('name')} id="name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Monto (S/)</label>
              <input type="number" step="0.01" {...register('amount')} id="amount" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" {...register('date')} id="date" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
              <textarea {...register('description')} id="description" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"></textarea>
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>}
            </div>
          </div>
          <div className="flex justify-end items-center p-4 border-t">
            <button type="button" onClick={onClose} disabled={isPending} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 disabled:opacity-50">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 disabled:opacity-50">
              {isPending ? 'Actualizando...' : 'Actualizar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditMonasteryExpense;