import React, { useState } from 'react';
import { Eye, Trash2, FileText, Wallet, Plus, BarChart3, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import ModalInformeModulo from './modal-reporte-modulo';
import ModalReporte from './modal-reporte';

interface ReporteData {
  id: number;
  modulo: string;
  fechaInicio: string;
  fechaFin?: string;
  observaciones?: string;
  ingresos: string;
  gastos: string;
  ganancia: string;
}

export default function ReporteComponentView() {
  const [reportes, setReportes] = useState<ReporteData[]>([
    {
      id: 1,
      modulo: "Ventas Online",
      fechaInicio: "2024-01-01",
      fechaFin: "2024-01-31",
      observaciones: "Mes con alta demanda",
      ingresos: "S/. 45,250.00",
      gastos: "S/. 12,800.00",
      ganancia: "S/. 32,450.00"
    },
    {
      id: 2,
      modulo: "Marketing Digital",
      fechaInicio: "2024-02-01",
      observaciones: "Campaña en progreso",
      ingresos: "En proceso...",
      gastos: "En proceso...",
      ganancia: "En proceso..."
    }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFinalizacion, setIsFinalizacion] = useState(false);
  const [selectedReporte, setSelectedReporte] = useState<ReporteData | undefined>(undefined);
  const [isInformeOpen, setIsInformeOpen] = useState(false);

  const handleOpenNuevo = () => {
    setIsFinalizacion(false);
    setSelectedReporte(undefined);
    setIsModalOpen(true);
  };

  const handleOpenFinalizar = (r: ReporteData) => {
    setIsFinalizacion(true);
    setSelectedReporte(r);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
    if (!isFinalizacion) {
      const nuevo: ReporteData = {
        id: Date.now(),
        modulo: data.modulo || 'Nuevo Módulo',
        fechaInicio: data.fechaInicio || new Date().toISOString().split('T')[0],
        fechaFin: undefined,
        observaciones: data.observaciones || '',
        ingresos: 'En proceso...',
        gastos: 'En proceso...',
        ganancia: 'En proceso...',
      };
      setReportes(prev => [nuevo, ...prev]);
    } else if (selectedReporte) {
      setReportes(prev =>
        prev.map(r =>
          r.id === selectedReporte.id
            ? { ...r, fechaFin: data.fechaFin, observaciones: data.observaciones }
            : r
        )
      );
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: number) => {
    setReportes(prev => prev.filter(r => r.id !== id));
  };

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
                    { label: 'Módulos' },
                    { label: 'Fecha inicio'},
                    { label: 'Fecha fin'},
                    { label: 'Ingresos totales' },
                    { label: 'Gastos totales' },
                    { label: 'Ganancia neta' },
                    { label: 'Observaciones' },
                    { label: 'Acciones' },
                  ].map((h, index) => (
                    <th key={h.label} className="px-6 py-4 text-left">
                      <div className="flex items-center gap-2 text-white font-medium text-sm">
                        {h.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reportes.map((r, index) => (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">{r.modulo}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{r.fechaInicio}</td>
                    <td className="px-6 py-4 text-gray-600">{r.fechaFin || '–'}</td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${r.ingresos.includes('proceso') ? 'text-orange-600' : 'text-green-600'}`}>
                        {r.ingresos}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${r.gastos.includes('proceso') ? 'text-orange-600' : 'text-red-600'}`}>
                        {r.gastos}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-semibold ${r.ganancia.includes('proceso') ? 'text-orange-600' : 'text-blue-600'}`}>
                        {r.ganancia}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 text-sm">{r.observaciones || '–'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenFinalizar(r)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-105"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {reportes.length === 0 && (
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

      <ModalReporte
        isOpen={isModalOpen}
        isFinalizacion={isFinalizacion}
        initialData={selectedReporte}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <ModalInformeModulo
        isOpen={isInformeOpen}
        onClose={() => setIsInformeOpen(false)}
        reportes={reportes}
        onExport={(modulo: string, datos: any) => {
          console.log('Exportando:', modulo, datos);
        }}
      />
    </div>
  );
}