'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, Calendar, AlertCircle } from 'lucide-react';

import { useCreateMonasterioOverhead } from '@/modules/monastery/hooks/useOverheads';

const createMonasteryExpenseSchema = z.object({
  date: z.string().min(1, 'La fecha es obligatoria'),
});

type CreateMonasteryExpenseData = z.infer<typeof createMonasteryExpenseSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateMonasteryExpense: React.FC<Props> = ({ isOpen, onClose }) => {
  const { mutate: createMonasteryOverhead, isPending } = useCreateMonasterioOverhead();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateMonasteryExpenseData>({
    resolver: zodResolver(createMonasteryExpenseSchema),
    mode: 'onChange',
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmit: SubmitHandler<CreateMonasteryExpenseData> = (data) => {
    const selectedDate = new Date(data.date);
    const monthName = selectedDate.toLocaleString('es-ES', { month: 'long' });
    const capitalizedMonthName =
      monthName.charAt(0).toUpperCase() + monthName.slice(1);

    createMonasteryOverhead(
      {
        name: `Cierre mensual ${capitalizedMonthName}`,
        amount: 0,
        date: data.date,
        description: `Registro del mes de ${capitalizedMonthName}: (en proceso)`,
      },
      {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error) => {
        console.error('Error al crear el cierre mensual:', error);
      },
      },
    );
  };

  const handleClose = () => {
    if (!isPending) {
      reset();
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isPending) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 px-4 sm:px-6 py-4 rounded-t-2xl sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Plus className="text-white" size={18} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-white">Realizar Cierre Mensual</h3>
                <p className="text-red-100 text-xs sm:text-sm">Confirma la fecha para abrir un nuevo ciclo</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isPending}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Fecha */}
            <div className="group">
              <label htmlFor="date" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="mr-2 text-red-600" size={16} />
                Fecha del Nuevo Ciclo
              </label>
              <input
                type="date"
                {...register('date')}
                id="date"
                className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 ${
                  errors.date
                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-red-500 focus:bg-red-50'
                }`}
              />
              {errors.date && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-amber-700" size={12} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-amber-900">Aviso importante</h4>
                  <p className="text-sm text-amber-800 mt-1">
                    Esta acción cerrará el registro mensual anterior como finalizado y creará un nuevo registro activo en proceso para la fecha seleccionada.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col-reverse sm:flex-row justify-end sm:items-center gap-3 mt-8 pt-6 border-t border-gray-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isPending}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || !isValid}
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Procesando cierre...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Confirmar Cierre Mensual</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateMonasteryExpense;
