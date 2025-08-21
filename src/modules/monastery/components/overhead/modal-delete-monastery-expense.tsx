'use client';

import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  overheadName: string;
}

const ModalDeleteMonasteryExpense: React.FC<Props> = ({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  overheadName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <AlertTriangle className="text-red-500 mr-2" />
            Confirmar Eliminación
          </h3>
          <button onClick={onClose} disabled={isPending} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar el gasto{" "}
            <strong className="font-medium text-gray-900">&quot;{overheadName}&quot;</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta acción marcará el registro como inactivo pero no lo eliminará permanentemente.
          </p>
        </div>
        <div className="flex justify-end items-center p-4 border-t">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 hover:bg-gray-300 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 disabled:opacity-50"
          >
            {isPending ? 'Eliminando...' : 'Sí, Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteMonasteryExpense;