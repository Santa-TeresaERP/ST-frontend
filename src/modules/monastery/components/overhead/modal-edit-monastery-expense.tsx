'use client';

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, DollarSign, Calendar, FileText, Tag, AlertCircle } from 'lucide-react';

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
    watch,
    formState: { errors, isDirty, isValid },
  } = useForm<UpdateOverheadFormData>({
    resolver: zodResolver(updateOverheadFormSchema),
    mode: 'onChange',
  });

  // 4. WATCH para valores en tiempo real
  const watchedAmount = watch('amount');

  // 5. EFECTO PARA POBLAR EL FORMULARIO CUANDO SE SELECCIONA UN GASTO
  useEffect(() => {
    if (overheadToEdit) {
      // Formateamos la fecha para que el input type="date" la acepte (YYYY-MM-DD)
      const formattedDate = new Date(overheadToEdit.date).toISOString().split('T')[0];
      reset({ 
        name: overheadToEdit.name,
        date: formattedDate,
        amount: Number(overheadToEdit.amount),
        description: overheadToEdit.description ?? undefined
      });
    }
  }, [overheadToEdit, reset]);

  // 6. MANEJADOR DEL ENVÍO DEL FORMULARIO
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

  // 7. MANEJADOR PARA CERRAR MODAL
  const handleClose = () => {
    if (!isPending) {
      reset();
      onClose();
    }
  };

  // 8. MANEJADOR PARA CLICK EN BACKDROP
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isPending) {
      handleClose();
    }
  };

  if (!isOpen || !overheadToEdit) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
        {/* Header con gradiente */}
        <div className="bg-gradient-to-r from-red-500 to-red-700 px-6 py-4 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FileText className="text-white" size={18} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Editar Gasto</h3>
                <p className="text-red-100 text-sm">Modificar información del gasto</p>
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

        {/* Contenido del formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="space-y-6">
            
            {/* Campo Nombre */}
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
                  placeholder="Ingrese el nombre del gasto"
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

            {/* Campo Monto */}
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

            {/* Campo Fecha */}
            <div className="group">
              <label htmlFor="date" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="mr-2 text-red-600" size={16} />
                Fecha del Gasto
              </label>
              <div className="relative">
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
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {errors.date && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.date.message}
                </p>
              )}
            </div>

            {/* Campo Descripción */}
            <div className="group">
              <label htmlFor="description" className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <FileText className="mr-2 text-red-600" size={16} />
                Descripción
                <span className="text-gray-400 text-xs ml-2">(Opcional)</span>
              </label>
              <div className="relative">
                <textarea 
                  {...register('description')} 
                  id="description" 
                  rows={4}
                  className={`w-full px-4 py-3 border-2 rounded-xl shadow-sm transition-all duration-200 focus:outline-none focus:ring-0 placeholder-gray-400 resize-none ${
                    errors.description 
                      ? 'border-red-300 focus:border-red-500 bg-red-50' 
                      : 'border-gray-200 focus:border-red-500 focus:bg-red-50'
                  }`}
                  placeholder="Ingrese una descripción detallada del gasto (opcional)"
                />
              </div>
              {errors.description && (
                <p className="text-red-600 text-sm mt-2 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex justify-end items-center gap-3 mt-8 pt-6 border-t border-gray-100">
            <button 
              type="button" 
              onClick={handleClose}
              disabled={isPending}
              className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isPending || !isDirty || !isValid}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
            >
              {isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Actualizar Gasto</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Indicador de cambios */}
        {isDirty && !isPending && (
          <div className="absolute top-0 right-0 w-3 h-3 bg-yellow-400 rounded-full transform translate-x-1 -translate-y-1 animate-pulse"></div>
        )}
      </div>
    </div>
  );
};

export default ModalEditMonasteryExpense;