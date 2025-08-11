import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useCreateFinancialReport, useUpdateFinancialReport } from '../../hooks/useFinancialReports';
import { FinancialReport } from '../../types/financialReport';

interface ModalReporteProps {
  isOpen: boolean;
  isFinalizacion: boolean; // false: primer reporte, true: cierre
  initialData?: FinancialReport;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

// Tipo solo para el formulario
interface FinancialReportForm {
  id?: string;
  start_date: string;
  end_date?: string;
  observations?: string;
  ingresos?: number;
  gastos?: number;
  ganancia?: number;
}

const ModalReporte: React.FC<ModalReporteProps> = ({
  isOpen,
  isFinalizacion,
  initialData,
  onClose,
  onSubmit
}) => {
  const formatDateForInput = (date?: string | Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  };

  const [form, setForm] = useState<FinancialReportForm>({
    id: initialData?.id,
    start_date: formatDateForInput(initialData?.start_date),
    end_date: formatDateForInput(initialData?.end_date),
    observations: initialData?.observations || '',
    ingresos: initialData?.total_income,
    gastos: initialData?.total_expenses,
    ganancia: initialData?.net_profit,
  });

  const { mutate: createReport } = useCreateFinancialReport();
  const { mutate: updateReport } = useUpdateFinancialReport();

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id,
        start_date: formatDateForInput(initialData.start_date),
        end_date: formatDateForInput(initialData.end_date),
        observations: initialData.observations || '',
        ingresos: initialData.total_income,
        gastos: initialData.total_expenses,
        ganancia: initialData.net_profit,
      });
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isValidDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return !isNaN(d.getTime());
    };

    const start_date_iso = form.start_date && isValidDate(form.start_date)
      ? new Date(form.start_date).toISOString()
      : undefined;

    const end_date_iso = form.end_date && isValidDate(form.end_date)
      ? new Date(form.end_date).toISOString()
      : undefined;

    if (isFinalizacion && form.id) {
      updateReport(
        {
          id: form.id,
          payload: {
            observations: form.observations,
            end_date: end_date_iso,
          },
        },
        { onSuccess: onClose }
      );
    } else {
      createReport(
        {
          start_date: start_date_iso,
          observations: form.observations,
        },
        { onSuccess: onClose }
      );
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh]">
        <div className="bg-[#8B0000] text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
          <FiX
            size={24}
            className="absolute left-5 top-1/2 transform -translate-y-1/2 cursor-pointer hover:opacity-75"
            onClick={onClose}
          />
          <h2 className="text-lg font-bold">
            {isFinalizacion ? 'Cerrar Reporte' : 'Nuevo Reporte'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6 overflow-y-auto max-h-[70vh]">
          {/* Fecha Inicio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha Inicio
            </label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              disabled={isFinalizacion}
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
                  <span className="font-medium">Ingresos Totales:</span>{' '}
                  <span>{form.ingresos}</span>
                </div>
                <div>
                  <span className="font-medium">Gastos Totales:</span>{' '}
                  <span>{form.gastos}</span>
                </div>
                <div>
                  <span className="font-medium">Ganancia Neta:</span>{' '}
                  <span>{form.ganancia}</span>
                </div>
              </div>

              {/* Fecha Fin */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Fin
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
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
              name="observations"
              value={form.observations}
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
              className="px-4 py-2 bg-red-800 text-white rounded hover:bg-red-700"
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
