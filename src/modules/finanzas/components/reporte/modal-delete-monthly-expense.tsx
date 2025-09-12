"use client";

import React from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Overhead } from '@/modules/monastery/types/overheads';
import { useDeleteOverhead } from '@/modules/monastery/hooks/useOverheads';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  expense: Overhead | null;
}

const ModalDeleteMonthlyExpense: React.FC<Props> = ({ isOpen, onClose, expense }) => {
  const { mutateAsync: remove, isPending } = useDeleteOverhead();

  if (!isOpen || !expense) return null;

  const handleConfirm = async () => {
    // El backend realiza borrado lógico/toggle usando la misma ruta
    await remove(expense.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">{expense.status ? 'Deshabilitar' : 'Habilitar'} Gasto</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          <p>
            ¿Seguro que deseas {expense.status ? 'deshabilitar' : 'habilitar'} el gasto
            {' '}<span className="font-semibold">“{expense.name}”</span>?
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
            <button type="button" onClick={handleConfirm} disabled={isPending} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center gap-2">
              <Trash2 size={16} />
              {isPending ? (expense.status ? 'Deshabilitando...' : 'Habilitando...') : (expense.status ? 'Deshabilitar' : 'Habilitar')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalDeleteMonthlyExpense;
