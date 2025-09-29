import api from "@/core/config/client";
import {
  Overhead,
  CreateOverheadPayload,
  UpdateOverheadPayload,
} from "../types/overheads";

const OVERHEADS_ENDPOINT = "/overhead";

/**
 * Llama a: GET /overheads
 * Obtiene todos los gastos generales activos.
 */
export const fetchOverheads = async (): Promise<Overhead[]> => {
  console.log('🔍 DEBUGGING fetchOverheads (TEMPORAL):');
  console.log('  - Endpoint:', OVERHEADS_ENDPOINT);
  
  try {
    const response = await api.get<Overhead[]>(OVERHEADS_ENDPOINT);
    
    console.log('  - Response raw:', response);
    console.log('  - Response.data:', response.data);
    console.log('  - Array length:', response.data?.length);
    
    // La API devuelve directamente el array, no {success: boolean, data: T}
    return response.data;
  } catch (error) {
    console.log('  - ERROR en fetchOverheads:', error);
    throw error;
  }
};

export const fetchMonasterioOverheads = async (): Promise<Overhead[]> => {
  console.log('🔍 DEBUGGING fetchMonasterioOverheads:');
  console.log('  - Endpoint:', `${OVERHEADS_ENDPOINT}/monastery`);
  
  try {
    const response = await api.get<Overhead[]>(
      `${OVERHEADS_ENDPOINT}/monastery`
    );
    
    console.log('  - Response raw:', response);
    console.log('  - Response.data:', response.data);
    console.log('  - Array length:', response.data?.length);
    
    // La API devuelve directamente el array, no {success: boolean, data: T}
    return response.data;
  } catch (error) {
    console.log('  - ERROR en fetchMonasterioOverheads:', error);
    throw error;
  }
}

/**
 * Llama a: POST /overheads
 * Crea un nuevo gasto general (para tipos diferentes a 'monasterio').
 */
export const createOverhead = async (
  payload: CreateOverheadPayload
): Promise<Overhead> => {
  const response = await api.post<{success: boolean; data: Overhead}>(OVERHEADS_ENDPOINT, payload);
  return response.data.data;
};

/**
 * Llama a: POST /overheads/monasterio
 * Crea un nuevo gasto general específicamente de tipo 'monasterio'.
 */
export const createMonasterioOverhead = async (
  payload: Omit<CreateOverheadPayload, "type">
): Promise<Overhead> => {
  const response = await api.post<{success: boolean; data: Overhead}>(
    `${OVERHEADS_ENDPOINT}/monasterio`,
    payload
  );
  return response.data.data;
};

/**
 * Llama a: PATCH /overheads/:id
 * Actualiza un gasto general existente.
 */
export const updateOverhead = async (
  id: string,
  payload: UpdateOverheadPayload
): Promise<Overhead> => {
  const response = await api.patch<{success: boolean; data: Overhead}>(
    `${OVERHEADS_ENDPOINT}/${id}`,
    payload
  );
  return response.data.data;
};

/**
 * Llama a: PUT /overheads/:id
 * Realiza un borrado lógico de un gasto general.
 */
export const deleteOverhead = async (id: string): Promise<void> => {
  // Aunque es un borrado, la ruta en el backend es PUT
  await api.put(`${OVERHEADS_ENDPOINT}/${id}`);
};
