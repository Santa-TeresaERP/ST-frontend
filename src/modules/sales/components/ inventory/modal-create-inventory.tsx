'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save } from 'lucide-react';
import { FiPackage } from 'react-icons/fi';
<<<<<<< Updated upstream

// 1. IMPORTAR HOOKS DE OTROS MÓDULOS
import { useFetchProducts } from '@/modules/production/hook/useProducts'; // Asegúrate que esta ruta es correcta
import { useFetchStores } from '@/modules/stores/hook/useStores';         // Asegúrate que esta ruta es correcta

// Importaciones del módulo actual
=======
import { useFetchProducts } from '@/modules/production/hook/useProducts';
>>>>>>> Stashed changes
import { useCreateWarehouseStoreItem } from '../../hooks/useInventoryQueries';
import { createWarehouseStoreSchema, CreateWarehouseStoreFormData } from '../../schemas/inventory.schema';

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  selectedStoreId?: string;
}

const ModalCreateInventory: React.FC<Props> = ({ isOpen, onClose, selectedStoreId }) => {
  const { data: products = [], isLoading: isLoadingProducts } = useFetchProducts();
<<<<<<< Updated upstream
  const { data: stores = [], isLoading: isLoadingStores } = useFetchStores();
  
=======
>>>>>>> Stashed changes
  const { mutate: createItem, isPending, error: mutationError } = useCreateWarehouseStoreItem();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateWarehouseStoreFormData>({
    resolver: zodResolver(createWarehouseStoreSchema),
  });

  const onSubmit = (data: CreateWarehouseStoreFormData) => {
    if (!selectedStoreId) return; // Seguridad extra
    const payload = { ...data, storeId: selectedStoreId };
    createItem(payload, { onSuccess: () => { reset(); onClose(); } });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-2">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiPackage size={24} />
          <h2 className="text-xl font-semibold text-center">Añadir Stock al Inventario</h2>
          <button onClick={onClose} className="absolute right-4 top-1/2 -translate-y-1/2"><X size={22} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 text-left">
          {mutationError && <p className="text-sm text-red-600 font-medium">Error: {mutationError.message}</p>}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Producto <span className="text-red-600">*</span></label>
              <select {...register('productId')} className={`w-full border rounded-lg px-4 py-2`} disabled={isLoadingProducts}>
                <option value="">{isLoadingProducts ? 'Cargando...' : 'Seleccione un producto'}</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {errors.productId && <p className="text-sm text-red-600 mt-1">{errors.productId.message}</p>}
            </div>
            
            {/* El desplegable de Tienda ya no está aquí */}
            
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cantidad <span className="text-red-600">*</span></label>
              <input type="number" {...register('quantity')} className={`w-full border rounded-lg px-4 py-2`} placeholder="Cantidad en stock" />
              {errors.quantity && <p className="text-sm text-red-600 mt-1">{errors.quantity.message}</p>}
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200">Cancelar</button>
            <button type="submit" disabled={isPending || isLoadingProducts} className="px-4 py-2 bg-red-800 text-white rounded-lg gap-2 flex items-center">
              {isPending ? 'Guardando...' : <><Save size={18} /> Guardar</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ModalCreateInventory;