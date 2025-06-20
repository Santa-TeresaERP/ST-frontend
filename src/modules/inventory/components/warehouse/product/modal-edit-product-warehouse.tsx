import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { WarehouseProduct } from '../../../types/warehouseProduct';
import { useUpdateWarehouseProduct } from '../../../hook/useWarehouseProducts';

type ModalEditProductWarehouseProps = {
  producto: WarehouseProduct;
  onClose: () => void;
};

const ModalEditProductWarehouse: React.FC<ModalEditProductWarehouseProps> = ({
  producto,
  onClose,
}) => {
  const [quantity, setQuantity] = useState<number>(producto.quantity);
  const [entry_date, setEntryDate] = useState(producto.entry_date.split('T')[0]);
  const [error, setError] = useState('');

  const { mutate, status } = useUpdateWarehouseProduct();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (quantity < 0) {
      setError('La cantidad debe ser mayor o igual a 0.');
      return;
    }
    if (!entry_date) {
      setError('La fecha de entrada es obligatoria.');
      return;
    }

    setError('');
    mutate(
      {
        id: producto.id,
        payload: {
          quantity,
          entry_date,
        },
      },
      {
        onSuccess: onClose,
        onError: () => setError('Error al actualizar el producto en almacén.'),
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative">
        <div className="bg-red-800 text-white p-5 rounded-t-2xl flex justify-center items-center relative">
          <h2 className="text-lg font-semibold">Editar Producto del Almacén</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar modal"
            className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-gray-200"
          >
            <X size={22} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-left">Cantidad*</label>
            <input
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
              placeholder="Ejemplo: 50"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1 font-medium text-left">Fecha de Entrada*</label>
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

export default ModalEditProductWarehouse;