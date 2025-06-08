/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { movementProductSchema } from '@/modules/inventory/schemas/movementProductValidation';
import { updateMovement } from '@/modules/inventory/action/movementProduct';
import { WarehouseMovementProductAttributes } from '@/modules/inventory/types/movementProduct';

interface Props {
  movement: WarehouseMovementProductAttributes;
  onUpdated: () => void;
  onCancel: () => void;
}

const EditMovementProduct: React.FC<Props> = ({ movement, onUpdated, onCancel }) => {
  const [form, setForm] = useState({
    ...movement,
    movement_date: movement.movement_date ? new Date(movement.movement_date).toISOString().split('T')[0] : '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = movementProductSchema.safeParse({
      ...form,
      quantity: Number(form.quantity),
      movement_date: new Date(form.movement_date),
    });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      await updateMovement(movement.movement_id, parsed.data);
      onUpdated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-yellow-600 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center">Editar Movimiento de Producto</h2>
          <button
            onClick={onCancel}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>
        <form className="p-6 space-y-5 text-left" onSubmit={handleSubmit}>
          {error && <div className="text-red-600 font-medium">{error}</div>}

          <div>
            <label className="block text-gray-700 mb-1 font-medium">ID Almacén*</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
              name="warehouse_id"
              placeholder="ID Almacén"
              value={form.warehouse_id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">ID Tienda*</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
              name="store_id"
              placeholder="ID Tienda"
              value={form.store_id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">ID Producto*</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
              name="product_id"
              placeholder="ID Producto"
              value={form.product_id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Tipo de Movimiento*</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
                name="movement_type"
                value={form.movement_type}
                onChange={handleChange}
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cantidad*</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
                name="quantity"
                type="number"
                placeholder="Cantidad"
                value={form.quantity}
                onChange={handleChange}
                required
                min={1}
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Fecha de Movimiento*</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
              name="movement_date"
              type="date"
              value={form.movement_date}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Observaciones</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-600 focus:outline-none"
              name="observations"
              placeholder="Observaciones"
              value={form.observations || ''}
              onChange={handleChange}
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
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition flex items-center gap-2"
              type="submit"
              disabled={loading}
            >
              <Save size={18} /> {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovementProduct;