"use client";

import React from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Overhead } from '@/modules/monastery/types/overheads';
import { useUpdateOverhead } from '@/modules/monastery/hooks/useOverheads';

const schema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  amount: z.coerce.number().positive('Monto debe ser mayor a 0'),
  date: z.string().min(1, 'Fecha requerida'),
  description: z.string().optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  expense: Overhead | null;
}

const ModalEditMonthlyExpense: React.FC<Props> = ({ isOpen, onClose, expense }) => {
  const { mutateAsync: update, isPending } = useUpdateOverhead();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: expense ? {
      name: expense.name,
      amount: Number(expense.amount),
      date: new Date(expense.date).toISOString().split('T')[0],
      description: expense.description ?? '',
    } : undefined,
  });

  React.useEffect(() => {
    if (expense) {
      reset({
        name: expense.name,
        amount: Number(expense.amount),
        date: new Date(expense.date).toISOString().split('T')[0],
        description: expense.description ?? '',
      });
    }
  }, [expense, reset]);

  const onSubmit = async (data: FormData) => {
    if (!expense) return;
    await update({ id: expense.id, payload: { ...data } });
    onClose();
  };

  if (!isOpen || !expense) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">Editar Gasto</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input className="w-full border rounded px-3 py-2" {...register('name')} />
            {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Monto (S/)</label>
            <input type="number" step="0.01" className="w-full border rounded px-3 py-2" {...register('amount')} />
            {errors.amount && <p className="text-sm text-red-600 mt-1">{errors.amount.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fecha</label>
            <input type="date" className="w-full border rounded px-3 py-2" {...register('date')} />
            {errors.date && <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea rows={3} className="w-full border rounded px-3 py-2" {...register('description')} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200">Cancelar</button>
            <button type="submit" disabled={isPending} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50">{isPending ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditMonthlyExpense;
