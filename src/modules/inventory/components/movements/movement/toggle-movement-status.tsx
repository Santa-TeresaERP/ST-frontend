import React from 'react';
import { Trash2, CheckCircle } from 'lucide-react';
import { useDeleteMovement } from '@/modules/inventory/hook/useMovementProduct';
import { useDeleteWarehouseMovementResource } from '@/modules/inventory/hook/useMovementResource';

interface Props {
  id: string;
  status: boolean;
  onToggled: () => void;
  type: 'producto' | 'recurso';
}

const ToggleMovementStatus: React.FC<Props> = ({ id, status, onToggled, type }) => {
  const deleteProduct = useDeleteMovement();
  const deleteResource = useDeleteWarehouseMovementResource();

  const handleToggle = () => {
    if (type === 'producto') {
      deleteProduct.mutate(
        { id, status: !status },
        {
          onSuccess: () => onToggled(),
          onError: (err) => console.error('Error al cambiar estado de producto:', err),
        }
      );
    } else {
      deleteResource.mutate(
        { id },
        {
          onSuccess: () => onToggled(),
          onError: (err) => console.error('Error al cambiar estado de recurso:', err),
        }
      );
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={status ? 'text-red-600 hover:text-red-800' : 'text-gray-400 hover:text-green-600'}
      title={status ? 'Desactivar' : 'Activar'}
    >
      {status ? <Trash2 size={18} /> : <CheckCircle size={18} />}
    </button>
  );
};

export default ToggleMovementStatus;
