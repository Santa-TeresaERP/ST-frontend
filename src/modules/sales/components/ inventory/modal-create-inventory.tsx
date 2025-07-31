/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import React, { useEffect } from 'react'; // Eliminado useEffect ya que reset se maneja en onSuccess
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { FiPackage } from 'react-icons/fi';

// 1. IMPORTAR HOOKS DE OTROS MÓDULOS (versión limpia)
import { useFetchProducts } from '@/modules/production/hook/useProducts';
import { useFetchStores } from '@/modules/sales/hooks/useStore';

// Importaciones del módulo actual (versión limpia)
import { useCreateWarehouseStoreItem } from '../../hooks/useInventoryQueries';
import { createWarehouseStoreSchema, CreateWarehouseStoreFormData } from '../../schemas/inventory.schema';
import { useStoreState } from '@/core/store/store';

// Importar validaciones de tienda
import { getEnabledStores } from '../../utils/store-validation';

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  selectedStoreId?: string; // Mantenemos la prop opcional por si se reutiliza
}

const ModalCreateInventory: React.FC<Props> = ({ isOpen, onClose, selectedStoreId }) => {
  // 2. OBTENER DATOS PARA LOS DESPLEGABLES (versión resuelta)
  const { data: products = [], isLoading: isLoadingProducts } = useFetchProducts();
  // Obtener tiendas (paginación si es necesario)
  const { data: storesResponse, isLoading: isLoadingStores } = useFetchStores(1, 100);
  const stores = storesResponse?.stores || [];
  
  // 3. FILTRAR SOLO TIENDAS HABILITADAS
  const enabledStores = getEnabledStores(stores);
  const hasValidStores = enabledStores.length > 0;
  const { selectedStore } = useStoreState();
  
  const { mutate: createItem, isPending, error: mutationError } = useCreateWarehouseStoreItem();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateWarehouseStoreFormData>({
    resolver: zodResolver(createWarehouseStoreSchema),
    defaultValues: {
      productId: '',
      quantity: 0,
    },
  });

  const onSubmit = (data: CreateWarehouseStoreFormData) => {
    // Use selectedStore.id or selectedStoreId as fallback
    const storeId = selectedStore?.id || selectedStoreId;
    if (!storeId) {
      console.error('No store selected');
      return;
    }
    const payload = { ...data, storeId };
    createItem(payload, { onSuccess: () => { reset(); onClose(); } });
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
              <select {...register('productId')} className={`w-full border rounded-lg px-4 py-2`} disabled={isLoadingProducts}>
                <option value="">{isLoadingProducts ? 'Cargando...' : 'Seleccione un producto'}</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {errors.productId && <p className="text-sm text-red-600 mt-1">{errors.productId.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Tienda <span className="text-red-600">*</span></label>
              {selectedStore ? (
                <input
                  type="text"
                  value={selectedStore.store_name}
                  disabled
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
                />
              ) : (
                <div>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                    disabled={areDependenciesLoading}
                    value=""
                  >
                    <option value="">{isLoadingStores ? 'Cargando tiendas...' : 'Seleccione una tienda desde el panel principal'}</option>
                  </select>
                  <p className="text-amber-600 text-xs mt-1">
                    💡 Selecciona una tienda desde la vista principal para poder añadir inventario
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cantidad <span className="text-red-600">*</span></label>
              <input type="number" {...register('quantity')} className={`w-full border rounded-lg px-4 py-2`} placeholder="Cantidad en stock" />
              {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition">
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isPending || areDependenciesLoading || (!selectedStore && !selectedStoreId)} 
              className={`px-4 py-2 rounded-lg gap-2 flex items-center transition ${
                isPending || areDependenciesLoading || (!selectedStore && !selectedStoreId)
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-800 hover:bg-red-700 text-white'
              }`}
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