import React, { useEffect, useState } from 'react';
import { FileText, ListChecks } from 'lucide-react';
import DetalleReporte from './detalleReporte/detalle-reporte-view';
import ReporteComponentView from './reporte/reporte-view';
import { useFetchFinancialReports } from '../../finanzas/hooks/useFinancialReports'; // Ajusta ruta si es necesario
import { FinancialReport } from '../../finanzas/types/financialReport'; // Ajusta ruta si es necesario

const FinanzasComponentView: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'general' | 'detalle'>('general');

  // Fetch reportes para poder seleccionar uno y pasarlo a DetalleReporte
  const { data: reportes = [], isLoading: loadingReportes } = useFetchFinancialReports();

  // id del reporte seleccionado para ver el detalle
  const [selectedReportId, setSelectedReportId] = useState<string | undefined>(undefined);

  // Cuando cambian los reportes, selecciono el que está en proceso por defecto.
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-center text-red-700 pb-4">Panel de Finanzas</h1>
        <p className="text-gray-600 text-center">Gestión de reportes generales y detalles</p>
      </div>

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 p-6">
        {/* Reporte General */}
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

        {/* Detalle de Reporte */}
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
                <div className="text-sm text-gray-500">No hay reportes disponibles. Crea uno en Reporte General.</div>
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
    </div>
  );
};

export default FinanzasComponentView;
