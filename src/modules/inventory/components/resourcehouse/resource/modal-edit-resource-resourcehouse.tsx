import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2 } from 'lucide-react';
import { ResourceValidationSchema } from '../../../schemas/resourceValidation';
import { Resource, UpdateResourcePayload } from '../../../types/resource';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import z from 'zod';

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

  useEffect(() => {
    if (recurso) {
      reset({
        name: recurso.name,
        unit_price: String(recurso.unit_price),
        type_unit: recurso.type_unit,
        total_cost: recurso.total_cost,
        supplier_id: recurso.supplier_id ?? null,
        observation: recurso.observation ?? '',
        purchase_date: recurso.purchase_date
          ? new Date(recurso.purchase_date).toISOString().split('T')[0]
          : '',
      });
    }
  }, [recurso, reset]);

  const onSubmit = async (data: ResourceFormData) => {
    if (!recurso.id) return;

    const payload: UpdateResourcePayload = {
      name: data.name,
      unit_price: data.unit_price,
      type_unit: data.type_unit,
      total_cost: Number(data.total_cost),
      supplier_id: data.supplier_id || null,
      observation: data.observation || null,
      purchase_date: data.purchase_date,
    };

    await onUpdate(recurso.id, payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative dark:bg-gray-800">
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex items-center justify-between">
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
          <div>
            <Label htmlFor="edit-name" className="block text-sm font-medium mb-1 dark:text-gray-300">
              Nombre*
            </Label>
            <Input
              id="edit-name"
              {...register('name')}
              className="h-10 mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="edit-unit_price" className="block text-sm font-medium mb-1 dark:text-gray-300">
                Precio Unitario*
              </Label>
              <Input
                id="edit-unit_price"
                type="text"
                {...register('unit_price')}
                className="h-10 mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {errors.unit_price && <p className="text-sm text-red-500 mt-1">{errors.unit_price.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-type_unit" className="block text-sm font-medium mb-1 dark:text-gray-300">
                Unidad*
              </Label>
              <select
                id="edit-type_unit"
                {...register('type_unit')}
                className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
              <Label htmlFor="edit-total_cost" className="block text-sm font-medium mb-1 dark:text-gray-300">
                Costo Total*
              </Label>
              <Input
                id="edit-total_cost"
                type="number"
                step="0.01"
                {...register('total_cost', { valueAsNumber: true })}
                className="h-10 mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {errors.total_cost && <p className="text-sm text-red-500 mt-1">{errors.total_cost.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="edit-supplier_id" className="block text-sm font-medium mb-1 dark:text-gray-300">
              Proveedor
            </Label>
            <Input
              id="edit-supplier_id"
              {...register('supplier_id')}
              className="h-10 mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ID del proveedor (temporal)"
            />
            {errors.supplier_id && <p className="text-sm text-red-500 mt-1">{errors.supplier_id.message}</p>}
          </div>

          <div>
            <Label htmlFor="edit-purchase_date" className="block text-sm font-medium mb-1 dark:text-gray-300">
              Fecha de Compra*
            </Label>
            <Input
              id="edit-purchase_date"
              type="date"
              {...register('purchase_date')}
              className="h-10 mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errors.purchase_date && <p className="text-sm text-red-500 mt-1">{errors.purchase_date.message}</p>}
          </div>

          <div>
            <Label htmlFor="edit-observation" className="block text-sm font-medium mb-1 dark:text-gray-300">
              Observación
            </Label>
            <textarea
              id="edit-observation"
              {...register('observation')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows={3}
            />
            {errors.observation && <p className="text-sm text-red-500 mt-1">{errors.observation.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isUpdating}
              className="dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isUpdating}
              className="bg-red-800 hover:bg-red-700 text-white disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
            >
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