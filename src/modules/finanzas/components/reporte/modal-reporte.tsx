import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

interface ReporteData {
  modulo: string;
  fechaInicio: string;
  fechaFin?: string;
  observaciones?: string;
  ingresos?: string;
  gastos?: string;
  ganancia?: string;
}

interface ModalReporteProps {
  isOpen: boolean;
  isFinalizacion: boolean; 
  initialData?: ReporteData;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const ModalReporte: React.FC<ModalReporteProps> = ({
  isOpen,
  isFinalizacion,
  initialData,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<ReporteData>({
    modulo: '',
    fechaInicio: '',
    observaciones: '',
    fechaFin: '',
    ingresos: 'En proceso...',
    gastos: 'En proceso...',
    ganancia: 'En proceso...',
  });

  useEffect(() => {
    if (initialData) setForm(prev => ({ ...prev, ...initialData }));
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSubmit = isFinalizacion
      ? {
          modulo: form.modulo,
          fechaInicio: form.fechaInicio,
          fechaFin: form.fechaFin,
          observaciones: form.observaciones,
          ingresos: initialData?.ingresos,
          gastos: initialData?.gastos,
          ganancia: initialData?.ganancia,
        }
      : {
          modulo: form.modulo,
          fechaInicio: form.fechaInicio,
          observaciones: form.observaciones,
        };
    onSubmit(dataToSubmit);
  };

  return (
    <div
      className="fixed inset-0 p-6 sm:p-8 md:p-12 lg:p-16 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl max-h-[90vh] overflow-auto shadow-2xl transition-transform duration-300 transform scale-100 hover:scale-[1.02] overflow-hidden mx-4 overflow-y-auto">
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 p-6 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
          <div className="relative flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {isFinalizacion ? 'Cerrar Reporte' : 'Nuevo Reporte'}
              </h2>
              <p className="text-red-100 text-sm">
                {isFinalizacion
                  ? 'Finalizar período de reporte'
                  : 'Crear un nuevo período de seguimiento'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Grid para inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Módulo
                </label>
                <select
                  name="modulo"
                  value={form.modulo}
                  onChange={handleChange}
                  required
                  disabled={isFinalizacion}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-gray-700 transition focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                    isFinalizacion
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-500'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <option value="">Selecciona un módulo</option>
                  <option value="Inventario">📦 Inventario</option>
                  <option value="Producción">⚙️ Producción</option>
                  <option value="Ventas">💼 Ventas</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={form.fechaInicio}
                  onChange={handleChange}
                  required
                  disabled={isFinalizacion}
                  className={`w-full border-2 rounded-xl px-4 py-3 text-gray-700 transition focus:ring-2 focus:ring-red-500/20 focus:border-red-500 ${
                    isFinalizacion
                      ? 'bg-gray-50 border-gray-200 cursor-not-allowed text-gray-500'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                />
              </div>
            </div>

            {isFinalizacion && (
              <div className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  📊 Resumen Financiero
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <span className="font-medium text-gray-600">💰 Ingresos Totales:</span>
                    <span className="font-bold text-green-600 text-lg">{initialData?.ingresos}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                    <span className="font-medium text-gray-600">💸 Gastos Totales:</span>
                    <span className="font-bold text-red-600 text-lg">{initialData?.gastos}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border border-red-200 col-span-1 sm:col-span-2">
                    <span className="font-semibold text-gray-700">📈 Ganancia Neta:</span>
                    <span className="font-bold text-red-700 text-xl">{initialData?.ganancia}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isFinalizacion && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Fecha de Finalización
                  </label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={form.fechaFin}
                    onChange={handleChange}
                    required
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 transition focus:ring-2 focus:ring-red-500/20 focus:border-red-500 hover:border-gray-300 bg-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={form.observaciones}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Añade comentarios adicionales sobre este reporte..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-700 transition focus:ring-2 focus:ring-red-500/20 focus:border-red-500 hover:border-gray-300 bg-white resize-none"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition font-medium order-2 sm:order-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 order-1 sm:order-2"
              >
                {isFinalizacion ? '🔒 Finalizar Reporte' : '✨ Crear Reporte'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalReporte;
