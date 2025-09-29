import api from "@/core/config/client";
import {
  MonasteryExpense,
  CreateMonasteryExpensePayload,
  UpdateMonasteryExpensePayload,
} from "../types/monasteryexpense";

const MONASTERY_EXPENSES_ENDPOINT = "/monasteryExpenses";

/**
 * Llama a: GET /monasteryExpenses
 * Obtiene todos los gastos del monasterio.
 */
export const fetchMonasteryExpenses = async (): Promise<MonasteryExpense[]> => {
  const response = await api.get<{success: boolean; data: MonasteryExpense[]}>(MONASTERY_EXPENSES_ENDPOINT);
  // La API devuelve {success: true, data: [...]} así que accedemos a response.data.data
  return response.data.data;
};

/**
 * Llama a: GET /monasteryExpenses/:id
 * Obtiene un gasto del monasterio por ID.
 */
export const fetchMonasteryExpenseById = async (id: string): Promise<MonasteryExpense> => {
  const response = await api.get<{success: boolean; data: MonasteryExpense}>(`${MONASTERY_EXPENSES_ENDPOINT}/${id}`);
  return response.data.data;
};

/**
 * Llama a: POST /monasteryExpenses
 * Crea un nuevo gasto del monasterio.
 */
export const createMonasteryExpense = async (
  payload: CreateMonasteryExpensePayload
): Promise<MonasteryExpense> => {
  const response = await api.post<{success: boolean; data: MonasteryExpense}>(MONASTERY_EXPENSES_ENDPOINT, payload);
  return response.data.data;
};

/**
 * Llama a: PATCH /monasteryExpenses/:id
 * Actualiza un gasto del monasterio existente.
 */
export const updateMonasteryExpense = async (
  id: string,
  payload: UpdateMonasteryExpensePayload
): Promise<MonasteryExpense> => {
  const response = await api.patch<{success: boolean; data: MonasteryExpense}>(
    `${MONASTERY_EXPENSES_ENDPOINT}/${id}`,
    payload
  );
  return response.data.data;
};

/**
 * Llama a: DELETE /monasteryExpenses/:id
 * Elimina un gasto del monasterio.
 */
export const deleteMonasteryExpense = async (id: string): Promise<void> => {
  await api.delete(`${MONASTERY_EXPENSES_ENDPOINT}/${id}`);
};