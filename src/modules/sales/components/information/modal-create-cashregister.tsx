import React, {  } from 'react';
import { FiX } from 'react-icons/fi';
<<<<<<< HEAD
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CashSessionAttributes } from '../../types/cash_sessions.d';
import { useFetchUsers } from '../../hooks/useCashSession';
import { StoreAttributes } from '@/modules/sales/types/store.d';
import { useStoreState } from '@/core/store/store';
import { z } from 'zod';
=======
import { CashSessionAttributes, CreateCashSessionPayload, CloseCashSessionPayload } from '../../types/cash-session';
import { StoreAttributes } from '@/modules/sales/types/store';
>>>>>>> main

interface ModalCreateCashRegisterProps {
  isOpen: boolean;
  onClose: () => void;
<<<<<<< HEAD
  onSubmit: (data: Omit<CashSessionAttributes, 'id'>) => void;
  selectedStore?: StoreAttributes | null; // Mantenemos por compatibilidad
=======
  onSubmit: (data: CreateCashSessionPayload | CloseCashSessionPayload) => void;
  isInitialSetup: boolean;
  activeCashSession?: CashSessionAttributes | null;
  selectedStoreId?: string;
  selectedStore?: StoreAttributes | null;
  currentSessionSales?: number;
  currentSessionReturns?: number; // Agregar pérdidas calculadas
>>>>>>> main
}

interface CashRegisterFormData {
  store_id: string;
  start_amount: number;
  end_amount: number;
  total_returns: number;
  total_sales: number;
}

const ModalCreateCashRegister: React.FC<ModalCreateCashRegisterProps> = ({
  isOpen,
  onClose,
  onSubmit,
<<<<<<< HEAD
  selectedStore: propSelectedStore, // Renombramos para evitar conflictos
}) => {
  const { data: users = [], isLoading: loadingUsers } = useFetchUsers();
  const { selectedStore } = useStoreState();
  
  // Usamos la tienda del store global, o la prop como fallback
  const currentStore = selectedStore || propSelectedStore;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(cashSessionFormSchema),
    defaultValues: {
      store_id: currentStore?.id ? String(currentStore.id) : '',
      ended_at: '',
      start_amount: '',
      end_amount: '',
      total_returns: '',
    },
  });

  // Sincronizar el valor de store_id con la tienda seleccionada
  useEffect(() => {
    if (isOpen && currentStore?.id) {
      setValue('store_id', String(currentStore.id));
    }
  }, [currentStore, isOpen, setValue]);

  const handleFormSubmit = (data: FormValues) => {
    // Usa directamente el id (UUID) de usuario y tienda
    const selectedUser = users.find(u => String(u.id) === String(data.user_id));
    const userId = selectedUser?.id || null;
    const storeId = currentStore?.id || null;

    console.log('selectedUser:', selectedUser);
    console.log('currentStore:', currentStore);
    console.log('userId:', userId, 'storeId:', storeId);

    if (!userId || !storeId) {
      alert('Debes seleccionar un usuario y una tienda válidos.');
      return;
=======
  isInitialSetup,
  activeCashSession,
  selectedStoreId,
  selectedStore,
  currentSessionSales = 0,
  currentSessionReturns = 0 // Agregar valor por defecto para pérdidas
}) => {
  const [formData, setFormData] = React.useState<CashRegisterFormData>({
    store_id: selectedStoreId || '',
    start_amount: 0,
    end_amount: 0,
    total_returns: currentSessionReturns || 0, // Usar pérdidas calculadas
    total_sales: currentSessionSales || 0
  });

  // Efecto para establecer valores iniciales cuando hay una sesión activa
  React.useEffect(() => {
    console.log('📊 Actualizando datos del modal:', {
      currentSessionSales,
      currentSessionReturns,
      activeCashSession: activeCashSession?.id,
      isInitialSetup
    });

    if (activeCashSession && !isInitialSetup) {
      setFormData(prev => ({
        ...prev,
        store_id: activeCashSession.store_id,
        start_amount: Number(activeCashSession.start_amount),
        total_sales: currentSessionSales,
        total_returns: currentSessionReturns
      }));
    } else if (selectedStoreId) {
      setFormData(prev => ({
        ...prev,
        store_id: selectedStoreId,
        total_sales: currentSessionSales,
        total_returns: currentSessionReturns
      }));
    }
  }, [activeCashSession, isInitialSetup, selectedStoreId, currentSessionSales, currentSessionReturns]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['start_amount', 'end_amount', 'total_returns', 'total_sales'].includes(name) ? 
              parseFloat(value) || 0 : value
    }));
  };

  // Calcular el dinero final automáticamente
  React.useEffect(() => {
    if (!isInitialSetup) {
      const calculatedEndAmount = formData.start_amount + formData.total_sales - formData.total_returns;
      setFormData(prev => ({
        ...prev,
        end_amount: Math.max(0, calculatedEndAmount) // No permitir negativos
      }));
>>>>>>> main
    }
  }, [formData.start_amount, formData.total_sales, formData.total_returns, isInitialSetup]);

