/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { warehouseMovementResourceSchema } from '@/modules/inventory/schemas/movementResourceValidation';
import { useCreateWarehouseMovementResource } from '@/modules/inventory/hook/useMovementResource';
import { CreateWarehouseMovementResourcePayload } from '@/modules/inventory/types/movementResource';
import { X, Save } from 'lucide-react';
import { useFetchWarehouses } from '@/modules/inventory/hook/useWarehouses';
import { useFetchResources } from '@/modules/inventory/hook/useResources'; // Asegúrate de tener este hook

interface Props {
  onCreated: () => void;
  onClose?: () => void;
}

const initialForm: CreateWarehouseMovementResourcePayload = {
  warehouse_id: '',
  resource_id: '',
  movement_type: 'entrada',
  quantity: 1, // Cambiar de 0 a 1 para evitar valores negativos
  movement_date: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
  observations: '',
};

const CreateMovementResource: React.FC<Props> = ({ onCreated, onClose }) => {
  const [form, setForm] = useState<CreateWarehouseMovementResourcePayload>(initialForm);
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useCreateWarehouseMovementResource();

  // Obtener almacenes y recursos existentes
  const { data: warehouses = [], isLoading: loadingWarehouses, error: errorWarehouses } = useFetchWarehouses();
  const { data: resources = [], isLoading: loadingResources, error: errorResources } = useFetchResources();

  // Debug: mostrar datos cargados
  console.log('Warehouses:', warehouses);
  console.log('Resources:', resources);
  console.log('Loading warehouses:', loadingWarehouses);
  console.log('Loading resources:', loadingResources);
  console.log('Error warehouses:', errorWarehouses);
  console.log('Error resources:', errorResources);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Debug: mostrar cambios en los campos
    console.log(`Campo ${name} cambió a:`, value);
    
    if (name === 'quantity') {
      const numValue = Number(value);
      if (numValue <= 0) {
        setError('La cantidad debe ser mayor que 0');
        return;
      } else {
        setError(null);
      }
      setForm({ ...form, [name]: numValue });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Debug: Mostrar los datos del formulario
    console.log('Form data antes de validación:', form);
    
    const parsed = warehouseMovementResourceSchema.safeParse({
      ...form,
      quantity: Number(form.quantity),
      movement_date: new Date(form.movement_date).toISOString(), // Convertir a ISO string
    });
    
    // Debug: Mostrar resultado de validación
    console.log('Parsed data:', parsed);
    
    if (!parsed.success) {
      console.log('Validation errors:', parsed.error.errors);
      setError(parsed.error.errors[0].message);
      return;
    }
    
    try {
      console.log('Payload a enviar:', parsed.data);
      await mutateAsync(parsed.data);
      setForm(initialForm);
      onCreated();
      if (onClose) onClose();
    } catch (err: any) {
      console.error('Error en la petición:', err);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-orange-500 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center">Nuevo Movimiento de Recurso</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
            >
              <X size={22} />
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600 font-medium">Error:</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          {/* Mostrar errores de carga de datos */}
          {errorWarehouses && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-600 font-medium">Error cargando almacenes:</p>
              <p className="text-sm text-yellow-700">{errorWarehouses.message}</p>
            </div>
          )}
          
          {errorResources && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-600 font-medium">Error cargando recursos:</p>
              <p className="text-sm text-yellow-700">{errorResources.message}</p>
            </div>
          )}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Almacén*</label>
            <select
              name="warehouse_id"
              value={form.warehouse_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
              disabled={loadingWarehouses}
            >
              <option key="select-warehouse" value="">Selecciona un almacén</option>
              {warehouses.map((w: any) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Recurso*</label>
            <select
              name="resource_id"
              value={form.resource_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
              disabled={loadingResources}
            >
              <option key="select-resource" value="">Selecciona un recurso</option>
              {resources.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tipo de Movimiento*</label>
            <select
              name="movement_type"
              value={form.movement_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              required
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cantidad*</label>
              <input
                type="number"
                name="quantity"
                min={1}
                value={form.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                placeholder="Cantidad"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Fecha de Movimiento*</label>
              <input
                type="date"
                name="movement_date"
                value={typeof form.movement_date === 'string' ? form.movement_date : ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Observaciones</label>
            <input
              type="text"
              name="observations"
              value={form.observations || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Observaciones"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
              disabled={isPending}
            >
              <Save size={18} /> {isPending ? 'Guardando...' : 'Aceptar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMovementResource;