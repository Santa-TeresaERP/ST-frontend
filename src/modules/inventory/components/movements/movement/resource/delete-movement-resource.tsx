import React, { useState } from 'react';
import { useDeleteResourceMovement } from '@/modules/inventory/hook/useMovementResource';
import { Trash2, Loader2, X } from 'lucide-react';

interface Props {
  id: string;
  onDeleted: () => void;
}

const DeleteMovementResource: React.FC<Props> = ({ id, onDeleted }) => {
  const [confirm, setConfirm] = useState(false);
  const { mutateAsync, isPending, error } = useDeleteResourceMovement();

  const handleDelete = async () => {
    await mutateAsync(id);
    setConfirm(false);
    onDeleted();
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
          <Trash2 className="mx-auto text-orange-500 mb-2" size={36} />
          <p className="mb-4 text-gray-700">¿Seguro que deseas eliminar este movimiento de recurso?</p>
          {error && <div className="text-red-500 text-sm mb-2">{error.message}</div>}
          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              onClick={() => setConfirm(false)}
              disabled={isPending}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-2"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition flex items-center gap-1"
      onClick={() => setConfirm(true)}
      title="Eliminar"
    >
      <Trash2 size={16} /> Eliminar
    </button>
  );
};

export default DeleteMovementResource;