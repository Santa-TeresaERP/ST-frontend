'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Plus, DollarSign, Calendar, FileText, Tag, AlertCircle } from 'lucide-react';

import { useCreateMonasteryExpense } from '@/modules/monastery/hooks/useMonasteryExpense';
import { monasteryExpenseFormSchema } from '@/modules/monastery/schemas/monasteryexpense.schema';

type CreateMonasteryExpenseData = z.infer<typeof monasteryExpenseFormSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateMonasteryExpense: React.FC<Props> = ({ isOpen, onClose }) => {
  const { mutate: createMonasteryExpense, isPending } = useCreateMonasteryExpense();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid, isDirty },
  } = useForm<CreateMonasteryExpenseData>({
    resolver: zodResolver(monasteryExpenseFormSchema),
    mode: 'onChange',
    defaultValues: {
      Name: '',
      category: '',
      amount: undefined,
      descripción: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  const watchedAmount = watch('amount');

  const onSubmit: SubmitHandler<CreateMonasteryExpenseData> = (data) => {
    createMonasteryExpense(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error) => {
        console.error("Error al crear el gasto de monasterio:", error);
      },
    });
  };

  const handleClose = () => {
    if (!isPending) {
      reset();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-2 sm:p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full sm:max-w-2xl lg:max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all duration-300 scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 px-4 sm:px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Plus className="text-white" size={18} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg sm:text-xl font-bold text-white">Registrar Nuevo Gasto del Monasterio</h3>
                <p className="text-red-100 text-xs sm:text-sm">Agregar un nuevo gasto específico del monasterio</p>
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
            
            {/* Nombre del Gasto */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline mr-2" size={16} />
                Nombre del Gasto *
              </label>
              <input
                {...register('Name')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Ejemplo: Reparación de techo"
                disabled={isPending}
              />
              {errors.Name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.Name.message}
                </p>
              )}
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Tag className="inline mr-2" size={16} />
                Categoría *
              </label>
              <input
                {...register('category')}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                placeholder="Ejemplo: Mantenimiento, Suministros, etc."
                disabled={isPending}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <FileText className="inline mr-2" size={16} />
                Descripción *
              </label>
              <textarea
                {...register('descripción')}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe detalladamente el gasto del monasterio..."
                disabled={isPending}
              />
              {errors.descripción && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.descripción.message}
                </p>
              )}
            </div>

            {/* Fila para Monto y Fecha */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Monto */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="inline mr-2" size={16} />
                  Monto (S/.) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">S/</span>
                  <input
                    {...register('amount')}
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="999999.99"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="0.00"
                    disabled={isPending}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.amount.message}
                  </p>
                )}
                {watchedAmount && (
                  <p className="mt-1 text-sm text-green-600 font-medium">
                    Monto: S/ {Number(watchedAmount).toFixed(2)}
                  </p>
                )}
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Fecha del Gasto *
                </label>
                <input
                  {...register('date')}
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  disabled={isPending}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="bg-gray-50 mt-8 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-b-2xl">
            <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isPending}
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isPending || !isValid || !isDirty}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
              >
                {isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Plus size={18} />
                    <span>Crear Gasto</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Indicador de carga */}
        {isPending && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-red-400 rounded-full transform translate-x-1 -translate-y-1 animate-ping"></div>
        )}
      </div>
    </div>
  );
};

export default ModalCreateMonasteryExpense;