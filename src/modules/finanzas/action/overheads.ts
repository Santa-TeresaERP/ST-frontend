import api from "@/core/config/client";
import {
  OverheadAttributes,
  CreateOverheadPayload,
  UpdateOverheadPayload,
} from "../types/overheads";

const OVERHEADS_ENDPOINT = "/overhead";

/**
 * Llama a: GET /overheads
 * Obtiene todos los gastos generales activos.
 */
export const fetchAllOverheads = async (): Promise<OverheadAttributes[]> => {
  const response = await api.get<OverheadAttributes[]>(`${OVERHEADS_ENDPOINT}/all`);
  return response.data;
};

/**
 * Llama a: GET /overheads
 * Obtiene gastos generales básicos.
 */
export const fetchOverheads = async (): Promise<OverheadAttributes[]> => {
  const response = await api.get<OverheadAttributes[]>(OVERHEADS_ENDPOINT);
  return response.data;
};

/**
 * Llama a: GET /overheads/monthly
 * Obtiene gastos mensuales.
 */
export const fetchMonthlyExpenses = async (): Promise<OverheadAttributes[]> => {
  const response = await api.get<OverheadAttributes[]>(`${OVERHEADS_ENDPOINT}/monthly`);
  return response.data;
};

/**
 * Llama a: GET /overheads/monastery
 * Obtiene gastos del monasterio.
 */
export const fetchMonasteryOverheads = async (): Promise<OverheadAttributes[]> => {
  const response = await api.get<OverheadAttributes[]>(`${OVERHEADS_ENDPOINT}/monastery`);
  return response.data;
};

/**
 * Llama a: POST /overheads
 * Crea un nuevo gasto general.
 */
export const createOverhead = async (
  payload: CreateOverheadPayload
): Promise<OverheadAttributes> => {
  const response = await api.post<OverheadAttributes>(OVERHEADS_ENDPOINT, payload);
  return response.data;
};

/**
 * Llama a: POST /overheads/monasterio
 * Crea un nuevo gasto del monasterio.
 */
export const createMonasterioOverhead = async (
  payload: Omit<CreateOverheadPayload, "type">
): Promise<OverheadAttributes> => {
  const response = await api.post<OverheadAttributes>(
    `${OVERHEADS_ENDPOINT}/monasterio`,
    payload
  );
  return response.data;
};

/**
 * Llama a: PATCH /overheads/:id
 * Actualiza un gasto general existente.
 */
export const updateOverhead = async (
  id: string,
  payload: UpdateOverheadPayload
): Promise<OverheadAttributes> => {
  const response = await api.patch<OverheadAttributes>(
    `${OVERHEADS_ENDPOINT}/${id}`,
    payload
  );
  return response.data;
};

/**
 * Llama a: PUT /overheads/:id
 * Realiza un borrado lógico de un gasto general.
 */
export const deleteOverhead = async (id: string): Promise<void> => {
  await api.put(`${OVERHEADS_ENDPOINT}/${id}`);
};