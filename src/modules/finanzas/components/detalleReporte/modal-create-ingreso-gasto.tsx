import React, { useState } from 'react';
import { X } from 'lucide-react'; 
import { CreateExpensePayload } from '../../types/generalExpense';
import { CreateIncomePayload } from '../../types/generalIncome';
import { useFetchModules } from '../../../modules/hook/useModules'; // ajusta ruta si es necesario
import { Module } from '../../../modules/types/modules';

interface Props {
  onClose: () => void;
  onSave: (data: CreateIncomePayload | CreateExpensePayload) => void;
  tipo: 'ingreso' | 'gasto';
}

const ModalAddEntrada: React.FC<Props> = ({ onClose, onSave, tipo }) => {
  // Aquí el estado interno con nombres neutros para el formulario
  const [formData, setFormData] = useState({
    module_id: '',
    income_type: '',   // para ingresos
    expense_type: '',  // para gastos
    amount: '',
    date: '',
    description: ''
  });


  // Carga módulos con el hook
  const { data: modulos = [], isLoading } = useFetchModules();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.module_id) {
      alert('Debe seleccionar un módulo');
      return;
    }
    if (tipo === 'ingreso' && !formData.income_type.trim()) {
      alert('Debe ingresar un tipo para ingreso');
      return;
    }
    if (tipo === 'gasto' && !formData.expense_type.trim()) {
      alert('Debe ingresar un tipo para gasto');
      return;
    }

    if (!formData.date) {
      alert('Debe seleccionar una fecha');
      return;
    }
    const amountNum = Number(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('Ingrese un monto válido mayor que 0');
      return;
    }

    // Aquí mapeo a los nombres exactos que usa el backend
    if (tipo === 'ingreso') {
      const payload: CreateIncomePayload = {
        module_id: formData.module_id,
        income_type: formData.income_type,
        amount: amountNum,
        date: formData.date,
        description: formData.description || undefined,
      };
      onSave(payload);
    } else {
      const payload: CreateExpensePayload = {
        module_id: formData.module_id,
        expense_type: formData.expense_type,
        amount: amountNum,
        date: formData.date,
        description: formData.description || undefined,
      };
      onSave(payload);
    }
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-red-700 to-red-600 rounded-t-xl">
          <h2 className="text-white text-xl font-semibold">
            Añadir {tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
          </h2>
          <button onClick={onClose}>
            <X className="text-white" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Módulo Asociado</label>
            <select
              name="module_id"
              value={formData.module_id}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Seleccione un módulo</option>
              {modulos.map((m: Module) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {isLoading && <p className="text-xs text-gray-500 mt-1">Cargando módulos...</p>}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tipo</label>
            {tipo === 'ingreso' ? (
              <input
                type="text"
                name="income_type"
                value={formData.income_type}
                onChange={handleChange}
                placeholder="Ej: Pago, Donación"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            ) : (
              <input
                type="text"
                name="expense_type"
                value={formData.expense_type}
                onChange={handleChange}
                placeholder="Ej: Compra, Servicio"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
            )}
          </div>


          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="S/ 0.00"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Comentarios adicionales..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 bg-gray-100 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAddEntrada;
