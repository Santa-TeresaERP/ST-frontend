'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

// 1. IMPORTAR HOOKS Y SCHEMAS BASE
import { useCreateMonasterioOverhead } from '@/modules/monastery/hooks/useOverheads';
import { overheadFormSchema } from '@/modules/monastery/schemas/overheads.schema';

// 2. CREAR UN SCHEMA ESPECÍFICO PARA ESTE FORMULARIO
// Omitimos el campo 'type' porque el endpoint /monasterio lo asigna automáticamente.
const createOverheadSchema = overheadFormSchema.omit({ type: true });
type CreateOverheadData = z.infer<typeof createOverheadSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateOverhead: React.FC<Props> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  // 3. INICIALIZAR EL HOOK DE MUTACIÓN DE REACT QUERY
  const { mutate: createMonasteryOverhead, isPending } = useCreateMonasterioOverhead();

  // 4. CONFIGURAR REACT-HOOK-FORM CON EL RESOLVER DE ZOD
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateOverheadData>({
    resolver: zodResolver(createOverheadSchema),
    defaultValues: {
      name: '',
      amount: undefined, // Empezar sin número para que el placeholder se muestre
      description: '',
      date: new Date().toISOString().split('T')[0], // Fecha actual por defecto
    },
  });

  // 5. MANEJADOR DEL ENVÍO DEL FORMULARIO
  const onSubmit: SubmitHandler<CreateOverheadData> = (data) => {
    createMonasteryOverhead(data, {
      onSuccess: () => {
        // Lógica post-éxito: Invalidar lista específica de Monasterio y genérica
        queryClient.invalidateQueries({ queryKey: ['overhead-monastery'] });
        queryClient.invalidateQueries({ queryKey: ['overhead'] });
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md mx-4 sm:mx-auto overflow-hidden">
        {/* Encabezado rojo — estilo actualizado para coincidir con otros modales */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 text-white p-4 sm:p-5 rounded-t-2xl flex items-center justify-center relative">
          <button
            onClick={onClose}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:opacity-90"
            aria-label="Cerrar"
          >
            <X size={22} />
          </button>
          <h3 className="text-lg sm:text-xl font-semibold">Registrar Nuevo Gasto General</h3>
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
              {isPending ? 'Guardando...' : 'Guardar Gasto General'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateOverhead;