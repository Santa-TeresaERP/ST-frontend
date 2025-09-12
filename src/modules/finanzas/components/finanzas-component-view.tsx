/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { FileText, ListChecks, ShieldAlert, Loader2 } from 'lucide-react';
import DetalleReporte from './detalleReporte/detalle-reporte-view';
import ReporteComponentView from './reporte/reporte-view';
import { useFetchFinancialReports } from '../../finanzas/hooks/useFinancialReports'; // Ajusta ruta si es necesario
import { FinancialReport } from '../../finanzas/types/financialReport'; // Ajusta ruta si es necesario
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';
import { suppressAxios403Errors } from '@/core/utils/error-suppressor';
import { useCurrentUser } from '@/modules/auth/hook/useCurrentUser';
import { useAuthStore } from '@/core/store/auth';
import ModalListMonthlyExpenses from './reporte/modal-list-monthly-expenses';

const FinanzasComponentView: React.FC = () => {
  // 🔥 OBTENER USUARIO ACTUAL CON SUS PERMISOS DESDE /auth/me
  const { user } = useAuthStore();
  const { data: currentUserWithPermissions, isLoading: usersLoading } = useCurrentUser();

  // 🔥 HOOK DE PERMISOS
  const { canView, canCreate, canEdit, canDelete, isLoading, isAdmin } = useModulePermissions(MODULE_NAMES.FINANZAS);
  
  const [selectedView, setSelectedView] = useState<'general' | 'detalle'>('general');
  const [isMonthlyModalOpen, setMonthlyModalOpen] = useState(false);

  // Fetch reportes para poder seleccionar uno y pasarlo a DetalleReporte
  const { data: reportes = [], isLoading: loadingReportes, error } = useFetchFinancialReports();

  // id del reporte seleccionado para ver el detalle
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);

  // 🔥 VERIFICAR ERROR 403 INMEDIATAMENTE - SIN USAR PERMISOS DINÁMICOS SI HAY ERROR
  const is403Error = error && (error.message.includes('403') || error.message.includes('Forbidden'));

  // 🔥 ACTIVAR SUPRESOR DE ERRORES 403 EN LA CONSOLA
  useEffect(() => {
    suppressAxios403Errors();
  }, []);

  // 🔥 DEBUG: Ver permisos actuales en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 FinanzasComponent - Análisis de Permisos:', {
        userId: user?.id,
        userFound: !!currentUserWithPermissions,
        roleName: (currentUserWithPermissions as any)?.Role?.name,
        moduleName: MODULE_NAMES.FINANZAS,
        permisos: { canView, canCreate, canEdit, canDelete, isAdmin },
        usersLoading,
        hasError: !!error,
        is403Error
      });
    }
  }, [user, currentUserWithPermissions, canView, canCreate, canEdit, canDelete, isAdmin, usersLoading, error, is403Error]);

  // Cuando cambian los reportes, selecciono el primero por defecto (si existe)
  useEffect(() => {
    if (reportes.length > 0 && !selectedReportId) {
      const inProcessReport = reportes.find(r => !r.end_date);
      if (inProcessReport) {
        setSelectedReportId(inProcessReport.id);
      } else if (reportes.length > 0) {
        // Fallback si no hay ninguno en proceso, selecciona el más reciente
        const sortedReports = [...reportes].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
        setSelectedReportId(sortedReports[0].id);
      }
    }
  }, [reportes, selectedReportId]);

  // Mantener vista inicial en 'general' independientemente de permisos

  // 🔥 DETECTAR CAMBIOS EN PERMISOS Y FORZAR RECARGA SI ES NECESARIO
  useEffect(() => {
    // Si detectamos un error 403 después de que el usuario ya estaba autenticado
    // esto significa que sus permisos fueron revocados
    if (is403Error && currentUserWithPermissions) {
      console.warn('⚠️ Permisos revocados detectados en Finanzas - recargando página');
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Dar tiempo para mostrar el mensaje
    }
  }, [is403Error, currentUserWithPermissions]);

  // Encuentro el reporte completo a pasar a DetalleReporte y hago el mapeo de campos
  const selectedReporteFull: FinancialReport | undefined = reportes.find(r => r.id === selectedReportId);

  // Función para mapear la estructura que espera DetalleReporte
  const mapToDetalleReporteProp = (r?: FinancialReport) => {
    if (!r) return undefined;
    return {
      id: r.id,
      name: (r as any).name ?? `Reporte ${r.id}`, // si tu API tiene nombre usa r.name, si no, dejo fallback
      fechaInicio: r.start_date,
      fechaFin: r.end_date ?? undefined,
      observaciones: r.observations ?? undefined,
    };
  };

  const detalleProp = mapToDetalleReporteProp(selectedReporteFull);

  // 🔥 VERIFICACIÓN DE CARGA INICIAL (usuarios + permisos)
  if (isLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-red-600" />
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // 🔥 VERIFICAR ERROR 403 INMEDIATAMENTE - NO ESPERAR A PERMISOS
  if (is403Error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Permisos Revocados</h2>
          <p className="text-gray-600 mb-4">
            Tus permisos para acceder al módulo de Finanzas han sido modificados o revocados.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contacta al administrador para obtener acceso o la página se recargará automáticamente.
          </p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Recargar Ahora
            </button>
            <button 
              onClick={() => window.history.back()}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 VERIFICACIÓN ADICIONAL DE PERMISOS LOCALES (solo si no hay error 403)
  if (!canView) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
          <ShieldAlert className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Acceso Restringido</h2>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder al módulo de Finanzas.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Contacta al administrador para obtener acceso.
          </p>
          <button 
            onClick={() => window.history.back()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-center text-red-700 pb-4">Panel de Finanzas</h1>
        <p className="text-gray-600 text-center">Gestión de reportes generales y detalles</p>
        
        {/* 🔥 DEBUG PANEL DE PERMISOS - Temporal */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-center">
            <p className="font-mono">
              📋 Permisos FINANZAS - 
              Usuario: {(currentUserWithPermissions as any)?.name || 'No encontrado'} | 
              Rol: {(currentUserWithPermissions as any)?.Role?.name || 'Sin rol'} | 
              Ver: {canView ? '✅' : '❌'} | 
              Crear: {canCreate ? '✅' : '❌'} | 
              Editar: {canEdit ? '✅' : '❌'} | 
              Eliminar: {canDelete ? '✅' : '❌'} | 
              Admin: {isAdmin ? '✅' : '❌'} |
              Error403: {is403Error ? '⚠️' : '✅'}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6">
        {/* Reporte General - Solo visible si tiene permisos de creación */}
        {(canCreate || isAdmin) && (
          <button
            onClick={() => setSelectedView('general')}
            className={`p-6 rounded-xl shadow-sm transition-all transform hover:scale-105 ${
              selectedView === 'general'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-white border border-gray-200 hover:border-blue-400'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${selectedView === 'general' ? 'bg-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                <FileText size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Reporte General</h3>
                <p className="text-sm opacity-80">Almacén y Recursos</p>
              </div>
            </div>
          </button>
        )}

        {/* Mensaje informativo si no tiene permisos de creación */}
        {!canCreate && !isAdmin && (
          <div className="p-6 rounded-xl bg-yellow-50 border border-yellow-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <ShieldAlert size={24} />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-yellow-800">Acceso Limitado</h3>
                <p className="text-sm text-yellow-700">No tienes permisos para crear reportes generales</p>
              </div>
            </div>
          </div>
        )}

        {/* Detalle de Reporte - Siempre visible si tiene permisos de lectura */}
        <button
          onClick={() => setSelectedView('detalle')}
          className={`p-6 rounded-xl shadow-sm transition-all transform hover:scale-105 ${
            selectedView === 'detalle'
              ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
              : 'bg-white border border-gray-200 hover:border-slate-400'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${selectedView === 'detalle' ? 'bg-slate-400' : 'bg-slate-100 text-slate-600'}`}>
              <ListChecks size={24} />
            </div>
            <div className="text-left">
              <h3 className="font-semibold">Detalle de Reporte</h3>
              <p className="text-sm opacity-80">Movimientos y Proveedores</p>
            </div>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-md overflow-hidden p-6 text-center text-gray-600 min-h-[300px]">
        {selectedView === 'general' && (
          <>
            {/* Botón para abrir vista de Gastos Mensuales */}
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setMonthlyModalOpen(true)}
                className="bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Ver Gastos Mensuales
              </button>
            </div>
            {/* 🔥 PASAR PERMISOS AL COMPONENTE DE REPORTE */}
            <ReporteComponentView />
            <div className="my-6" />
          </>
        )}

        {selectedView === 'detalle' && (
          <>
            {/* Selector de reportes — se muestra solo en la vista detalle */}
            <div className="mb-6 flex items-center justify-center gap-4">
              {loadingReportes ? (
                <div className="text-sm text-gray-500">Cargando reportes...</div>
              ) : reportes.length === 0 ? (
                <div className="text-sm text-gray-500">
                  {(canCreate || isAdmin) 
                    ? 'No hay reportes disponibles. Crea uno en "Reporte General".'
                    : 'No hay reportes disponibles. Contacta al administrador para crear reportes.'
                  }
                </div>
              ) : (
                <>
                  <label className="text-sm font-medium text-gray-700">Seleccionar reporte:</label>
                  <select
                    className="border border-gray-300 rounded px-3 py-2"
                    value={selectedReportId ?? ''}
                    onChange={(e) => setSelectedReportId(e.target.value)}
                  >
                    {reportes.map((r) => {
                      const startDate = new Date(r.start_date).toLocaleDateString('es-PE');
                      const endDate = r.end_date ? new Date(r.end_date).toLocaleDateString('es-PE') : '...';
                      return (
                        <option key={r.id} value={r.id}>
                          {`(${startDate} - ${endDate})`}
                        </option>
                      );
                    })}
                  </select>
                </>
              )}
            </div>

            {/* Si hay un reporte seleccionado, lo pasamos como prop */}
            {detalleProp ? (
              <DetalleReporte reporte={detalleProp} reportId={selectedReportId} />
            ) : (
              <div className="text-sm text-gray-500">Selecciona un reporte para ver su detalle</div>
            )}

            <div className="my-6" />
          </>
        )}
      </div>

      {/* Modal: Lista de Gastos Mensuales */}
      <ModalListMonthlyExpenses
        isOpen={isMonthlyModalOpen}
        onClose={() => setMonthlyModalOpen(false)}
      />
    </div>
  );
};

export default FinanzasComponentView;