<<<<<<< HEAD
    const payload: Omit<CashSessionAttributes, 'id'> = {
      user_id: Number(userId),
      store_id: Number(storeId),
      start_amount: Number(data.start_amount),
      end_amount: Number(data.end_amount),
      total_returns: Number(data.total_returns),
      ended_at: new Date(data.ended_at).toISOString(),
    };
    console.log('Payload enviado a createCashSession:', payload);
    onSubmit(payload);
    reset();
=======
  // Si no hay tienda seleccionada, no mostrar el modal
  if (!selectedStore?.id && isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isInitialSetup) {
      // Configuración inicial - solo enviar datos para crear sesión
      if (!formData.store_id && selectedStoreId) {
        setFormData(prev => ({ ...prev, store_id: selectedStoreId }));
        return;
      }
      
      // Para modo de prueba, usar un store_id temporal
      const storeId = formData.store_id || selectedStoreId || 'temp-store-id';
      
      const createPayload: CreateCashSessionPayload = {
        store_id: storeId,
        start_amount: formData.start_amount
      };
      onSubmit(createPayload);
    } else {
      // Cierre de sesión - validación adicional
      if (formData.end_amount < 0) {
        alert('El dinero final no puede ser negativo');
        return;
      }
      
      const closePayload: CloseCashSessionPayload = {
        end_amount: formData.end_amount,
        total_returns: formData.total_returns,
        ended_at: new Date().toISOString(),
        status: 'closed'
      };
      onSubmit(closePayload);
    }
    
