import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Edit3, TrendingUp, TrendingDown, DollarSign, Calendar, ListChecks, Target } from 'lucide-react';
import ModalAddEntrada from './modal-create-ingreso-gasto';
import ModalEditEntrada from './modal-edit-ingreso-gasto';
import ModalDeleteIngresoGasto from './modal-delete-ingreso-gasto';


interface DetalleReporteProps {
  reporte: {
    id: number;
    modulo: string;
    fechaInicio: string;
    fechaFin?: string;
    observaciones?: string;
  };
}

interface GeneralEntry {
  id: number;
  modulo: string;
  tipo: string;
  monto: string;
  fecha: string;
  observaciones: string;
}

const fetchReporteDetalles = (id: number) => ({
  ingresos: [
    { id: 1, modulo: 'Inventario', tipo: 'Credito', monto: 'S/. 102.00', fecha: '2025-12-12', observaciones: 'Venta de productos terminados' }
  ],
  gastos: [
    { id: 1, modulo: 'Logística', tipo: 'Compra', monto: 'S/. 300.00', fecha: '2025-10-08', observaciones: 'Compra de materiales' }
  ],
});

export default function DetalleReporte({ reporte }: DetalleReporteProps) {
  const [data, setData] = useState<{ ingresos: GeneralEntry[]; gastos: GeneralEntry[] }>(
    () => fetchReporteDetalles(reporte.id)
  );
  const [tab, setTab] = useState<'ingresos' | 'gastos'>('ingresos');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [entryToEdit, setEntryToEdit] = useState<GeneralEntry | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<GeneralEntry | null>(null);

  const parseMonto = (monto: string) => parseFloat(monto.replace(/[^\d.-]/g, '')) || 0;

  const ingresosTotales = useMemo(
    () => data.ingresos.reduce((acc, curr) => acc + parseMonto(curr.monto), 0),
    [data.ingresos]
  );
  const gastosTotales = useMemo(
    () => data.gastos.reduce((acc, curr) => acc + parseMonto(curr.monto), 0),
    [data.gastos]
  );
  const utilidadNeta = ingresosTotales - gastosTotales;
  const formatoMoneda = (valor: number) =>
    `S/. ${valor.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;

  const handleSaveIngreso = (newIngreso: Omit<GeneralEntry, 'id'>) => {
    const id = Date.now();
    setData(prev => ({ ...prev, ingresos: [...prev.ingresos, { id, ...newIngreso }] }));
    setIsAddOpen(false);
  };

  const handleSaveGasto = (newGasto: Omit<GeneralEntry, 'id'>) => {
    const id = Date.now();
    setData(prev => ({ ...prev, gastos: [...prev.gastos, { id, ...newGasto }] }));
    setIsAddOpen(false);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-600 rounded-xl">
              <ListChecks className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Detalles del Reporte Financiero
            </h1>
          </div>
          <p className="text-gray-600 ml-12">
            Período: {reporte.fechaInicio} {reporte.fechaFin && `- ${reporte.fechaFin}`}
          </p>
        </div>

        {/* Cards de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-bold text-green-600">{formatoMoneda(ingresosTotales)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-green-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: '75%'}}></div>
              </div>
              <span className="text-xs text-green-600 font-medium">+15%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Gastos Totales</p>
                <p className="text-2xl font-bold text-red-600">{formatoMoneda(gastosTotales)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-red-100 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '60%'}}></div>
              </div>
              <span className="text-xs text-red-600 font-medium">-8%</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-600">Utilidad Neta</p>
                <p className={`text-2xl font-bold ${utilidadNeta >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatoMoneda(utilidadNeta)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-blue-100 rounded-full h-2">
                <div className={`h-2 rounded-full ${utilidadNeta >= 0 ? 'bg-blue-500' : 'bg-red-500'}`} 
                     style={{width: Math.abs(utilidadNeta / Math.max(ingresosTotales, gastosTotales)) * 100 + '%'}}></div>
              </div>
              <span className={`text-xs font-medium ${utilidadNeta >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                {utilidadNeta >= 0 ? '+' : ''}{((utilidadNeta / ingresosTotales) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Tabs y contenido */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
          {/* Tabs header */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between p-6">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setTab('ingresos')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    tab === 'ingresos'
                      ? 'bg-white text-green-600 shadow-md'
                      : 'text-gray-600 hover:text-green-600'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  INGRESOS
                  <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                    {data.ingresos.length}
                  </span>
                </button>
                <button
                  onClick={() => setTab('gastos')}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    tab === 'gastos'
                      ? 'bg-white text-red-600 shadow-md'
                      : 'text-gray-600 hover:text-red-600'
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  GASTOS
                  <span className="bg-red-100 text-red-700 px-2 py-1 text-xs rounded-full">
                    {data.gastos.length}
                  </span>
                </button>
              </div>

              <button
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg ${
                  tab === 'ingresos'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                    : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                }`}
                onClick={() => setIsAddOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Agregar {tab === 'ingresos' ? 'Ingreso' : 'Gasto'}
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-700 to-gray-700 border-b border-gray-200">
                  <th className="text-center py-4 px-6 font-semibold text-white">Módulo</th>
                  <th className="text-center py-4 px-6 font-semibold text-white">
                    Tipo de {tab === 'ingresos' ? 'Ingreso' : 'Gasto'}
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-white">Monto</th>
                  <th className="text-center py-4 px-6 font-semibold text-white">Fecha</th>
                  <th className="text-center py-4 px-6 font-semibold text-white">Observaciones</th>
                  <th className="text-center py-4 px-6 font-semibold text-white">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data[tab].map((entry: GeneralEntry, index) => (
                  <tr 
                    key={entry.id} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-800">{entry.modulo}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        tab === 'ingresos'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <DollarSign className="w-3 h-3" />
                        {entry.tipo}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-bold text-lg ${
                        tab === 'ingresos' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {entry.monto}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{entry.fecha}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-600 text-sm max-w-xs truncate block">
                        {entry.observaciones}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-2">
                        <button 
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="Editar"
                          onClick={() => {
                            setEntryToEdit(entry);
                            setIsEditOpen(true);
                          }}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Eliminar"
                          onClick={() => {
                            setEntryToDelete(entry);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer de la tabla */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Mostrando {data[tab].length} {tab} de {data[tab].length} total</span>
              <div className="flex items-center gap-2">
                <span>Total: </span>
                <span className={`font-bold text-lg ${
                  tab === 'ingresos' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatoMoneda(tab === 'ingresos' ? ingresosTotales : gastosTotales)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAddOpen && (
        <ModalAddEntrada
          onClose={() => setIsAddOpen(false)}
          onSave={tab === 'ingresos' ? handleSaveIngreso : handleSaveGasto}
          tipo={tab === 'ingresos' ? 'ingreso' : 'gasto'}
        />
      )}

      {isEditOpen && entryToEdit && (
        <ModalEditEntrada
          tipo={tab === 'ingresos' ? 'ingreso' : 'gasto'}
          data={entryToEdit}
          onClose={() => {
            setEntryToEdit(null);
            setIsEditOpen(false);
          }}
          onSave={(updatedEntry) => {
            setData(prev => ({
              ...prev,
              [tab]: prev[tab].map(item => 
                item.id === updatedEntry.id ? updatedEntry : item
              )
            }));
            setEntryToEdit(null);
            setIsEditOpen(false);
          }}
        />
      )}

      {isDeleteOpen && entryToDelete && (
        <ModalDeleteIngresoGasto
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setEntryToDelete(null);
          }}
          onConfirm={() => {
            setData(prev => ({
              ...prev,
              [tab]: prev[tab].filter(item => item.id !== entryToDelete?.id)
            }));
            setIsDeleteOpen(false);
            setEntryToDelete(null);
          }}
          type={tab === 'ingresos' ? 'ingreso' : 'gasto'} // ← Aquí defines el tipo
        />
      )}
    </div>
  );
}