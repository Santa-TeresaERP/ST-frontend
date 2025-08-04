import api from '@/core/config/client'; // Tu cliente API configurado
import {
  FinancialReport,
  CreateReportPayload,
  UpdateReportPayload
} from '../types/financialReport.d';

const REPORTS_ENDPOINT = '/finanzas/reports';

/**
 * Llama a: GET /finanzas/reports
 * Obtiene todos los reportes financieros.
 */
export const fetchFinancialReports = async (): Promise<FinancialReport[]> => {
  const response = await api.get<FinancialReport[]>(REPORTS_ENDPOINT);
  return response.data;
};

/**
 * Llama a: GET /finanzas/reports/:id
 * Obtiene un reporte financiero específico por su ID.
 */
export const fetchFinancialReportById = async (id: string): Promise<FinancialReport> => {
  const response = await api.get<FinancialReport>(`${REPORTS_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Llama a: POST /finanzas/reports
 * Envía la solicitud para generar un nuevo reporte financiero.
 */
export const createFinancialReport = async (payload: CreateReportPayload): Promise<FinancialReport> => {
  const response = await api.post<FinancialReport>(REPORTS_ENDPOINT, payload);
  return response.data;
};

/**
 * Llama a: PUT /finanzas/reports/:id
 * Actualiza las observaciones de un reporte existente.
 */
export const updateFinancialReport = async (id: string, payload: UpdateReportPayload): Promise<FinancialReport> => {
  const response = await api.put<FinancialReport>(`${REPORTS_ENDPOINT}/${id}`, payload);
  return response.data;
};

/**
 * Llama a: DELETE /finanzas/reports/:id
 * Elimina un reporte financiero.
 */
export const deleteFinancialReport = async (id: string): Promise<void> => {
  await api.delete(`${REPORTS_ENDPOINT}/${id}`);
};