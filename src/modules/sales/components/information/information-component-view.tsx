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

interface InformationComponentViewProps {
  selectedStore?: StoreAttributes | null;
  onStoreUpdate: (storeId: string) => Promise<void>;
}

const InformationComponentView: React.FC<InformationComponentViewProps> = ({
  selectedStore,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialSetup, setIsInitialSetup] = useState(true);
  const [isEditStoreModalOpen, setIsEditStoreModalOpen] = useState(false);
  const [previousStoreId, setPreviousStoreId] = useState<string | undefined>(
    selectedStore?.id
  );
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
  const { data: activeCashSession, isLoading: loadingActive } =
    useFetchActiveCashSession(selectedStore?.id);
  const {
    data: cashSessionHistory = [],
    isLoading: loadingHistory,
    error: errorHistory,
  } = useFetchCashSessionHistory(selectedStore?.id);

  // Usar directamente la sesión del hook (ya filtrada)
  const filteredActiveCashSession = React.useMemo(() => {
    // El hook ya filtra por tienda, solo verificar que exista tienda seleccionada
    return selectedStore && activeCashSession ? activeCashSession : null;
  }, [selectedStore, activeCashSession]);

  // Obtener detalles de la sesión activa con totales calculados desde el backend
  const { data: sessionDetails, isLoading: loadingDetails } =
    useFetchCashSessionDetails(filteredActiveCashSession?.id);

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
      return sessionDetails.totalReturns || 0;
    }

    // Fallback: calcular en el frontend si no hay datos del backend
    if (
      !filteredActiveCashSession ||
      !allReturns.length ||
      !allSales.length ||
      !selectedStore
    )
      return 0;

    const sessionStartDate = new Date(filteredActiveCashSession.started_at);

    const activeSales = allSales.filter((sale) => {
      const saleDate = new Date(sale.income_date);
      return sale.store_id === selectedStore.id && saleDate >= sessionStartDate;
    });

    const activeSalesIds = activeSales.map((sale) => sale.id);

    const activeReturns = allReturns.filter((returnItem) =>
      activeSalesIds.includes(returnItem.salesId)
    );

    let totalReturnsValue = 0;

    activeReturns.forEach((returnItem) => {
      const relatedSale = activeSales.find(
        (sale) => sale.id === returnItem.salesId
      );
      if (relatedSale) {
        totalReturnsValue += Number(relatedSale.total_income || 0);
      }
    });

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
        return newSetupState;
      }
      return prev;
    });
  }, [selectedStore, filteredActiveCashSession, loadingActive, isInitialSetup]);

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

            // ✅ CORREGIDO: Usar helper para invalidación específica por tienda
            const currentStoreId = selectedStore?.id;
            if (currentStoreId) {
              invalidateStoreQueries(
                queryClient,
                currentStoreId,
                filteredActiveCashSession?.id
              );
            }

            // Crear nueva sesión automáticamente con el monto final como monto inicial
            const endAmount = response.end_amount;
            if (endAmount && selectedStore?.id) {
              console.log(
                "🔄 Creando nueva sesión con monto inicial de sesión anterior:",
                endAmount
              );

              const newSessionData: CreateCashSessionPayload = {
                store_id: selectedStore.id,
                start_amount: Number(endAmount),
              };

              // Crear nueva sesión automáticamente
              createCashSessionMutation.mutate(newSessionData, {
                onSuccess: (newSession) => {
                  console.log(
                    "✅ Nueva sesión creada automáticamente:",
                    newSession
                  );

                  // ✅ CORREGIDO: Usar helper para actualización específica por tienda
                  if (currentStoreId) {
                    invalidateStoreQueries(
                      queryClient,
                      currentStoreId,
                      newSession.id
                    );
                  }

                  // Actualizar UI para reflejar la nueva sesión activa
                  setTimeout(() => {
                    console.log(
                      "Actualizando UI para mostrar nueva sesión en",
                      selectedStore?.store_name
                    );
                    setIsInitialSetup(false);
                  }, 100);
                },
                onError: (error) => {
                  console.error("❌ Error al crear sesión automática:", error);

                  // Si falla la creación automática, simplemente mostrar la UI de configuración inicial
                  setTimeout(() => {
                    console.log("Forzando re-evaluación de isInitialSetup");
                    setIsInitialSetup(true);
                  }, 100);
                },
              });
            } else {
              // Si no hay monto final o tienda, solo actualizar la UI
              setTimeout(() => {
                console.log("Forzando re-evaluación de isInitialSetup");
                setIsInitialSetup(true);
              }, 100);
            }
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
  console.log("🎯 [DEBUG] === ESTADO FINAL PARA RENDER ===", {
    selectedStore: selectedStore
      ? {
          id: selectedStore.id,
          name: selectedStore.store_name,
        }
      : null,
    activeCashSession: activeCashSession
      ? {
          id: activeCashSession.id,
          store_id: activeCashSession.store_id,
          status: activeCashSession.status,
        }
      : null,
    filteredActiveCashSession: filteredActiveCashSession
      ? {
          id: filteredActiveCashSession.id,
          store_id: filteredActiveCashSession.store_id,
          status: filteredActiveCashSession.status,
        }
      : null,
    isInitialSetup,
    loadingActive,
    buttonText: !selectedStore?.id
      ? "Selecciona Tienda"
      : isInitialSetup
        ? "Configurar Caja"
        : "Finalizar Caja",
    willShowActiveSession:
      selectedStore && !loadingActive && filteredActiveCashSession,
    willShowNoSession:
      selectedStore && !loadingActive && !filteredActiveCashSession,
    willShowLoading: selectedStore && loadingActive,
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-6">
      {/* Información de la Tienda */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
        <h2 className="text-2xl font-bold text-red-700 flex items-center space-x-2 mb-4 md:mb-0">
          <FiInfo className="text-red-600" size={24} />
          <span>Información de la Tienda</span>
        </h2>
        {selectedStore && (
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
          <button
            onClick={() => {
              console.log("🔘 [DEBUG] Botón clickeado - Estado completo:", {
                selectedStore: selectedStore
                  ? {
                      id: selectedStore.id,
                      name: selectedStore.store_name,
                    }
                  : null,
                activeCashSession: activeCashSession
                  ? {
                      id: activeCashSession.id,
                      store_id: activeCashSession.store_id,
                      status: activeCashSession.status,
                    }
                  : null,
                filteredActiveCashSession: filteredActiveCashSession
                  ? {
                      id: filteredActiveCashSession.id,
                      store_id: filteredActiveCashSession.store_id,
                      status: filteredActiveCashSession.status,
                    }
                  : null,
                isInitialSetup,
                loadingActive,
                sessionMatch:
                  selectedStore?.id === filteredActiveCashSession?.store_id,
                buttonText: !selectedStore?.id
                  ? "Selecciona Tienda"
                  : isInitialSetup
                    ? "Configurar Caja"
                    : "Finalizar Caja",
              });

              if (!selectedStore?.id) {
                console.log("❌ [DEBUG] No hay tienda seleccionada");
                alert(
                  "Por favor selecciona una tienda antes de configurar la caja."
                );
                return;
              }

              console.log(
                "✅ [DEBUG] Abriendo modal con isInitialSetup:",
                isInitialSetup
              );
              setIsModalOpen(true);
            }}
            disabled={!selectedStore?.id}
            className={`flex items-center justify-center space-x-1 px-4 py-2 rounded-lg transition-colors w-full md:w-auto ${
              !selectedStore?.id
                ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            <FiPlus size={18} />
            <span>
              {!selectedStore?.id
                ? "Selecciona Tienda"
                : isInitialSetup
                  ? "Configurar Caja"
                  : "Finalizar Caja"}
            </span>
          </button>
          {/* 👉 Nuevo botón Generar PDF */}
          <button
            onClick={() => {
              if (!selectedStore?.id) {
                alert("Selecciona una tienda para generar el PDF.");
                return;
              }
              setIsPdfModalOpen(true);
            }}
            disabled={!selectedStore?.id}
            className={`flex flex-1 items-center justify-center space-x-1 rounded-lg px-4 py-2 md:flex-none ${
              !selectedStore?.id
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-red-600 border border-red-600 hover:bg-red-50"
            }`}
          >
            <span>Generar PDF</span>
          </button>
          {!selectedStore && (
            <p className="text-xs text-gray-500 mt-2 md:text-right w-full">
              ⚠️ Selecciona una tienda para configurar la caja
            </p>
          )}
          {selectedStore && !isInitialSetup && (
            <p className="text-xs text-blue-600 mt-2 md:text-right w-full">
              📊 Sesión activa - listo para cerrar mes
            </p>
          )}
          {selectedStore && isInitialSetup && (
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
          {/* Mensaje para sesión creada automáticamente */}
          {filteredCashSessionHistory.length > 0 &&
            new Date(filteredActiveCashSession.started_at).getTime() >
              new Date(filteredCashSessionHistory[0].ended_at || "").getTime() -
                5000 && (
              <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded">
                <p className="text-blue-800 text-sm">
                  ℹ️ <strong>Nota:</strong> Esta sesión fue creada
                  automáticamente al cerrar la anterior. El dinero inicial
                  corresponde al dinero final de la sesión previa.
                </p>
              </div>
            )}
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
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            No hay sesión activa - {selectedStore.store_name}
          </h3>
          <p className="text-yellow-700">
            Puedes configurar una nueva sesión de caja utilizando el botón
            &quot;Configurar Caja&quot;.
          </p>
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

      {/* Modal de editar*/}
      {selectedStore && (
        <ModalEditStore
          isOpen={isEditStoreModalOpen}
          onClose={() => setIsEditStoreModalOpen(false)}
          store={selectedStore}
        />
      )}

      {/* Modal de registro de cierre de caja */}
      <ModalCreateCashRegister
        key={selectedStore?.id || "no-store"} // Forzar re-render cuando cambie la tienda
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCashRegister}
        isInitialSetup={isInitialSetup}
        activeCashSession={filteredActiveCashSession}
        selectedStoreId={selectedStore?.id}
        selectedStore={selectedStore}
        currentSessionSales={currentSessionSales}
        currentSessionReturns={currentSessionReturns}
      />

      <ModalGenerateSalePdf
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        defaultStoreId={selectedStore?.id}
        defaultStoreName={selectedStore?.store_name}
        loading={generatingPdf}
        onSubmit={(payload) => {
          generarPdfVentas(payload, {
            onSuccess: () => {
              // Se descarga automáticamente por autoDownload
              setIsPdfModalOpen(false);
            },
            onError: (e) => {
              alert(e.message ?? "No se pudo generar el PDF");
            },
          });
        }}
      />
    </div>
  );
};

export default InformationComponentView;
