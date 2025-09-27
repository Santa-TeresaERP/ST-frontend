import api from "@/core/config/client";
import {
  Overhead,
  CreateOverheadPayload,
  UpdateOverheadPayload,
} from "../types/overheads";

const OVERHEADS_ENDPOINT = "/overhead";

/**
 * Llama a: GET /overheads
 * Obtiene todos los gastos generales activos.w
 */
export const fetchOverheads = async (): Promise<Overhead[]> => {
  const response = await api.get<Overhead[]>(OVERHEADS_ENDPOINT);
  return response.data;
};
export const fetchMonthlyOverheads = async (): Promise<Overhead[]> => {
  const response = await api.get<Overhead[]>(
    `${OVERHEADS_ENDPOINT}/monthly`
  );
  return response.data;
}

export const fetchMonasterioOverheads = async (): Promise<Overhead[]> => {
  const response = await api.get<Overhead[]>(
    `${OVERHEADS_ENDPOINT}/monastery`
  );
  return response.data;
}

/**
 * Llama a: POST /overheads
 * Crea un nuevo gasto general (para tipos diferentes a 'monasterio').
 */
export const createOverhead = async (
  payload: CreateOverheadPayload
): Promise<Overhead> => {
  const response = await api.post<Overhead>(OVERHEADS_ENDPOINT, payload);
  return response.data;
};

/**
 * Llama a: POST /overheads/monasterio
 * Crea un nuevo gasto general específicamente de tipo 'monasterio'.
 */
export const createMonasterioOverhead = async (
  payload: Omit<CreateOverheadPayload, "type">
): Promise<Overhead> => {
  const response = await api.post<Overhead>(
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
): Promise<Overhead> => {
  const response = await api.patch<Overhead>(
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
  // Aunque es un borrado, la ruta en el backend es PUT
  await api.put(`${OVERHEADS_ENDPOINT}/${id}`);
};
