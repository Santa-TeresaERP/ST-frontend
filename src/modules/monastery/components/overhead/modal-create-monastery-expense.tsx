'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

// 1. IMPORTAR HOOKS Y SCHEMAS BASE
import { useCreateMonasterioOverhead } from '@/modules/monastery/hooks/useOverheads';
import { overheadFormSchema } from '@/modules/monastery/schemas/overheads.schema';

// 2. CREAR UN SCHEMA ESPECÍFICO PARA ESTE FORMULARIO
// Omitimos el campo 'type' porque el endpoint /monasterio lo asigna automáticamente.
const createMonasteryExpenseSchema = overheadFormSchema.omit({ type: true });
type CreateMonasteryExpenseData = z.infer<typeof createMonasteryExpenseSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateMonasteryExpense: React.FC<Props> = ({ isOpen, onClose }) => {
  // 3. INICIALIZAR EL HOOK DE MUTACIÓN DE REACT QUERY
  const { mutate: createMonasteryOverhead, isPending } = useCreateMonasterioOverhead();

  // 4. CONFIGURAR REACT-HOOK-FORM CON EL RESOLVER DE ZOD
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateMonasteryExpenseData>({
    resolver: zodResolver(createMonasteryExpenseSchema),
    defaultValues: {
      name: '',
      amount: undefined, // Empezar sin número para que el placeholder se muestre
      description: '',
      date: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    },
  });

  // 5. MANEJADOR DEL ENVÍO DEL FORMULARIO
  const onSubmit: SubmitHandler<CreateMonasteryExpenseData> = (data) => {
    createMonasteryOverhead(data, {
      onSuccess: () => {
        // Lógica post-éxito: Limpiar formulario y cerrar modal
        reset();
        onClose();
      },
      onError: (error) => {
        // Opcional: Manejar errores con un toast o alerta
        console.error("Error al crear el gasto:", error);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800">Registrar Nuevo Gasto</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 space-y-4">
            {/* Campo Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
              <input type="text" {...register('name')} id="name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>
            {/* Campo Monto */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">Monto (S/)</label>
              <input type="number" step="0.01" {...register('amount')} id="amount" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" placeholder="0.00" />
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>}
            </div>
            {/* Campo Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
              <input type="date" {...register('date')} id="date" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500" />
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
            </div>
            {/* Campo Descripción */}
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
              {isPending ? 'Guardando...' : 'Guardar Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateMonasteryExpense;