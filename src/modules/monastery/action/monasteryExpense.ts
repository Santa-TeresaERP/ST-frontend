import api from '@/core/config/client';
import {
  MonasteryExpenses,
  CreateMonasteryExpensePayload,
  UpdateMonasteryExpensePayload,
} from '../types/monasteryExpenses';

const MONASTERY_EXPENSES_ENDPOINT = '/monasteryExpenses';

/**
 * Llama a: GET /monasteryExpenses
 * Obtiene todos los gastos del monasterio.
 */
export const fetchMonasteryExpenses = async (): Promise<MonasteryExpenses[]> => {
  const response = await api.get<MonasteryExpenses[]>(MONASTERY_EXPENSES_ENDPOINT);
  return response.data;
};

/**
 * Llama a: GET /monasteryExpenses/:id
 * Obtiene un gasto de monasterio específico por su ID.
 */
export const fetchMonasteryExpenseById = async (id: string): Promise<MonasteryExpenses> => {
  const response = await api.get<MonasteryExpenses>(`${MONASTERY_EXPENSES_ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Llama a: POST /monasteryExpenses
 * Crea un nuevo gasto de monasterio.
 */
export const createMonasteryExpense = async (
  payload: CreateMonasteryExpensePayload
): Promise<MonasteryExpenses> => {
  console.log('Payload enviado a API (MonasteryExpense):', payload);
  const response = await api.post<MonasteryExpenses>(MONASTERY_EXPENSES_ENDPOINT, payload);
  return response.data;
};

/**
 * Llama a: PATCH /monasteryExpenses/:id
 * Actualiza un gasto de monasterio existente.
 */
export const updateMonasteryExpense = async (
  id: string,
  payload: UpdateMonasteryExpensePayload
): Promise<MonasteryExpenses> => {
  const response = await api.patch<MonasteryExpenses>(
    `${MONASTERY_EXPENSES_ENDPOINT}/${id}`,
    payload
  );
  return response.data;
};

/**
 * Llama a: DELETE /monasteryExpenses/:id
 * Elimina un gasto de monasterio.
 */
export const deleteMonasteryExpense = async (id: string): Promise<void> => {
  await api.delete(`${MONASTERY_EXPENSES_ENDPOINT}/${id}`);
};

/**
 * Función auxiliar para obtener gastos de monasterio filtrados por overhead
 */
export const fetchMonasteryExpensesByOverhead = async (overheadId: string): Promise<MonasteryExpenses[]> => {
  const response = await api.get<MonasteryExpenses[]>(
    `${MONASTERY_EXPENSES_ENDPOINT}?overheadsId=${overheadId}`
  );
  return response.data;
};

/**
 * Función auxiliar para obtener gastos de monasterio filtrados por categoría
 */
export const fetchMonasteryExpensesByCategory = async (category: string): Promise<MonasteryExpenses[]> => {
  const response = await api.get<MonasteryExpenses[]>(
    `${MONASTERY_EXPENSES_ENDPOINT}?category=${category}`
  );
  return response.data;
};

/**
 * Función auxiliar para obtener gastos de monasterio filtrados por rango de fechas
 */
export const fetchMonasteryExpensesByDateRange = async (
  startDate: string,
  endDate: string
): Promise<MonasteryExpenses[]> => {
  const response = await api.get<MonasteryExpenses[]>(
    `${MONASTERY_EXPENSES_ENDPOINT}?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};