import React, { useState } from "react";
import {
  FiInfo,
  FiMapPin,
  FiHome,
  FiClipboard,
  FiDollarSign,
  FiPlus,
} from "react-icons/fi";
import { StoreAttributes } from "@/modules/sales/types/store.d";
import ModalCreateCashRegister from "./modal-create-cashregister";
import { useQueryClient } from "@tanstack/react-query";
import {
  useFetchActiveCashSession,
  useFetchCashSessionHistory,
  useFetchCashSessionDetails,
  useCreateCashSession,
  useCloseCashSession,
} from "@/modules/sales/hooks/useCashSession";
import { useFetchSales } from "@/modules/sales/hooks/useSales";
import { useFetchReturns } from "@/modules/sales/hooks/useReturns";
import {
  CreateCashSessionPayload,
  CloseCashSessionPayload,
} from "@/modules/sales/types/cash-session";
import { invalidateStoreQueries } from "@/modules/sales/utils/cache-helpers";
import ModalEditStore from "../store/modal-edit-store";
import { useGenerateSalePdf } from "../../hooks/usePdf";
import ModalGenerateSalePdf from "../../components/information/ModalGenerateSalePdf";

// 🔥 IMPORTAR SISTEMA DE PERMISOS OPTIMIZADO
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';

interface InformationComponentViewProps {
  selectedStore?: StoreAttributes | null;
  onStoreUpdate: (storeId: string) => Promise<void>;
}

