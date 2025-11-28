import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, AlertCircle } from 'lucide-react';
import { useCreateBuysProduct } from '../../../hook/useBuysProducts';
import { useFetchSuppliers } from '../../../hook/useSuppliers';
import { BuysProductResponse } from '@/modules/inventory/types/buysProduct';
import { createBuysProductSchema, CreateBuysProductFormData } from '../../../schemas/buysProduct.schema'; // <-- Importar el schema

// IDs MOCK (simulando que son constantes o vienen de otro lado)
const MOCK_WAREHOUSE_ID = '91234567-89ab-cdef-0123-456789abcdef';

const MOCK_PRODUCT_ID = '01234567-89ab-cdef-0123-456789abcde0';

type ModalCreateBuysProductProps = {
  onClose: () => void;
};

const ModalCreateBuysProduct: React.FC<ModalCreateBuysProductProps> = ({ onClose }) => {
  const { mutate, isPending, isSuccess, isError, error, data: responseData } = useCreateBuysProduct();
  const { data: suppliers, isLoading: loadingSuppliers } = useFetchSuppliers();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateBuysProductFormData>({
    resolver: zodResolver(createBuysProductSchema),
    defaultValues: {
      entry_date: new Date().toISOString().split('T')[0],
    }
  });

  // Observar 'quantity' y 'unit_price' para calcular el total
  const quantity = watch('quantity');
  const unit_price = watch('unit_price');
  const total_cost = (Number(quantity) || 0) * (Number(unit_price) || 0);

  // La función onSubmit ahora es mucho más simple
  const onSubmit: SubmitHandler<CreateBuysProductFormData> = (formData) => {
    mutate(
      {
        ...formData,
        total_cost,
        warehouse_id: MOCK_WAREHOUSE_ID, // Añadimos los IDs MOCK aquí
        product_id: MOCK_PRODUCT_ID,
      },
      {
        onSuccess: (
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          _data: BuysProductResponse) => {
          setTimeout(() => {
            reset();
            onClose();
          }, 1800);
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold">Registrar Compra</h2>
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {isError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="text-red-600" size={18} />
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <p className="text-sm text-red-600">{(error as any)?.response?.data?.error || 'Error al registrar la compra'}</p>
            </div>
          )}
          {isSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{responseData?.message || 'Compra registrada exitosamente'}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">Nombre de la compra<span className="text-red-500">*</span></label>
              <input type="text" {...register('name')} placeholder="Ej: Compra de arroz" className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">Proveedor<span className="text-red-500">*</span></label>
              <select {...register('supplier_id')} className="w-full border border-gray-300 rounded-lg px-4 py-2" disabled={loadingSuppliers}>
                <option value="">Seleccione un proveedor</option>
                {suppliers?.filter(s => s.status).map((s) => <option key={s.id} value={s.id}>{s.suplier_name}</option>)}
              </select>
              {errors.supplier_id && <p className="text-red-600 text-sm mt-1">{errors.supplier_id.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">Categoría<span className="text-red-500">*</span></label>
              <input type="text" {...register('category')} placeholder="Ej: Alimentos, Limpieza..." className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cantidad<span className="text-red-500">*</span></label>
              <input type="number" min={1} {...register('quantity')} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Ej: 10" />
              {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Precio Unitario<span className="text-red-500">*</span></label>
              <input type="number" min={0.01} step={0.01} {...register('unit_price')} className="w-full border border-gray-300 rounded-lg px-4 py-2" placeholder="Ej: 12.50" />
              {errors.unit_price && <p className="text-red-600 text-sm mt-1">{errors.unit_price.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">Total (calculado)</label>
              <div className="w-full border border-gray-300 bg-gray-50 rounded-lg px-4 py-2 font-bold text-gray-900">S/. {total_cost.toFixed(2)}</div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-1 font-medium">Fecha de Compra<span className="text-red-500">*</span></label>
              <input type="date" {...register('entry_date')} max={new Date().toISOString().split('T')[0]} className="w-full border border-gray-300 rounded-lg px-4 py-2" />
              {errors.entry_date && <p className="text-red-600 text-sm mt-1">{errors.entry_date.message}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700">Cancelar</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2 disabled:opacity-50">
              <Save size={18} />
              <span>{isPending ? 'Guardando...' : 'Guardar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateBuysProduct;