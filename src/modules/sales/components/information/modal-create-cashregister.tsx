import React, {  } from 'react';
import { FiX } from 'react-icons/fi';
import { CashSessionAttributes, CreateCashSessionPayload, CloseCashSessionPayload } from '../../types/cash-session';
import { StoreAttributes } from '@/modules/sales/types/store';

interface ModalCreateCashRegisterProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCashSessionPayload | CloseCashSessionPayload) => void;
  isInitialSetup: boolean;
  activeCashSession?: CashSessionAttributes | null;
  selectedStoreId?: string;
  selectedStore?: StoreAttributes | null;
  currentSessionSales?: number;
  currentSessionReturns?: number; // Agregar pérdidas calculadas
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
  isInitialSetup,
  activeCashSession,
  selectedStoreId,
  selectedStore,
  currentSessionSales = 0,
  currentSessionReturns = 0
}) => {
  const [formData, setFormData] = React.useState<CashRegisterFormData>({
    store_id: selectedStoreId || '',
    start_amount: 0,
    end_amount: 0,
    total_returns: currentSessionReturns || 0,
    total_sales: currentSessionSales || 0
  });

  // Efecto para establecer valores iniciales cuando hay una sesión activa
  React.useEffect(() => {
    console.log('📊 Actualizando datos del modal para tienda:', selectedStore?.store_name, {
      currentSessionSales,
      currentSessionReturns,
      activeCashSession: activeCashSession?.id,
      isInitialSetup,
      selectedStoreId
    });

    // ✅ CORREGIDO: Validar que la sesión pertenece a la tienda seleccionada
    if (activeCashSession && !isInitialSetup && selectedStoreId && activeCashSession.store_id === selectedStoreId) {
      setFormData(prev => ({
        ...prev,
        store_id: activeCashSession.store_id,
        start_amount: Number(activeCashSession.start_amount),
        total_sales: currentSessionSales,
        total_returns: currentSessionReturns
      }));
    } else if (selectedStoreId) {
      // Solo actualizar datos de la tienda si coincide
      setFormData(prev => ({
        ...prev,
        store_id: selectedStoreId,
        total_sales: currentSessionSales,
        total_returns: currentSessionReturns
      }));
    }
  }, [activeCashSession, isInitialSetup, selectedStoreId, selectedStore?.store_name, currentSessionSales, currentSessionReturns]);

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
    }
  }, [formData.start_amount, formData.total_sales, formData.total_returns, isInitialSetup]);

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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg md:max-w-2xl my-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {isInitialSetup ? 'Configuración Inicial de Caja' : 'Cierre de Sesión de Caja'}
            </h3>
            <button 
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
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
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
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
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