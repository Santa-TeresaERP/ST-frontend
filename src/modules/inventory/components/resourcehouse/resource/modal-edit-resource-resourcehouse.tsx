import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2 } from 'lucide-react';
import { BuysResourceEditValidationSchema, BuysResourceEditFormData } from '../../../schemas/buysResourceValidation';
import { BuysResourceWithResource, UpdateBuysResourcePayload } from '../../../types/buysResource';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useFetchSuppliers } from '@/modules/inventory/hook/useSuppliers';

type ModalEditResourceProps = {
  isOpen: boolean;
  recurso: BuysResourceWithResource;
  onClose: () => void;
  onUpdate: (id: string, payload: UpdateBuysResourcePayload) => Promise<void>;
  isUpdating: boolean;
};

type ResourceFormData = BuysResourceEditFormData;

const ModalEditResource: React.FC<ModalEditResourceProps> = ({
  isOpen,
  recurso,
  onClose,
  onUpdate,
  isUpdating,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResourceFormData>({
    resolver: zodResolver(BuysResourceEditValidationSchema),
  });

  const { data: suppliers, isLoading: isLoadingSuppliers, error: errorSuppliers } = useFetchSuppliers();

  useEffect(() => {
    if (recurso) {
      reset({
        type_unit: recurso.type_unit || '',
        supplier_id: recurso.supplier_id || '',
        quantity: recurso.quantity || 0,
        entry_date: recurso.entry_date
          ? new Date(recurso.entry_date).toISOString().split('T')[0]
          : '',
        // Campos inmutables como hidden inputs
        warehouse_id: recurso.warehouse_id || '',
        resource_id: recurso.resource_id || '',
        unit_price: recurso.unit_price || 0,
        total_cost: recurso.total_cost || 0,
      });
    }
  }, [recurso, reset]);

  const onSubmit = async (data: ResourceFormData) => {
    if (!recurso.id) return;

    const payload: UpdateBuysResourcePayload = {
      type_unit: data.type_unit,
      supplier_id: data.supplier_id,
      quantity: data.quantity,
      entry_date: new Date(data.entry_date),
      // Los campos inmutables mantienen sus valores originales
      warehouse_id: recurso.warehouse_id,
      resource_id: recurso.resource_id,
      unit_price: recurso.unit_price,
      total_cost: recurso.total_cost,
    };

    await onUpdate(recurso.id, payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 z-10 bg-red-800 text-white p-5 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-semibold">Editar Recurso</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isUpdating}
            className="text-white hover:text-gray-200 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-left">
          {/* Información inmutable */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Información del Recurso (No editable)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* warehouse_id - Solo lectura */}
              <div>
                <Label htmlFor="edit-warehouse_id" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Almacén
                </Label>
                <div className="h-10 mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                  {recurso.warehouse?.name || 'N/A'}
                </div>
                <input type="hidden" {...register('warehouse_id')} />
              </div>

              {/* resource_id - Solo lectura */}
              <div>
                <Label htmlFor="edit-resource_id" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Recurso
                </Label>
                <div className="h-10 mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                  {recurso.resource?.name || 'N/A'}
                </div>
                <input type="hidden" {...register('resource_id')} />
              </div>

              {/* unit_price - Solo lectura */}
              <div>
                <Label htmlFor="edit-unit_price" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Precio Unitario
                </Label>
                <div className="h-10 mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                  S/ {recurso.unit_price?.toFixed(2) || '0.00'}
                </div>
                <input type="hidden" {...register('unit_price')} />
              </div>

              {/* total_cost - Solo lectura */}
              <div>
                <Label htmlFor="edit-total_cost" className="block text-sm font-medium mb-1 dark:text-gray-300">
                  Costo Total
                </Label>
                <div className="h-10 mt-1 px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                  S/ {recurso.total_cost?.toFixed(2) || '0.00'}
                </div>
                <input type="hidden" {...register('total_cost')} />
              </div>
            </div>
          </div>

          {/* Campos editables */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Información Editable</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <Label htmlFor="edit-type_unit" className="block text-sm font-medium mb-1">Unidad*</Label>
              <select
                id="edit-type_unit"
                {...register('type_unit')}
                className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              >
                <option value="">Selecciona una unidad</option>
                <option value="Unidades">Unidades</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
              </select>
              {errors.type_unit && <p className="text-sm text-red-500 mt-1">{errors.type_unit.message}</p>}
            </div>

            {/* quantity */}
            <div>
              <Label htmlFor="edit-quantity" className="block text-sm font-medium mb-1 dark:text-gray-300">
                Cantidad*
              </Label>
              <Input
                id="edit-quantity"
                type="number"
                step="0.01"
                {...register('quantity', { valueAsNumber: true })}
                className="h-10 mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-supplier_id">Proveedor*</Label>
              {isLoadingSuppliers ? (
                <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
              ) : errorSuppliers ? (
                <p className="text-red-500 text-sm">Error al cargar proveedores</p>
              ) : (
                <select
                  id="edit-supplier_id"
                  {...register('supplier_id')}
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
                >
                  <option value="">Seleccione un proveedor</option>
                  {suppliers?.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.suplier_name}
                    </option>
                  ))}
                </select>
              )}
              {errors.supplier_id && <p className="text-sm text-red-500 mt-1">{errors.supplier_id.message}</p>}
            </div>

            {/* entry_date */}
            <div>
              <Label htmlFor="edit-entry_date" className="block text-sm font-medium mb-1">Fecha de Entrada*</Label>
              <Input id="edit-entry_date" type="date" {...register('entry_date')} className="h-10 mt-1" />
              {errors.entry_date && <p className="text-sm text-red-500 mt-1">{errors.entry_date.message}</p>}
            </div>
          </div>
        </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isUpdating}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isUpdating} className="bg-red-800 hover:bg-red-700 text-white disabled:opacity-50">
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" /> Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditResource;