// src/modules/sales/components/inventory/modal-edit-inventory.tsx
'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { FiPackage } from 'react-icons/fi';

import { useUpdateInventoryProduct } from '../../hooks/useInventoryQueries';
import { inventoryFormSchema, InventoryFormData } from '../../schemas/inventory.schema';
import { InventoryItem } from '../../types/inventory.types';

interface ModalEditProductProps {
  isOpen: boolean;
  onClose: () => void;
  currentProduct: InventoryItem | null;
}

const ModalEditProduct: React.FC<ModalEditProductProps> = ({ isOpen, onClose, currentProduct }) => {
  const { mutate: updateProduct, isPending, error: mutationError } = useUpdateInventoryProduct();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<InventoryFormData>({
    resolver: zodResolver(inventoryFormSchema),
  });
  
  useEffect(() => {
    if (currentProduct && isOpen) {
      // 'reset' rellena todo el formulario con los datos del producto,
      // incluyendo la fecha si los nombres de los campos coinciden.
      reset(currentProduct);
    }
  }, [currentProduct, isOpen, reset]);

  const onSubmit = (data: InventoryFormData) => {
    if (!currentProduct) return;

    updateProduct({ id: currentProduct.id, payload: data }, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-2">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiPackage size={24} />
          <h2 className="text-xl font-semibold text-center">Editar Producto</h2>
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 text-left">
          {mutationError && <p className="text-sm text-red-600 font-medium">Error al actualizar: {mutationError.message}</p>}
          
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Producto <span className="text-red-600">*</span></label>
              <input
                type="text"
                {...register('producto')}
                className={`w-full border ${errors.producto ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none`}
              />
              {errors.producto && <p className="text-sm text-red-600 mt-1">{errors.producto.message}</p>}
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cantidad <span className="text-red-600">*</span></label>
              <input
                type="number"
                {...register('cantidad')}
                className={`w-full border ${errors.cantidad ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none`}
              />
              {errors.cantidad && <p className="text-sm text-red-600 mt-1">{errors.cantidad.message}</p>}
            </div>
            
            {/* --- CAMPO DE FECHA AÑADIDO --- */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Fecha <span className="text-red-600">*</span></label>
              <input
                type="date"
                {...register('fecha')}
                className={`w-full border ${errors.fecha ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none`}
              />
              {errors.fecha && <p className="text-sm text-red-600 mt-1">{errors.fecha.message}</p>}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:bg-gray-400"
            >
              {isPending ? 'Guardando...' : <><Save size={18} /> Guardar Cambios</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditProduct;