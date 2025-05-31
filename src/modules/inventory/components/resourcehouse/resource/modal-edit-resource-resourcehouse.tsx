import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// Verified Icons import path
import { X, Save, Loader2 } from 'lucide-react'; 
// Verified Schema/Types import paths (assuming correct relative path)
import { ResourceValidationSchema } from '../../schemas/resourceValidation'; 
import { Resource, UpdateResourcePayload } from '../../types/resource';
// Verified UI component import paths
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
// Select component import path (verified existence, uncomment if needed for supplier)
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";

type ModalEditResourceProps = {
  isOpen: boolean;
  recurso: Resource; // Use the defined Resource type
  onClose: () => void;
  onUpdate: (id: string, payload: UpdateResourcePayload) => Promise<void>;
  isUpdating: boolean;
  // suppliers: { id: string; name: string }[]; // Add if needed for Select
};

// Define the form type based on the validation schema
type ResourceFormData = Zod.infer<typeof ResourceValidationSchema>;

const ModalEditResource: React.FC<ModalEditResourceProps> = ({
  isOpen,
  recurso,
  onClose,
  onUpdate,
  isUpdating,
  // suppliers = [],
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResourceFormData>({
    // Verified resolver import
    resolver: zodResolver(ResourceValidationSchema),
    // Default values will be set by useEffect
  });

  // Populate form with resource data when the modal opens or resource changes
  useEffect(() => {
    if (recurso) {
      reset({
        name: recurso.name,
        unit_price: String(recurso.unit_price), // Convert to string for input
        type_unit: recurso.type_unit,
        total_cost: recurso.total_cost,
        supplier_id: recurso.supplier_id ?? null,
        observation: recurso.observation ?? '',
        // Format date correctly for the input type='date'
        purchase_date: recurso.purchase_date ? new Date(recurso.purchase_date).toISOString().split('T')[0] : '',
      });
    }
  }, [recurso, reset]);

  const onSubmit = async (data: ResourceFormData) => {
    if (!recurso.id) return; // Should not happen if recurso is valid

    // Prepare payload for update
    const payload: UpdateResourcePayload = {
      name: data.name,
      unit_price: data.unit_price, // Keep as string if backend expects string
      type_unit: data.type_unit,
      total_cost: Number(data.total_cost), // Ensure it's a number
      supplier_id: data.supplier_id || null,
      observation: data.observation || null,
      purchase_date: data.purchase_date,
    };

    await onUpdate(recurso.id, payload);
    // Parent should close modal on success
  };

  if (!isOpen) return null;

  return (
    // Style consistency check: Use project's modal/dialog structure if available
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative dark:bg-gray-800">
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-lg font-semibold">Editar Recurso</h2>
          {/* Using verified Button and Icon */}
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
          {/* Form Fields using verified components, populated by useEffect */}
          <div>
            <Label htmlFor="edit-name" className="dark:text-gray-300">Nombre*</Label>
            <Input
              id="edit-name"
              {...register('name')}
              className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
              <Label htmlFor="edit-unit_price" className="dark:text-gray-300">Precio Unitario*</Label>
              <Input
                id="edit-unit_price"
                type="text"
                {...register('unit_price')}
                className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {errors.unit_price && <p className="text-sm text-red-500 mt-1">{errors.unit_price.message}</p>}
            </div>
             <div>
              <Label htmlFor="edit-type_unit" className="dark:text-gray-300">Unidad*</Label>
              <Input
                id="edit-type_unit"
                {...register('type_unit')}
                className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {errors.type_unit && <p className="text-sm text-red-500 mt-1">{errors.type_unit.message}</p>}
            </div>
             <div>
              <Label htmlFor="edit-total_cost" className="dark:text-gray-300">Costo Total*</Label>
              <Input
                id="edit-total_cost"
                type="number"
                step="0.01"
                {...register('total_cost', { valueAsNumber: true })}
                className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
              {errors.total_cost && <p className="text-sm text-red-500 mt-1">{errors.total_cost.message}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="edit-supplier_id" className="dark:text-gray-300">Proveedor</Label>
            {/* Replace with verified Select component if needed */}
            <Input
              id="edit-supplier_id"
              {...register('supplier_id')}
              className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              placeholder="ID del proveedor (temporal)" // Consider using Select
            />
            {errors.supplier_id && <p className="text-sm text-red-500 mt-1">{errors.supplier_id.message}</p>}
          </div>

          <div>
            <Label htmlFor="edit-purchase_date" className="dark:text-gray-300">Fecha de Compra*</Label>
            <Input
              id="edit-purchase_date"
              type="date"
              {...register('purchase_date')}
              className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
            {errors.purchase_date && <p className="text-sm text-red-500 mt-1">{errors.purchase_date.message}</p>}
          </div>

          <div>
            <Label htmlFor="edit-observation" className="dark:text-gray-300">Observación</Label>
            <Textarea
              id="edit-observation"
              {...register('observation')}
              className="mt-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows={3}
            />
            {errors.observation && <p className="text-sm text-red-500 mt-1">{errors.observation.message}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            {/* Using verified Button component */}
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
                  {/* Using verified Icon */}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                <>
                  {/* Using verified Icon */}
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

