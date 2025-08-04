import api from '@/core/config/client';
import {
  GeneralIncome,
  CreateIncomePayload,
  UpdateIncomePayload
} from '../types/generalIncome.d';

const INCOMES_ENDPOINT = '/finanzas/incomes';

/**
 * Llama a: GET /finanzas/incomes
 * Obtiene todos los registros de ingresos.
 */
export const fetchGeneralIncomes = async (): Promise<GeneralIncome[]> => {
  const response = await api.get<GeneralIncome[]>(INCOMES_ENDPOINT);
  return response.data;
};

/**
 * Llama a: GET /finanzas/incomes/:id
 * Obtiene un registro de ingreso específico por su ID.
 */
export const fetchGeneralIncomeById = async (id: string): Promise<GeneralIncome> => {
  const response = await api.get<GeneralIncome>(`${INCOMES_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Llama a: POST /finanzas/incomes
 * Crea un nuevo registro de ingreso.
 */
export const createGeneralIncome = async (payload: CreateIncomePayload): Promise<GeneralIncome> => {
  const response = await api.post<GeneralIncome>(INCOMES_ENDPOINT, payload);
  return response.data;
};

/**
 * Llama a: PUT /finanzas/incomes/:id
 * Actualiza un registro de ingreso existente.
 */
export const updateGeneralIncome = async (id: string, payload: UpdateIncomePayload): Promise<GeneralIncome> => {
  const response = await api.put<GeneralIncome>(`${INCOMES_ENDPOINT}/${id}`, payload);
  return response.data;
};

/**
 * Llama a: DELETE /finanzas/incomes/:id
 * Elimina un registro de ingreso.
 */
export const deleteGeneralIncome = async (id: string): Promise<void> => {
  await api.delete(`${INCOMES_ENDPOINT}/${id}`);
};