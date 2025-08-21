import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchFinancialReports,
  fetchFinancialReportById,
  createFinancialReport,
  updateFinancialReport,
  deleteFinancialReport
} from '../action/financialReport.actions';
import { FinancialReport, CreateReportPayload, UpdateReportPayload } from '../types/financialReport';

// Clave principal para las queries de este módulo
const REPORTS_QUERY_KEY = 'financialReports';

// Hook para OBTENER TODOS los reportes
export const useFetchFinancialReports = () => {
  return useQuery<FinancialReport[], Error>({
    queryKey: [REPORTS_QUERY_KEY],
    queryFn: fetchFinancialReports,
  });
};

// Hook para OBTENER UN reporte por ID
export const useFetchFinancialReportById = (id: string) => {
  return useQuery<FinancialReport, Error>({
    queryKey: [REPORTS_QUERY_KEY, id],
    queryFn: () => fetchFinancialReportById(id),
    enabled: !!id, // La query solo se ejecutará si el 'id' es válido
  });
};

// Hook para CREAR un reporte
export const useCreateFinancialReport = () => {
  const queryClient = useQueryClient();
  return useMutation<FinancialReport, Error, CreateReportPayload>({
    mutationFn: createFinancialReport,
    onSuccess: () => {
      // Invalida la lista de reportes para que se actualice automáticamente
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
      // Invalidar también ingresos y gastos para sincronizar cálculos
      queryClient.invalidateQueries({ queryKey: ['generalIncomes'] });
      queryClient.invalidateQueries({ queryKey: ['generalExpenses'] });
    },
  });
};

// Hook para ACTUALIZAR un reporte
export const useUpdateFinancialReport = () => {
  const queryClient = useQueryClient();
  return useMutation<FinancialReport, Error, { id: string; payload: UpdateReportPayload }>({
    mutationFn: ({ id, payload }) => updateFinancialReport(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
      // Invalidar también ingresos y gastos para sincronizar cálculos
      queryClient.invalidateQueries({ queryKey: ['generalIncomes'] });
      queryClient.invalidateQueries({ queryKey: ['generalExpenses'] });
    },
  });
};

// Hook para ELIMINAR un reporte
export const useDeleteFinancialReport = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: deleteFinancialReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [REPORTS_QUERY_KEY] });
      // Invalidar también ingresos y gastos para sincronizar cálculos
      queryClient.invalidateQueries({ queryKey: ['generalIncomes'] });
      queryClient.invalidateQueries({ queryKey: ['generalExpenses'] });
    },
  });
};