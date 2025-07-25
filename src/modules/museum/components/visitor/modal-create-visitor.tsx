/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { X, Save, Users, ShoppingCart, CreditCard, Settings } from 'lucide-react';
import { useSalesChannel } from '../../hook/useSalesChannel';
import { useTypePerson } from '../../hook/useTypePerson';
import { usePaymentMethod } from '../../hook/usePaymentMethod';
import { EntrancePayload } from '../../types/entrance';
import { createEntrance} from '../../action/entrance'; 
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Obtener usuario ID del store Zustand (prioritario) o del token JWT
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

    if (!userId) {
      alert('Error: No se puede identificar el usuario. Por favor, inicie sesión nuevamente.');
      return;
    }

    // Verificar si el usuario existe haciendo una llamada de prueba
    console.log('Verificando usuario:', userId);
    
    // TEMPORAL: Si el usuario del token no existe, usar el que sabemos que existe
    // Esto es solo mientras arreglas el problema del token
    const EXISTING_USER_ID = 'd513ad58-19c6-4bf7-82de-28de4351b423';
    
    // Verificar si el usuario existe en la lista de usuarios
    if (!loadingUsuarios && usuarios) {
      const userExists = usuarios.some(u => u.id === userId);
      
      if (!userExists) {
        console.warn(`⚠️ Usuario del token (${userId}) no existe en la BD`);
        console.log(`✅ Usando usuario existente: ${EXISTING_USER_ID}`);
        userId = EXISTING_USER_ID;
        
      }
    } else if (loadingUsuarios) {
      console.log('⚠️ Usuarios aún cargando, usando usuario por defecto');
      userId = EXISTING_USER_ID;
    }

    // Validar que todos los campos requeridos están completos
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
    if (!monto || parseFloat(monto) < 0) {
      alert('Por favor ingrese un monto válido');
      return;
    }
    if (!gratis) {
      alert('Por favor seleccione si es gratis o no');
      return;
    }

    const payload: EntrancePayload = {
      user_id: String(userId), // Usar el ID del token
      type_person_id: String(tipoVisitante),
      sale_date: fecha,
      sale_number: 'V-' + Date.now(),
      sale_channel: String(canalVenta), // Asegurar que sea string (ID)
      total_sale: parseFloat(monto),
      payment_method: String(tipoPago), // Asegurar que sea string (ID)
      free: gratis === 'Si',
    };

    console.log('Creando entrada para usuario:', payload.user_id);

    try {
      const result = await createEntrance(payload);
      console.log('Entrada creada exitosamente:', result);
      
      // Limpiar formulario
      setTipoVisitante('');
      setCanalVenta('');
      setTipoPago('');
      setMonto('');
      setGratis('');
    
      onClose();
      
      // Llamar onSuccess para refrescar la tabla
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl relative mx-2">
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
        onClose={() => setMiniOpen('none')} 
        onCreated={refetch}
      />
    </div>
  );
};
export default ModalCreateVisitor;
