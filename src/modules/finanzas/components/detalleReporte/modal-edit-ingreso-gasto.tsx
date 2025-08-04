import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ModalEditProps {
  tipo: 'ingreso' | 'gasto';
  data: {
    id: number;
    modulo: string;
    tipo: string;
    monto: string;
    fecha: string;
    observaciones: string;
  };
  onSave: (updated: any) => void;
  onClose: () => void;
}

const ModalEditEntrada: React.FC<ModalEditProps> = ({ tipo, data, onSave, onClose }) => {
  const [form, setForm] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Editar {tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Módulo</label>
            <input
              type="text"
              name="modulo"
              value={form.modulo}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <input
              type="text"
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="text"
              name="monto"
              value={form.monto}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={form.fecha}
              onChange={handleChange}
              className="mt-1 block w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Observaciones</label>
          <textarea
            name="observaciones"
            value={form.observaciones}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-lg text-white font-semibold ${
              tipo === 'ingreso'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditEntrada;