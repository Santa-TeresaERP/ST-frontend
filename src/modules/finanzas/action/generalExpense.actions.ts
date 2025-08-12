import api from '@/core/config/client';
import {
  GeneralExpense,
  CreateExpensePayload,
  UpdateExpensePayload
} from '../types/generalExpense.d';

const EXPENSES_ENDPOINT = '/generalExpense';

/**
 * Llama a: GET /generalExpense
 * Obtiene todos los registros de gastos.
 */
export const fetchGeneralExpenses = async (): Promise<GeneralExpense[]> => {
  const response = await api.get<GeneralExpense[]>(EXPENSES_ENDPOINT);
  return response.data;
};

/**
 * Llama a: GET /generalExpense/:id
 * Obtiene un registro de gasto específico por su ID.
 */
export const fetchGeneralExpenseById = async (id: string): Promise<GeneralExpense> => {
  const response = await api.get<GeneralExpense>(`${EXPENSES_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Llama a: POST /generalExpense
 * Crea un nuevo registro de gasto.
 */
export const createGeneralExpense = async (payload: CreateExpensePayload): Promise<GeneralExpense> => {
  console.log('Payload enviado a API:', payload);
  const response = await api.post<GeneralExpense>(EXPENSES_ENDPOINT, payload);
  return response.data;
};

/**
 * Llama a: PUT /generalExpense/:id
 * Actualiza un registro de gasto existente.
 */
export const updateGeneralExpense = async (id: string, payload: UpdateExpensePayload): Promise<GeneralExpense> => {
  const response = await api.put<GeneralExpense>(`${EXPENSES_ENDPOINT}/${id}`, payload);
  return response.data;
};

/**
 * Llama a: DELETE /finanzas/expenses/:id
 * Elimina un registro de gasto.
 */
export const deleteGeneralExpense = async (id: string): Promise<void> => {
  await api.delete(`${EXPENSES_ENDPOINT}/${id}`);
};