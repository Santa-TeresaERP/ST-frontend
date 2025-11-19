// src/modules/inventory/components/buys-product/modal-edit-buys-product.tsx

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, AlertCircle } from 'lucide-react';
// ==========================================================
// CORRECCIÓN DE RUTAS DE IMPORTACIÓN
// ==========================================================
import { useUpdateBuysProduct } from '../../../hook/useBuysProducts';
import { useFetchWarehouses } from '../../../hook/useWarehouses';
import { useFetchProducts } from '../../../hook/useProducts';
import { useFetchSuppliers } from '../../../hook/useSuppliers';
import { updateBuysProductSchema, UpdateBuysProductFormData } from '../../../schemas/buysProduct.schema';
import type { BuysProductWithRelations } from '../../../types/buysProduct.d';

type ModalEditBuysProductProps = {
  buysProduct: BuysProductWithRelations;
  onClose: () => void;
};

const ModalEditBuysProduct: React.FC<ModalEditBuysProductProps> = ({ buysProduct, onClose }) => {
  const { mutate, isPending, isError, error } = useUpdateBuysProduct();
  const { data: warehouses, isLoading: loadingWarehouses } = useFetchWarehouses();
  const { data: products, isLoading: loadingProducts } = useFetchProducts();
  const { data: suppliers, isLoading: loadingSuppliers } = useFetchSuppliers();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UpdateBuysProductFormData>({
    resolver: zodResolver(updateBuysProductSchema),
  });

  // Poblar el formulario con los datos iniciales
  useEffect(() => {
    if (buysProduct) {
      reset({
        ...buysProduct,
        quantity: Number(buysProduct.quantity),
        unit_price: Number(buysProduct.unit_price),
        entry_date: new Date(buysProduct.entry_date).toISOString().split('T')[0],
      });
    }
  }, [buysProduct, reset]);

  const quantity = watch('quantity');
  const unit_price = watch('unit_price');
  const total_cost = (Number(quantity) || 0) * (Number(unit_price) || 0);

  const onSubmit: SubmitHandler<UpdateBuysProductFormData> = (formData) => {
  
   if (!buysProduct?.id) {
      console.error("No se puede actualizar: el ID del producto es indefinido.");
      return;
    }

    mutate(
      { id: buysProduct.id, payload: { ...formData, total_cost } },
      { onSuccess: onClose }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-t-2xl flex items-center justify-center sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-center">Editar Compra de Producto</h2>
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-left">
          {isError && (
             <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-sm text-red-600 font-medium">{(error as any)?.message || 'Error al actualizar la compra'}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Almacén<span className="text-red-500">*</span></label>
              <select {...register('warehouse_id')} className="w-full border border-gray-300 rounded-lg px-4 py-2" disabled={loadingWarehouses}>
                <option value="">Seleccione un almacén</option>
                {warehouses?.filter(w => w.status).map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              {errors.warehouse_id && <p className="text-red-600 text-sm mt-1">{errors.warehouse_id.message}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Producto<span className="text-red-500">*</span></label>
              <select {...register('product_id')} className="w-full border border-gray-300 rounded-lg px-4 py-2" disabled={loadingProducts}>
                <option value="">Seleccione un producto</option>
                {products?.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {errors.product_id && <p className="text-red-600 text-sm mt-1">{errors.product_id.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">Proveedor<span className="text-red-500">*</span></label>
              <select {...register('supplier_id')} className="w-full border border-gray-300 rounded-lg px-4 py-2" disabled={loadingSuppliers}>
                <option value="">Seleccione un proveedor</option>
                {suppliers?.filter(s => s.status).map((s) => <option key={s.id} value={s.id}>{s.suplier_name}</option>)}
              </select>
              {errors.supplier_id && <p className="text-red-600 text-sm mt-1">{errors.supplier_id.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cantidad<span className="text-red-500">*</span></label>
              <input type="number" min="0.01" step="1" {...register('quantity')} className="w-full border border-gray-300 rounded-lg px-4 py-2"/>
              {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Precio Unitario<span className="text-red-500">*</span></label>
              <input type="number" min="0.01" step="0.01" {...register('unit_price')} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              {errors.unit_price && <p className="text-red-600 text-sm mt-1">{errors.unit_price.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Costo Total (Calculado)</label>
              <div className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 text-gray-900 font-bold">
                S/. {total_cost.toFixed(2)}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Fecha de Entrada<span className="text-red-500">*</span></label>
              <input type="date" {...register('entry_date')} max={new Date().toISOString().split('T')[0]} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              {errors.entry_date && <p className="text-red-600 text-sm mt-1">{errors.entry_date.message}</p>}
            </div>
            
            <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('status')} className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"/>
                    <span className="text-gray-700 font-medium">Activo</span>
                </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition">Cancelar</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition flex items-center justify-center space-x-2 disabled:opacity-50">
              <Save size={18} />
              <span>{isPending ? 'Actualizando...' : 'Actualizar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditBuysProduct;