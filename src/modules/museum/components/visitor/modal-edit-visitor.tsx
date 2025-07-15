import React, { useState, useEffect } from 'react';
import { X, Save, Pencil } from 'lucide-react';

interface ModalEditVisitorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VisitorData) => void;
  initialData: VisitorData | null;
}

export interface VisitorData {
  tipoVisitante: string;
  canalVenta: string;
  fecha: string;
  monto: string;
  gratis: string;
}

const ModalEditVisitor: React.FC<ModalEditVisitorProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [tipoVisitante, setTipoVisitante] = useState('');
  const [canalVenta, setCanalVenta] = useState('');
  const [fecha, setFecha] = useState('');
  const [monto, setMonto] = useState('');
  const [gratis, setGratis] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setTipoVisitante(initialData.tipoVisitante);
      setCanalVenta(initialData.canalVenta);
      setFecha(initialData.fecha);
      setMonto(initialData.monto);
      setGratis(initialData.gratis);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!tipoVisitante || !canalVenta || !fecha || !monto || !gratis) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    onSave({ tipoVisitante, canalVenta, fecha, monto, gratis });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative mx-2">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <Pencil size={24} />
          <h2 className="text-xl font-semibold text-center">Editar Visitante</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Tipo de Visitante <span className="text-red-600">*</span></label>
              <select
                value={tipoVisitante}
                onChange={(e) => setTipoVisitante(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="">Seleccione un tipo</option>
                <option value="Nacional">Nacional</option>
                <option value="Extranjero">Extranjero</option>
                <option value="Estudiante">Estudiante</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 mb-1 font-medium">Canal de Venta <span className="text-red-600">*</span></label>
              <select
                value={canalVenta}
                onChange={(e) => setCanalVenta(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="">Seleccione un canal</option>
                <option value="Taquilla">Taquilla</option>
                <option value="Web">Web</option>
                <option value="Agencia">Agencia</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Fecha <span className="text-red-600">*</span></label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">Monto Total <span className="text-red-600">*</span></label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="S/ 0.00"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1 font-medium">¿Gratis? <span className="text-red-600">*</span></label>
            <select
              value={gratis}
              onChange={(e) => setGratis(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
            >
              <option value="">Seleccione</option>
              <option value="Si">Sí</option>
              <option value="No">No</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center gap-2"
            >
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditVisitor;