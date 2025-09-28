/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { X, Save, Users, ShoppingCart, CreditCard, Settings } from 'lucide-react';
import { useSalesChannel } from '../../hook/useSalesChannel';
import { useTypePerson } from '../../hook/useTypePerson';
import { usePaymentMethod } from '../../hook/usePaymentMethod';
import { EntrancePayload } from '../../types/entrance';
import { createEntrance } from '../../action/entrance'; 
import { useAuthStore } from '@/core/store/auth';
import ModalTicketTypes from '../tickets/modal-ticket-types';
import { useFetchUsers } from '@/modules/user-creations/hook/useUsers';

interface ModalCreateVisitorProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void; // Función opcional para refrescar datos
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

const ModalCreateVisitor: React.FC<ModalCreateVisitorProps> = ({ isOpen, onClose, onSuccess }) => {
  const user = useAuthStore((state) => state.user);
  
  // Hook para obtener todos los usuarios
  const { data: usuarios, isLoading: loadingUsuarios } = useFetchUsers();
  
  const [tipoVisitante, setTipoVisitante] = useState('');
  const [canalVenta, setCanalVenta] = useState('');
  const [tipoPago, setTipoPago] = useState('');
  const [fecha, setFecha] = useState(() => new Date().toISOString().split('T')[0]);
  const [cantidad, setCantidad] = useState(1);
  const [monto, setMonto] = useState(''); // monto representará EL TOTAL (unit_price * cantidad)
  const [gratis, setGratis] = useState('');

  // Estados para mini-modal
  const [miniOpen, setMiniOpen] = useState<'none' | 'pago' | 'canal' | 'ticket'>('none');
  const [newOption, setNewOption] = useState('');

  // Hook para obtener los canales de venta
  const { data: canalesVenta, loading: loadingCanales, error: errorCanales, create: createCanalVenta } = useSalesChannel();
  // Hook para obtener los tipos de persona
  const { data: tiposPersona, loading: loadingTipos, error: errorTipos, refetch: refetchTipos } = useTypePerson();
  // Hook para obtener los métodos de pago
  const { data: metodosPago, loading: loadingPagos, error: errorPagos, create: createMetodoPago } = usePaymentMethod();

  // Recalcula monto automáticamente cuando cambian tipoVisitante, cantidad, gratis o tiposPersona
  useEffect(() => {
    if (gratis === 'Si') {
      setMonto('0.00');
      return;
    }

    const selectedTipo = tiposPersona?.find(tipo => tipo.id === tipoVisitante);
    if (selectedTipo) {
      const unit = Number(selectedTipo.base_price) || 0;
      const total = unit * Number(cantidad || 0);
      setMonto(total.toFixed(2));
    } else {
      setMonto('');
    }
  }, [tipoVisitante, cantidad, gratis, tiposPersona]);

  // Handlers: solo actualizan estados; useEffect se encarga del cálculo
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 1) Obtener userId del store o token
    let userId = user?.id;

    if (!userId) {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.userId || payload.id || payload.user_id || payload.sub;
          console.log('Usuario extraído del token:', userId);
        } catch (error) {
          console.error('Error al decodificar token:', error);
        }
      }
    } else {
      console.log('Usuario obtenido del store:', userId);
    }

    // 2) Validar contra la lista de usuarios que ya cargaste (usuarios)
    //    Si el userId no existe en esa lista, usar el primer usuario disponible como fallback.
    if (!loadingUsuarios && Array.isArray(usuarios)) {
      const found = userId && usuarios.some(u => String(u.id) === String(userId));
      if (!found) {
        console.warn(`Usuario (${userId}) no encontrado en lista de usuarios.`);
        if (usuarios.length > 0) {
          // usar el primer usuario como fallback seguro
          console.warn(`Usando primer usuario disponible como fallback: ${usuarios[0].id}`);
          userId = String(usuarios[0].id);
        } else {
          // no hay usuarios cargados -> no podemos continuar
          alert('No se encontró un usuario válido y la lista de usuarios está vacía. Contacte al administrador.');
          return;
        }
      }
    } else {
      // Si aún no cargaron usuarios, evitamos usar hardcode; si no hay userId mostramos error
      if (!userId) {
        alert('No se pudo identificar el usuario (usuarios aún cargando o token inválido). Intente nuevamente.');
        return;
      }
    }

    console.log('Final userId a enviar:', userId);

    // Validaciones formales
    if (!tipoVisitante) {
      alert('Por favor seleccione un tipo de visitante');
      return;
    }
    if (!canalVenta) {
      alert('Por favor seleccione un canal de venta');
      return;
    }
    if (!tipoPago) {
      alert('Por favor seleccione un método de pago');
      return;
    }
    if (!fecha) {
      alert('Por favor seleccione una fecha');
      return;
    }
    if (!cantidad || cantidad <= 0) {
      alert('Por favor ingrese una cantidad válida');
      return;
    }
    if (monto === '' || Number.isNaN(parseFloat(monto)) || parseFloat(monto) < 0) {
      alert('Por favor ingrese un monto válido');
      return;
    }
    if (!gratis) {
      alert('Por favor seleccione si es gratis o no');
      return;
    }

    const payload: EntrancePayload = {
      user_id: String(userId),
      type_person_id: String(tipoVisitante),
      sale_date: fecha,
      cantidad: Number(cantidad),
      sale_number: 'V-' + Date.now(),
      sale_channel: String(canalVenta),
      total_sale: parseFloat(monto), // monto ya es total
      payment_method: String(tipoPago),
      free: gratis === 'Si',
    };

    console.log('Enviando payload a createEntrance:', JSON.stringify(payload, null, 2));

    try {
      const result = await createEntrance(payload);
      console.log('Entrada creada exitosamente:', result);

      // Limpiar formulario (manteniendo diseño)
      setTipoVisitante('');
      setCanalVenta('');
      setTipoPago('');
      setMonto('');
      setGratis('');
      setCantidad(1);

      onClose();

      // Llamar onSuccess para refrescar la tabla
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error al crear entrada:', error);

      // Si hay más detalles en la respuesta del servidor
      if (
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof (error as any).response === 'object' &&
        (error as any).response !== null &&
        'data' in (error as any).response
      ) {
        const serverError = error as { response: { data: any } };
        console.error('Detalles del error del servidor:', serverError.response.data);
        alert(`Error del servidor: ${JSON.stringify(serverError.response.data)}`);
      } else {
        alert('Error al crear la entrada. Revise la consola para más detalles.');
      }
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      {/* Contenedor del modal: Se ajusta para ser responsive */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg lg:max-w-3xl relative mx-auto my-auto overflow-y-auto max-h-[90vh]">
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

        {/* Formulario con campos responsive */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-left">
          {/* El grid ahora es de 1 columna por defecto y se vuelve 2 en pantallas medianas */}
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
                      {tipo.name} - S/. {Number(tipo.base_price).toFixed(2)}
                    </option>
                  ))}
                </select>
                {/* 🔧 BOTONES VERTICALES PARA ADMINISTRAR TIPOS */}
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => setMiniOpen('ticket')}
                    className="px-2 py-1 bg-gray-100 rounded-md border border-gray-300 hover:bg-gray-200 transition text-xs"
                    title="Administrar tipos de ticket"
                  >
                    <Settings size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      console.log('Refrescando tipos manualmente...')
                      refetchTipos()
                    }}
                    className="px-2 py-1 bg-blue-100 rounded-md border border-blue-300 hover:bg-blue-200 transition text-xs"
                    title="Refrescar lista de tipos"
                  >
                    🔄
                  </button>
                </div>
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
                  className={`w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none bg-gray-100`}
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
                  : 'El monto se calcula automáticamente según el tipo y cantidad'
                }
              </p>
            </div>

            {/* Cantidad y ¿Gratis? */}
            <div className="grid grid-cols-2 gap-4">
              {/* Cantidad */}
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Cantidad <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  value={cantidad}
                  onChange={(e) => handleCantidadChange(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-600 focus:outline-none"
                />
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

      {/* Mini-Modal creación rápida (pago) */}
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

      {/* Mini-Modal creación rápida (canal) */}
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
        onClose={() => {
          console.log('Cerrando modal de tipos, refrescando...')
          setMiniOpen('none')
          // ✅ Refrescar tipos cuando se cierre el modal
          setTimeout(() => {
            console.log('Ejecutando refetch retrasado...')
            refetchTipos()
          }, 100)
        }}
        onDataChanged={() => {
          console.log('onDataChanged ejecutado en modal-create-visitor')
          refetchTipos()
        }}
      />
    </div>
  );
};
export default ModalCreateVisitor;
