import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2 } from 'lucide-react';
import { ResourceValidationSchema } from '../../../schemas/resourceValidation';
import { Resource, UpdateResourcePayload } from '../../../types/resource';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useFetchSuppliers } from '@/modules/inventory/hook/useSuppliers';
import { z } from 'zod';

type ModalEditResourceProps = {
  isOpen: boolean;
  recurso: Resource;
  onClose: () => void;
  onUpdate: (id: string, payload: UpdateResourcePayload) => Promise<void>;
  isUpdating: boolean;
};

type ResourceFormData = z.infer<typeof ResourceValidationSchema>;

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
    resolver: zodResolver(ResourceValidationSchema),
  });

  const { data: suppliers, isLoading: isLoadingSuppliers, error: errorSuppliers } = useFetchSuppliers();

  useEffect(() => {
    if (recurso) {
      reset({
        name: recurso.name,
        warehouse_id: recurso.warehouse_id,
        resource_id: recurso.resource_id,
        type_unit: recurso.type_unit,
        unit_price: recurso.unit_price,
        total_cost: recurso.total_cost,
        supplier_id: recurso.supplier_id ?? '',
        quantity: recurso.quantity,
        entry_date: recurso.entry_date
          ? new Date(recurso.entry_date).toISOString().split('T')[0]
          : '',
        observation: recurso.observation ?? '',
      });
    }
  }, [recurso, reset]);

  const onSubmit = async (data: any) => {
    if (!recurso.id) return;

    const payload = {
      name: data.name,
      warehouse_id: data.warehouse_id,
      resource_id: data.resource_id,
      type_unit: data.type_unit,
      unit_price: Number(data.unit_price),
      total_cost: Number(data.total_cost),
      supplier_id: data.supplier_id,
      quantity: Number(data.quantity),
      entry_date: data.entry_date,
      observation: data.observation,
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
          {/* Nombre */}
          <div>
            <Label htmlFor="edit-name" className="block text-sm font-medium mb-1">
              Nombre*
            </Label>
            <Input
              id="edit-name"
              {...register('name')}
              className="h-10 mt-1"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          {/* Grid de campos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-warehouse_id" className="block text-sm font-medium mb-1">Almacén*</Label>
              <Input id="edit-warehouse_id" {...register('warehouse_id')} className="h-10 mt-1" />
              {errors.warehouse_id && <p className="text-sm text-red-500 mt-1">{errors.warehouse_id.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-resource_id" className="block text-sm font-medium mb-1">ID Recurso*</Label>
              <Input id="edit-resource_id" {...register('resource_id')} className="h-10 mt-1" />
              {errors.resource_id && <p className="text-sm text-red-500 mt-1">{errors.resource_id.message}</p>}
            </div>

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

            <div>
              <Label htmlFor="edit-unit_price" className="block text-sm font-medium mb-1">Precio Unitario*</Label>
              <Input id="edit-unit_price" type="number" step="0.01" {...register('unit_price', { valueAsNumber: true })} className="h-10 mt-1" />
              {errors.unit_price && <p className="text-sm text-red-500 mt-1">{errors.unit_price.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-total_cost" className="block text-sm font-medium mb-1">Costo Total*</Label>
              <Input id="edit-total_cost" type="number" step="0.01" {...register('total_cost', { valueAsNumber: true })} className="h-10 mt-1" />
              {errors.total_cost && <p className="text-sm text-red-500 mt-1">{errors.total_cost.message}</p>}
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
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm sm:text-sm"
                  defaultValue=""
                >
                  <option value="">Seleccione un proveedor</option>
                  {suppliers?.map((s) => (
                    <option key={s.id} value={s.id}>{s.suplier_name}</option>
                  ))}
                </select>
              )}
              {errors.supplier_id && <p className="text-sm text-red-500 mt-1">{errors.supplier_id.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-quantity" className="block text-sm font-medium mb-1">Cantidad*</Label>
              <Input id="edit-quantity" type="number" {...register('quantity', { valueAsNumber: true })} className="h-10 mt-1" />
              {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-entry_date" className="block text-sm font-medium mb-1">Fecha de Entrada*</Label>
              <Input id="edit-entry_date" type="date" {...register('entry_date')} className="h-10 mt-1" />
              {errors.entry_date && <p className="text-sm text-red-500 mt-1">{errors.entry_date.message}</p>}
            </div>
          </div>

          {/* Observación */}
          <div>
            <Label htmlFor="edit-observation" className="block text-sm font-medium mb-1">Observación</Label>
            <textarea
              id="edit-observation"
              {...register('observation')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"
              rows={3}
            />
            {errors.observation && <p className="text-sm text-red-500 mt-1">{errors.observation.message}</p>}
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