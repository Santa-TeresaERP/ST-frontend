/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { movementProductSchema } from '@/modules/inventory/schemas/movementProductValidation';
import { createMovement, CreateMovementProductPayload } from '@/modules/inventory/action/movementProduct';
import { useFetchWarehouses } from '@/modules/inventory/hook/useWarehouses';
import { useFetchProducts } from '@/modules/inventory/hook/useProducts';
import { WarehouseAttributes } from '@/modules/inventory/types/warehouse';
import { ProductAttributes } from '@/modules/inventory/types/ListProduct';

interface Props {
  onCreated: () => void;
  onClose?: () => void; // Opcional, por si quieres usarlo como modal
}

  const initialForm = {
    warehouse_id: '',
    store_id: '',
    product_id: '',
    movement_type: 'entrada' as const,
    quantity: 0, // Cambiar de undefined a 0
    movement_date: new Date().toISOString().split('T')[0],
    observations: '',
  };

const CreateMovementProduct: React.FC<Props> = ({ onCreated, onClose }) => {
  const [form, setForm] = useState(initialForm);
  const { data: warehouses, isLoading: isLoadingWarehouses, error: errorWarehouses } = useFetchWarehouses();
  const { data: products, isLoading: isLoadingProducts, error: errorProducts } = useFetchProducts();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'quantity') {
      setForm({ ...form, [name]: value === '' ? 0 : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    console.log('Datos del formulario antes de validar:', form);
    
    // Validar campos antes de enviar
    if (!form.warehouse_id || form.warehouse_id.trim() === '' || form.warehouse_id === 'Seleccione un almacén') {
      setError('Debe seleccionar un almacén');
      return;
    }
    
    if (!form.product_id || form.product_id.trim() === '' || form.product_id === 'Seleccione un producto') {
      setError('Debe seleccionar un producto');
      return;
    }
    
    if (form.quantity < 0) {
      setError('La cantidad debe ser mayor o igual a 0');
      return;
    }

    // Preparar datos para validación
    const dataToValidate = {
      warehouse_id: form.warehouse_id.trim(),
      store_id: form.store_id?.trim() || null, // Convertir a null si está vacío
      product_id: form.product_id.trim(),
      movement_type: form.movement_type,
      quantity: Number(form.quantity),
      movement_date: new Date(form.movement_date),
      observations: form.observations?.trim() || undefined,
    };

    console.log('Datos preparados para validación:', dataToValidate);

    const parsed = movementProductSchema.safeParse(dataToValidate);
    
    if (!parsed.success) {
      console.error('Error de validación:', parsed.error.errors);
      setError(parsed.error.errors[0].message);
      return;
    }
    
    // Preparar los datos exactamente como los espera el backend
    const payload: CreateMovementProductPayload = {
      warehouse_id: parsed.data.warehouse_id,
      product_id: parsed.data.product_id,
      movement_type: parsed.data.movement_type,
      quantity: parsed.data.quantity,
      movement_date: parsed.data.movement_date,
      store_id: parsed.data.store_id, // Incluir siempre (puede ser null)
      ...(parsed.data.observations && { observations: parsed.data.observations }), // Solo incluir si no es undefined
    };
    
    console.log('Payload final a enviar:', payload);
    
    setLoading(true);
    try {
      await createMovement(payload);
      setForm(initialForm);
      onCreated();
      if (onClose) onClose();
    } catch (err: any) {
      console.error('Error completo:', err);
      console.error('Respuesta del servidor:', err.response?.data);
      console.error('Status:', err.response?.status);
      console.error('Headers:', err.response?.headers);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.status === 400) {
        setError('Datos inválidos. Verifique que todos los campos estén correctos.');
      } else {
        setError(err.message || 'Error al crear el movimiento');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-slate-700 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center">Nuevo Movimiento de Producto</h2>
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
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Almacén*</label>
            <select
              name="warehouse_id"
              value={form.warehouse_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
              required
              disabled={isLoadingWarehouses}
            >
              <option key="select-warehouse" value="">{isLoadingWarehouses ? 'Cargando almacenes...' : 'Seleccione un almacén'}</option>
              {errorWarehouses && <option key="error-warehouse" value="" disabled>Error al cargar almacenes</option>}
              {warehouses?.map((warehouse: WarehouseAttributes) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Tienda</label>
            <select
              name="store_id"
              value={form.store_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
            >
              <option value="">Sin tienda asignada</option>
              <option value="Tienda Centro">Tienda Centro</option>
              <option value="Sucursal Norte">Sucursal Norte</option>
              <option value="Tienda Sur">Tienda Sur</option>
              <option value="Almacén Principal">Almacén Principal</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Producto*</label>
            <select
              name="product_id"
              value={form.product_id}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
              required
              disabled={isLoadingProducts}
            >
              <option key="select-product" value="">{isLoadingProducts ? 'Cargando productos...' : 'Seleccione un producto'}</option>
              {errorProducts && <option key="error-product" value="" disabled>Error al cargar productos</option>}
              {products?.map((product: ProductAttributes) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Tipo de Movimiento*</label>
              <select
                name="movement_type"
                value={form.movement_type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Cantidad*</label>
              <input
                type="number"
                name="quantity"
                min={1}
                value={form.quantity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
                placeholder="Cantidad"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Fecha de Movimiento*</label>
            <input
              type="date"
              name="movement_date"
              value={form.movement_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Observaciones</label>
            <input
              type="text"
              name="observations"
              value={form.observations}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-slate-600 focus:outline-none"
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
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition flex items-center gap-2"
              disabled={loading}
            >
              <Save size={18} /> {loading ? 'Guardando...' : 'Aceptar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMovementProduct;