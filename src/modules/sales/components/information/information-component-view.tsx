/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { FiInfo, FiMapPin, FiHome, FiClipboard, FiDollarSign, FiPlus } from 'react-icons/fi';
import { StoreAttributes } from '@/modules/stores/types/store';
import ModalCreateCashRegister from './modal-create-cashregister';
import { CreateCashSessionPayload, CloseCashSessionPayload } from '../../types/cash-session';
import { useCreateCashSession, useCloseCashSession, useFetchActiveCashSession, useFetchCashSessionHistory } from '../../hooks/useCashSession';
import { useFetchSales } from '../../hooks/useSales';
import { useQueryClient } from '@tanstack/react-query';

interface InformationComponentViewProps {
  selectedStore?: StoreAttributes | null;
}

const InformationComponentView: React.FC<InformationComponentViewProps> = ({ selectedStore }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(true);
  const queryClient = useQueryClient();

  // Helper para convertir valores monetarios a número - convertido a useCallback para evitar recreación en cada render
  const toMoney = React.useCallback((value: number | string | undefined | null): string => {
    if (value === undefined || value === null) return '0.00';
    return Number(value).toFixed(2);
  }, []);

  // Hooks para manejar cash sessions
  const createCashSessionMutation = useCreateCashSession();
  const closeCashSessionMutation = useCloseCashSession();
  
  // Obtener sesión activa y historial si hay una tienda seleccionada
  // Los hooks ya tienen { enabled: !!storeId } incorporado
  const { data: activeCashSession, isLoading: loadingActive, error: errorActive } = useFetchActiveCashSession(selectedStore?.id);
  const { data: cashSessionHistory = [], isLoading: loadingHistory, error: errorHistory } = useFetchCashSessionHistory(selectedStore?.id);
  
  // Obtener todas las ventas para calcular los totales por tienda
  const { data: allSales = [], isLoading: loadingSales } = useFetchSales();

  // Refrescar queries cuando cambie la tienda seleccionada
  React.useEffect(() => {
    console.log('🔄 Tienda cambió:', selectedStore?.id, selectedStore?.store_name);
    
    // Si hay una tienda seleccionada, invalidar para refrescar
    if (selectedStore?.id) {
      console.log('🔄 Refrescando queries para tienda:', selectedStore.id, selectedStore.store_name);
      // Solo invalidar para refrescar, no remover del cache
      queryClient.invalidateQueries({ queryKey: ['activeCashSession', selectedStore.id] });
      queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', selectedStore.id] });
    }
  }, [selectedStore?.id, selectedStore?.store_name, queryClient]);
  
  // Filtrar los datos específicamente para la tienda seleccionada
  const filteredActiveCashSession = React.useMemo(() => {
    // Verificar que la sesión sea activa (status: 'open') además de pertenecer a la tienda seleccionada
    return selectedStore && activeCashSession?.store_id === selectedStore.id && activeCashSession?.status === 'open'
      ? activeCashSession 
      : null;
  }, [selectedStore, activeCashSession]);
    
  const filteredCashSessionHistory = React.useMemo(() => {
    return selectedStore 
      ? cashSessionHistory.filter(session => session.store_id === selectedStore.id)
      : [];
  }, [selectedStore, cashSessionHistory]);

  // Calcular ventas totales por tienda y por sesión
  const salesBySession = React.useMemo(() => {
    if (!selectedStore || !allSales.length) return {};
    
    const result: { [sessionId: string]: number } = {};
    
    // Para cada sesión de caja en el historial
    filteredCashSessionHistory.forEach(session => {
      // Fechas de inicio y fin de la sesión
      const sessionStartDate = new Date(session.started_at);
      const sessionEndDate = session.ended_at ? new Date(session.ended_at) : new Date();
      
      // Filtrar ventas que pertenecen a esta tienda y están dentro del período de la sesión
      const sessionSales = allSales.filter(sale => {
        const saleDate = new Date(sale.income_date);
        return (
          sale.store_id === selectedStore.id &&
          saleDate >= sessionStartDate && 
          saleDate <= sessionEndDate
        );
      });
      
      // Sumar el total de ventas para esta sesión
      result[session.id || ''] = sessionSales.reduce((sum, sale) => sum + Number(sale.total_income), 0);
    });
    
    return result;
  }, [selectedStore, allSales, filteredCashSessionHistory]);
  
  // Calcular las ventas totales para la sesión activa
  const currentSessionSales = React.useMemo(() => {
    if (!filteredActiveCashSession || !allSales.length || !selectedStore) return 0;
    
    const sessionStartDate = new Date(filteredActiveCashSession.started_at);
    
    // Filtrar ventas que pertenecen a esta tienda y están dentro del período de la sesión activa
    const activeSales = allSales.filter(sale => {
      const saleDate = new Date(sale.income_date);
      return (
        sale.store_id === selectedStore.id &&
        saleDate >= sessionStartDate
      );
    });
    
    // Sumar el total de ventas para la sesión activa
    return activeSales.reduce((sum, sale) => sum + Number(sale.total_income), 0);
  }, [filteredActiveCashSession, allSales, selectedStore]);

  // Debug logs - solo en entorno de desarrollo y menos verboso
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Debug info básica:', {
        selectedStoreId: selectedStore?.id,
        hasActiveSession: !!filteredActiveCashSession,
        historyCount: filteredCashSessionHistory.length,
        currentSales: currentSessionSales ? `S/ ${toMoney(currentSessionSales)}` : '0.00',
        isInitialSetup
      });
    }
  }, [selectedStore?.id, filteredActiveCashSession, filteredCashSessionHistory.length, currentSessionSales, isInitialSetup, toMoney]);

  // Determinar si necesitamos configuración inicial de forma más eficiente
  React.useEffect(() => {
    // Solo actualizar cuando cambien valores relevantes
    setIsInitialSetup(!filteredActiveCashSession);
  }, [filteredActiveCashSession]);

  // Verificar automáticamente si necesita cerrarse - optimizado
  const shouldCloseSession = React.useMemo(() => {
    if (!filteredActiveCashSession) return false;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const sessionStartDate = new Date(filteredActiveCashSession.started_at);
    const sessionMonth = sessionStartDate.getMonth();
    const sessionYear = sessionStartDate.getFullYear();
    
    // Si estamos en un mes diferente al de inicio de la sesión
    return (currentMonth !== sessionMonth || currentYear !== sessionYear);
  }, [filteredActiveCashSession]);

  // Notificar sobre cierre necesario
  React.useEffect(() => {
    if (shouldCloseSession && !isModalOpen) {
      // Solo log en desarrollo
      if (process.env.NODE_ENV === 'development') {
        console.log('Se debe cerrar la sesión del mes anterior');
      }
    }
  }, [shouldCloseSession, isModalOpen]);

  const handleCreateCashRegister = (data: CreateCashSessionPayload | CloseCashSessionPayload) => {
    console.log('Datos enviados:', data); // Debug log
    
    if ('store_id' in data) {
      // Es una creación de sesión inicial
      console.log('Creando nueva sesión para tienda:', data.store_id); // Debug log
      createCashSessionMutation.mutate(data as CreateCashSessionPayload, {
        onSuccess: (response) => {
          console.log('✅ Sesión de caja creada exitosamente:', response);
          setIsModalOpen(false);
          // Invalidar las queries para forzar recarga
          queryClient.invalidateQueries({ queryKey: ['activeCashSession', selectedStore?.id] });
          queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', selectedStore?.id] });
        },
        onError: (error) => {
          console.error('❌ Error al crear sesión de caja:', error);
          alert(`Error al crear sesión: ${error.message || 'Error desconocido'}`);
        }
      });
    } else if (filteredActiveCashSession?.id) {
      // Es un cierre de sesión
      console.log('Cerrando sesión:', filteredActiveCashSession.id); // Debug log
      
      // Agregar automáticamente las ventas del período a los datos de cierre
      const closureData = data as CloseCashSessionPayload;
      
      // Siempre incluir las ventas actuales calculadas
      if (currentSessionSales > 0) {
        console.log('Incluyendo ventas actuales en el cierre:', currentSessionSales);
        closureData.total_sales = currentSessionSales;
      }
      
      closeCashSessionMutation.mutate(
        { id: filteredActiveCashSession.id, payload: closureData },
        {
          onSuccess: (response) => {
            console.log('✅ Sesión de caja cerrada exitosamente:', response);
            setIsModalOpen(false);
            
            // Forzar actualización del caché
            queryClient.removeQueries({ queryKey: ['activeCashSession', selectedStore?.id] });
            queryClient.invalidateQueries({ queryKey: ['activeCashSession', selectedStore?.id] });
            queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', selectedStore?.id] });
            
            // Crear nueva sesión automáticamente con el monto final como monto inicial
            const endAmount = response.end_amount;
            if (endAmount && selectedStore?.id) {
              console.log('🔄 Creando nueva sesión con monto inicial de sesión anterior:', endAmount);
              
              const newSessionData: CreateCashSessionPayload = {
                store_id: selectedStore.id,
                start_amount: Number(endAmount)
              };
              
              // Crear nueva sesión automáticamente
              createCashSessionMutation.mutate(newSessionData, {
                onSuccess: (newSession) => {
                  console.log('✅ Nueva sesión creada automáticamente:', newSession);
                  
                  // Actualizar las consultas nuevamente
                  queryClient.invalidateQueries({ queryKey: ['activeCashSession', selectedStore.id] });
                  queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', selectedStore.id] });
                  
                  // Actualizar UI para reflejar la nueva sesión activa
                  setTimeout(() => {
                    console.log('Actualizando UI para mostrar nueva sesión');
                    setIsInitialSetup(false);
                  }, 100);
                },
                onError: (error) => {
                  console.error('❌ Error al crear sesión automática:', error);
                  
                  // Si falla la creación automática, simplemente mostrar la UI de configuración inicial
                  setTimeout(() => {
                    console.log('Forzando re-evaluación de isInitialSetup');
                    setIsInitialSetup(true);
                  }, 100);
                }
              });
            } else {
              // Si no hay monto final o tienda, solo actualizar la UI
              setTimeout(() => {
                console.log('Forzando re-evaluación de isInitialSetup');
                setIsInitialSetup(true);
              }, 100);
            }
          },
          onError: (error) => {
            console.error('❌ Error al cerrar sesión de caja:', error);
            alert(`Error al cerrar sesión: ${error.message || 'Error desconocido'}`);
          }
        }
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
      {/* Debug info - remover después */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
          <strong>Seleccionado:</strong> {selectedStore ? selectedStore.store_name : 'null/undefined'}
        </div>
      )}
      
      {/* Información de la Tienda */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
          <FiInfo className="text-red-600" size={24} />
          <span>Información de la Tienda</span>
        </h2>
        {selectedStore && (
          <button
            onClick={() => setIsEditStoreModalOpen(true)}
            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors ml-auto"
            style={{ minWidth: 0 }}
          >
            <FiPlus size={18} />
            <span>Editar Tienda</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <FiHome className="text-red-500" size={20} />
            <span className="font-semibold">Nombre de la tienda</span>
          </div>
          <p className={selectedStore ? 'text-gray-900' : 'text-gray-400 italic'}>
            {selectedStore ? selectedStore.store_name : 'Selecciona una tienda para ver su información'}
          </p>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <FiMapPin className="text-red-500" size={20} />
            <span className="font-semibold">Dirección</span>
          </div>
          <p className={selectedStore ? 'text-gray-900' : 'text-gray-400 italic'}>
            {selectedStore ? selectedStore.address : 'Selecciona una tienda para ver su dirección'}
          </p>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 shadow-sm text-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <FiClipboard className="text-red-500" size={20} />
          <span className="font-semibold">Observaciones</span>
        </div>
        <p className={selectedStore ? 'text-gray-900' : 'text-gray-400 italic'}>
          {selectedStore ? 
            (selectedStore.observations || 'Sin observaciones registradas') : 
            'Selecciona una tienda para ver sus observaciones'
          }
        </p>
      </div>

      {/* Información de la Caja */}
      <div className="flex justify-between items-center pt-6">
        <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
          <FiDollarSign className="text-red-600" size={24} />
          <span>Información de Caja</span>
        </h2>
        <div className="flex flex-col items-end">
          <button
            onClick={() => {
              console.log('🔘 Botón clickeado:', {
                activeCashSession: filteredActiveCashSession,
                isInitialSetup,
                selectedStore: selectedStore?.id,
                sessionStoreId: filteredActiveCashSession?.store_id
              });
              
              if (!selectedStore?.id) {
                alert('Por favor selecciona una tienda antes de configurar la caja.');
                return;
              }
              
              setIsModalOpen(true);
            }}
            disabled={!selectedStore?.id}
            className={`flex items-center space-x-1 px-4 py-2 rounded-lg transition-colors ${
              !selectedStore?.id
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            <FiPlus size={18} />
            <span>
              {!selectedStore?.id
                ? 'Selecciona Tienda'
                : isInitialSetup
                  ? 'Configurar Caja' 
                  : 'Cerrar Mes'
              }
            </span>
          </button>
          {!selectedStore && (
            <p className="text-xs text-gray-500 mt-1">
              ⚠️ Selecciona una tienda para configurar la caja
            </p>
          )}
          {selectedStore && !isInitialSetup && (
            <p className="text-xs text-blue-600 mt-1">
              📊 Sesión activa - listo para cerrar mes
            </p>
          )}
          {selectedStore && isInitialSetup && (
            <p className="text-xs text-green-600 mt-1">
              ✅ Listo para configurar caja en {selectedStore.store_name}
            </p>
          )}
        </div>
      </div>

      {/* Información de la sesión activa */}
      {selectedStore && loadingActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Cargando información de {selectedStore.store_name}...</h3>
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-lg bg-blue-200 h-20 w-full"></div>
          </div>
        </div>
      )}
      {filteredActiveCashSession && !loadingActive && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Sesión Activa - {selectedStore?.store_name}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">Dinero Inicial:</span>
              <p className="text-green-900">S/ {toMoney(filteredActiveCashSession.start_amount)}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Ventas Actuales:</span>
              <p className="text-green-900">S/ {toMoney(currentSessionSales)}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Fecha de Inicio:</span>
              <p className="text-green-900">{new Date(filteredActiveCashSession.started_at).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="font-medium text-green-700">Estado:</span>
              <p className="text-green-900">
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  Activo
                </span>
              </p>
            </div>
          </div>
          {/* Mensaje para sesión creada automáticamente */}
          {filteredCashSessionHistory.length > 0 &&
           new Date(filteredActiveCashSession.started_at).getTime() > 
           new Date(filteredCashSessionHistory[0].ended_at || '').getTime() - 5000 && (
            <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded">
              <p className="text-blue-800 text-sm">
                ℹ️ <strong>Nota:</strong> Esta sesión fue creada automáticamente al cerrar la anterior. 
                El dinero inicial corresponde al dinero final de la sesión previa.
              </p>
            </div>
          )}
          {shouldCloseSession && (
            <div className="mt-3 p-2 bg-amber-100 border border-amber-300 rounded">
              <p className="text-amber-800 text-sm">
                ⚠️ <strong>Atención:</strong> La sesión actual corresponde al mes anterior. Es recomendable cerrarla.
              </p>
            </div>
          )}
        </div>
      )}
      {!filteredActiveCashSession && !loadingActive && selectedStore && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No hay sesión activa - {selectedStore?.store_name}</h3>
          <p className="text-yellow-700">Puedes configurar una nueva sesión de caja utilizando el botón &quot;Configurar Caja&quot;.</p>
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="min-w-full bg-white text-left text-gray-700">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-4 py-2 text-center">Período</th>
              <th className="px-4 py-2 text-center">Dinero Inicial</th>
              <th className="px-4 py-2 text-center">Total Ventas</th>
              <th className="px-4 py-2 text-center">Total Pérdidas</th>
              <th className="px-4 py-2 text-center">Dinero Final</th>
              <th className="px-4 py-2 text-center">Estado</th>
              <th className="px-4 py-2 text-center">Fecha Cierre</th>
            </tr>
          </thead>
          <tbody>
            {!selectedStore ? (
              <tr className="border-t">
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Selecciona una tienda para ver los registros de caja
                </td>
              </tr>
            ) : loadingHistory ? (
              <tr className="border-t">
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Cargando historial de {selectedStore.store_name}...
                </td>
              </tr>
            ) : errorHistory ? (
              <tr className="border-t">
                <td colSpan={7} className="px-4 py-8 text-center text-red-500">
                  Error al cargar historial de {selectedStore.store_name}: {errorHistory.message}
                </td>
              </tr>
            ) : filteredCashSessionHistory.length > 0 ? (
              filteredCashSessionHistory.map((session, index) => (
                <tr key={session.id || index} className={index % 2 === 0 ? "border-t" : "border-t bg-gray-50"}>
                  <td className="px-4 py-2 text-center">
                    {new Date(session.started_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-2 text-center">S/ {toMoney(session.start_amount)}</td>
                  <td className="px-4 py-2 text-center">
                    {session.status === 'closed' 
                      ? `S/ ${toMoney(salesBySession[session.id || ''] || 0)}`
                      : currentSessionSales > 0 
                        ? `S/ ${toMoney(currentSessionSales)} (en proceso)`
                        : 'En proceso...'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {session.total_returns ? `S/ ${toMoney(session.total_returns)}` : 'S/ 0.00'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {session.end_amount ? `S/ ${toMoney(session.end_amount)}` : 'Pendiente'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className={`px-2 py-1 rounded text-xs ${
                      session.status === 'open' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {session.status === 'open' ? 'Activo' : 'Cerrado'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {session.ended_at ? new Date(session.ended_at).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t">
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No hay registros de caja para {selectedStore.store_name}. ¡Configura la primera sesión!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de registro de cierre de caja */}
      <ModalCreateCashRegister
        key={selectedStore?.id || 'no-store'} // Forzar re-render cuando cambie la tienda
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCashRegister}
        isInitialSetup={isInitialSetup}
        activeCashSession={filteredActiveCashSession}
        selectedStoreId={selectedStore?.id}
        selectedStore={selectedStore}
        currentSessionSales={currentSessionSales}
      />
    </div>
  );
};

export default InformationComponentView;