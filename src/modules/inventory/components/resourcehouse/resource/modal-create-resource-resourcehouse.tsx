import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Save, Loader2 } from 'lucide-react';
import { BuysResourceValidationSchema, BuysResourceFormData } from '../../../schemas/buysResourceValidation';
import { CreateBuysResourcePayload } from '../../../types/buysResource';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Label } from '@/app/components/ui/label';
import { useFetchSuppliers } from '@/modules/inventory/hook/useSuppliers';
import { useFetchWarehouses } from '@/modules/inventory/hook/useWarehouses';
import ResourceSearchInput from './ResourceSearchInput';
import ModalError from '../../ModalError';

type ModalNuevoRecursoProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateBuysResourcePayload) => Promise<void>;
  isCreating: boolean;
};

const UNIT_OPTIONS = [
  { value: 'g', label: 'Gramos (g)' },
  { value: 'kg', label: 'Kilogramos (kg)' },
  { value: 'l', label: 'Litros (l)' },
  { value: 'ml', label: 'Mililitros (ml)' },
  { value: 'unidades', label: 'Unidades' },
];

const ModalNuevoRecurso: React.FC<ModalNuevoRecursoProps> = ({
  isOpen,
  onClose,
  onCreate,
  isCreating,
}) => {
  const [serverError, setServerError] = React.useState<string | null>(null);
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');
  const [modalError, setModalError] = useState<string | null>(null);

  // Función para limpiar el formulario y estados
  const handleCloseModal = () => {
    reset();
    setSelectedResourceId('');
    setServerError(null);
    onClose();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<BuysResourceFormData>({
    resolver: zodResolver(BuysResourceValidationSchema),
    defaultValues: {
      warehouse_id: '',
      resource_id: '',
      quantity: 0,
      type_unit: '',
      total_cost: 0,
      supplier_id: '',
      entry_date: new Date().toISOString().split('T')[0], // Fecha de hoy por defecto
    },
  });

  // Hooks para datos
  const { data: suppliers, isLoading: isLoadingSuppliers, error: errorSuppliers } = useFetchSuppliers();
  const { data: warehouses, isLoading: isLoadingWarehouses, error: errorWarehouses } = useFetchWarehouses();

  // Limpiar el formulario cuando se cierre el modal
  useEffect(() => {
    if (!isOpen) {
      reset();
      setSelectedResourceId('');
      setServerError(null);
    }
  }, [isOpen, reset]);

  // Watch para calcular unit_price automáticamente
  const quantity = watch('quantity');
  const totalCost = watch('total_cost');
  const unitPrice = quantity > 0 && totalCost > 0 ? (totalCost / quantity).toFixed(2) : '0.00';

  useEffect(() => {
    if (quantity > 0 && totalCost > 0) {
      // El precio unitario se calcula automáticamente y se muestra en el UI
      const calculatedUnitPrice = totalCost / quantity;
      console.log('Precio unitario calculado:', calculatedUnitPrice);
    }
  }, [quantity, totalCost]);

  const onSubmit = async (data: BuysResourceFormData) => {
    console.log('🚀 onSubmit ejecutado con data:', data);
    console.log('🔍 selectedResourceId:', selectedResourceId);

    if (!data.warehouse_id || data.warehouse_id.trim() === '' || data.warehouse_id === 'Seleccione un almacén') {
      setServerError('Debe seleccionar un almacén');
      return;
    }

    const selectedWarehouse = warehouses?.find(w => w.id === data.warehouse_id);
    if (selectedWarehouse && selectedWarehouse.status === false) {
      setModalError('El almacén seleccionado está inactivo. Actívelo para poder utilizarlo.');
      return;
    }

    // Validar que se haya seleccionado un recurso
    if (!selectedResourceId) {
      setServerError('Debe seleccionar un recurso');
      return;
    }

    const unitPrice = data.quantity > 0 && data.total_cost > 0 ? data.total_cost / data.quantity : 0;
    
    const payload: CreateBuysResourcePayload = {
      warehouse_id: data.warehouse_id,
      resource_id: selectedResourceId, // Usar el ID del recurso seleccionado
      quantity: data.quantity,
      type_unit: data.type_unit,
      unit_price: unitPrice,
      total_cost: data.total_cost,
      supplier_id: data.supplier_id,
      entry_date: new Date(data.entry_date),
    };

    // Debug logs para verificar los valores enviados
    console.log('Datos del formulario:', data);
    console.log('Payload a enviar:', payload);
    console.log('Cantidad original:', data.quantity);
    console.log('Cantidad en payload:', payload.quantity);

    try {
      await onCreate(payload);
      reset();
      setSelectedResourceId('');
      setServerError(null);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error inesperado al crear el recurso.';
      setServerError(message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-5 rounded-t-2xl flex items-center justify-between">
          <h2 className="text-xl font-semibold">Nuevo Recurso</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCloseModal}
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
          {modalError && (
            <ModalError
              message={modalError}
              onClose={() => setModalError(null)}
            />
          )}

          {/* Campo Recurso - Ocupa todo el ancho */}
          <div className="mb-4">
            <ResourceSearchInput
              label="Recurso"
              placeholder="Buscar recurso..."
              onResourceSelect={(resourceId) => {
                setSelectedResourceId(resourceId);
                // Actualizar el valor en el formulario
                setValue('resource_id', resourceId);
              }}
              required
              error={errors.resource_id?.message}
            />
          </div>

          {/* Proveedor y Almacén - Misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* supplier_id */}
            <div>
              <Label htmlFor="supplier_id" className="block text-sm font-medium mb-1">
                Proveedor<span className="text-red-500">*</span>
              </Label>
              {isLoadingSuppliers ? (
                <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
              ) : errorSuppliers ? (
                <p className="text-red-500 text-sm">Error al cargar proveedores</p>
              ) : (
                <select
                  id="supplier_id"
                  {...register('supplier_id')}
                  className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 border-gray-300"
                  defaultValue=""
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

            {/* warehouse_id */}
            <div>
              <Label htmlFor="warehouse_id" className="block text-sm font-medium mb-1">
                Almacén<span className="text-red-500">*</span>
              </Label>
              {isLoadingWarehouses ? (
                <div className="animate-pulse bg-gray-200 h-10 rounded-lg"></div>
              ) : errorWarehouses ? (
                <p className="text-red-500 text-sm">Error al cargar almacenes</p>
              ) : (
                <select
                  id="warehouse_id"
                  {...register('warehouse_id')}
                  className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 border-gray-300"
                  defaultValue=""
                >
                  <option value="">Seleccione un almacén</option>
                  {warehouses?.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.warehouse_id && <p className="text-sm text-red-500 mt-1">{errors.warehouse_id.message}</p>}
            </div>
          </div>

          {/* Costo Total, Cantidad y Precio Unitario - Misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* total_cost */}
            <div>
              <Label htmlFor="total_cost" className="block text-sm font-medium mb-1">
                Costo Total<span className="text-red-500">*</span>
              </Label>
              <Input
                id="total_cost"
                type="number"
                step="0.01"
                {...register('total_cost', { valueAsNumber: true })}
                className="h-10 mt-1 bg-white text-gray-900 border-gray-300"
                placeholder="0.00"
              />
              {errors.total_cost && <p className="text-sm text-red-500 mt-1">{errors.total_cost.message}</p>}
            </div>

            {/* quantity */}
            <div>
              <Label htmlFor="quantity" className="block text-sm font-medium mb-1">
                Cantidad<span className="text-red-500">*</span>
              </Label>
              <Input
                id="quantity"
                type="number"
                {...register('quantity', { valueAsNumber: true })}
                className="h-10 mt-1 bg-white text-gray-900 border-gray-300"
                placeholder="Cantidad"
              />
              {errors.quantity && <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>}
            </div>

            {/* unit_price - Calculado automáticamente e inmutable */}
            <div>
              <Label htmlFor="unit_price" className="block text-sm font-medium mb-1">
                Precio Unitario
              </Label>
              <Input
                id="unit_price"
                type="text"
                value={`S/ ${unitPrice}`}
                readOnly
                className="h-10 mt-1 bg-gray-100 text-gray-600 cursor-not-allowed border-gray-300"
                placeholder="0.00"
              />
              <p className="text-xs text-gray-500 mt-1">Calculado automáticamente</p>
            </div>
          </div>

          {/* Unidad y Fecha - Misma fila */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* type_unit */}
            <div>
              <Label htmlFor="type_unit" className="block text-sm font-medium mb-1">
                Unidad<span className="text-red-500">*</span>
              </Label>
              <select
                id="type_unit"
                {...register('type_unit')}
                className="h-10 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white text-gray-900 border-gray-300"
              >
                <option value="">Selecciona una unidad</option>
                {UNIT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.type_unit && <p className="text-sm text-red-500 mt-1">{errors.type_unit.message}</p>}
            </div>

            {/* entry_date */}
            <div>
              <Label htmlFor="entry_date" className="block text-sm font-medium mb-1">
                Fecha de Entrada<span className="text-red-500">*</span>
              </Label>
              <Input
                id="entry_date"
                type="date"
                {...register('entry_date')}
                className="h-10 mt-1 bg-white text-gray-900 border-gray-300"
              />
              {errors.entry_date && <p className="text-sm text-red-500 mt-1">{errors.entry_date.message}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={isCreating}
              className="text-gray-600 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              className="bg-red-800 hover:bg-red-700 text-white disabled:opacity-50"
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-6700 text-white transition flex items-center justify-center space-x-2"
              onClick={() => console.log('🖱️ Button clicked, isCreating:', isCreating)}
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
