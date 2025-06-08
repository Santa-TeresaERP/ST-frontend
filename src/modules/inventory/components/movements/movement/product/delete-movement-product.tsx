/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Trash2, Loader2, X } from 'lucide-react';
import { deleteMovement } from '@/modules/inventory/action/movementProduct';

interface Props {
  id: string;
  onDeleted: () => void;
}

const DeleteMovementProduct: React.FC<Props> = ({ id, onDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteMovement(id);
      setConfirm(false);
      onDeleted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (confirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xs text-center relative">
          <button
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
            onClick={() => setConfirm(false)}
          >
            <X size={20} />
          </button>
          <Trash2 className="mx-auto text-red-600 mb-2" size={36} />
          <p className="mb-4 text-gray-700">¿Seguro que deseas eliminar este movimiento?</p>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={() => setConfirm(false)}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center gap-1"
      onClick={() => setConfirm(true)}
      title="Eliminar"
    >
      <Trash2 size={16} /> Eliminar
    </button>
  );
};

export default DeleteMovementProduct;