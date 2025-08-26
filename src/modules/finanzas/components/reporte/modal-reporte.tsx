import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useCreateFinancialReport, useUpdateFinancialReport } from '../../hooks/useFinancialReports';
import { useFetchGeneralIncomes } from '../../hooks/useGeneralIncomes';
import { useFetchGeneralExpenses } from '../../hooks/useGeneralExpenses';
import { FinancialReport } from '../../types/financialReport';

interface ModalReporteProps {
  isOpen: boolean;
  isFinalizacion: boolean; // false: primer reporte, true: cierre
  initialData?: FinancialReport;
  onClose: () => void;
  onSubmit: (data: {
    start_date?: string;
    end_date?: string;
    observations?: string;
  }) => void;
}

// Tipo solo para el formulario
interface FinancialReportForm {
  start_date: string;
  end_date: string;
  observations: string;
}

const ModalReporte: React.FC<ModalReporteProps> = ({
  isOpen,
  isFinalizacion,
  initialData,
  onClose,
  onSubmit
}) => {
  // Obtener los datos de ingresos y gastos para calcular totales
  const { data: incomes = [] } = useFetchGeneralIncomes();
  const { data: expenses = [] } = useFetchGeneralExpenses();

  const formatDateForInput = (date?: string | Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().split('T')[0]; // yyyy-MM-dd
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [form, setForm] = useState<FinancialReportForm>({
    start_date: initialData?.start_date ? formatDateForInput(initialData.start_date) : getCurrentDate(),
    end_date: getCurrentDate(),
    observations: initialData?.observations || '',
  });

  const { isPending: isCreating } = useCreateFinancialReport();
  const { isPending: isUpdating } = useUpdateFinancialReport();

  // Calcular totales de ingresos y gastos sin report_id asignado
  const totalIngresos = incomes
  .filter(income => !income.report_id)
  // Asegurar suma numérica: amount puede venir como string "12.00"
  .reduce((sum, income) => sum + Number(income.amount ?? 0), 0);

  const totalGastos = expenses
  .filter(expense => !expense.report_id)
  // Asegurar suma numérica: amount puede venir como string
  .reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);

  const gananciaNeta = totalIngresos - totalGastos;

  useEffect(() => {
    if (initialData && isOpen) {
      setForm({
        start_date: formatDateForInput(initialData.start_date),
        end_date: getCurrentDate(),
        observations: initialData.observations || '',
      });
    } else if (!isFinalizacion && isOpen) {
      // Modo primer reporte
      setForm({
        start_date: getCurrentDate(),
        end_date: getCurrentDate(),
        observations: '',
      });
    }
  }, [initialData, isOpen, isFinalizacion]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      start_date: form.start_date,
      end_date: isFinalizacion ? form.end_date : undefined,
      observations: form.observations,
    });
  };


  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh]">
        <div className="bg-gradient-to-r from-red-700 to-red-600 text-white p-5 rounded-t-2xl flex items-center justify-center relative gap-2">
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
          {!isFinalizacion ? (
            // MODO 1: Primer reporte
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 text-sm">
                  <strong>Nota:</strong> Para el primer reporte solo será necesario colocar la fecha de inicio. 
                  Después los datos se colocarán automáticamente.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="observations"
                  value={form.observations}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Descripción del reporte (opcional)"
                />
              </div>
            </>
          ) : (
            // MODO 2: Finalizar reporte existente
            <>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-800 text-lg">Datos del Reporte Actual</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">Fecha de Inicio:</span>
                    <div className="text-gray-900">{formatDateForInput(initialData?.start_date) ? new Date(initialData!.start_date).toLocaleDateString('es-PE') : 'No definida'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Descripción Actual:</span>
                    <div className="text-gray-900">{initialData?.observations || 'Sin descripción'}</div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-green-800 text-lg">Totales Calculados</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      S/. {totalIngresos.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-green-700">Ingresos Totales</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      S/. {totalGastos.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-red-700">Gastos Totales</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${gananciaNeta >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                      S/. {gananciaNeta.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-sm text-gray-700">Ganancia Neta</div>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones Finales
                </label>
                <textarea
                  name="observations"
                  value={form.observations}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Observaciones finales del reporte"
                />
              </div>
            </>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isCreating || isUpdating) ? 'Procesando...' : (isFinalizacion ? 'Finalizar Reporte' : 'Crear Reporte')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalReporte;