>>>>>>> main
    onClose();
    setFormData({
      store_id: selectedStoreId || '',
      start_amount: 0,
      end_amount: 0,
      total_returns: 0,
      total_sales: 0
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
<<<<<<< HEAD
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl relative mx-2">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-700 to-red-900 text-white p-5 rounded-t-2xl flex items-center justify-center relative">
          <h3 className="text-xl font-semibold text-center">Registro Completo de Cierre de Caja</h3>
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300"
            aria-label="Cerrar modal"
          >
            <FiX size={22} />
          </button>
        </div>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Usuario */}
              <div>
                <label htmlFor="user_id" className="block text-gray-700 mb-1">
                  Usuario <span className="text-red-500">*</span>
                </label>
                <select
                  id="user_id"
                  {...register('user_id')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={loadingUsers}
                >
                  <option value="">Seleccione un usuario</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
                {errors.user_id && <p className="text-red-500 text-sm mt-1">{errors.user_id.message}</p>}
              </div>

              {/* Tienda */}
              <div>
                <label htmlFor="store_id" className="block text-gray-700 mb-1">
                  Tienda <span className="text-red-500">*</span>
                </label>
                {currentStore ? (
                  <input
                    id="store_id"
                    type="text"
                    value={currentStore.store_name}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-not-allowed"
                    placeholder="Nombre de la tienda"
                  />
                ) : (
                  <input
                    id="store_id"
                    type="text"
                    placeholder="Selecciona una tienda desde la vista principal"
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-not-allowed"
                  />
                )}
                {/* El id real se envía oculto */}
                <input type="hidden" {...register('store_id')} value={currentStore?.id || ''} />
                {errors.store_id && <p className="text-red-500 text-sm mt-1">{errors.store_id.message}</p>}
                {!currentStore && (
                  <p className="text-amber-600 text-xs mt-1">
                    💡 Selecciona una tienda desde la vista principal para facilitar el llenado
                  </p>
                )}
              </div>

              {/* Dinero Inicial */}
              <div>
                <label htmlFor="start_amount" className="block text-gray-700 mb-1">
                  Dinero Inicial (S/) <span className="text-red-500">*</span>
                </label>
                <input
                  id="start_amount"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                  {...register('start_amount')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="200.00"
                />
                {errors.start_amount && <p className="text-red-500 text-sm mt-1">{errors.start_amount.message}</p>}
              </div>

              {/* Dinero Final */}
              <div>
                <label htmlFor="end_amount" className="block text-gray-700 mb-1">
                  Dinero Final (S/) <span className="text-red-500">*</span>
                </label>
                <input
                  id="end_amount"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                  {...register('end_amount')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="500.00"
                />
                {errors.end_amount && <p className="text-red-500 text-sm mt-1">{errors.end_amount.message}</p>}
              </div>

              {/* Total Pérdidas */}
              <div>
                <label htmlFor="total_returns" className="block text-gray-700 mb-1">
                  Total Pérdidas (S/) <span className="text-red-500">*</span>
                </label>
                <input
                  id="total_returns"
                  type="text"
                  inputMode="decimal"
                  pattern="^[0-9]+(\.[0-9]{1,2})?$"
                  {...register('total_returns')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="20.00"
                />
                {errors.total_returns && <p className="text-red-500 text-sm mt-1">{errors.total_returns.message}</p>}
              </div>

              {/* Fecha de Término */}
              <div>
                <label htmlFor="ended_at" className="block text-gray-700 mb-1">
                  Fecha de Término <span className="text-red-500">*</span>
                </label>
                <input
                  id="ended_at"
                  type="date"
                  {...register('ended_at')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.ended_at && <p className="text-red-500 text-sm mt-1">{errors.ended_at.message}</p>}
              </div>
            </div>

            {/* Tienda */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Tienda <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={selectedStore?.store_name || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none"
                placeholder="Nombre de la tienda"
              />
              <input type="hidden" {...register('store_id')} value={selectedStore?.id || ''} />
              {errors.store_id && <p className="text-sm text-red-600 mt-1">{errors.store_id.message}</p>}
            </div>

            {/* Dinero Inicial */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Dinero Inicial (S/) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+(\.[0-9]{1,2})?$"
                {...register('start_amount')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="200.00"
              />
              {errors.start_amount && <p className="text-sm text-red-600 mt-1">{errors.start_amount.message}</p>}
            </div>

            {/* Dinero Final */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Dinero Final (S/) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+(\.[0-9]{1,2})?$"
                {...register('end_amount')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="500.00"
              />
              {errors.end_amount && <p className="text-sm text-red-600 mt-1">{errors.end_amount.message}</p>}
            </div>

            {/* Total Pérdidas */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Total Pérdidas (S/) <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                pattern="^[0-9]+(\.[0-9]{1,2})?$"
                {...register('total_returns')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="20.00"
              />
              {errors.total_returns && <p className="text-sm text-red-600 mt-1">{errors.total_returns.message}</p>}
            </div>

            {/* Fecha de Término */}
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Fecha de Término <span className="text-red-600">*</span>
              </label>
              <input
                type="date"
                {...register('ended_at')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
              {errors.ended_at && <p className="text-sm text-red-600 mt-1">{errors.ended_at.message}</p>}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
=======
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {isInitialSetup ? 'Configuración Inicial de Caja' : 'Cierre de Sesión de Caja'}
            </h3>
            <button 
>>>>>>> main
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Cerrar modal"
            >
              <FiX size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isInitialSetup ? (
              // Formulario para configuración inicial - SOLO UNA VEZ
              <>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    <strong>Configuración Inicial:</strong> Esta información se solicita solo una vez para inicializar el sistema de caja.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="start_amount" className="block text-gray-700 mb-1">
                      Dinero Inicial (S/) <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="start_amount"
                      type="number"
                      name="start_amount"
                      value={formData.start_amount || ''}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="200.00"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">
                      Tienda
                    </label>
                    <input
                      type="text"
                      value={selectedStore?.store_name || 'Tienda de prueba (no seleccionada)'}
                      className={`w-full px-3 py-2 border rounded-md ${
                        selectedStore 
                          ? 'border-gray-300 bg-gray-100' 
                          : 'border-amber-300 bg-amber-50 text-amber-800'
                      }`}
                      disabled
                    />
                    {!selectedStore && (
                      <p className="text-xs text-amber-600 mt-1">
                        ⚠️ Modo de prueba - selecciona una tienda real para uso en producción
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Formulario para cierre de mes
              <>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
                  <p className="text-amber-800 text-sm">
                    <strong>Cierre de Mes:</strong> El total de ventas se calcula automáticamente a partir de los registros del sistema.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Dinero Inicial (S/)
                    </label>
                    <input
                      type="number"
                      value={Number(activeCashSession?.start_amount || 0).toFixed(2)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      disabled
                    />
                  </div>

                  <div>
                    <label htmlFor="total_sales" className="block text-gray-700 mb-1">
                      Total Ventas del Mes (S/)
                    </label>
                    <input
                      id="total_sales"
                      type="number"
                      name="total_sales"
                      value={formData.total_sales || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      placeholder="Calculado automáticamente"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculado automáticamente del sistema
                    </p>
                  </div>

                  <div>
                    <label htmlFor="total_returns" className="block text-gray-700 mb-1">
                      Total Pérdidas del Mes (S/)
                    </label>
                    <input
                      id="total_returns"
                      type="number"
                      name="total_returns"
                      value={formData.total_returns || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                      placeholder="Calculado automáticamente"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculado automáticamente del sistema
                    </p>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">
                      Dinero Final Calculado (S/)
                    </label>
                    <input
                      type="number"
                      value={formData.end_amount.toFixed(2)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-green-50 text-green-800 font-semibold"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Calculado automáticamente: Inicial + Ventas - Pérdidas
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                {isInitialSetup ? 'Configurar Caja' : 'Cerrar Mes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalCreateCashRegister;