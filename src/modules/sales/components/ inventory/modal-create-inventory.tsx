/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React from 'react'; // Eliminado useEffect ya que reset se maneja en onSuccess
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { FiPackage } from 'react-icons/fi';

// 1. IMPORTAR HOOKS DE OTROS MÓDULOS
import { useFetchProducts } from '@/modules/production/hook/useProducts'; // Asegúrate que esta ruta es correcta
import { useFetchStores } from '@/modules/sales/hooks/useStore';         // Hook corregido para obtener tiendas

// Importaciones del módulo actual
import { useCreateWarehouseStoreItem } from '../../hooks/useInventoryQueries';
import { createWarehouseStoreSchema, CreateWarehouseStoreFormData } from '../../schemas/inventory.schema';

// Importar validaciones de tienda
import { getEnabledStores } from '../../utils/store-validation';

interface Props { isOpen: boolean; onClose: () => void; }

const ModalCreateInventory: React.FC<Props> = ({ isOpen, onClose }) => {
  // 2. OBTENER DATOS PARA LOS DESPLEGABLES
  const { data: products = [], isLoading: isLoadingProducts } = useFetchProducts();
  // Obtener tiendas (paginación si es necesario)
  const { data: storesResponse, isLoading: isLoadingStores } = useFetchStores(1, 100);
  const stores = storesResponse?.stores || [];
  
  // 3. FILTRAR SOLO TIENDAS HABILITADAS
  const enabledStores = getEnabledStores(stores);
  const hasValidStores = enabledStores.length > 0;
  
  const { mutate: createItem, isPending, error: mutationError } = useCreateWarehouseStoreItem();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateWarehouseStoreFormData>({
    resolver: zodResolver(createWarehouseStoreSchema),
  });

  const onSubmit = (data: CreateWarehouseStoreFormData) => {
    createItem(data, {
      onSuccess: () => {
        reset(); // Limpia el formulario
        onClose(); // Cierra el modal
      },
    });
  };

  if (!isOpen) return null;

  const areDependenciesLoading = isLoadingProducts || isLoadingStores;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-2">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiPackage size={24} />
          <h2 className="text-xl font-semibold text-center">Añadir Stock al Inventario</h2>
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 text-left">
          {mutationError && <p className="text-sm text-red-600 font-medium">Error al crear: {mutationError.message}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Producto <span className="text-red-600">*</span></label>
              <select
                {...register('productId')}
                className={`w-full border ${errors.productId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none`}
                disabled={areDependenciesLoading}
              >
                <option value="">{isLoadingProducts ? 'Cargando productos...' : 'Seleccione un producto'}</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {errors.productId && <p className="text-sm text-red-600 mt-1">{errors.productId.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Tienda <span className="text-red-600">*</span></label>
              <select
                {...register('storeId')}
                className={`w-full border ${errors.storeId ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none`}
                disabled={areDependenciesLoading}
              >
                <option value="">{isLoadingStores ? 'Cargando tiendas...' : 'Seleccione una tienda'}</option>
                {enabledStores.length === 0 && !isLoadingStores && (
                  <option value="" disabled>No hay tiendas disponibles</option>
                )}
                {enabledStores.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.store_name}
                  </option>
                ))}
              </select>
              {errors.storeId && <p className="text-sm text-red-600 mt-1">{errors.storeId.message}</p>}
              {enabledStores.length === 0 && !isLoadingStores && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 text-sm">
                    ⚠️ <strong>No hay tiendas disponibles.</strong> Debes crear al menos una tienda antes de poder agregar inventario.
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cantidad <span className="text-red-600">*</span></label>
              <input
                type="number"
                {...register('quantity')}
                className={`w-full border ${errors.quantity ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none`}
                placeholder="Cantidad en stock"
              />
              {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending || areDependenciesLoading}
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2 disabled:bg-gray-400"
            >
              {isPending ? 'Guardando...' : <><Save size={18} /> Guardar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ModalCreateInventory;