import React, { useState } from 'react';
import { Eye, Trash2, FileText, Plus, BarChart3 } from 'lucide-react';
import ModalInformeModulo from './modal-reporte-modulo';
import ModalReporte from './modal-reporte';
import {
  useFetchFinancialReports,
  useCreateFinancialReport,
  useUpdateFinancialReport,
  useDeleteFinancialReport
} from '../../hooks/useFinancialReports';
import { FinancialReport } from '../../types/financialReport';

export default function ReporteComponentView() {
  const { data: reportes = [], isLoading } = useFetchFinancialReports();
  const createReport = useCreateFinancialReport();
  const updateReport = useUpdateFinancialReport();
  const deleteReport = useDeleteFinancialReport();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinalizacion, setIsFinalizacion] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState<FinancialReport | undefined>(undefined);
  const [isInformeOpen, setIsInformeOpen] = useState(false);

  const handleOpenNuevo = () => {
    setIsFinalizacion(false);
    setSelectedReporte(undefined);
    setIsModalOpen(true);
  };

  const handleOpenFinalizar = (r: FinancialReport) => {
    setIsFinalizacion(true);
    setSelectedReporte(r);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
    if (!isFinalizacion) {
      createReport.mutate(
        {
          start_date: data.fechaInicio,
          observations: data.observaciones || '',
        },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else if (selectedReporte) {
      updateReport.mutate(
        {
          id: selectedReporte.id,
          payload: {
            end_date: data.fechaFin,
            observations: data.observaciones,
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
              <button
                onClick={() => setIsInformeOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-medium hover:from-gray-700 hover:to-gray-800 transition-all shadow-lg"
              >
                <BarChart3 className="w-4 h-4" />
                Informe por Módulo
              </button>
              <button
                onClick={handleOpenNuevo}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-lg"
              >
                <Plus className="w-4 h-4" />
                Nuevo Reporte
              </button>
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
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Cargando reportes...
                    </td>
                  </tr>
                ) : (
                  reportes.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4 text-gray-600">{formatDateLocal(r.start_date)}</td>
                      <td className="px-6 py-4 text-gray-600">{r.end_date ? formatDateLocal(r.end_date) : '–'}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-green-600">
                          S/. {r.total_income.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-red-600">
                          S/. {r.total_expenses.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-blue-600">
                          S/. {r.net_profit.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">{r.observations || '–'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenFinalizar(r)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-105"
                            title="Finalizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-105"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
        isFinalizacion={isFinalizacion}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
