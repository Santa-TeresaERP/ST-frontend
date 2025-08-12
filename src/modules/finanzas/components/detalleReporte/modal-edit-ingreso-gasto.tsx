import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useUpdateGeneralExpense } from '../../hooks/useGeneralExpenses';
import { useUpdateGeneralIncome } from '../../hooks/useGeneralIncomes';
import { UpdateExpensePayload } from '../../types/generalExpense';
import { UpdateIncomePayload } from '../../types/generalIncome';
import { useFetchModules } from '../../../modules/hook/useModules'; // Ajusta ruta

interface EditEntry {
  id: string;
  module_id: string;
  income_type?: string;    // solo para ingreso
  expense_type?: string;   // solo para gasto
  amount: number;
  date: string;
  description?: string;
}

interface ModalEditEntradaProps {
  tipo: 'ingreso' | 'gasto';
  data: EditEntry;
  onClose: () => void;
  onSave: (updatedData: EditEntry) => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function ModalEditEntrada({ tipo, data, onClose }: ModalEditEntradaProps) {
  const [form, setForm] = useState<EditEntry>({
    ...data,
    date: formatDate(data.date),
  });

  const updateIngreso = useUpdateGeneralIncome();
  const updateGasto = useUpdateGeneralExpense();

  const { data: modules = [] } = useFetchModules();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tipo === 'ingreso') {
      const payload: UpdateIncomePayload = {
        module_id: form.module_id,
        income_type: form.income_type || '',
        amount: form.amount,
        date: form.date,
        description: form.description || undefined,
      };
      updateIngreso.mutate(
        { id: form.id, payload },
        { onSuccess: () => onClose() }
      );
    } else {
      const payload: UpdateExpensePayload = {
        module_id: form.module_id,
        expense_type: form.expense_type || '',
        amount: form.amount,
        date: form.date,
        description: form.description || undefined,
      };
      updateGasto.mutate(
        { id: form.id, payload },
        { onSuccess: () => onClose() }
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl p-6 w-[550px] max-w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-semibold text-xl capitalize">
            {tipo === 'ingreso' ? 'Editar Ingreso' : 'Editar Gasto'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="module_id" className="block text-sm font-medium text-gray-700 mb-1">
              Módulo
            </label>
            <select
              id="module_id"
              name="module_id"
              value={form.module_id}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>Seleccione un módulo</option>
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  {mod.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={tipo === 'ingreso' ? 'income_type' : 'expense_type'} className="block text-sm font-medium text-gray-700 mb-1">
              Tipo {tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
            </label>
            <input
              type="text"
              id={tipo === 'ingreso' ? 'income_type' : 'expense_type'}
              name={tipo === 'ingreso' ? 'income_type' : 'expense_type'}
              value={tipo === 'ingreso' ? form.income_type || '' : form.expense_type || ''}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Monto
            </label>
            <input
              type="number"
              step="0.01"
              id="amount"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              min="0"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-gray-200 px-5 py-2 font-semibold hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`rounded-xl px-5 py-2 font-semibold text-white ${
                tipo === 'ingreso' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              } transition`}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
