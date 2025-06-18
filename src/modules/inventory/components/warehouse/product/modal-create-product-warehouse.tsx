import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { useCreateWarehouseProduct } from '../../../hook/useWarehouseProducts';
import { useFetchWarehouses } from '../../../hook/useWarehouses';
import { useFetchProducts } from '../../../hook/useProducts';

type ModalCreateProductWarehouseProps = {
  onClose: () => void;
};

const ModalCreateProductWarehouse: React.FC<ModalCreateProductWarehouseProps> = ({
  onClose
}) => {
  const [warehouse_id, setWarehouseId] = useState('');
  const [product_id, setProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [entry_date, setEntryDate] = useState('');
  const [error, setError] = useState('');

  const { mutate, status } = useCreateWarehouseProduct();
  const { data: warehouses, isLoading: loadingWarehouses } = useFetchWarehouses();
  const { data: products, isLoading: loadingProducts } = useFetchProducts();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!warehouse_id || !product_id || quantity === '' || Number(quantity) < 0 || !entry_date) {
      setError('Todos los campos son obligatorios y la cantidad debe ser mayor o igual a 0.');
      return;
    }

    setError('');
    mutate(
      {
        warehouse_id,
        product_id,
        quantity: Number(quantity),
        entry_date,
      },
      {
        onSuccess: onClose,
        onError: () => setError('Error al crear el producto en almacén.'),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h2 className="text-lg font-semibold text-center">Crear Producto en Almacén</h2>
          <button
            onClick={onClose}
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
              value={warehouse_id}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={loadingWarehouses}
            >
              <option value="">Seleccione un almacén</option>
              {warehouses?.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Producto*</label>
            <select
              value={product_id}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              disabled={loadingProducts}
            >
              <option value="">Seleccione un producto</option>
              {products?.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Cantidad*</label>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Ejemplo: 50"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Fecha de Entrada*</label>
            <input
              type="date"
              value={entry_date}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={status === 'pending'}
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
            >
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCreateProductWarehouse;