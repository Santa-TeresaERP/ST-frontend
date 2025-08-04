import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Props {
  onClose: () => void;
  onSave: (data: any) => void;
  tipo: 'ingreso' | 'gasto';
}

const ModalAddEntrada: React.FC<Props> = ({ onClose, onSave, tipo }) => {
  const [formData, setFormData] = useState({
    modulo: '',
    tipo: '',
    monto: '',
    fecha: '',
    observaciones: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({ ...formData, observaciones: formData.observaciones || '' });
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
              name="modulo"
              value={formData.modulo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="">Seleccione un módulo</option>
              <option value="Ventas">Ventas</option>
              <option value="Servicios">Servicios</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Tipo</label>
            <input
              type="text"
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Ej: Pago, Donación"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="S/ 0.00"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">Observaciones</label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
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