const InformationComponentView: React.FC<InformationComponentViewProps> = ({
  selectedStore,
}) => {
  // 🔥 USAR HOOK OPTIMIZADO DE PERMISOS - UNA SOLA LLAMADA
  const { canCreate, canEdit, canDelete, isAdmin } = useModulePermissions(MODULE_NAMES.SALES);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(true);
  const [isEditStoreModalOpen, setIsEditStoreModalOpen] = useState(false);
  const [previousStoreId, setPreviousStoreId] = useState<string | undefined>(selectedStore?.id);
  const [lastClosedSession, setLastClosedSession] = useState<{ end_amount: number } | null>(null);
  const [sessionJustClosed, setSessionJustClosed] = useState(false); // ✅ NUEVO: Control local de sesión cerrada
  const queryClient = useQueryClient();
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const { mutate: generarPdfVentas, isPending: generatingPdf } =
    useGenerateSalePdf({ autoDownload: true });

  // Efecto para manejar el cambio de tienda
  React.useEffect(() => {
    const newStoreId = selectedStore?.id;

    // Si cambió la tienda seleccionada
    if (previousStoreId !== newStoreId) {
      console.log("🏪 Cambio de tienda:", {
        anterior: previousStoreId,
        nueva: newStoreId,
        nombreNueva: selectedStore?.store_name,
      });

      // Resetear estado del modal cuando cambia la tienda
      setIsModalOpen(false);
      
      // ✅ LIMPIAR información de sesión anterior cuando cambia la tienda
      setLastClosedSession(null);
      
      // ✅ RESETEAR estado de sesión cerrada
      setSessionJustClosed(false);
      
      // Actualizar el estado de la tienda anterior
      setPreviousStoreId(newStoreId);

      // Si hay una nueva tienda, invalidar sus queries para cargar datos frescos
      if (newStoreId) {
        setTimeout(() => {
          invalidateStoreQueries(queryClient, newStoreId);
        }, 100);
      }
    }
  }, [
    selectedStore?.id,
    selectedStore?.store_name,
    previousStoreId,
    queryClient,
  ]);

  // Helper para convertir valores monetarios a número - convertido a useCallback para evitar recreación en cada render
  const toMoney = React.useCallback(
    (value: number | string | undefined | null): string => {
      if (value === undefined || value === null) return "0.00";
      return Number(value).toFixed(2);
    },
    []
  );

  // Hooks para manejar cash sessions
  const createCashSessionMutation = useCreateCashSession();
  const closeCashSessionMutation = useCloseCashSession();

  // Obtener sesión activa y historial si hay una tienda seleccionada
  const { data: activeCashSession, isLoading: loadingActive } = useFetchActiveCashSession(selectedStore?.id);
  const { data: cashSessionHistory = [], isLoading: loadingHistory, error: errorHistory } = useFetchCashSessionHistory(selectedStore?.id);
  
  // Usar directamente la sesión del hook (ya filtrada) pero considerar si se acaba de cerrar
  const filteredActiveCashSession = React.useMemo(() => {
    // Si acabamos de cerrar una sesión, no mostrar sesión activa
    if (sessionJustClosed) {
      return null;
    }
    
    // ✅ VALIDACIÓN ADICIONAL: Solo considerar sesiones realmente activas
    if (selectedStore && activeCashSession) {
      // Verificar que la sesión pertenezca a la tienda seleccionada
      if (activeCashSession.store_id !== selectedStore.id) {
        console.log('⚠️ Sesión no pertenece a la tienda seleccionada:', {
          sessionStoreId: activeCashSession.store_id,
          selectedStoreId: selectedStore.id
        });
        return null;
      }
      
      // ✅ VALIDACIÓN CRÍTICA: Solo mostrar si el status es 'open'
      if (activeCashSession.status !== 'open') {
        console.log('⚠️ Sesión no está activa (status != open):', {
          sessionId: activeCashSession.id,
          status: activeCashSession.status,
          store: selectedStore.store_name
        });
        return null;
      }
      
      return activeCashSession;
    }
    
    return null;
  }, [selectedStore, activeCashSession, sessionJustClosed]);
  
  // Obtener detalles de la sesión activa con totales calculados desde el backend
  const { data: sessionDetails, isLoading: loadingDetails } =
    useFetchCashSessionDetails(filteredActiveCashSession?.id);

  React.useEffect(() => {
    if (sessionDetails && !loadingDetails) {
      console.log('✅ Datos de sesión cargados desde el backend:', sessionDetails);
    }
  }, [sessionDetails, loadingDetails]);

  // Obtener todas las ventas para calcular los totales por tienda (mantenemos para historial)
  const { data: allSales = [] } = useFetchSales();

  // Obtener todas las devoluciones para calcular las pérdidas por tienda (mantenemos para historial)
  const { data: allReturns = [] } = useFetchReturns();

  const filteredCashSessionHistory = React.useMemo(() => {
    return selectedStore
      ? cashSessionHistory.filter(
          (session) => session.store_id === selectedStore.id
        )
      : [];
  }, [selectedStore, cashSessionHistory]);

  // ✅ OBTENER información de la última sesión cerrada del historial
  const lastClosedSessionFromHistory = React.useMemo(() => {
    if (!filteredCashSessionHistory.length) return null;
    
    // Buscar la última sesión cerrada (que tenga end_amount)
    const closedSessions = filteredCashSessionHistory.filter(session => 
      session.status === 'closed' && session.end_amount
    );
    
    if (!closedSessions.length) return null;
    
    // Ordenar por fecha de cierre y tomar la más reciente
    const sorted = closedSessions.sort((a, b) => 
      new Date(b.ended_at || '').getTime() - new Date(a.ended_at || '').getTime()
    );
    
    return {
      end_amount: Number(sorted[0].end_amount || 0)
    };
  }, [filteredCashSessionHistory]);

  // ✅ USAR la información de sesión cerrada más reciente (del estado o del historial)
  const suggestedInitialAmount = React.useMemo(() => {
    return lastClosedSession?.end_amount || lastClosedSessionFromHistory?.end_amount || 0;
  }, [lastClosedSession, lastClosedSessionFromHistory]);

  // Efecto para actualizar los datos cuando cambian las ventas - SOLO para la tienda seleccionada
  React.useEffect(() => {
    if (allSales && allSales.length > 0 && selectedStore?.id) {
      console.log(
        "🔄 Ventas actualizadas para tienda:",
        selectedStore.store_name
      );
      // ✅ CORREGIDO: Usar helper para invalidación específica por tienda
      invalidateStoreQueries(
        queryClient,
        selectedStore.id,
        filteredActiveCashSession?.id
      );
    }
  }, [
    allSales,
    queryClient,
    selectedStore?.id,
    selectedStore?.store_name,
    filteredActiveCashSession?.id,
  ]);

  // Calcular ventas totales por tienda y por sesión
  const salesBySession = React.useMemo(() => {
    if (!selectedStore || !allSales.length) return {};

    const result: { [sessionId: string]: number } = {};

    // Para cada sesión de caja en el historial
    filteredCashSessionHistory.forEach((session) => {
      // Fechas de inicio y fin de la sesión
      const sessionStartDate = new Date(session.started_at);
      const sessionEndDate = session.ended_at
        ? new Date(session.ended_at)
        : new Date();

      // Filtrar ventas que pertenecen a esta tienda y están dentro del período de la sesión
      const sessionSales = allSales.filter((sale) => {
        const saleDate = new Date(sale.income_date);
        return (
          sale.store_id === selectedStore.id &&
          saleDate >= sessionStartDate &&
          saleDate <= sessionEndDate
        );
      });

      // Sumar el total de ventas para esta sesión
      result[session.id || ""] = sessionSales.reduce(
        (sum, sale) => sum + Number(sale.total_income),
        0
      );
    });

    return result;
  }, [selectedStore, allSales, filteredCashSessionHistory]);

  // Usar los totales calculados desde el backend para la sesión activa
  const currentSessionSales = React.useMemo(() => {
    // Si tenemos detalles de la sesión desde el backend, usar esos valores
    if (sessionDetails && !loadingDetails) {
      console.log("📊 Usando totales del backend:", sessionDetails);
      return sessionDetails.totalSales || 0;
    }

    // Fallback: calcular en el frontend si no hay datos del backend
    if (!filteredActiveCashSession || !allSales.length || !selectedStore)
      return 0;

    const sessionStartDate = new Date(filteredActiveCashSession.started_at);

    const activeSales = allSales.filter((sale) => {
      const saleDate = new Date(sale.income_date);
      return sale.store_id === selectedStore.id && saleDate >= sessionStartDate;
    });

    return activeSales.reduce(
      (sum, sale) => sum + Number(sale.total_income),
      0
    );
  }, [
    sessionDetails,
    loadingDetails,
    filteredActiveCashSession,
    allSales,
    selectedStore,
  ]);

// Usar las pérdidas calculadas desde el backend para la sesión activa
const currentSessionReturns = React.useMemo(() => {
  // Si tenemos detalles de la sesión desde el backend, usar esos valores
  if (sessionDetails && !loadingDetails) {
    console.log("📉 Usando devoluciones del backend:", sessionDetails);
    return sessionDetails.totalReturns || 0;
  }

  // Fallback: calcular en el frontend si no hay datos del backend
  if (!filteredActiveCashSession || !allReturns.length || !selectedStore) {
    return 0;
  }

  const sessionStartDate = new Date(filteredActiveCashSession.started_at);

  // Filtrar devoluciones de la tienda seleccionada y dentro de la sesión
  const activeReturns = allReturns.filter((returnItem) => {
    const sale = allSales.find((s) => s.id === returnItem.salesId);
    if (!sale) return false;

    const saleDate = new Date(sale.income_date);
    return sale.store_id === selectedStore.id && saleDate >= sessionStartDate;
  });

  // Sumar el total de ingresos de las ventas relacionadas con las devoluciones
  const totalReturnsValue = activeReturns.reduce((sum, returnItem) => {
    const relatedSale = allSales.find((sale) => sale.id === returnItem.salesId);
    return sum + Number(relatedSale?.total_income || 0);
  }, 0);

  return totalReturnsValue;
}, [
  sessionDetails,
  loadingDetails,
  filteredActiveCashSession,
  allReturns,
  allSales,
  selectedStore,
]);

  // Determinar si necesitamos configuración inicial
  React.useEffect(() => {
    // Si hay tienda seleccionada y no hay sesión activa = necesita configuración inicial
    const needsSetup =
      selectedStore && !filteredActiveCashSession && !loadingActive;
    const newSetupState = !!needsSetup;

    // Solo actualizar si realmente cambió para evitar re-renders innecesarios
    setIsInitialSetup((prev) => {
      if (prev !== newSetupState) {
        console.log('🔄 Cambiando isInitialSetup:', { prev, newSetupState, reason: needsSetup ? 'necesita setup' : 'no necesita setup' });
        return newSetupState;
      }
      return prev;
    });
  }, [selectedStore, filteredActiveCashSession, loadingActive]);

  // ✅ NUEVO: Efecto para detectar y corregir inconsistencias
  React.useEffect(() => {
    // Si tenemos una sesión "activa" pero el estado dice que está cerrada
    if (activeCashSession && activeCashSession.status === 'closed' && !sessionJustClosed) {
      console.log('🚨 [INCONSISTENCIA] Sesión marcada como activa pero status=closed:', {
        sessionId: activeCashSession.id,
        status: activeCashSession.status,
        store: selectedStore?.store_name
      });
      
      // Forzar invalidación de la query para esta tienda
      if (selectedStore?.id) {
        queryClient.invalidateQueries({ queryKey: ['activeCashSession', selectedStore.id] });
      }
    }
  }, [activeCashSession, sessionJustClosed, selectedStore?.id, selectedStore?.store_name, queryClient]);

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
    return currentMonth !== sessionMonth || currentYear !== sessionYear;
  }, [filteredActiveCashSession]);

  // Notificar sobre cierre necesario
  React.useEffect(() => {
    if (shouldCloseSession && !isModalOpen) {
      // Auto-cerrar sesiones del mes anterior
    }
  }, [shouldCloseSession, isModalOpen]);

  const handleCreateCashRegister = (
    data: CreateCashSessionPayload | CloseCashSessionPayload
  ) => {
    console.log("Datos enviados:", data); // Debug log

    if ("store_id" in data) {
      // Es una creación de sesión inicial
      console.log("Creando nueva sesión para tienda:", data.store_id); // Debug log
      createCashSessionMutation.mutate(data as CreateCashSessionPayload, {
        onSuccess: (response) => {
          console.log("✅ Sesión de caja creada exitosamente:", response);
          setIsModalOpen(false);
          
          // ✅ RESETEAR estado de sesión cerrada cuando se crea nueva sesión
          setSessionJustClosed(false);
          
          // Invalidar las queries para forzar recarga
          queryClient.invalidateQueries({
            queryKey: ["activeCashSession", selectedStore?.id],
          });
          queryClient.invalidateQueries({
            queryKey: ["cashSessionHistory", selectedStore?.id],
          });
        },
        onError: (error) => {
          console.error("❌ Error al crear sesión de caja:", error);
          alert(
            `Error al crear sesión: ${error.message || "Error desconocido"}`
          );
        },
      });
    } else if (filteredActiveCashSession?.id) {
      // Es un cierre de sesión
      console.log("Cerrando sesión:", filteredActiveCashSession.id); // Debug log
      console.log("Datos actuales para cierre:", {
        currentSessionSales,
        currentSessionReturns,
        usingBackendData: !!sessionDetails && !loadingDetails,
        sessionDetails,
      });

      // Agregar automáticamente las ventas del período a los datos de cierre
      const closureData = data as CloseCashSessionPayload;

      // Siempre incluir las ventas actuales calculadas
      if (currentSessionSales >= 0) {
        // Cambiar > 0 a >= 0 para incluir también cero
        console.log(
          "Incluyendo ventas actuales en el cierre:",
          currentSessionSales
        );
        closureData.total_sales = currentSessionSales;
      }

      // Incluir también las pérdidas calculadas
      if (currentSessionReturns >= 0) {
        // Cambiar > 0 a >= 0 para incluir también cero
        console.log(
          "Incluyendo pérdidas actuales en el cierre:",
          currentSessionReturns
        );
        closureData.total_returns = currentSessionReturns;
      }

      closeCashSessionMutation.mutate(
        { id: filteredActiveCashSession.id, payload: closureData },
        {
          onSuccess: (response) => {
            console.log("✅ Sesión de caja cerrada exitosamente:", response);
            setIsModalOpen(false);
            
            // ✅ MARCAR que la sesión se acaba de cerrar
            setSessionJustClosed(true);
            
            // ✅ GUARDAR INFORMACIÓN DE LA SESIÓN CERRADA para usar en la siguiente
            setLastClosedSession({
              end_amount: Number(response.end_amount || 0)
            });
            
            // ✅ CORREGIDO: Usar helper para invalidación específica por tienda
            const currentStoreId = selectedStore?.id;
            if (currentStoreId) {
              invalidateStoreQueries(queryClient, currentStoreId, filteredActiveCashSession?.id);
              
              // ✅ NUEVO: Invalidación adicional más agresiva y específica
              queryClient.invalidateQueries({ queryKey: ['activeCashSession'] });
              queryClient.invalidateQueries({ queryKey: ['cashSessionHistory'] });
              queryClient.invalidateQueries({ queryKey: ['cashSessionDetails'] });
              
              // ✅ INVALIDACIÓN ESPECÍFICA POR TIENDA
              queryClient.invalidateQueries({ queryKey: ['activeCashSession', currentStoreId] });
              queryClient.invalidateQueries({ queryKey: ['cashSessionHistory', currentStoreId] });
              
              // ✅ REMOVER DATOS OBSOLETOS DE LA CACHÉ
              queryClient.removeQueries({ queryKey: ['activeCashSession', currentStoreId] });
              queryClient.removeQueries({ queryKey: ['cashSessionDetails', filteredActiveCashSession?.id] });
            }
            
            // ✅ NUEVO COMPORTAMIENTO: No crear sesión automáticamente
            // Solo actualizar la UI para mostrar configuración inicial
            setTimeout(() => {
              console.log('Sesión cerrada. Usuario debe configurar nueva sesión manualmente para', selectedStore?.store_name);
              console.log('Dinero final de sesión anterior:', response.end_amount);
              setIsInitialSetup(true);
            }, 100);
          },
          onError: (error) => {
            console.error("❌ Error al cerrar sesión de caja:", error);
            alert(
              `Error al cerrar sesión: ${error.message || "Error desconocido"}`
            );
          },
        }
      );
    }
  };

  // 🔍 DEBUG: Estado final antes del render
  console.log('🎯 [DEBUG] === ESTADO FINAL PARA RENDER ===', {
    selectedStore: selectedStore ? {
      id: selectedStore.id,
      name: selectedStore.store_name
    } : null,
    activeCashSession: activeCashSession ? {
      id: activeCashSession.id,
      store_id: activeCashSession.store_id,
      status: activeCashSession.status
    } : null,
    filteredActiveCashSession: filteredActiveCashSession ? {
      id: filteredActiveCashSession.id,
      store_id: filteredActiveCashSession.store_id,
      status: filteredActiveCashSession.status
    } : null,
    sessionJustClosed,
    isInitialSetup,
    loadingActive,
    buttonText: !selectedStore?.id
      ? "Selecciona Tienda"
      : isInitialSetup
        ? 'Configurar Caja' 
        : 'Finalizar Caja',
    willShowActiveSession: selectedStore && !loadingActive && filteredActiveCashSession,
    willShowNoSession: selectedStore && !loadingActive && !filteredActiveCashSession,
    willShowLoading: selectedStore && loadingActive,
    lastClosedSession,
    suggestedInitialAmount
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
      
      {/* 🔥 INDICADOR DE PERMISOS EN DESARROLLO */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Debug Permisos:</strong> 
            Módulo: {MODULE_NAMES.SALES} | 
            Crear: {canCreate ? '✅' : '❌'} | 
            Editar: {canEdit ? '✅' : '❌'} | 
            Eliminar: {canDelete ? '✅' : '❌'} |
            Admin: {isAdmin ? '✅' : '❌'}
          </p>
        </div>
      )}

      {/* Información de la Tienda */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2 mb-4 md:mb-0">
          <FiInfo className="text-red-600" size={24} />
          <span>Información de la Tienda</span>
        </h2>
        {/* 🔥 BOTÓN DE EDITAR TIENDA - SOLO SI TIENE PERMISOS */}
        {selectedStore && (canEdit || isAdmin) && (
          <button
            onClick={() => setIsEditStoreModalOpen(true)}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors w-full md:w-auto"
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
          <p
            className={selectedStore ? "text-gray-900" : "text-gray-400 italic"}
          >
            {selectedStore
              ? selectedStore.store_name
              : "Selecciona una tienda para ver su información"}
          </p>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <FiMapPin className="text-red-500" size={20} />
            <span className="font-semibold">Dirección</span>
          </div>
          <p
            className={selectedStore ? "text-gray-900" : "text-gray-400 italic"}
          >
            {selectedStore
              ? selectedStore.address
              : "Selecciona una tienda para ver su dirección"}
          </p>
        </div>
      </div>

      <div className="border border-gray-300 rounded-lg p-4 shadow-sm text-gray-700">
        <div className="flex items-center space-x-2 mb-2">
          <FiClipboard className="text-red-500" size={20} />
          <span className="font-semibold">Observaciones</span>
        </div>
        <p className={selectedStore ? "text-gray-900" : "text-gray-400 italic"}>
          {selectedStore
            ? selectedStore.observations || "Sin observaciones registradas"
            : "Selecciona una tienda para ver sus observaciones"}
        </p>
      </div>

      {/* Información de la Caja */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pt-6 space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2">
          <FiDollarSign className="text-red-600" size={24} />
          <span>Información de Caja</span>
        </h2>
        <div className="flex flex-col items-start md:items-end w-full md:w-auto">
          {/* 🔥 BOTÓN DE CONFIGURAR/FINALIZAR CAJA - SOLO SI TIENE PERMISOS */}
          {(canCreate || canEdit || isAdmin) && (
            <button
              onClick={() => {
                console.log('🔘 [DEBUG] Botón clickeado - Estado completo:', {
                  selectedStore: selectedStore ? {
                    id: selectedStore.id,
                    name: selectedStore.store_name
                  } : null,
                  activeCashSession: activeCashSession ? {
                    id: activeCashSession.id,
                    store_id: activeCashSession.store_id,
                    status: activeCashSession.status
                  } : null,
                  filteredActiveCashSession: filteredActiveCashSession ? {
                    id: filteredActiveCashSession.id,
                    store_id: filteredActiveCashSession.store_id,
                    status: filteredActiveCashSession.status
                  } : null,
                  isInitialSetup,
                  loadingActive,
                  sessionMatch: selectedStore?.id === filteredActiveCashSession?.store_id,
                  buttonText: !selectedStore?.id
                    ? 'Selecciona Tienda'
                    : isInitialSetup
                      ? 'Configurar Caja' 
                      : 'Finalizar Caja'
                });
                
                if (!selectedStore?.id) {
                  console.log('❌ [DEBUG] No hay tienda seleccionada');
                  alert('Por favor selecciona una tienda antes de configurar la caja.');
                  return;
                }
                
                console.log('✅ [DEBUG] Abriendo modal con isInitialSetup:', isInitialSetup);
                setIsModalOpen(true);
              }}
              disabled={!selectedStore?.id}
              className={`flex items-center justify-center space-x-1 px-4 py-2 rounded-lg transition-colors w-full md:w-auto ${
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
                    : 'Finalizar Caja'
                }
              </span>
            </button>
          )}
          
          {/* 🔥 MENSAJE CUANDO NO HAY PERMISOS */}
          {!canCreate && !canEdit && !isAdmin && selectedStore && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 w-full md:w-auto">
              <span className="text-yellow-700 text-sm">Sin permisos para gestionar caja</span>
            </div>
          )}
          
          {!selectedStore && (
            <p className="text-xs text-gray-500 mt-2 md:text-right w-full">
              ⚠️ Selecciona una tienda para configurar la caja
            </p>
          )}
          {selectedStore && !isInitialSetup && (canCreate || canEdit || isAdmin) && (
            <p className="text-xs text-blue-600 mt-2 md:text-right w-full">
              📊 Sesión activa - listo para cerrar mes
            </p>
          )}
          {selectedStore && isInitialSetup && (canCreate || canEdit || isAdmin) && (
            <p className="text-xs text-green-600 mt-2 md:text-right w-full">
              ✅ Listo para configurar caja en {selectedStore.store_name}
            </p>
          )}
        </div>
      </div>

      {/* Información de la sesión activa - SIMPLIFICADO */}
      {selectedStore && loadingActive && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Cargando información de {selectedStore.store_name}...
          </h3>
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-lg bg-blue-200 h-20 w-full"></div>
          </div>
        </div>
      )}

      {/* Mostrar sesión activa si existe */}
      {selectedStore && !loadingActive && filteredActiveCashSession && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Sesión Activa - {selectedStore.store_name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-700">
                Dinero Inicial:
              </span>
              <p className="text-green-900">
                S/ {toMoney(filteredActiveCashSession.start_amount)}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-700">
                Ventas Actuales:
              </span>
              <p className="text-green-900">
                S/ {toMoney(currentSessionSales)}
                {sessionDetails && !loadingDetails && (
                  <span className="text-xs text-green-600 ml-1">(✓)</span>
                )}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-700">
                Pérdidas Actuales:
              </span>
              <p className="text-red-900">
                S/ {toMoney(currentSessionReturns)}
                {sessionDetails && !loadingDetails && (
                  <span className="text-xs text-red-600 ml-1">(✓)</span>
                )}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-700">
                Fecha de Inicio:
              </span>
              <p className="text-green-900">
                {new Date(
                  filteredActiveCashSession.started_at
                ).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="mt-2">
            <span className="font-medium text-green-700">Estado:</span>
            <p className="text-green-900">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                Activo
              </span>
            </p>
          </div>
          {shouldCloseSession && (
            <div className="mt-3 p-2 bg-amber-100 border border-amber-300 rounded">
              <p className="text-amber-800 text-sm">
                ⚠️ <strong>Atención:</strong> La sesión actual corresponde al
                mes anterior. Es recomendable cerrarla.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mostrar mensaje de no hay sesión SOLO cuando no hay loading y no hay sesión */}
      {selectedStore && !loadingActive && !filteredActiveCashSession && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">No hay sesión activa - {selectedStore.store_name}</h3>
          <p className="text-yellow-700">Puedes configurar una nueva sesión de caja utilizando el botón &quot;Configurar Caja&quot;.</p>
          
          {/* ✅ MOSTRAR información de la última sesión cerrada */}
          {suggestedInitialAmount > 0 && (
            <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded">
              <p className="text-blue-800 text-sm">
                💰 <strong>Información de la sesión anterior:</strong> El dinero final fue S/ {suggestedInitialAmount.toFixed(2)}
                <br />
                <span className="text-blue-600">Este monto aparecerá como sugerencia al configurar la nueva caja.</span>
              </p>
            </div>
          )}
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
                  Error al cargar historial de {selectedStore.store_name}:{" "}
                  {errorHistory.message}
                </td>
              </tr>
            ) : filteredCashSessionHistory.length > 0 ? (
              filteredCashSessionHistory.map((session, index) => {
                return (
                  <tr
                    key={session.id || index}
                    className={
                      index % 2 === 0 ? "border-t" : "border-t bg-gray-50"
                    }
                  >
                    <td className="px-4 py-2 text-center">
                      {new Date(session.started_at).toLocaleDateString(
                        "es-ES",
                        { month: "long", year: "numeric" }
                      )}
                    </td>
                    <td className="px-4 py-2 text-center">
                      S/ {toMoney(session.start_amount)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {session.status === "closed"
                        ? session.total_sales
                          ? `S/ ${toMoney(session.total_sales)}`
                          : `S/ ${toMoney(salesBySession[session.id || ""] || 0)}`
                        : currentSessionSales > 0
                          ? `S/ ${toMoney(currentSessionSales)} (en proceso)`
                          : "En proceso..."}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {session.status === "closed"
                        ? session.total_returns
                          ? `S/ ${toMoney(session.total_returns)}`
                          : "S/ 0.00"
                        : currentSessionReturns > 0
                          ? `S/ ${toMoney(currentSessionReturns)} (en proceso)`
                          : "S/ 0.00"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {session.end_amount
                        ? `S/ ${toMoney(session.end_amount)}`
                        : "Pendiente"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          session.status === "open"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {session.status === "open" ? "Activo" : "Cerrado"}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center">
                      {session.ended_at
                        ? new Date(session.ended_at).toLocaleDateString()
                        : "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-t">
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No hay registros de caja para {selectedStore.store_name}.
                  ¡Configura la primera sesión!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* 🔥 MODAL DE EDITAR TIENDA - SOLO SI TIENE PERMISOS */}
      {selectedStore && (canEdit || isAdmin) && (
        <ModalEditStore
          isOpen={isEditStoreModalOpen}
          onClose={() => setIsEditStoreModalOpen(false)}
          store={selectedStore}
        />
      )}

      {/* 🔥 MODAL DE REGISTRO DE CAJA - SOLO SI TIENE PERMISOS */}
      {(canCreate || canEdit || isAdmin) && (
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
          currentSessionReturns={currentSessionReturns}
          suggestedInitialAmount={suggestedInitialAmount}
        />
      )}
    </div>
  );
};

export default InformationComponentView;
