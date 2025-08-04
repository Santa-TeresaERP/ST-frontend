import React, { useState, useEffect } from 'react';
import { X, Save, Pencil, CreditCard, ShoppingCart, Settings } from 'lucide-react';
import { useTypePerson } from '../../hook/useTypePerson';
import { useSalesChannel } from '../../hook/useSalesChannel';
import { usePaymentMethod } from '../../hook/usePaymentMethod';
import { Entrance } from '../../types/entrance';
import ModalTicketTypes from '../tickets/modal-ticket-types';

interface ModalEditVisitorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Omit<Entrance, 'id'>>) => void;
  initialData: Entrance | null;
}

export interface VisitorData {
  tipoVisitante: string;
  canalVenta: string;
  tipoPago: string;
  fecha: string;
  monto: string;
  gratis: string;
}

const ModalEditVisitor: React.FC<ModalEditVisitorProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [tipoVisitante, setTipoVisitante] = useState('');
  const [canalVenta, setCanalVenta] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [fecha, setFecha] = useState('');
  const [monto, setMonto] = useState('');
  const [gratis, setGratis] = useState('');

  // Estados para mini-modal
  const [miniOpen, setMiniOpen] = useState<'none' | 'pago' | 'canal' | 'ticket'>('none');
  const [newOption, setNewOption] = useState('');

  // Hook para obtener los canales de venta
  const { data: canalesVenta, loading: loadingCanales, error: errorCanales, create: createCanalVenta } = useSalesChannel();
  // Hook para obtener los tipos de persona
  const { data: tiposPersona, loading: loadingTipos, error: errorTipos, refetch } = useTypePerson();
  // Hook para obtener los métodos de pago
  const { data: metodosPago, loading: loadingPagos, error: errorPagos, create: createMetodoPago } = usePaymentMethod();

  // Función para actualizar el monto cuando cambia el tipo de visitante
  const handleTipoVisitanteChange = (tipoId: string) => {
    setTipoVisitante(tipoId);
    const selectedTipo = tiposPersona?.find(tipo => tipo.id === tipoId);
    if (selectedTipo && gratis !== 'Si') {
      setMonto(selectedTipo.base_price.toString());
    }
  };

  // Función para manejar el cambio de gratis
  const handleGratisChange = (value: string) => {
    setGratis(value);
    if (value === 'Si') {
      setMonto('0');
    } else if (value === 'No' && tipoVisitante) {
      const selectedTipo = tiposPersona?.find(tipo => tipo.id === tipoVisitante);
      if (selectedTipo) {
        setMonto(selectedTipo.base_price.toString());
      }
    }
  };

  useEffect(() => {
    if (initialData) {
      setTipoVisitante(initialData.type_person_id);
      setCanalVenta(initialData.sale_channel);
      setTipoPago(initialData.payment_method);
      setFecha(initialData.sale_date);
      setMonto(initialData.total_sale.toString());
      setGratis(initialData.free ? 'Si' : 'No');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!gratis) {
      alert('Por favor, seleccione si es gratis o no.');
      return;
    }

    // Solo enviar los campos que han cambiado
    const payload: Partial<Omit<Entrance, 'id'>> = {};

    // Comparar con los datos iniciales y solo incluir los campos modificados
    if (initialData) {
      if (tipoVisitante && tipoVisitante !== initialData.type_person_id) {
        payload.type_person_id = tipoVisitante;
      }
      if (canalVenta && canalVenta !== initialData.sale_channel) {
        payload.sale_channel = canalVenta;
      }
      if (tipoPago && tipoPago !== initialData.payment_method) {
        payload.payment_method = tipoPago;
      }
      if (fecha && fecha !== initialData.sale_date) {
        payload.sale_date = fecha;
      }
      if (monto && parseFloat(monto) !== initialData.total_sale) {
        payload.total_sale = parseFloat(monto);
      }
      // El campo 'free' siempre se incluye si ha cambiado
      const freeValue = gratis === 'Si';
      if (freeValue !== initialData.free) {
        payload.free = freeValue;
      }
    }

    // Si no hay cambios, mostrar mensaje
    if (Object.keys(payload).length === 0) {
      alert('No se detectaron cambios para guardar.');
      return;
    }

    console.log('Payload para actualización:', payload);
    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Contenedor del modal: Se ajusta para ser responsive */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg lg:max-w-3xl relative mx-auto my-auto overflow-y-auto max-h-[90vh]">
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <Pencil size={24} />
          <h2 className="text-lg md:text-xl font-semibold text-center">Editar Visitante</h2>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
          >
            <X size={22} />
          </button>
        </div>

        {/* Formulario con campos responsive */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Visitante */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Tipo de Visitante <span className="text-red-600">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={tipoVisitante}
                  onChange={(e) => handleTipoVisitanteChange(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                  disabled={loadingTipos}
                >
                  <option value="">Seleccione un tipo</option>
                  {tiposPersona && tiposPersona.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.name} - S/. {tipo.base_price.toFixed(2)}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setMiniOpen('ticket')}
                  className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition"
                  title="Administrar tipos de ticket"
                >
                  <Settings size={18} />
                </button>
              </div>
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
                    <option key={canal.id} value={canal.id}>
                      {canal.name}
                    </option>
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
                  disabled={loadingPagos}
                >
                  <option value="">Seleccione un pago</option>
                  {metodosPago && metodosPago.map((metodo) => (
                    <option key={metodo.id} value={metodo.id}>
                      {metodo.name}
                    </option>
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
              {loadingPagos && (
                <p className="text-xs text-gray-500 mt-1">Cargando métodos de pago...</p>
              )}
              {errorPagos && (
                <p className="text-xs text-red-600 mt-1">{errorPagos}</p>
              )}
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
              <div className="relative">
                <input
                  type="number"
                  value={monto}
                  readOnly
                  disabled={gratis !== 'Si'}
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none ${
                    gratis !== 'Si' ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder="S/ 0.00"
                />
                {gratis !== 'Si' && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-gray-500">Automático</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {gratis === 'Si'
                  ? 'Entrada gratuita'
                  : 'El monto se calcula automáticamente según el tipo de ticket'
                }
              </p>
            </div>

            {/* ¿Gratis? */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                ¿Gratis? <span className="text-red-600">*</span>
              </label>
              <select
                value={gratis}
                onChange={(e) => handleGratisChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              >
                <option value="">Seleccione</option>
                <option value="Si">Sí</option>
                <option value="No">No</option>
              </select>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>

      {/* Mini‑Modal creación rápida (pago) */}
      {miniOpen === 'pago' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setMiniOpen('none')}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Nuevo Tipo de Pago</h3>
              <button onClick={() => setMiniOpen('none')} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Nombre del tipo de pago"
            />
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  if (!newOption.trim()) return;
                  try {
                    const newPaymentMethod = await createMetodoPago({ name: newOption.trim() });
                    setTipoPago(newPaymentMethod.id); // Usar el ID del objeto creado
                    setNewOption('');
                    setMiniOpen('none');
                    alert('Método de pago creado exitosamente');
                  } catch (error) {
                    console.error('Error al crear método de pago:', error);
                    alert('Error al crear el método de pago');
                  }
                }}
                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition"
                disabled={!newOption.trim()}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {miniOpen === 'canal' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.target === e.currentTarget && setMiniOpen('none')}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Nuevo Canal de Venta</h3>
              <button onClick={() => setMiniOpen('none')} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
              placeholder="Nombre del canal"
            />
            <div className="flex justify-end">
              <button
                onClick={async () => {
                  if (!newOption.trim()) return;
                  try {
                    const newSalesChannel = await createCanalVenta({ name: newOption.trim() });
                    setCanalVenta(newSalesChannel.id ?? ''); // Usar el ID del objeto creado o string vacío si es undefined
                    setNewOption('');
                    setMiniOpen('none');
                    alert('Canal de venta creado exitosamente');
                  } catch (error) {
                    console.error('Error al crear canal de venta:', error);
                    alert('Error al crear el canal de venta');
                  }
                }}
                className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition"
                disabled={!newOption.trim()}
              >
                Agregar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de administración de tipos de ticket */}
      <ModalTicketTypes 
        isOpen={miniOpen === 'ticket'} 
        onClose={() => setMiniOpen('none')} 
      />
    </div>
  );
};

export default ModalEditVisitor;