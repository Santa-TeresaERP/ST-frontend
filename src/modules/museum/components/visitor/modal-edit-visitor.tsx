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
  cantidad: number;
  monto: string;
  gratis: string;
}

const ModalEditVisitor: React.FC<ModalEditVisitorProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [tipoVisitante, setTipoVisitante] = useState('');
  const [canalVenta, setCanalVenta] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [fecha, setFecha] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [monto, setMonto] = useState('');
  const [gratis, setGratis] = useState('');

  // Estados para mini-modal
  const [miniOpen, setMiniOpen] = useState<'none' | 'pago' | 'canal' | 'ticket'>('none');
  const [newOption, setNewOption] = useState('');

  // Hooks
  const { data: canalesVenta, loading: loadingCanales, error: errorCanales, create: createCanalVenta } = useSalesChannel();
  const { data: tiposPersona, loading: loadingTipos, error: errorTipos, refetch } = useTypePerson();
  const { data: metodosPago, loading: loadingPagos, error: errorPagos, create: createMetodoPago } = usePaymentMethod();

  // Poblar campos cuando cambie initialData
  useEffect(() => {
    if (initialData) {
      setTipoVisitante(initialData.type_person_id || '');
      setCanalVenta(initialData.sale_channel || '');
      setTipoPago(initialData.payment_method || '');
      setFecha(initialData.sale_date || '');
      setCantidad(initialData.cantidad ?? 1);
      setGratis(initialData.free ? 'Si' : 'No');
      // NO seteamos monto aquí directamente para evitar inconsistencias:
      // lo recalculará el useEffect que sigue.
    } else {
      // reset si no hay initialData
      setTipoVisitante('');
      setCanalVenta('');
      setTipoPago('');
      setFecha('');
      setCantidad(1);
      setMonto('');
      setGratis('');
    }
  }, [initialData]);

  // Recalcula monto automáticamente cuando cambian tipoVisitante, cantidad, gratis o tiposPersona
  useEffect(() => {
    // Si es gratis -> monto 0.00
    if (gratis === 'Si') {
      setMonto('0.00');
      return;
    }

    // Buscar el tipo seleccionado para obtener base_price
    const selectedTipo = tiposPersona?.find(tipo => tipo.id === tipoVisitante);
    if (selectedTipo) {
      const unit = Number(selectedTipo.base_price) || 0;
      const qty = Number(cantidad) || 0;
      const total = unit * qty;
      setMonto(total.toFixed(2));
    } else {
      // Si no hay tipo seleccionado y initialData trae total_sale, conservarlo (caso edición)
      if (initialData && typeof initialData.total_sale === 'number') {
        setMonto(Number(initialData.total_sale).toFixed(2));
      } else {
        setMonto('');
      }
    }
  }, [tipoVisitante, cantidad, gratis, tiposPersona, initialData]);

  // Handlers
  const handleTipoVisitanteChange = (tipoId: string) => {
    setTipoVisitante(tipoId);
  };

  const handleGratisChange = (value: string) => {
    setGratis(value);
  };

  const handleCantidadChange = (value: number) => {
    const n = Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
    setCantidad(n);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!gratis) {
      alert('Por favor, seleccione si es gratis o no.');
      return;
    }

    const payload: Partial<Omit<Entrance, 'id'>> = {};

    if (initialData) {
      if (tipoVisitante && tipoVisitante !== initialData.type_person_id) payload.type_person_id = tipoVisitante;
      if (canalVenta && canalVenta !== initialData.sale_channel) payload.sale_channel = canalVenta;
      if (tipoPago && tipoPago !== initialData.payment_method) payload.payment_method = tipoPago;
      if (fecha && fecha !== initialData.sale_date) payload.sale_date = fecha;
      if (cantidad && cantidad !== initialData.cantidad) payload.cantidad = cantidad;
      // parse monto a number y comparar contra total_sale
      const montoNum = monto === '' ? NaN : parseFloat(monto);
      if (!Number.isNaN(montoNum) && montoNum !== initialData.total_sale) payload.total_sale = montoNum;
      const freeValue = gratis === 'Si';
      if (freeValue !== initialData.free) payload.free = freeValue;
    } else {
      // si no hay initialData (caso raro), enviar campos mínimos
      payload.type_person_id = tipoVisitante;
      payload.sale_channel = canalVenta;
      payload.payment_method = tipoPago;
      payload.sale_date = fecha;
      payload.cantidad = cantidad;
      payload.total_sale = monto === '' ? 0 : parseFloat(monto);
      payload.free = gratis === 'Si';
    }

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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tipo de Visitante */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Tipo de Visitante <span className="text-red-600">*</span></label>
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
                      {tipo.name} - S/. {Number(tipo.base_price).toFixed(2)}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => setMiniOpen('ticket')} className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition" title="Administrar tipos de ticket">
                  <Settings size={18} />
                </button>
              </div>
              {loadingTipos && <p className="text-xs text-gray-500 mt-1">Cargando tipos de persona...</p>}
              {errorTipos && <p className="text-xs text-red-600 mt-1">{errorTipos}</p>}
            </div>

            {/* Canal de Venta */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Canal de Venta <span className="text-red-600">*</span></label>
              <div className="flex gap-2">
                <select
                  value={canalVenta}
                  onChange={e => setCanalVenta(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                  disabled={loadingCanales}
                >
                  <option value="">Seleccione un canal</option>
                  {canalesVenta && canalesVenta.map((canal) => (
                    <option key={canal.id} value={canal.id}>{canal.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setMiniOpen('canal')} className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition" title="Agregar canal">
                  <ShoppingCart size={18} />
                </button>
              </div>
              {loadingCanales && <p className="text-xs text-gray-500 mt-1">Cargando canales...</p>}
              {errorCanales && <p className="text-xs text-red-600 mt-1">{errorCanales}</p>}
            </div>

            {/* Tipo de Pago */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Tipo de Pago <span className="text-red-600">*</span></label>
              <div className="flex gap-2">
                <select
                  value={tipoPago}
                  onChange={e => setTipoPago(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                  disabled={loadingPagos}
                >
                  <option value="">Seleccione un pago</option>
                  {metodosPago && metodosPago.map((metodo) => (
                    <option key={metodo.id} value={metodo.id}>{metodo.name}</option>
                  ))}
                </select>
                <button type="button" onClick={() => setMiniOpen('pago')} className="px-3 py-2 bg-gray-100 rounded-lg border border-gray-300 hover:bg-gray-200 transition" title="Agregar pago">
                  <CreditCard size={18} />
                </button>
              </div>
              {loadingPagos && <p className="text-xs text-gray-500 mt-1">Cargando métodos de pago...</p>}
              {errorPagos && <p className="text-xs text-red-600 mt-1">{errorPagos}</p>}
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Fecha <span className="text-red-600">*</span></label>
              <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none" />
            </div>

            {/* Monto */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">Monto Total <span className="text-red-600">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  value={monto}
                  readOnly
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none ${gratis !== 'Si' ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  placeholder="S/ 0.00"
                />
                {gratis !== 'Si' && (
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-xs text-gray-500">Automático</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">{gratis === 'Si' ? 'Entrada gratuita' : 'El monto se calcula automáticamente según el tipo de ticket'}</p>
            </div>

            {/* Cantidad y ¿Gratis? */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">Cantidad <span className="text-red-600">*</span></label>
                <input type="number" min={1} value={cantidad} onChange={(e) => handleCantidadChange(Number(e.target.value))} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none" />
              </div>

              <div>
                <label className="block text-gray-700 mb-1 font-medium">¿Gratis? <span className="text-red-600">*</span></label>
                <select value={gratis} onChange={(e) => handleGratisChange(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none">
                  <option value="">Seleccione</option>
                  <option value="Si">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition w-full sm:w-auto">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center gap-2 w-full sm:w-auto">
              <Save size={18} /> Guardar
            </button>
          </div>
        </form>
      </div>

      {/* Mini-modals */}
      {miniOpen === 'pago' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => e.target === e.currentTarget && setMiniOpen('none')}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Nuevo Tipo de Pago</h3>
              <button onClick={() => setMiniOpen('none')} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <input type="text" value={newOption} onChange={(e) => setNewOption(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Nombre del tipo de pago" />
            <div className="flex justify-end">
              <button onClick={async () => {
                if (!newOption.trim()) return;
                try {
                  const newPaymentMethod = await createMetodoPago({ name: newOption.trim() });
                  setTipoPago(newPaymentMethod.id);
                  setNewOption('');
                  setMiniOpen('none');
                  alert('Método de pago creado exitosamente');
                } catch (error) {
                  console.error('Error al crear método de pago:', error);
                  alert('Error al crear el método de pago');
                }
              }} className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition" disabled={!newOption.trim()}>Agregar</button>
            </div>
          </div>
        </div>
      )}

      {miniOpen === 'canal' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={(e) => e.target === e.currentTarget && setMiniOpen('none')}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Nuevo Canal de Venta</h3>
              <button onClick={() => setMiniOpen('none')} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <input type="text" value={newOption} onChange={(e) => setNewOption(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none" placeholder="Nombre del canal" />
            <div className="flex justify-end">
              <button onClick={async () => {
                if (!newOption.trim()) return;
                try {
                  const newSalesChannel = await createCanalVenta({ name: newOption.trim() });
                  setCanalVenta(newSalesChannel.id ?? '');
                  setNewOption('');
                  setMiniOpen('none');
                  alert('Canal de venta creado exitosamente');
                } catch (error) {
                  console.error('Error al crear canal de venta:', error);
                  alert('Error al crear el canal de venta');
                }
              }} className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition" disabled={!newOption.trim()}>Agregar</button>
            </div>
          </div>
        </div>
      )}

      <ModalTicketTypes isOpen={miniOpen === 'ticket'} onClose={() => setMiniOpen('none')} />
    </div>
  );
};

export default ModalEditVisitor;
