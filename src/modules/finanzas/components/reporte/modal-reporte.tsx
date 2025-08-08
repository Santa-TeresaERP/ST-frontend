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
  isFinalizacion: boolean; // false: primer reporte, true: cierre
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
    if (initialData) setForm({ ...form, ...initialData });
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
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            {isFinalizacion ? 'Cerrar Reporte' : 'Nuevo Reporte'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Módulo */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Módulo
            </label>
            <select
                name="modulo"
                value={form.modulo}
                onChange={handleChange}
                required
                disabled={isFinalizacion}                // <–– aquí
                className={`w-full border rounded px-3 py-2 ${
                isFinalizacion ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            >
                <option value="">Selecciona un módulo</option>
                <option value="Inventario">Inventario</option>
                <option value="Producción">Producción</option>
                <option value="Ventas">Ventas</option>
            </select>
            </div>

            {/* Fecha Inicio */}
            <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Inicio
            </label>
            <input
                type="date"
                name="fechaInicio"
                value={form.fechaInicio}
                onChange={handleChange}
                required
                disabled={isFinalizacion}                // <–– aquí
                className={`w-full border rounded px-3 py-2 ${
                isFinalizacion ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
            />
            </div>


          {/* Datos fijos al cerrar */}
          {isFinalizacion && (
            <>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Ingresos Totales:</span> <span>{initialData?.ingresos}</span>
                </div>
                <div>
                  <span className="font-medium">Gastos Totales:</span> <span>{initialData?.gastos}</span>
                </div>
                <div>
                  <span className="font-medium">Ganancia Neta:</span> <span>{initialData?.ganancia}</span>
                </div>
              </div>

              {/* Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  name="fechaFin"
                  value={form.fechaFin}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </>
          )}

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observaciones
            </label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isFinalizacion ? 'Finalizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalReporte;