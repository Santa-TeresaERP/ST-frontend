'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, DollarSign, Calendar, FileText, Tag, AlertCircle } from 'lucide-react';

import { useCreateMonasterioOverhead } from '@/modules/monastery/hooks/useOverheads';
import { overheadFormSchema } from '@/modules/monastery/schemas/overheads.schema';

const createMonasteryExpenseSchema = overheadFormSchema.omit({ type: true });
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
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateMonasteryExpenseData>({
    resolver: zodResolver(createMonasteryExpenseSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      amount: undefined,
      description: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const watchedAmount = watch('amount');

  const onSubmit: SubmitHandler<CreateMonasteryExpenseData> = (data) => {
    createMonasteryOverhead(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error) => {
        console.error("Error al crear el gasto:", error);
      },
    });
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
                <h3 className="text-lg sm:text-xl font-bold text-white">Registrar Nuevo Gasto</h3>
                <p className="text-red-100 text-xs sm:text-sm">Agregar un nuevo gasto al monasterio</p>
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
            {/* Nombre */}
            <div className="group">
              <label htmlFor="name" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Tag className="mr-2 text-red-600" size={16} />
                Nombre del Gasto
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('name')}
                  id="name"
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 placeholder-gray-400 ${
                    errors.name
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-red-500 focus:bg-red-50'
                  }`}
                  placeholder="Ej: Compra de víveres..."
                />
                {errors.name && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.name && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Monto */}
            <div className="group">
              <label htmlFor="amount" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <DollarSign className="mr-2 text-red-600" size={16} />
                Monto
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-gray-500 font-medium">S/</span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  {...register('amount', { valueAsNumber: true })}
                  id="amount"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 placeholder-gray-400 ${
                    errors.amount
                      ? 'border-red-300 focus:border-red-500 bg-red-50'
                      : 'border-gray-200 focus:border-red-500 focus:bg-red-50'
                  }`}
                  placeholder="0.00"
                />
                {errors.amount && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {watchedAmount && !errors.amount && (
                <p className="text-green-600 text-sm mt-2 font-medium">
                  Monto: S/ {Number(watchedAmount).toFixed(2)}
                </p>
              )}
              {errors.amount && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.amount.message}
                </p>
              )}
            </div>

            {/* Fecha */}
            <div className="group">
              <label htmlFor="date" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="mr-2 text-red-600" size={16} />
                Fecha del Gasto
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

            {/* Descripción */}
            <div className="group">
              <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FileText className="mr-2 text-red-600" size={16} />
                Descripción
                <span className="text-gray-400 text-xs ml-2">(Opcional)</span>
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={3}
                className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 placeholder-gray-400 resize-none ${
                  errors.description
                    ? 'border-red-300 focus:border-red-500 bg-red-50'
                    : 'border-gray-200 focus:border-red-500 focus:bg-red-50'
                }`}
                placeholder="Describa los detalles del gasto..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="text-blue-600" size={12} />
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-blue-900">Información</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Este gasto será registrado automáticamente como un gasto del monasterio.
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
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Plus size={16} />
                  <span>Guardar Gasto</span>
                </>
              )}
            </button>
          </div>
        </form>

        {isDirty && !isPending && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-green-400 rounded-full transform translate-x-1 -translate-y-1 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default ModalCreateMonasteryExpense;
