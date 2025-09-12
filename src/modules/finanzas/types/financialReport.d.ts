// Importamos los tipos completos que ya existen
import { GeneralIncome } from './generalIncome.d';
import { GeneralExpense } from './generalExpense.d';

/**
 * Representa la estructura de un Reporte Financiero tal como lo devuelve la API.
 */
export interface FinancialReport {
  id: string;
  start_date: Date;
  end_date: Date;
  total_income: number;
  total_expenses: number;
  net_profit: number;
  observations?: string | null;
  createdAt: string;
  updatedAt: string;
  incomes: GeneralIncome[];
  expenses: GeneralExpense[];
}

/**
 * Define el payload necesario para ENVIAR una petición de creación de reporte.
 */
export interface CreateReportPayload {
  start_date: string | Date;
  observations?: string;
}

/**
 * Define el payload para ACTUALIZAR las observaciones de un reporte.
 */
export interface UpdateReportPayload {
  observations?: string;
  end_date?: string | Date;
}