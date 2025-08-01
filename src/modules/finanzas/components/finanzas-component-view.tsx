import React, { useState } from 'react';
import { FileText, ListChecks } from 'lucide-react';
import DetalleReporteView from './detalleReporte/detalle-reporte-view';
import DetalleReporte from './detalleReporte/detalle-reporte-view';
import ReporteComponentView from './reporte/reporte-view';

const FinanzasComponentView: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'general' | 'detalle'>('general');

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
            <DetalleReporte
              reporte={{
                id: 1,
                modulo: 'Finanzas',
                fechaInicio: '2024-01-01',
                fechaFin: '2024-12-31',
                observaciones: 'Observaciones de ejemplo'
              }}
            />
            <div className="my-6" />
          </>
        )}
      </div>
    </div>
  );
};

export default FinanzasComponentView;
