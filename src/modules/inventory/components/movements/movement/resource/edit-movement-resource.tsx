/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { warehouseMovementResourceSchema } from '@/modules/inventory/schemas/movementResourceValidation';
import { useUpdateWarehouseMovementResource } from '@/modules/inventory/hook/useMovementResource';
import { WarehouseMovementResource } from '@/modules/inventory/types/movementResource';
import { X, Save } from 'lucide-react';
import { useFetchWarehouses } from '@/modules/inventory/hook/useWarehouses';
import { useFetchResources } from '@/modules/inventory/hook/useResources';

interface Props {
  movement: WarehouseMovementResource;
  onUpdated: () => void;
  onCancel: () => void;
}

const today = new Date().toISOString().split('T')[0];

const EditMovementResource: React.FC<Props> = ({ movement, onUpdated, onCancel }) => {
  const [form, setForm] = useState({
    warehouse_id: movement.warehouse_id,
    resource_id: movement.resource_id,
    movement_type: movement.movement_type,
    quantity: movement.quantity,
    movement_date: typeof movement.movement_date === 'string'
      ? movement.movement_date.split('T')[0]
      : new Date(movement.movement_date).toISOString().split('T')[0],
    observations: movement.observations || '',
  });
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useUpdateWarehouseMovementResource();

  // Obtener almacenes y recursos existentes
  const { data: warehouses = [], isLoading: loadingWarehouses } = useFetchWarehouses();
  const { data: resources = [], isLoading: loadingResources } = useFetchResources();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = warehouseMovementResourceSchema.safeParse({
      ...form,
      quantity: Number(form.quantity),
      movement_date: form.movement_date,
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    try {
      await mutateAsync({ id: movement.id!, payload: parsed.data });
      onUpdated();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-orange-500 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center">Editar Movimiento de Recurso</h2>
          <button
            onClick={onCancel}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
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
              <option value="">Selecciona un almacén</option>
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
              <option value="">Selecciona un recurso</option>
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
                value={form.movement_date}
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
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
              disabled={isPending}
            >
              <Save size={18} /> {isPending ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
          </form>
      </div>
    </div>
  );
};

export default EditMovementResource;