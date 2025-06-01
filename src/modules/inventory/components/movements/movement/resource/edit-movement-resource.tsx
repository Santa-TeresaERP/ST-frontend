/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { warehouseMovementResourceSchema } from '@/modules/inventory/schemas/movementResourceValidation';
import { useUpdateResourceMovement } from '@/modules/inventory/hook/useMovementResource';
import { WarehouseMovementResourceAttributes } from '@/modules/inventory/types/movementResource';
import { X, Save } from 'lucide-react';

interface Props {
  movement: WarehouseMovementResourceAttributes;
  onUpdated: () => void;
  onCancel: () => void;
}

const EditMovementResource: React.FC<Props> = ({ movement, onUpdated, onCancel }) => {
  const [form, setForm] = useState({
    ...movement,
    movement_date: movement.movement_date
      ? new Date(movement.movement_date).toISOString().split('T')[0]
      : '',
  });
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync, isPending } = useUpdateResourceMovement();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = warehouseMovementResourceSchema.safeParse({
      ...form,
      quantity: Number(form.quantity),
      movement_date: new Date(form.movement_date),
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    try {
      await mutateAsync({ id: form.movement_id, data: parsed.data });
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
            <label className="block text-gray-700 mb-1 font-medium">ID Movimiento*</label>
            <input
              type="text"
              name="movement_id"
              value={form.movement_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="ID del movimiento"
              required
              disabled
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">ID Almacén*</label>
            <input
              type="text"
              name="warehouse_id"
              value={form.warehouse_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="ID del almacén"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">ID Recurso*</label>
            <input
              type="text"
              name="resource_id"
              value={form.resource_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="ID del recurso"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tipo*</label>
            <input
              type="text"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Tipo"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tipo de Movimiento*</label>
            <input
              type="text"
              name="movement_type"
              value={form.movement_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="Tipo de movimiento"
              required
            />
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