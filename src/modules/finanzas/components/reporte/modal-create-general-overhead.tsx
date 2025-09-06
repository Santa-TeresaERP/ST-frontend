'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus, Save } from 'lucide-react';

// Importamos la lógica desde el módulo 'monastery' como planeamos
import { useCreateOverhead } from '@/modules/monastery/hooks/useOverheads';
import { generalOverheadFormsSchema, GeneralOverheadFormData } from '@/modules/monastery/schemas/overheads.schema';
import { useFetchModules } from '@/modules/modules/hook/useModules'; 


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ModalCreateGeneralOverhead: React.FC<Props> = ({ isOpen, onClose }) => {
  // Hook para la mutación de creación
  const { mutate: createOverhead, isPending } = useCreateOverhead();
  // Hook para obtener la lista de módulos para el dropdown
  const { data: modules = [], isLoading, isError } = useFetchModules();

  console.log("Estado de los Módulos:", { modules, isLoading, isError });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GeneralOverheadFormData>({
    resolver: zodResolver(generalOverheadFormsSchema),
  });

  const onSubmit: SubmitHandler<GeneralOverheadFormData> = (data) => {
    createOverhead(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
      onError: (error) => {
        console.error("Error al crear el gasto:", error);
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      {/* CAMBIO: Contenedor principal del modal con esquinas redondeadas */}
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        
        {/* ====================================================================== */}
        {/* CAMBIO: Encabezado del modal rediseñado */}
        {/* ====================================================================== */}
        <div className="flex justify-between items-center p-4 bg-red-800 text-white">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <UserPlus size={22} />
            Registrar Nuevo Gasto/Ingreso
          </h3>
          <button onClick={onClose} className="text-white opacity-70 hover:opacity-100 transition-opacity">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ====================================================================== */}
          {/* CAMBIO: Cuerpo del formulario con layout de dos columnas (Grid) */}
          {/* ====================================================================== */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            
            {/* Campo Nombre */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre<span className="text-red-500">*</span>
              </label>
              <input type="text" {...register('name')} id="name" placeholder="Nombre del gasto o ingreso" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Campo Módulo (Dropdown) */}
            <div>
              <label htmlFor="moduleName" className="block text-sm font-medium text-gray-700 mb-1">
                Módulo<span className="text-red-500">*</span>
              </label>
              <select {...register('moduleName')} id="moduleName" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                 <option value="">Seleccione un módulo</option>
                 {modules.map(module => (
                    <option key={module.id} value={module.name}>{module.name}</option>
                 ))}
              </select>
              {errors.moduleName && <p className="text-red-600 text-sm mt-1">{errors.moduleName.message}</p>}
            </div>

            {/* Campo Tipo (Dropdown) */}
            <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo<span className="text-red-500">*</span>
                </label>
                <select {...register('type')} id="type" className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Seleccione un tipo</option>
                    <option value="donativo">Donativo</option>
                    <option value="gasto mensual">Gasto Mensual</option>
                    <option value="otro ingreso">Otro Ingreso</option>
                    <option value="otro egreso">Otro Egreso</option>
                </select>
                {errors.type && <p className="text-red-600 text-sm mt-1">{errors.type.message}</p>}
            </div>

            {/* Campo Monto */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Monto (S/)<span className="text-red-500">*</span>
              </label>
              <input type="number" step="0.01" {...register('amount')} id="amount" placeholder="0.00" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              {errors.amount && <p className="text-red-600 text-sm mt-1">{errors.amount.message}</p>}
            </div>

            {/* Campo Fecha */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Fecha<span className="text-red-500">*</span>
              </label>
              <input type="date" {...register('date')} defaultValue={new Date().toISOString().split('T')[0]} id="date" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date.message}</p>}
            </div>

            {/* Campo Descripción (Ocupa dos columnas) */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea {...register('description')} id="description" rows={3} placeholder="Añada una descripción (opcional)..." className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
            </div>
          </div>
          
          {/* ====================================================================== */}
          {/* CAMBIO: Pie de página rediseñado con nuevos estilos de botones */}
          {/* ====================================================================== */}
          <div className="flex justify-end items-center p-4 bg-gray-50 border-t">
            <button type="button" onClick={onClose} disabled={isPending} className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md mr-3 font-semibold hover:bg-gray-300 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isPending} className="px-5 py-2 bg-red-800 text-white rounded-md font-semibold hover:bg-red-900 transition-colors flex items-center gap-2">
              <Save size={16} />
              {isPending ? 'Aceptando...' : 'Aceptar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateGeneralOverhead;