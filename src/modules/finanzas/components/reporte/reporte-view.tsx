/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Eye, Trash2, FileText, Plus, BarChart3, ShieldAlert, Loader2 } from 'lucide-react';
import ModalReporte from './modal-reporte';
import ModalInformeModulo from './modal-reporte-modulo';
import {
  useFetchFinancialReports,
  useCreateFinancialReport,
  useUpdateFinancialReport,
  useDeleteFinancialReport
} from '../../hooks/useFinancialReports';
import { useFetchGeneralIncomes } from '../../hooks/useGeneralIncomes';
import { useFetchGeneralExpenses } from '../../hooks/useGeneralExpenses';
import { FinancialReport } from '../../types/financialReport';
import { useModulePermissions } from '@/core/utils/permission-hooks';
import { MODULE_NAMES } from '@/core/utils/useModulesMap';
import { suppressAxios403Errors } from '@/core/utils/error-suppressor';
import { useCurrentUser } from '@/modules/auth/hook/useCurrentUser';
import { useAuthStore } from '@/core/store/auth';

export default function ReporteComponentView() {
  // 🔥 HOOKS DE PERMISOS Y AUTENTICACIÓN
  const {
    canView: canRead,
    canCreate,
    canEdit,
    canDelete,
    isLoading: permissionsLoading,
    isAdmin
  } = useModulePermissions(MODULE_NAMES.FINANZAS);

  const { data: currentUser } = useCurrentUser();
  const userWithPermissions = useAuthStore((state) => state.userWithPermissions);

  // 🔥 ESTADO PARA DETECCIÓN DE ERRORES 403
  const [is403Error, setIs403Error] = useState(false);

  // 🔥 HOOKS DE DATOS
  const { data: reportes = [], isLoading, error: reportesError } = useFetchFinancialReports();
  const { data: incomes = [], isLoading: incomesLoading, error: incomesError } = useFetchGeneralIncomes();
  const { data: expenses = [], isLoading: expensesLoading, error: expensesError } = useFetchGeneralExpenses();

  // Suprimir errores 403 después de obtener los hooks
  suppressAxios403Errors();

  const createReport = useCreateFinancialReport();
  const updateReport = useUpdateFinancialReport();
  const deleteReport = useDeleteFinancialReport();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState<FinancialReport | undefined>(undefined);
  const [isInformeOpen, setIsInformeOpen] = useState(false);

  // Determinar si es primer reporte o finalización
  const hasReports = reportes.length > 0;
  const activeReport = reportes.find(r => r.end_date === null); // Reporte en proceso

  // Calcular totales actuales para el reporte activo con mayor precisión
  const currentTotalIncome = React.useMemo(() => {
    return incomes
      .filter((income: any) => !income.report_id)
      .reduce((sum: number, income: any) => sum + Number(income.amount || 0), 0);
  }, [incomes]);

  const currentTotalExpenses = React.useMemo(() => {
    return expenses
      .filter((expense: any) => !expense.report_id)
      .reduce((sum: number, expense: any) => sum + Number(expense.amount || 0), 0);
  }, [expenses]);

  const currentNetProfit = React.useMemo(() => {
    return currentTotalIncome - currentTotalExpenses;
  }, [currentTotalIncome, currentTotalExpenses]);

  // 🔥 VERIFICAR ERRORES 403 Y PERMISOS REVOCADOS
  const checkFor403Error = (error: unknown) => {
    return error && (
      (error as any).message?.includes('403') ||
      (error as any).response?.status === 403 ||
      (error as any).status === 403
    );
  };

  // 🔥 DETECCIÓN DE PERMISOS REVOCADOS
  useEffect(() => {
    const has403 = checkFor403Error(reportesError) || 
                   checkFor403Error(incomesError) || 
                   checkFor403Error(expensesError);
    
    if (has403 && !is403Error) {
      console.log('🚨 Permisos revocados detectados en finanzas');
      setIs403Error(true);
      
      // Auto-reload después de 2 segundos
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }, [reportesError, incomesError, expensesError, is403Error]);

  // 🔥 PANTALLA DE ACCESO DENEGADO
  if (permissionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Verificando permisos...</h2>
          <p className="text-gray-600">Cargando acceso al módulo de finanzas</p>
        </div>
      </div>
    );
  }

  if (!canRead && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8">
          <div className="mb-6">
            <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Restringido</h2>
            <p className="text-gray-600">No tienes permisos para acceder al módulo de finanzas</p>
          </div>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (is403Error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full text-center p-8">
          <div className="mb-6">
            <ShieldAlert className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Permisos Revocados</h2>
            <p className="text-gray-600 mb-4">Tus permisos han sido modificados. La página se recargará automáticamente.</p>
            <Loader2 className="w-6 h-6 animate-spin text-orange-500 mx-auto" />
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Recargar Ahora
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Debug: Agregar logs para verificar los datos
  console.log('🔍 Debug Estado Reportes:', {
    // Estados de carga
    isLoading,
    incomesLoading,
    expensesLoading,
    
    // Errores
    incomesError: incomesError?.message,
    expensesError: expensesError?.message,
    
    // Datos crudos
    totalIncomes: incomes.length,
    totalExpenses: expenses.length,
    totalReportes: reportes.length,
    
    // Datos filtrados
    incomesWithoutReport: incomes.filter(income => !income.report_id).length,
    expensesWithoutReport: expenses.filter(expense => !expense.report_id).length,
    
    // Cálculos
    currentTotalIncome,
    currentTotalExpenses,
    currentNetProfit,
    
    // Muestras de datos
    sampleIncome: incomes[0],
    sampleExpense: expenses[0],
    
    // Estado del reporte
    hasReports,
    activeReport: activeReport ? {
      id: activeReport.id,
      start_date: activeReport.start_date,
      end_date: activeReport.end_date
    } : null,
    
    // Todos los ingresos para inspección
    allIncomes: incomes.map(income => ({
      id: income.id,
      amount: income.amount,
      report_id: income.report_id,
      description: income.description
    })),
    
    // Todos los gastos para inspección
    allExpenses: expenses.map(expense => ({
      id: expense.id,
      amount: expense.amount,
      report_id: expense.report_id,
      description: expense.description
    }))
  });

  // Función para determinar si es el reporte activo (en proceso)
  const isActiveReport = (report: FinancialReport) => {
    return activeReport && report.id === activeReport.id;
  };

  // Función para formatear números correctamente
  const formatCurrency = (amount: number | string) => {
    // Convertir a número si viene como string y asegurarse de que es válido
    const num = Number(amount);
    if (isNaN(num)) return '0.00';
    
    return num.toFixed(2);
  };

  // Función para mostrar el valor de ingresos
  const displayIncome = (report: FinancialReport) => {
    if (isActiveReport(report)) {
      return currentTotalIncome === 0 
        ? "En proceso" 
        : `En proceso (S/. ${formatCurrency(currentTotalIncome)})`;
    }
    return `S/. ${formatCurrency(report.total_income)}`;
  };

  // Función para mostrar el valor de gastos
  const displayExpenses = (report: FinancialReport) => {
    if (isActiveReport(report)) {
      return currentTotalExpenses === 0 
        ? "En proceso" 
        : `En proceso (S/. ${formatCurrency(currentTotalExpenses)})`;
    }
    return `S/. ${formatCurrency(report.total_expenses)}`;
  };

  // Función para mostrar la ganancia neta
  const displayNetProfit = (report: FinancialReport) => {
    if (isActiveReport(report)) {
      if (currentNetProfit === 0) {
        return "En proceso";
      }
      return `En proceso (S/. ${formatCurrency(currentNetProfit)})`;
    }
    return `S/. ${formatCurrency(report.net_profit)}`;
  };

  const handleOpenModal = () => {
    setSelectedReporte(activeReport);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: {
    start_date?: string;
    end_date?: string;
    observations?: string;
  }) => {
    if (!hasReports || !activeReport) {
      // Crear primer reporte
      createReport.mutate(
        {
          start_date: data.start_date,
          observations: data.observations || '',
        },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      // Finalizar reporte activo
      updateReport.mutate(
        {
          id: activeReport.id,
          payload: {
            end_date: data.end_date,
            observations: data.observations,
          },
        },
        { onSuccess: () => setIsModalOpen(false) }
      );
    }
  };

  const handleDelete = (id: string) => {
    deleteReport.mutate(id);
  };

  const formatDateLocal = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-PE');
  }

  // Convertir datos de reportes al formato que espera el modal de módulo
  const convertReportsToModuleFormat = () => {
    return reportes.map((reporte, index) => ({
      id: index + 1,
      modulo: 'Finanzas', // Por ahora todos son del módulo de finanzas
      fechaInicio: reporte.start_date,
      fechaFin: reporte.end_date || undefined,
      observaciones: reporte.observations || undefined,
      ingresos: `S/. ${formatCurrency(reporte.total_income)}`,
      gastos: `S/. ${formatCurrency(reporte.total_expenses)}`,
      ganancia: `S/. ${formatCurrency(reporte.net_profit)}`
    }));
  };

  const handleExportModule = (modulo: string, datos: { id: number; modulo: string; fechaInicio: string; fechaFin?: string; observaciones?: string; ingresos: string; gastos: string; ganancia: string; }[]) => {
    console.log('Exportando:', { modulo, datos });
    // Aquí puedes implementar la lógica de exportación
  };

  // 🔥 DEBUG PANEL - Información de permisos para desarrollo
  console.log('🔍 Debug Panel Finanzas:', {
    // Información del usuario
    currentUser: currentUser ? {
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.Role?.name
    } : null,
    
    // Estado de permisos
    permissions: {
      canRead,
      canCreate,
      canEdit,
      canDelete,
      isAdmin,
      permissionsLoading
    },
    
    // Estado de errores 403
    errorState: {
      is403Error,
      reportesError: reportesError?.message,
      incomesError: incomesError?.message,
      expensesError: expensesError?.message
    },
    
    // Datos del usuario con permisos
    userPermissions: userWithPermissions ? {
      userId: userWithPermissions.id,
      userName: userWithPermissions.name,
      roleName: userWithPermissions.Role?.name,
      permissionsCount: userWithPermissions.Role?.Permissions?.length || 0
    } : null
  });



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-blue-600 bg-clip-text text-transparent">
              Reportes Financieros Generales
            </h1>
            <p className="text-gray-500 mt-1 text-left">Gestiona y analiza tus reportes financieros</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-red-600 rounded-xl">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Reportes Activos</h2>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                {reportes.length} reportes
              </span>
            </div>

            <div className="flex gap-3">
              {(canRead || isAdmin) && (
                <button
                  onClick={() => setIsInformeOpen(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg"
                >
                  <BarChart3 className="w-4 h-4" />
                  Informe por Módulo
                </button>
              )}
              {(canCreate || canEdit || isAdmin) && (
                <button
                  onClick={handleOpenModal}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  {hasReports && activeReport ? 'Finalizar Reporte' : 'Nuevo Reporte'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
                  {[
                    { label: 'Fecha inicio' },
                    { label: 'Fecha fin' },
                    { label: 'Estado' },
                    { label: 'Ingresos totales' },
                    { label: 'Gastos totales' },
                    { label: 'Ganancia neta' },
                    { label: 'Observaciones' },
                    { label: 'Acciones' },
                  ].map((h) => (
                    <th key={h.label} className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-white font-medium text-sm">
                        {h.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      Cargando reportes...
                    </td>
                  </tr>
                ) : (
                  reportes.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 text-gray-600">{formatDateLocal(r.start_date)}</td>
                      <td className="px-6 py-4 text-gray-600">{r.end_date ? formatDateLocal(r.end_date) : '–'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isActiveReport(r) 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {isActiveReport(r) ? 'En proceso' : 'Finalizado'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${isActiveReport(r) ? 'text-orange-600' : 'text-green-600'}`}>
                          {displayIncome(r)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${isActiveReport(r) ? 'text-orange-600' : 'text-red-600'}`}>
                          {displayExpenses(r)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${
                          isActiveReport(r) 
                            ? 'text-orange-600' 
                            : r.net_profit >= 0 
                              ? 'text-blue-600' 
                              : 'text-red-600'
                        }`}>
                          {displayNetProfit(r)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">{r.observations || '–'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {(canRead || isAdmin) && (
                            <button
                              onClick={() => setSelectedReporte(r)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-105"
                              title="Ver detalles"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                          {(canDelete || isAdmin) && (
                            <button
                              onClick={() => handleDelete(r.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-105"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {!isLoading && reportes.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No hay reportes disponibles</p>
                      <p className="text-gray-400 text-sm">Crea tu primer reporte para comenzar</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ModalReporte
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedReporte}
        isFinalizacion={hasReports && activeReport !== undefined}
        onSubmit={handleModalSubmit}
      />

      <ModalInformeModulo
        isOpen={isInformeOpen}
        onClose={() => setIsInformeOpen(false)}
        reportes={convertReportsToModuleFormat()}
        onExport={handleExportModule}
      />
    </div>
  );
}
