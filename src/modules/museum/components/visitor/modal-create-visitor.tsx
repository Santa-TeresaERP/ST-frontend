import React, { useState } from 'react';
import { X, Save, Users, ShoppingCart, CreditCard } from 'lucide-react';
import { useSalesChannel } from '../../hook/useSalesChannel';
import { useTypePerson } from '../../hook/useTypePerson';

interface ModalCreateVisitorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: VisitorData) => void;
}

export interface VisitorData {
  tipoVisitante: string;
  canalVenta: string;
  tipoPago: string;
  canalDeVenta: string;
  fecha: string;
  monto: string;
  gratis: string;
}

const ModalCreateVisitor: React.FC<ModalCreateVisitorProps> = ({ isOpen, onClose, onSave }) => {
  const [pagoOptions, setPagoOptions] = useState<string[]>([
    'Efectivo',
    'Tarjeta',
    'Transferencia',
  ]);
  const [canalOptions, setCanalOptions] = useState<string[]>([
    'Taquilla',
    'Web',
    'Agencia',
  ]);

  const [tipoVisitante, setTipoVisitante] = useState('');
  const [canalVenta, setCanalVenta] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [canalDeVenta] = useState('');
  const [fecha, setFecha] = useState('');
  const [monto, setMonto] = useState('');
  const [gratis, setGratis] = useState('');
  const [error, setError] = useState('');

  // Estados para mini-modal
  const [miniOpen, setMiniOpen] = useState<'none' | 'pago' | 'canal'>('none');
  const [newOption, setNewOption] = useState('');

  // Hook para obtener los canales de venta
  const { data: canalesVenta, loading: loadingCanales, error: errorCanales } = useSalesChannel();
  // Hook para obtener los tipos de persona
  const { data: tiposPersona, loading: loadingTipos, error: errorTipos } = useTypePerson();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tipoVisitante || !canalVenta || !tipoPago || !fecha || !monto || !gratis) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    onSave({ tipoVisitante, canalVenta, tipoPago, canalDeVenta, fecha, monto, gratis });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative mx-2">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <Users size={24} />
          <h2 className="text-lg md:text-xl font-semibold text-center">Nuevo Visitante</h2>
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
            {/* Tipo de Visitante */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Tipo de Visitante <span className="text-red-600">*</span>
              </label>
              <select
                value={tipoVisitante}
                onChange={(e) => setTipoVisitante(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                disabled={loadingTipos}
              >
                <option value="">Seleccione un tipo</option>
                {tiposPersona && tiposPersona.map((tipo) => (
                  <option key={tipo.id} value={tipo.name}>
                    {tipo.name}
                  </option>
                ))}
              </select>
              {loadingTipos && (
                <p className="text-xs text-gray-500 mt-1">Cargando tipos de persona...</p>
              )}
              {errorTipos && (
                <p className="text-xs text-red-600 mt-1">{errorTipos}</p>
              )}
            </div>

            {/* Canal de Venta */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Canal de Venta <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={canalVenta}
                  onChange={e => setCanalVenta(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                  disabled={loadingCanales}
                >
                  <option value="">Seleccione un canal</option>
                  {canalesVenta && canalesVenta.map((canal) => (
                    <option key={canal.id} value={canal.name}>
                      {canal.name}
                    </option>
                  ))}
                  {canalOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setMiniOpen('canal')}
                  className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
                  title="Agregar canal"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
              {loadingCanales && (
                <p className="text-xs text-gray-500 mt-1">Cargando canales...</p>
              )}
              {errorCanales && (
                <p className="text-xs text-red-600 mt-1">{errorCanales}</p>
              )}
            </div>

            {/* Tipo de Pago */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Tipo de Pago <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={tipoPago}
                  onChange={e => setTipoPago(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                >
                  <option value="">Seleccione un pago</option>
                  {pagoOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setMiniOpen('pago')}
                  className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
                  title="Agregar pago"
                >
                  <CreditCard size={18} />
                </button>
              </div>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Fecha <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              />
            </div>

            {/* Monto */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Monto Total <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                placeholder="S/ 0.00"
              />
            </div>

            {/* ¿Gratis? */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                ¿Gratis? <span className="text-red-600">*</span>
              </label>
              <select
                value={gratis}
                onChange={(e) => setGratis(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="">Seleccione</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Botones */}
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

      {/* Mini‑Modal creación rápida */}
      {miniOpen !== 'none' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setMiniOpen('none')}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">
                {miniOpen === 'pago' ? 'Nuevo Tipo de Pago' : 'Nuevo Canal de Venta'}
              </h3>
              <button onClick={() => setMiniOpen('none')} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder={miniOpen === 'pago' ? 'Nombre del tipo de pago' : 'Nombre del canal'}
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  if (!newOption.trim()) return;
                  if (miniOpen === 'pago') {
                    setPagoOptions(prev => [...prev, newOption]);
                    setTipoPago(newOption);
                  } else {
                    setCanalOptions(prev => [...prev, newOption]);
                    setCanalVenta(newOption);
                  }
                  setNewOption('');
                  setMiniOpen('none');
                }}
                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition"
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ModalCreateVisitor;
