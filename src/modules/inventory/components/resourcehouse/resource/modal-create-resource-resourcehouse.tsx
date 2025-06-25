import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Save, Loader2 } from 'lucide-react';
import { CreateResourcePayload } from '../../../types/resource';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';

// validaciones
const ResourceValidationSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio'),
  unit_price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El precio debe ser un número mayor que 0',
    }),
  type_unit: z.string().min(1, 'La unidad es obligatoria'),
  total_cost: z
    .number({ invalid_type_error: 'El costo total debe ser un número' })
    .nonnegative('El costo total no puede ser negativo'),
  supplier_id: z.string().nullable().optional(),
  observation: z.string().optional(),
  purchase_date: z.string().min(1, 'La fecha de compra es obligatoria'),
});

type ResourceFormData = z.infer<typeof ResourceValidationSchema>;

type ModalNuevoRecursoProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateResourcePayload) => Promise<void>;
  isCreating: boolean;
};

const ModalNuevoRecurso: React.FC<ModalNuevoRecursoProps> = ({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}) => {
  const [serverError, setServerError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResourceFormData>({
    resolver: zodResolver(ResourceValidationSchema),
    defaultValues: {
      name: '',
      unit_price: '',
      type_unit: '',
      total_cost: undefined,
      supplier_id: null,
      observation: '',
      purchase_date: '',
    },
  });

  const onSubmit = async (data: ResourceFormData) => {
    const payload: CreateResourcePayload = {
      ...data,
      unit_price: data.unit_price,
      total_cost: Number(data.total_cost),
      supplier_id: data.supplier_id || null,
      observation: data.observation || null,
    };

    try {
      await onCreate(payload);
      reset();
      setServerError(null);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Error inesperado al crear el recurso. Verifica los datos.';
      setServerError(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative dark:bg-gray-800">
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-semibold">Nuevo Recurso</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={isCreating}
            className="text-white hover:text-gray-200 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4 text-left">
          {serverError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm border border-red-300">
              {serverError}
            </div>
          )}

          <div>
            <Label htmlFor="name" className="dark:text-gray-300">Nombre*</Label>
            <Input
              id="name"
              {...register('name')}
              className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Nombre del recurso"
              autoFocus
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="unit_price" className="dark:text-gray-300">Precio Unitario*</Label>
              <Input
                id="unit_price"
                type="text"
                {...register('unit_price')}
                className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="0.00"
              />
              {errors.unit_price && <p className="text-sm text-red-500 mt-1">{errors.unit_price.message}</p>}
            </div>
            <div>
              <Label htmlFor="type_unit" className="dark:text-gray-300">Unidad*</Label>
              <Input
                id="type_unit"
                {...register('type_unit')}
                className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="Ej: kg, unidad, hora"
              />
              {errors.type_unit && <p className="text-sm text-red-500 mt-1">{errors.type_unit.message}</p>}
            </div>
            <div>
              <Label htmlFor="total_cost" className="dark:text-gray-300">Costo Total*</Label>
              <Input
                id="total_cost"
                type="number"
                step="0.01"
                {...register('total_cost', { valueAsNumber: true })}
                className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                placeholder="0.00"
              />
              {errors.total_cost && <p className="text-sm text-red-500 mt-1">{errors.total_cost.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="supplier_id" className="dark:text-gray-300">Proveedor</Label>
            <Input
              id="supplier_id"
              {...register('supplier_id')}
              className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ID del proveedor (opcional)"
            />
            {errors.supplier_id && <p className="text-sm text-red-500 mt-1">{errors.supplier_id.message}</p>}
          </div>

          <div>
            <Label htmlFor="purchase_date" className="dark:text-gray-300">Fecha de Compra*</Label>
            <Input
              id="purchase_date"
              type="date"
              {...register('purchase_date')}
              className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errors.purchase_date && <p className="text-sm text-red-500 mt-1">{errors.purchase_date.message}</p>}
          </div>

          <div>
            <Label htmlFor="observation" className="dark:text-gray-300">Observación</Label>
            <textarea
              id="observation"
              {...register('observation')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="Añadir observación (opcional)"
              rows={3}
            />
            {errors.observation && <p className="text-sm text-red-500 mt-1">{errors.observation.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isCreating}
              className="dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-red-800 hover:bg-red-700 text-white disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" /> Guardar
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalNuevoRecurso;
